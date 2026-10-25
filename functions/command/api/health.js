import { json } from "./_utils.js";

export async function onRequestGet({ env }) {
  const databaseConfigured = Boolean(env.DB);
  if (!databaseConfigured) {
    return json({
      service: "drivehub-command-api",
      status: "database_not_configured",
      database: "missing",
      productionReady: false
    }, 503);
  }

  try {
    const result = await env.DB.prepare("SELECT 1 AS ok").first();
    return json({
      service: "drivehub-command-api",
      status: result?.ok === 1 ? "database_connected" : "database_check_failed",
      database: result?.ok === 1 ? "connected" : "error",
      productionReady: false,
      note: "Authentication and staff provisioning must also be verified before production use."
    }, result?.ok === 1 ? 200 : 503);
  } catch {
    return json({
      service: "drivehub-command-api",
      status: "database_query_failed",
      database: "error",
      productionReady: false
    }, 503);
  }
}
