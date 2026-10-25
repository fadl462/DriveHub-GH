// Public readiness probe. This does not expose business data or prove authentication is configured.
export async function onRequestGet({ env }) {
  const databaseConfigured = Boolean(env.DB);
  return new Response(JSON.stringify({
    service: "drivehub-command-api",
    status: databaseConfigured ? "configured" : "database_not_configured",
    database: databaseConfigured ? "bound" : "missing",
    productionReady: false
  }), {
    status: databaseConfigured ? 200 : 503,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}
