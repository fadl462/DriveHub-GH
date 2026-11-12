// End the Cloudflare Access session and return to the public DriveHub GH homepage.
export async function onRequestGet({ request, env }) {
  const team = String(env.ACCESS_TEAM_DOMAIN || "")
    .trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  if (!team || !/^[a-z0-9.-]+$/i.test(team)) {
    return new Response("Cloudflare Access logout is not configured. Check ACCESS_TEAM_DOMAIN.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" }
    });
  }
  const origin = new URL(request.url).origin;
  const returnTo = new URL("/", origin).toString();
  const logoutUrl = new URL(`https://${team}/cdn-cgi/access/logout`);
  logoutUrl.searchParams.set("returnTo", returnTo);
  return Response.redirect(logoutUrl.toString(), 302);
}
