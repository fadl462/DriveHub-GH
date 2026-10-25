// Cloudflare Pages Functions middleware: verify Access JWT cryptographically and enforce DB-backed staff roles.
// Required environment: DB (D1 binding), ACCESS_TEAM_DOMAIN (e.g. company.cloudflareaccess.com), ACCESS_AUD.
const json = (body, status=200) => new Response(JSON.stringify(body), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});
function b64urlBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}
async function verifiedAccessClaims(request, env) {
  const team = String(env.ACCESS_TEAM_DOMAIN || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
  const audience = String(env.ACCESS_AUD || "");
  if (!team || !audience) throw new Error("Access identity configuration missing");
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) throw new Error("Access token missing");
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed Access token");
  const header = JSON.parse(new TextDecoder().decode(b64urlBytes(parts[0])));
  const claims = JSON.parse(new TextDecoder().decode(b64urlBytes(parts[1])));
  if (header.alg !== "RS256" || !header.kid) throw new Error("Unsupported Access token");
  const issuer = `https://${team}`;
  if (claims.iss !== issuer) throw new Error("Invalid token issuer");
  if (!Array.isArray(claims.aud) ? claims.aud !== audience : !claims.aud.includes(audience)) throw new Error("Invalid token audience");
  const now = Math.floor(Date.now()/1000);
  if (!claims.exp || claims.exp <= now || (claims.nbf && claims.nbf > now) || (claims.iat && claims.iat > now + 60)) throw new Error("Expired or not-yet-valid token");
  const response = await fetch(`${issuer}/cdn-cgi/access/certs`, { cf: { cacheTtl: 300, cacheEverything: true } });
  if (!response.ok) throw new Error("Could not retrieve Access signing keys");
  const keys = await response.json();
  const jwk = (keys.keys || []).find(k => k.kid === header.kid && k.kty === "RSA");
  if (!jwk) throw new Error("Access signing key not found");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const valid = await crypto.subtle.verify({ name: "RSASSA-PKCS1-v1_5" }, key, b64urlBytes(parts[2]), signed);
  if (!valid) throw new Error("Invalid Access token signature");
  return claims;
}
export async function onRequest(context) {
  const { request, env } = context;
  const path = new URL(request.url).pathname;
  if (path.endsWith("/api/health")) return context.next();
  if (!env.DB) return json({ error: "database_not_configured" }, 503);
  try {
    const claims = await verifiedAccessClaims(request, env);
    const subject = String(claims.sub || "");
    const email = String(claims.email || "").toLowerCase();
    if (!subject || !email) return json({ error: "identity_claims_missing" }, 401);
    const staff = await env.DB.prepare(
      "SELECT id, identity_subject, display_name, email, role, active FROM staff_users WHERE identity_subject = ? AND lower(email) = ? AND active = 1 LIMIT 1"
    ).bind(subject, email).first();
    if (!staff) return json({ error: "staff_not_authorized" }, 403);
    context.data = context.data || {};
    context.data.staff = staff;
    return context.next();
  } catch (error) {
    // Avoid leaking token validation details to callers.
    return json({ error: "unauthorized", message: "A valid, configured Cloudflare Access identity is required." }, 401);
  }
}
