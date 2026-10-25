// Fail-closed placeholder for protected API routes.
// Replace with verified Cloudflare Access JWT validation + staff_users role checks before enabling data endpoints.
// Do not treat the presence of a request header alone as authentication.
export async function onRequest(context) {
  const path = new URL(context.request.url).pathname;
  if (path === "/api/health") return context.next();
  return new Response(JSON.stringify({
    error: "api_not_enabled",
    message: "Protected API routes are disabled until server-side identity verification and role authorization are implemented."
  }), {
    status: 503,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}
