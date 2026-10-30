import { json, readJson, requireRole, audit, errorResponse } from './_utils.js';
const readRoles = ['admin', 'operations', 'finance', 'read_only'];

export async function onRequestGet({ env, data, request }) {
  if (!requireRole(data.staff, readRoles)) return json({ error: 'forbidden' }, 403);
  try {
    const url = new URL(request.url), status = url.searchParams.get('status') || '';
    if (status && !['active', 'inactive'].includes(status)) return json({ error: 'invalid_status' }, 400);
    const rows = await env.DB.prepare("SELECT p.*, (SELECT COUNT(*) FROM sourced_vehicles v WHERE v.partner_id=p.id) AS sourced_vehicle_count, (SELECT COALESCE(SUM(sp.amount_minor),0) FROM supplier_payments sp WHERE sp.partner_id=p.id) AS payments_total_minor FROM rental_partners p WHERE (?='' OR p.status=?) ORDER BY p.created_at DESC LIMIT 300").bind(status, status).all();
    return json({ data: rows.results || [] });
  } catch (error) { return errorResponse(error); }
}

export async function onRequestPost({ env, data, request }) {
  if (!requireRole(data.staff, ['admin', 'operations'])) return json({ error: 'forbidden', detail: 'Only staff with the admin or operations role can add rental partners.' }, 403);
  try {
    if (!env.DB) return json({ error: 'database_unavailable', detail: 'The Command Centre D1 binding (DB) is not configured.' }, 503);
    const b = await readJson(request);
    const company = String(b.company_name || '').trim();
    if (company.length < 2 || company.length > 180) return json({ error: 'invalid_company_name', detail: 'Company name must be between 2 and 180 characters.' }, 400);
    const values = ['contact_name', 'phone', 'email', 'address', 'payment_terms', 'payment_details', 'notes'].map(k => b[k] == null ? '' : String(b[k]).trim());
    if (values.some(v => v.length > 2000)) return json({ error: 'field_too_long', detail: 'One or more fields exceed 2,000 characters.' }, 400);
    const id = 'PARTNER-' + crypto.randomUUID();
    await env.DB.prepare('INSERT INTO rental_partners (id,company_name,contact_name,phone,email,address,payment_terms,payment_details,notes) VALUES (?,?,?,?,?,?,?,?,?)').bind(id, company, ...values).run();

    // The partner row is already committed at this point. A separate audit failure must not
    // turn a successful insert into an HTTP error, which would mislead the user into retrying.
    let auditWarning = null;
    try {
      await audit(env.DB, data.staff, 'partner.created', 'rental_partner', id, { company_name: company });
    } catch (auditError) {
      auditWarning = 'Partner saved, but the audit entry could not be written. Check the audit_log schema and permissions.';
      console.error('Partner created but audit write failed', { id, error: auditError?.message });
    }
    return json({ data: { id, company_name: company, contact_name: values[0], phone: values[1], email: values[2], address: values[3], payment_terms: values[4], payment_details: values[5], notes: values[6], status: 'active' }, ...(auditWarning ? { warning: auditWarning } : {}) }, 201);
  } catch (error) {
    const message = String(error?.message || 'internal_error');
    if (/no such table: rental_partners|no such table: sourced_vehicles|no such table: supplier_payments/i.test(message)) {
      return json({ error: 'partner_sourcing_migration_missing', detail: 'The partner-sourcing migration has not been applied to the D1 database used by this deployment. Apply command/migrations/0003_partner_sourcing.sql, then redeploy.' }, 500);
    }
    return errorResponse(error);
  }
}
