// DriveHub Command API middleware.
// Route prefix: /command/api/* (covered by the Cloudflare Access application /command/*).
// Required Pages bindings/variables: DB (D1), ACCESS_TEAM_DOMAIN, ACCESS_AUD.
import { json } from "./_utils.js";

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};
const decodeJwtPart = (value) => JSON.parse(new TextDecoder().decode(decodeBase64Url(value)));

async function verifyAccessJwt(request, env) {
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) throw Object.assign(new Error("Cloudflare Access token missing"), { status: 401 });
  const team = String(env.ACCESS_TEAM_DOMAIN || "").trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const audience = String(env.ACCESS_AUD || "").trim();
  if (!team || !audience) throw Object.assign(new Error("Cloudflare Access environment variables are not configured"), { status: 503 });
  const parts = token.split(".");
  if (parts.length !== 3) throw Object.assign(new Error("Invalid Access token"), { status: 401 });
  const header = decodeJwtPart(parts[0]);
  const claims = decodeJwtPart(parts[1]);
  if (header.alg !== "RS256" || !header.kid) throw Object.assign(new Error("Unsupported Access token"), { status: 401 });
  const issuer = `https://${team}`;
  const now = Math.floor(Date.now() / 1000);
  const audienceValid = Array.isArray(claims.aud) ? claims.aud.includes(audience) : claims.aud === audience;
  if (claims.iss !== issuer || !audienceValid || typeof claims.exp !== "number" || claims.exp <= now ||
      (typeof claims.nbf === "number" && claims.nbf > now + 60) ||
      (typeof claims.iat === "number" && claims.iat > now + 60) ||
      typeof claims.sub !== "string" || typeof claims.email !== "string") {
    throw Object.assign(new Error("Access token claims are invalid"), { status: 401 });
  }
  const response = await fetch(`${issuer}/cdn-cgi/access/certs`, { headers: { accept: "application/json" }, cf: { cacheTtl: 300, cacheEverything: true } });
  if (!response.ok) throw Object.assign(new Error("Could not retrieve Access signing keys"), { status: 503 });
  const certs = await response.json();
  const jwk = (certs.keys || []).find((key) => key.kid === header.kid && key.kty === "RSA");
  if (!jwk) throw Object.assign(new Error("Access signing key not found"), { status: 401 });
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, decodeBase64Url(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
  if (!valid) throw Object.assign(new Error("Access token signature is invalid"), { status: 401 });
  return claims;
}

export async function onRequest(context) {
  const { request, env } = context;
  const path = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
  // Health reveals only whether the D1 binding can answer a trivial query; Access still protects /command/*.
  if (path === "/command/api/health" && request.method === "GET") return context.next();
  if (!env.DB) return json({ error: "database_not_configured" }, 503);
  try {
    const claims = await verifyAccessJwt(request, env);
    const staff = await env.DB.prepare(
      "SELECT id, identity_subject, display_name, email, role, active FROM staff_users WHERE identity_subject = ? AND lower(email) = lower(?) LIMIT 1"
    ).bind(claims.sub, claims.email).first();
    if (!staff || Number(staff.active) !== 1) return json({ error: "staff_account_not_authorized" }, 403);
    context.data = context.data || {};
    context.data.staff = staff;
    context.data.accessClaims = { sub: claims.sub, email: claims.email };
    return context.next();
  } catch (error) {
    const status = error?.status || 401;
    return json({ error: status === 503 ? "authentication_service_unavailable" : "unauthorized" }, status);
  }
}
