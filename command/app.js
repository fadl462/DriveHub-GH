const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = n => 'GH₵ ' + Number(n).toLocaleString('en-GH',{maximumFractionDigits:2});
const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initial = {
 reviews:[],
 invoices:[
  {id:'INV-2026-018',customer:'Ama Mensah',vehicle:'Toyota RAV4',issued:'2026-10-23',due:'2026-10-27',total:2400,paid:2400,status:'Paid'},
  {id:'INV-2026-017',customer:'Kojo Asare',vehicle:'Toyota Prado',issued:'2026-10-20',due:'2026-10-24',total:3200,paid:1000,status:'Partially paid'},
  {id:'INV-2026-016',customer:'Nana Owusu',vehicle:'Honda CR-V',issued:'2026-10-18',due:'2026-10-22',total:1800,paid:0,status:'Overdue'},
  {id:'INV-2026-015',customer:'Esi Boateng',vehicle:'Mitsubishi Outlander',issued:'2026-10-15',due:'2026-10-19',total:2100,paid:0,status:'Overdue'},
  {id:'INV-2026-014',customer:'Yaw Kwarteng',vehicle:'Hyundai Santa Fe',issued:'2026-10-10',due:'2026-10-15',total:1550,paid:1550,status:'Paid'},
  {id:'INV-2026-013',customer:'Kofi Nartey',vehicle:'Toyota Land Cruiser V8',issued:'2026-10-05',due:'2026-10-10',total:3900,paid:3900,status:'Paid'}
 ],
 rentals:[
  {id:'DH-208',customer:'Ama Mensah',vehicle:'Toyota RAV4',pickup:'2026-10-23',returned:'2026-10-27',rate:600,status:'Active'},
  {id:'DH-207',customer:'Kojo Asare',vehicle:'Toyota Prado',pickup:'2026-10-22',returned:'2026-10-26',rate:800,status:'Active'},
  {id:'DH-206',customer:'Nana Owusu',vehicle:'Honda CR-V',pickup:'2026-10-25',returned:'2026-10-28',rate:450,status:'Upcoming'},
  {id:'DH-205',customer:'Esi Boateng',vehicle:'Mitsubishi Outlander',pickup:'2026-10-20',returned:'2026-10-24',rate:500,status:'Active'},
  {id:'DH-204',customer:'Yaw Kwarteng',vehicle:'Hyundai Santa Fe',pickup:'2026-10-10',returned:'2026-10-14',rate:500,status:'Completed'},
  {id:'DH-203',customer:'Kofi Nartey',vehicle:'Toyota Land Cruiser V8',pickup:'2026-10-05',returned:'2026-10-09',rate:950,status:'Completed'}
 ],
 payments:[
  {id:'RCT-2026-031',customer:'Ama Mensah',invoice:'INV-2026-018',date:'2026-10-23',method:'Mobile Money',amount:2400},
  {id:'RCT-2026-030',customer:'Kojo Asare',invoice:'INV-2026-017',date:'2026-10-22',method:'Bank transfer',amount:1000},
  {id:'RCT-2026-029',customer:'Yaw Kwarteng',invoice:'INV-2026-014',date:'2026-10-15',method:'Cash',amount:1550},
  {id:'RCT-2026-028',customer:'Kofi Nartey',invoice:'INV-2026-013',date:'2026-10-05',method:'Bank transfer',amount:3900}
 ],
 fleet:[
  {name:'Toyota Prado',plate:'DRH 001',status:'Rented',rate:800,util:83,service:'Service due 04 Nov'},
  {name:'Mitsubishi Outlander',plate:'DRH 002',status:'Rented',rate:500,util:70,service:'Service due 18 Nov'},
  {name:'Toyota RAV4',plate:'DRH 003',status:'Rented',rate:600,util:76,service:'Inspection due 12 Nov'},
  {name:'Hyundai Santa Fe',plate:'DRH 004',status:'Rented',rate:500,util:62,service:'Service up to date'},
  {name:'Honda CR-V',plate:'DRH 005',status:'Available',rate:450,util:48,service:'Service up to date'},
  {name:'Toyota Land Cruiser V8',plate:'DRH 006',status:'Available',rate:950,util:63,service:'Service due 29 Oct'}
 ],
 customers:[
  {name:'Ama Mensah',email:'ama@example.com',phone:'024 000 0101',rentals:4,spend:8200,last:'23 Oct 2026'},
  {name:'Kojo Asare',email:'kojo@example.com',phone:'020 000 0102',rentals:3,spend:6700,last:'22 Oct 2026'},
  {name:'Nana Owusu',email:'nana@example.com',phone:'055 000 0103',rentals:2,spend:3600,last:'18 Oct 2026'},
  {name:'Esi Boateng',email:'esi@example.com',phone:'024 000 0104',rentals:5,spend:9100,last:'20 Oct 2026'},
  {name:'Yaw Kwarteng',email:'yaw@example.com',phone:'027 000 0105',rentals:2,spend:3100,last:'10 Oct 2026'},
  {name:'Kofi Nartey',email:'kofi@example.com',phone:'050 000 0106',rentals:3,spend:7400,last:'05 Oct 2026'}
 ],
 maintenance:[{vehicle:'Toyota Land Cruiser V8',note:'Schedule routine service and oil check.',date:'2026-10-29'},{vehicle:'Toyota RAV4',note:'Check tyre pressure and inspect brakes before next rental.',date:'2026-11-12'}]
};
let state;
try { state = JSON.parse(localStorage.getItem('dh-command-demo') || 'null') || structuredClone(initial); } catch { state = JSON.parse(JSON.stringify(initial)); }
if (!Array.isArray(state.auditLog)) state.auditLog = [];
let reviewFilter='Pending', invoiceFilter='All', rentalFilter='All', currentView='overview';
let rentalPartners=[], sourcedVehicles=[], supplierPayments=[], partnersReady=false;
function save(){try{localStorage.setItem('dh-command-demo',JSON.stringify(state));return true}catch(e){toast('Could not save in this browser. Storage may be full or disabled.');return false}}
// D1 customer integration: keep local demo records intact while adding database records.
let d1Customers = [];
let d1CustomersReady = false;
let d1FinancialReady = false;
function titleStatus(value){return ({issued:'Unpaid',draft:'Draft',partially_paid:'Partially paid',paid:'Paid',overdue:'Overdue',void:'Void',upcoming:'Upcoming',active:'Active',completed:'Completed',cancelled:'Cancelled'})[String(value||'').toLowerCase()]||String(value||'Unpaid');}
function normalizeD1Rental(r){return {id:r.id,customer:r.customer_name||'',customerId:r.customer_id,vehicle:r.vehicle_name||'',vehicleId:r.vehicle_id,pickup:r.pickup_date,returned:r.return_date,rate:Number(r.daily_rate_minor||0)/100,status:titleStatus(r.status),source:'d1',invoiceId:r.invoice_id||null,invoiceNumber:r.invoice_number||null,invoiceTotal:Number(r.invoice_total_minor||0)/100,paid:Number(r.paid_minor||0)/100};}
function normalizeD1Invoice(i){return {id:i.invoice_number||i.id,dbId:i.id,customer:i.customer_name||'',customerId:i.customer_id,vehicle:i.vehicle_name||'Vehicle rental',vehicleId:i.vehicle_id, rentalId:i.rental_id,pickup:i.pickup_date,returned:i.return_date,issued:i.issued_on,due:i.due_on||'',total:Number(i.total_minor||0)/100,paid:Number(i.paid_minor||0)/100,status:titleStatus(i.status),source:'d1'};}
function normalizeD1Payment(p){return {id:p.receipt_number||p.id,dbId:p.id,customer:p.customer_name||'',customerId:p.customer_id,invoice:p.invoice_number||p.invoice_id,invoiceId:p.invoice_id,date:p.received_at,method:({cash:'Cash',bank_transfer:'Bank transfer',mobile_money:'Mobile Money',card:'Card',other:'Other'})[p.payment_method]||p.payment_method,amount:Number(p.amount_minor||0)/100,reference:p.reference||'',source:'d1'};}
async function loadD1Financials({quiet=true}={}){
 try{
  const [rr,ir,pr]=await Promise.all([
   fetch('/command/api/rentals?limit=500',{credentials:'same-origin',headers:{Accept:'application/json'},cache:'no-store'}),
   fetch('/command/api/invoices?limit=200',{credentials:'same-origin',headers:{Accept:'application/json'},cache:'no-store'}),
   fetch('/command/api/payments?limit=200',{credentials:'same-origin',headers:{Accept:'application/json'},cache:'no-store'})
  ]);
  const [rj,ij,pj]=await Promise.all([rr.json().catch(()=>({})),ir.json().catch(()=>({})),pr.json().catch(()=>({}))]);
  if(!rr.ok)throw new Error(rj.error||`Rentals API returned ${rr.status}`);
  if(!ir.ok)throw new Error(ij.error||`Invoices API returned ${ir.status}`);
  if(!pr.ok)throw new Error(pj.error||`Payments API returned ${pr.status}`);
  const d1Rentals=(rj.data||[]).map(normalizeD1Rental),d1Invoices=(ij.data||[]).map(normalizeD1Invoice),d1Payments=(pj.data||[]).map(normalizeD1Payment);
  // Preserve older browser-preview records during the transition; never silently discard a rental or financial row on first D1 sync.
  const keepLocal=(rows,live,key)=>{const ids=new Set(live.map(key));return [...live,...rows.filter(row=>!ids.has(key(row))).map(row=>({...row,source:'browser-preview'}))]};
  state.rentals=keepLocal(state.rentals||[],d1Rentals,r=>String(r.id||''));
  state.invoices=keepLocal(state.invoices||[],d1Invoices,r=>String(r.id||''));
  state.payments=keepLocal(state.payments||[],d1Payments,r=>String(r.id||''));
  d1FinancialReady=true;renderRentals();renderInvoices();renderPayments();renderOverview();renderCustomers();return true;
 }catch(error){if(!quiet)toast(`Could not load live rental and financial records: ${error.message}. Existing preview data was retained.`);console.warn('D1 financial sync unavailable; keeping existing preview records.',error);return false;}
}
function normalizeD1Customer(row){return {id:row.id,name:row.full_name||row.name||'',email:row.email||'',phone:row.phone||'',rentals:0,spend:0,last:'—',notes:row.notes||'',source:'d1'};}
function mergeD1Customers(rows){
 d1Customers=(Array.isArray(rows)?rows:[]).map(normalizeD1Customer);
 const local=Array.isArray(state.customers)?state.customers:[];
 const d1Names=new Set(d1Customers.map(c=>c.name.trim().toLowerCase()));
 state.customers=[...d1Customers,...local.filter(c=>!d1Names.has(String(c.name||'').trim().toLowerCase()))];
 d1CustomersReady=true;
 renderCustomers();
}
async function loadD1Customers(){
 try{
  const response=await fetch('/command/api/customers?limit=100',{headers:{Accept:'application/json'},credentials:'same-origin'});
  if(!response.ok) throw new Error(`Customer API returned ${response.status}`);
  const payload=await response.json();
  mergeD1Customers(payload.data||[]);
 }catch(error){
  console.warn('D1 customer sync unavailable; keeping existing browser records.',error);
 }
}

// Live D1 fleet integration. Keep the existing local fleet as a fallback if the API is unavailable.
let d1VehiclesReady = false;
async function loadD1Vehicles({quiet=false}={}) {
 try {
  const response = await fetch('/command/api/vehicles?limit=200', {headers:{Accept:'application/json'}, credentials:'same-origin'});
  const payload = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(payload.error || `Vehicle API returned ${response.status}`);
  if (!Array.isArray(payload.data)) throw new Error('Vehicle API returned an unexpected response.');
  const vehicles = payload.data.map(v => ({
   id:v.id, name:v.name || '', plate:v.registration_number || 'Registration not entered',
   status:({available:'Available',reserved:'Reserved',rented:'Rented',maintenance:'In maintenance',inactive:'Inactive'})[String(v.status||'available').toLowerCase()] || v.status || 'Available',
   rate:Number(v.daily_rate_minor || 0)/100, util:0,
   service:v.service_due_on ? `Service due ${fmtDate(v.service_due_on)}` : (v.notes || 'Service date not recorded'),
   serviceDueOn:v.service_due_on || null, notes:v.notes || '', source:'d1'
  })).filter(v=>v.name);
  // Only replace the demo fleet when the API call succeeded. Empty D1 is a real empty fleet.
  state.fleet = vehicles;
  d1VehiclesReady = true;
  renderFleet();
  renderOverview();
  return true;
 } catch(error) {
  if (!quiet) toast(`Could not load live fleet data: ${error.message}. Existing fleet preview retained.`);
  console.warn('D1 fleet sync unavailable; keeping existing browser fleet.', error);
  return false;
 }
}

// Live review records: D1 is the source of truth; never mix browser demo reviews into this list.
let d1ReviewsReady = false;
let d1ReviewsError = '';
const reviewStatusLabel = s => ({pending:'Pending', approved:'Approved', rejected:'Rejected', flagged:'Flagged'})[String(s||'').toLowerCase()] || 'Pending';
function normalizeD1Review(r){return {id:r.id,name:r.name||'Customer',email:r.email||'',vehicle:r.vehicle||'Not specified',rating:Number(r.rating||0),date:(r.submittedAt||'').slice(0,10),status:reviewStatusLabel(r.status),good:r.whatWentWell||'',improve:r.whatToImprove||'',improvementStatus:r.improvementStatus||'new',managementNotes:r.managementNotes||'',source:'d1'};}
async function loadD1Reviews({quiet=false}={}){
 try{
  const response=await fetch('/command/api/reviews?limit=500',{headers:{Accept:'application/json'},credentials:'same-origin',cache:'no-store'});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(payload.error||`Reviews API returned ${response.status}`);
  if(!Array.isArray(payload.data)) throw new Error('Reviews API returned an unexpected response.');
  state.reviews=payload.data.map(normalizeD1Review);
  d1ReviewsReady=true; d1ReviewsError='';
  renderReviews(); renderOverview(); renderAttention();
  return true;
 }catch(error){
  d1ReviewsReady=false; d1ReviewsError=error.message||'Could not load live reviews.';
  state.reviews=[]; renderReviews(); renderOverview(); renderAttention();
  if(!quiet) toast(`Live reviews could not be loaded: ${d1ReviewsError}`);
  console.warn('D1 review sync failed; preview reviews suppressed.',error);
  return false;
 }
}
async function setD1ReviewStatus(id, status){
 const dbStatus=({Pending:'pending',Approved:'approved',Rejected:'rejected',Flagged:'flagged'})[status];
 if(!dbStatus) throw new Error('Invalid review status.');
 const response=await fetch('/command/api/reviews',{method:'PATCH',headers:{'content-type':'application/json','accept':'application/json'},credentials:'same-origin',body:JSON.stringify({id,status:dbStatus})});
 const payload=await response.json().catch(()=>({}));
 if(!response.ok) throw new Error(payload.error||`Could not update review (${response.status}).`);
 await loadD1Reviews({quiet:true});
}

function recordAudit(action, area=currentView, details=''){
  if(!Array.isArray(state.auditLog)) state.auditLog=[];
  state.auditLog.unshift({id:'AUD-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),at:new Date().toISOString(),area:String(area||'workspace'),action:String(action||'Activity'),record:'',actor:'DriveHub Admin (demo)',details:String(details||'')});
  state.auditLog=state.auditLog.slice(0,500);
  save();
  if(currentView==='audit') renderAudit();
}
function renderAudit(){
  const logs=Array.isArray(state.auditLog)?state.auditLog:[];
  const q=($('#auditSearch')?.value||'').trim().toLowerCase();
  const visible=logs.filter(x=>[x.area,x.action,x.record,x.actor,x.details].join(' ').toLowerCase().includes(q));
  const today=new Date().toISOString().slice(0,10);
  if($('#auditCount'))$('#auditCount').textContent=logs.length;
  if($('#auditToday'))$('#auditToday').textContent=logs.filter(x=>String(x.at).slice(0,10)===today).length;
  if($('#auditLast'))$('#auditLast').textContent=logs.length?new Date(logs[0].at).toLocaleTimeString('en-GH',{hour:'2-digit',minute:'2-digit'}):'—';
  if($('#auditRows'))$('#auditRows').innerHTML=visible.map(x=>`<tr><td>${escapeHTML(new Date(x.at).toLocaleString('en-GH'))}</td><td>${escapeHTML(x.area)}</td><td><strong>${escapeHTML(x.action)}</strong></td><td>${escapeHTML(x.record||'—')}</td><td>${escapeHTML(x.actor)}</td><td>${escapeHTML(x.details||'—')}</td></tr>`).join('')||'<tr><td colspan="6">No activity found. Actions you perform in this browser will appear here.</td></tr>';
}
function exportAuditCSV(){
  const rows=[['Timestamp','Area','Action','Record','Actor','Details'],...(state.auditLog||[]).map(x=>[x.at,x.area,x.action,x.record,x.actor,x.details])];
  const csv=rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='drivehub-audit-preview.csv';a.click();URL.revokeObjectURL(url);
}

function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3000)}
function initials(name){return name.split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase()}
function statusClass(s){return s.toLowerCase().replace(/\s+/g,'-')}
function statusBadge(s){return `<span class="status ${statusClass(s)}">${escapeHTML(s)}</span>`}
function avatar(name){return `<span class="mini-avatar">${escapeHTML(initials(name))}</span>`}
function daysInclusive(a,b){const x=new Date(a+'T12:00:00'),y=new Date(b+'T12:00:00');return Math.max(1,Math.round((y-x)/86400000)+1)}
function localISODate(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function invoiceBalance(i){return Math.max(0,Number(i.total||0)-Number(i.paid||0))}
function effectiveInvoiceStatus(i){
 if(invoiceBalance(i)<=0) return 'Paid';
 if(i.due && i.due < localISODate()) return 'Overdue';
 if(Number(i.paid||0)>0) return 'Partially paid';
 return 'Unpaid';
}
function maintenanceStart(m){return m.startDate||m.date||''}
function maintenanceEnd(m){return m.endDate||m.date||maintenanceStart(m)}
function maintenanceOverlaps(m,start,end){return maintenanceStart(m)<=end&&maintenanceEnd(m)>=start}
function rentalIsCurrent(r){const today=localISODate();return r.status!=='Completed' && r.status!=='Cancelled' && r.pickup<=today && r.returned>=today}
function refreshInvoiceStatuses(){state.invoices.forEach(i=>{i.status=effectiveInvoiceStatus(i)})}
function renderKpis(){
 refreshInvoiceStatuses();
 const revenue=state.payments.reduce((sum,p)=>sum+Number(p.amount||0),0);
 const active=state.rentals.filter(r=>rentalIsCurrent(r)||r.status==='Active').length;
 const outstanding=state.invoices.reduce((sum,i)=>sum+invoiceBalance(i),0);
 const overdue=state.invoices.filter(i=>effectiveInvoiceStatus(i)==='Overdue').length;
 const assigned=state.fleet.filter(v=>v.status==='Rented'||v.status==='Assigned').length;
 const total=state.fleet.length;
 const utilisation=total?Math.round(assigned/total*100):0;
 $('#revenueMetric').textContent=money(revenue);
 $('#activeRentalsMetric').textContent=String(active);
 $('#outstandingMetric').textContent=money(outstanding);
 $('#utilisationMetric').textContent=utilisation+'%';
 const activeFoot=$('#activeRentalsMetric')?.closest('.metric-card')?.querySelector('.metric-foot');
 if(activeFoot) activeFoot.innerHTML=`<span class="neutral">${state.rentals.filter(r=>r.status==='Upcoming').length} upcoming</span><span> · future bookings</span>`;
 const outstandingFoot=$('#outstandingMetric')?.closest('.metric-card')?.querySelector('.metric-foot');
 if(outstandingFoot) outstandingFoot.innerHTML=`<span class="warning">${overdue} overdue</span><span> · follow-up needed</span>`;
 const utilFoot=$('#utilisationMetric')?.closest('.metric-card')?.querySelector('.metric-foot');
 if(utilFoot) utilFoot.innerHTML=`<span class="trend">${assigned} of ${total} vehicles</span><span> currently assigned</span>`;
 const bars=$$('#revenueMetric').length;
}

function nav(view){currentView=view;try{if(location.hash!==`#${view}`)history.replaceState(null,'',`#${view}`)}catch{};$$('.nav-item[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));$$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${view}`));const titles={overview:'Overview',reviews:'Reviews & reputation',invoices:'Invoices',payments:'Payments & receipts',rentals:'Rental operations',fleet:'Fleet management',customers:'Customers',partners:'Partners & sourcing',reports:'Reports & insights',audit:'Audit trail',settings:'Settings'};$('#crumbCurrent').textContent=titles[view]||view; if(view==='audit') renderAudit();$('#pageTitle').innerHTML=view==='overview'?'Good evening. <em>Let\'s move.</em>':titles[view];$('#eyebrow').textContent=view==='overview'?'YOUR BUSINESS, AT A GLANCE':'DRIVEHUB GH · '+titles[view].toUpperCase();$('#pageSubtitle').textContent=({overview:"A clear view of today's activity across DriveHub GH.",reviews:'Listen, respond and decide what gets published.',invoices:'Keep every rental charge and balance accounted for.',payments:'Track recorded payments and issue receipts.',rentals:'Know what is booked, active and due back.',fleet:'Make every vehicle work harder and stay road-ready.',customers:'Understand your customers and their rental history.',reports:'Turn day-to-day activity into clear business decisions.',settings:'Manage company preferences and production readiness.',partners:'Manage external suppliers and source vehicles only when customer demand exceeds your own fleet.'})[view];$('#sidebar').classList.remove('open');if(view==='reviews')renderReviews();if(view==='invoices')renderInvoices();if(view==='payments')renderPayments();if(view==='rentals')renderRentals();if(view==='fleet')renderFleet();if(view==='customers')renderCustomers();if(view==='partners')loadPartnerData()}
$$('.nav-item[data-view]').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.view)));
$$('[data-goto]').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.goto)));
$('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));

$('#auditSearch')?.addEventListener('input',renderAudit);
$('#exportAudit')?.addEventListener('click',()=>{exportAuditCSV();recordAudit('Exported audit preview CSV','audit','Export requested by user')});
$('#clearAudit')?.addEventListener('click',()=>{if(!confirm('Clear the local preview audit log? This cannot be undone in this browser.'))return;state.auditLog=[];save();renderAudit();toast('Preview audit log cleared.')});
// Capture meaningful action buttons without recording form field contents or customer/payment values.
document.addEventListener('click',e=>{
  const b=e.target.closest('button');
  if(!b||b.dataset.auditSkip==='true'||b.closest('#view-audit'))return;
  const label=(b.innerText||b.getAttribute('aria-label')||b.title||'').replace(/\s+/g,' ').trim();
  if(!label||/^(overview|reviews|invoices|payments & receipts|rentals|fleet|customers|reports|settings|audit trail)$/i.test(label))return;
  if(b.id==='mobileMenu'||b.id==='dismissNotice'||b.id==='revenueRange')return;
  if(b.type==='submit')return; // action handlers can add more specific events later
  recordAudit('Clicked action',currentView,label.slice(0,120));
},true);
function renderChart(){
 const count=Number($('#revenueRange').value||7), now=new Date();
 const months=[];
 for(let i=count-1;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);months.push({key:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`,label:d.toLocaleDateString('en-GB',{month:'short'}) ,value:0})}
 state.payments.forEach(p=>{const key=String(p.date||'').slice(0,7),m=months.find(x=>x.key===key);if(m)m.value+=Number(p.amount||0)});
 const max=Math.max(1,...months.map(m=>m.value));
 $('#revenueChart').innerHTML=months.map(m=>`<div class="bar-wrap"><div class="bar" style="height:${Math.max(4,m.value/max*100)}%" data-value="${money(m.value)}" title="${m.label}: ${money(m.value)}"></div></div>`).join('');
 $('.chart-axis').innerHTML=months.map(m=>`<span>${m.label}</span>`).join('');
 const subtitle=$('.revenue-panel .panel-heading p');if(subtitle)subtitle.textContent=`Recorded payments across the last ${count} month${count===1?'':'s'}`;
}
$('#revenueRange').addEventListener('change',renderChart);
function renderAttention(){const pending=state.reviews.filter(r=>r.status==='Pending').length;const overdue=state.invoices.filter(i=>effectiveInvoiceStatus(i)==='Overdue').length;const available=state.fleet.filter(v=>v.status==='Available').length;const list=[{icon:'✳',red:true,title:`${pending} reviews awaiting approval`,desc:'Read feedback and approve or reject publication.',goto:'reviews'},{icon:'!',title:`${overdue} overdue invoices`,desc:'Follow up on unpaid rental balances.',goto:'invoices'},{icon:'◇',title:`${available} vehicles currently available`,desc:'Check upcoming bookings and fleet utilisation.',goto:'fleet'}];$('#attentionList').innerHTML=list.map(x=>`<div class="attention-item"><span class="attention-symbol ${x.red?'red':''}">${x.icon}</span><div><strong>${x.title}</strong><p>${x.desc}</p><button class="text-link" data-goto="${x.goto}">Open →</button></div></div>`).join('');$$('#attentionList [data-goto]').forEach(b=>b.onclick=()=>nav(b.dataset.goto));$('#pendingBadge').textContent=pending;$('#pendingCount').textContent=pending;$('#reviewPendingSummary').textContent=pending}
function renderRecent(){const rows=state.rentals.slice(0,4);$('#recentRentals').innerHTML=rows.map(r=>`<tr><td><div class="customer-cell">${avatar(r.customer)}<div><strong>${escapeHTML(r.customer)}</strong><small>${r.id}</small></div></div></td><td>${escapeHTML(r.vehicle)}${r.sourceType==='partner'?'<small>Partner-sourced · '+escapeHTML(r.partnerName||'supplier')+' · Cost '+money(r.supplierTotal||0)+'</small>':''}</td><td>${fmtDate(r.pickup)} – ${fmtDate(r.returned)}<small>${daysInclusive(r.pickup,r.returned)} billable days</small></td><td><strong>${money(r.rate*daysInclusive(r.pickup,r.returned))}</strong></td><td>${statusBadge(r.status)}</td></tr>`).join('')}
function renderCustomerImprovements(){
 const host=$('#improvementFeedbackList'); if(!host)return;
 const items=state.reviews.filter(r=>String(r.improve||'').trim() && String(r.improvementStatus||'new').toLowerCase()!=='resolved').sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
 const fresh=items.filter(r=>(r.improvementStatus||'new')==='new').length;
 const count=$('#improvementNewCount'); if(count)count.textContent=`${fresh} new`;
 if(!items.length){host.innerHTML='<div class="empty-state"><strong>No customer improvement feedback yet</strong><p>Suggestions submitted through the public review form will appear here.</p></div>';return;}
 host.innerHTML=items.slice(0,8).map(r=>`<article class="review-card" style="margin:10px 0;padding:16px"><div class="review-card-head"><div class="review-person"><div><strong>${escapeHTML(r.name)}</strong><small>${escapeHTML(r.date||'Date unavailable')} · ${r.rating}/5 rating</small></div></div><span class="status-pill">${escapeHTML((r.improvementStatus||'new').replace('_',' '))}</span></div><p class="review-text" style="margin-top:12px">${escapeHTML(r.improve)}</p><div class="review-actions" style="align-items:center;gap:8px;flex-wrap:wrap"><label style="font-size:12px">Status <select data-improvement-status="${escapeHTML(r.id)}"><option value="new" ${(r.improvementStatus||'new')==='new'?'selected':''}>New</option><option value="under_review">Under review</option><option value="action_planned">Action planned</option><option value="resolved">Resolved</option></select></label><button class="btn btn-neutral" data-improvement-notes="${escapeHTML(r.id)}">${r.managementNotes?'Edit management note':'Add management note'}</button></div>${r.managementNotes?`<p class="review-text"><strong>Internal management note</strong><br>${escapeHTML(r.managementNotes)}</p>`:''}</article>`).join('');
 host.querySelectorAll('[data-improvement-status]').forEach(sel=>{const r=items.find(x=>x.id===sel.dataset.improvementStatus); if(r)sel.querySelector('option[value="under_review"]').selected=(r.improvementStatus||'new')==='under_review'; sel.addEventListener('change',async()=>{try{await updateImprovement(r.id,{improvementStatus:sel.value});toast('Improvement status saved.')}catch(e){toast(`Could not save status: ${e.message}`);sel.value=r.improvementStatus||'new';}})});
 host.querySelectorAll('[data-improvement-notes]').forEach(btn=>btn.addEventListener('click',async()=>{const r=items.find(x=>x.id===btn.dataset.improvementNotes);if(!r)return;const note=prompt('Internal management note (private; never shown publicly):',r.managementNotes||'');if(note===null)return;try{await updateImprovement(r.id,{managementNotes:note});toast('Internal note saved.')}catch(e){toast(`Could not save note: ${e.message}`)}}));
}
async function updateImprovement(id, patch){const response=await fetch('/command/api/reviews',{method:'PATCH',headers:{'content-type':'application/json','accept':'application/json'},credentials:'same-origin',body:JSON.stringify({id,...patch})});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||`Update failed (${response.status})`);await loadD1Reviews({quiet:true});}
function renderOverview(){renderKpis();renderChart();renderAttention();renderRecent();renderCustomerImprovements()}
function renderReviews(){const counts={Pending:state.reviews.filter(r=>r.status==='Pending').length,Approved:state.reviews.filter(r=>r.status==='Approved').length,Rejected:state.reviews.filter(r=>r.status==='Rejected').length,All:state.reviews.length};const countTargets={Pending:'#pendingCount',Approved:'#approvedCount',Rejected:'#rejectedCount',All:'#allReviewsCount'};Object.entries(countTargets).forEach(([status,selector])=>{const el=$(selector);if(el)el.textContent=counts[status]});const q=($('#reviewSearch')?.value||'').toLowerCase();let arr=state.reviews.filter(r=>(reviewFilter==='All'||r.status===reviewFilter)&&[r.name,r.vehicle,r.good,r.improve,r.id].join(' ').toLowerCase().includes(q));$('#reviewsList').innerHTML=arr.length?arr.map(r=>`<article class="review-card"><div class="review-card-head"><div class="review-person">${avatar(r.name)}<div><strong>${escapeHTML(r.name)}</strong><small>${escapeHTML(r.id)} · ${fmtDate(r.date)} · ${escapeHTML(r.email)}</small></div></div><div><div class="stars" aria-label="${r.rating} out of 5">${'★'.repeat(r.rating)}<span style="color:#e9ddda">${'★'.repeat(5-r.rating)}</span></div><div style="text-align:right;margin-top:7px">${statusBadge(r.status)}</div></div></div><div class="review-meta"><span>${escapeHTML(r.vehicle)}</span><span>${r.rating}/5 rating</span></div><p class="review-text"><strong>What went well</strong><br>${escapeHTML(r.good||'No comment provided.')}</p>${r.improve?`<p class="review-text"><strong>What could improve</strong><br>${escapeHTML(r.improve)}</p>`:''}<div class="review-actions">${r.status==='Pending'?`<button class="btn-approve" data-review-action="Approved" data-id="${r.id}">✓ Approve & publish</button><button class="btn-reject" data-review-action="Rejected" data-id="${r.id}">× Reject</button>`:`<button class="btn-neutral" data-review-action="Pending" data-id="${r.id}">Return to pending</button>${r.status==='Rejected'?`<button class="btn-reject" data-review-delete="${r.id}">Delete permanently</button>`:''}`}<span class="spacer"></span><button class="btn-neutral" data-review-detail="${r.id}">View details</button></div></article>`).join(''):'<div class="empty-state"><strong>No reviews in this view</strong>Try another status filter or search term.</div>';$$('[data-review-action]').forEach(b=>b.onclick=async()=>{const r=state.reviews.find(x=>x.id===b.dataset.id);if(!r)return;const next=b.dataset.reviewAction;if(next==='Approved'&&!confirm('Approve this review for public publication?'))return;try{await setD1ReviewStatus(r.id,next);toast(`Review ${r.id} updated in the database.`)}catch(error){toast(`Review was not updated: ${error.message}`)}});$$('[data-review-delete]').forEach(b=>b.onclick=async()=>{const r=state.reviews.find(x=>x.id===b.dataset.reviewDelete);if(!r||r.status!=='Rejected')return;if(!confirm(`Permanently delete rejected review from ${r.name}? This cannot be undone.`))return;try{const response=await fetch('/command/api/reviews',{method:'DELETE',headers:{'content-type':'application/json','accept':'application/json'},credentials:'same-origin',body:JSON.stringify({id:r.id})});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||`Delete failed (${response.status})`);await loadD1Reviews({quiet:true});toast('Rejected review permanently deleted.')}catch(error){toast(`Review was not deleted: ${error.message}`)}});$$('[data-review-detail]').forEach(b=>b.onclick=()=>{const r=state.reviews.find(x=>x.id===b.dataset.reviewDetail);alert(`Review ${r.id}\\nCustomer: ${r.name}\\nEmail: ${r.email}\\nVehicle: ${r.vehicle}\\nRating: ${r.rating}/5\\nDate: ${r.date}\\nStatus: ${r.status}\\n\\nWhat went well: ${r.good||'—'}\\n\\nWhat could improve: ${r.improve||'—'}\\n\\nLive review record loaded from the database.`)});const approvedRatingReviews=state.reviews.filter(r=>String(r.status||'').toLowerCase()==='approved' && Number.isFinite(Number(r.rating)) && Number(r.rating)>=1 && Number(r.rating)<=5);
 const approvedRatingAverage=approvedRatingReviews.length?approvedRatingReviews.reduce((sum,r)=>sum+Number(r.rating),0)/approvedRatingReviews.length:null;
 $('#avgRating').innerHTML=(approvedRatingAverage===null?'—':approvedRatingAverage.toFixed(1))+' <small>/ 5.0</small>';$('#approvedMonth').textContent=state.reviews.filter(r=>r.status==='Approved').length}
$('#reviewFilters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;reviewFilter=b.dataset.filter;$$('#reviewFilters button').forEach(x=>x.classList.toggle('selected',x===b));renderReviews()});$('#reviewSearch').addEventListener('input',renderReviews);
async function getJsPDF(){
 if(window.jspdf?.jsPDF)return window.jspdf.jsPDF;
 if(window.__drivehubPdfLoading)return window.__drivehubPdfLoading;
 window.__drivehubPdfLoading=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';script.onload=()=>window.jspdf?.jsPDF?resolve(window.jspdf.jsPDF):reject(new Error('PDF library unavailable'));script.onerror=()=>reject(new Error('Could not load PDF library'));document.head.appendChild(script)});
 try{return await window.__drivehubPdfLoading}catch(error){window.__drivehubPdfLoading=null;throw error}
}
async function downloadInvoicePDF(i){
 try{const JsPDF=await getJsPDF(),doc=new JsPDF({unit:'mm',format:'a4'});let y=20;doc.setTextColor(190,18,47);doc.setFontSize(10);doc.setFont('helvetica','bold');doc.text('DRIVEHUB GH',18,y);doc.setTextColor(35,29,30);doc.setFontSize(22);doc.text('INVOICE',18,y+13);doc.setFontSize(10);doc.setFont('helvetica','normal');doc.text(`Invoice: ${i.id}`,18,y+22);doc.text('Accra, Ghana',145,y,{align:'right'});doc.setDrawColor(200,16,46);doc.setLineWidth(1.2);doc.line(18,y+27,192,y+27);y+=40;
 const details=[['Bill to',i.customer],['Vehicle',i.vehicle],['Rental reference',i.rentalId||'—'],['Issue date',fmtDate(i.issued)],['Due date',fmtDate(i.due)],['Rental period',i.pickup&&i.returned?`${fmtDate(i.pickup)} to ${fmtDate(i.returned)}`:'—']];doc.setFontSize(10);details.forEach(([k,v])=>{doc.setFont('helvetica','bold');doc.text(k,18,y);doc.setFont('helvetica','normal');doc.text(String(v||'—'),65,y);y+=7});y+=8;doc.setFillColor(247,241,239);doc.rect(18,y,174,10,'F');doc.setFont('helvetica','bold');doc.text('DESCRIPTION',22,y+6.5);doc.text('AMOUNT (GHS)',188,y+6.5,{align:'right'});y+=18;doc.setFont('helvetica','normal');doc.text(`Vehicle rental${i.pickup&&i.returned?` · ${daysInclusive(i.pickup,i.returned)} billable days`:''}`,22,y);doc.text(Number(i.total||0).toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2}),188,y,{align:'right'});y+=16;doc.setDrawColor(225,216,213);doc.line(18,y,192,y);y+=10;[['Invoice total',i.total],['Amount paid',i.paid],['Outstanding balance',invoiceBalance(i)]].forEach(([label,value],idx)=>{doc.setFont('helvetica',idx===2?'bold':'normal');doc.text(label,125,y);doc.text(Number(value||0).toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2}),188,y,{align:'right'});y+=8});doc.setTextColor(190,18,47);doc.setFont('helvetica','bold');doc.setFontSize(13);doc.text(`STATUS: ${effectiveInvoiceStatus(i).toUpperCase()}`,18,y+8);doc.setTextColor(110,100,101);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text('Thank you for choosing DriveHub GH.',18,275);doc.save(`${String(i.id).replace(/[^a-z0-9-_]/gi,'_')}-DriveHub-GH.pdf`);return true
 }catch(error){toast('Direct PDF download is unavailable. Opening the print version so you can choose Save as PDF.');printInvoice(i);return false}
}
async function downloadReceiptPDF(p){
 try{const JsPDF=await getJsPDF(),doc=new JsPDF({unit:'mm',format:'a4'});let y=22;doc.setTextColor(190,18,47);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('DRIVEHUB GH',18,y);doc.setTextColor(35,29,30);doc.setFontSize(22);doc.text('PAYMENT RECEIPT',18,y+15);doc.setDrawColor(200,16,46);doc.setLineWidth(1.2);doc.line(18,y+22,192,y+22);y+=38;[['Receipt number',p.id],['Customer',p.customer],['Invoice',p.invoice],['Payment date',fmtDate(p.date)],['Payment method',p.method],['Payment reference',p.reference||'—']].forEach(([k,v])=>{doc.setFontSize(10);doc.setFont('helvetica','bold');doc.text(k,18,y);doc.setFont('helvetica','normal');doc.text(String(v||'—'),68,y);y+=10});y+=8;doc.setFillColor(247,241,239);doc.roundedRect(18,y,174,30,3,3,'F');doc.setTextColor(190,18,47);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('AMOUNT RECEIVED',25,y+11);doc.setFontSize(20);doc.text(`GHS ${Number(p.amount||0).toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2})}`,25,y+23);doc.setTextColor(110,100,101);doc.setFontSize(8);doc.setFont('helvetica','normal');doc.text('Generated by DriveHub Command. Keep this receipt for your records.',18,275);doc.save(`${String(p.id).replace(/[^a-z0-9-_]/gi,'_')}-DriveHub-GH-Receipt.pdf`);return true
 }catch(error){toast('Direct PDF download is unavailable. Opening the print version so you can choose Save as PDF.');printReceipt(p);return false}
}
function renderInvoices(){
 refreshInvoiceStatuses();
 const total=state.invoices.reduce((s,i)=>s+Number(i.total||0),0);
 const paid=state.invoices.reduce((s,i)=>s+Number(i.paid||0),0);
 const balance=state.invoices.reduce((s,i)=>s+invoiceBalance(i),0);
 if($('#invoiceTotalMetric'))$('#invoiceTotalMetric').textContent=money(total);
 if($('#invoicePaidMetric'))$('#invoicePaidMetric').textContent=money(paid);
 if($('#invoiceBalanceMetric'))$('#invoiceBalanceMetric').textContent=money(balance);
 let rows=state.invoices.filter(i=>invoiceFilter==='All'||effectiveInvoiceStatus(i)===invoiceFilter);
 $('#invoiceRows').innerHTML=rows.map(i=>`<tr><td><strong>${escapeHTML(i.id)}</strong><small>${escapeHTML(i.vehicle)}</small>${i.source==='browser-preview'?'<small class="preview-record-tag">Browser preview · not in D1</small>':''}</td><td>${escapeHTML(i.customer)}</td><td>${fmtDate(i.issued)}</td><td>${fmtDate(i.due)}</td><td><strong>${money(i.total)}</strong></td><td>${money(invoiceBalance(i))}</td><td>${statusBadge(effectiveInvoiceStatus(i))}</td><td><button class="table-action" type="button" data-invoice-download="${escapeHTML(i.id)}">Download PDF</button><button class="table-action" type="button" data-invoice-print="${escapeHTML(i.id)}">Print</button></td></tr>`).join('')||'<tr><td colspan="8">No invoices match this filter.</td></tr>';
}
$('#invoiceRows').addEventListener('click',e=>{const d=e.target.closest('[data-invoice-download]');if(d){const inv=state.invoices.find(i=>i.id===d.dataset.invoiceDownload);if(inv)downloadInvoicePDF(inv);return}const b=e.target.closest('[data-invoice-print]');if(!b)return;const inv=state.invoices.find(i=>i.id===b.dataset.invoicePrint);if(inv)printInvoice(inv)});
function printInvoice(i){
 const win=window.open('','_blank','width=820,height=900');if(!win){toast('Allow pop-ups to print the invoice.');return}
 const htmlDoc=`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHTML(i.id)} — DriveHub GH</title><style>body{font:14px Arial,sans-serif;color:#211b1c;margin:42px}header{display:flex;justify-content:space-between;border-bottom:3px solid #c8102e;padding-bottom:18px}h1{font-size:26px;margin:0}small{color:#756a6d}.tag{color:#c8102e;font-weight:bold;letter-spacing:2px;font-size:10px}table{width:100%;border-collapse:collapse;margin-top:28px}td,th{padding:12px;border-bottom:1px solid #e8ddda;text-align:left}.total{font-size:20px;font-weight:bold;text-align:right;margin-top:28px}.foot{margin-top:48px;color:#756a6d;font-size:11px}</style></head><body><header><div><div class="tag">DRIVEHUB GH · PREMIUM SELF-DRIVE RENTALS</div><h1>INVOICE</h1><p>${escapeHTML(i.id)}</p></div><div><strong>DriveHub GH</strong><br><small>Accra, Ghana</small></div></header><p><strong>Bill to:</strong> ${escapeHTML(i.customer)}<br><strong>Vehicle:</strong> ${escapeHTML(i.vehicle)}<br><strong>Issue date:</strong> ${escapeHTML(fmtDate(i.issued))}<br><strong>Due date:</strong> ${escapeHTML(fmtDate(i.due))}</p><table><thead><tr><th>Description</th><th>Amount</th></tr></thead><tbody><tr><td>Vehicle rental</td><td>${money(i.total)}</td></tr><tr><td>Amount paid</td><td>${money(i.paid)}</td></tr><tr><td>Outstanding balance</td><td>${money(invoiceBalance(i))}</td></tr></tbody></table><div class="total">Invoice total: ${money(i.total)}</div><p>Status: <strong>${escapeHTML(effectiveInvoiceStatus(i))}</strong></p><div class="foot">Generated by DriveHub Command. Verify customer and payment details before issuing.</div><script>window.onload=()=>window.print()<\/script></body></html>`;
 win.document.open();win.document.write(htmlDoc);win.document.close();
}

$('#invoiceFilters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;invoiceFilter=b.dataset.filter;$$('#invoiceFilters button').forEach(x=>x.classList.toggle('selected',x===b));renderInvoices()});
function renderPayments(){
 const total=state.payments.reduce((s,p)=>s+Number(p.amount||0),0);
 if($('#paymentsReceivedMetric'))$('#paymentsReceivedMetric').textContent=money(total);
 if($('#paymentMethodsMetric'))$('#paymentMethodsMetric').textContent=new Set(state.payments.map(p=>p.method).filter(Boolean)).size;
 $('#paymentRows').innerHTML=state.payments.map(p=>`<tr><td><strong>${escapeHTML(p.id)}</strong>${p.source==='browser-preview'?'<small class="preview-record-tag">Browser preview · not in D1</small>':''}</td><td>${escapeHTML(p.customer)}</td><td>${escapeHTML(p.invoice)}</td><td>${fmtDate(p.date)}</td><td>${escapeHTML(p.method)}</td><td><strong>${money(p.amount)}</strong></td><td><button class="table-action" type="button" data-receipt-download="${escapeHTML(p.id)}">Download PDF</button><button class="table-action" type="button" data-receipt-print="${escapeHTML(p.id)}">Print</button></td></tr>`).join('')||'<tr><td colspan="7">No payments recorded yet.</td></tr>';
 $('#paymentCount').textContent=state.payments.length;
}
$('#paymentRows').addEventListener('click',e=>{const d=e.target.closest('[data-receipt-download]');if(d){const p=state.payments.find(x=>x.id===d.dataset.receiptDownload);if(p)downloadReceiptPDF(p);return}const b=e.target.closest('[data-receipt-print]');if(!b)return;const p=state.payments.find(x=>x.id===b.dataset.receiptPrint);if(p)printReceipt(p)});
function printReceipt(p){
 const win=window.open('','_blank','width=760,height=760');if(!win){toast('Allow pop-ups to print the receipt.');return}
 const inv=state.invoices.find(i=>i.id===p.invoice);
 const doc=`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHTML(p.id)} — Receipt</title><style>body{font:14px Arial,sans-serif;color:#211b1c;margin:42px}.receipt{max-width:650px;margin:auto;border:1px solid #eadfdb;border-radius:18px;padding:30px}header{border-bottom:3px solid #c8102e;padding-bottom:18px}h1{font-size:25px;margin:12px 0}.tag{color:#c8102e;font-weight:bold;letter-spacing:2px;font-size:10px}dl{display:grid;grid-template-columns:170px 1fr;gap:12px}dt{color:#756a6d}dd{margin:0;font-weight:bold}.amount{font-size:26px;color:#c8102e;font-weight:bold;margin:28px 0}.foot{font-size:11px;color:#756a6d;margin-top:32px}</style></head><body><div class="receipt"><header><div class="tag">DRIVEHUB GH · PAYMENT RECEIPT</div><h1>Payment received</h1><div>${escapeHTML(p.id)}</div></header><dl><dt>Customer</dt><dd>${escapeHTML(p.customer)}</dd><dt>Invoice</dt><dd>${escapeHTML(p.invoice)}</dd><dt>Payment date</dt><dd>${escapeHTML(fmtDate(p.date))}</dd><dt>Payment method</dt><dd>${escapeHTML(p.method)}</dd><dt>Reference</dt><dd>${escapeHTML(p.reference||'—')}</dd></dl><div class="amount">${money(p.amount)}</div><p>${inv?`Invoice balance after recorded allocations: <strong>${money(invoiceBalance(inv))}</strong>`:'Keep this receipt for your records.'}</p><div class="foot">Generated by DriveHub Command. This receipt reflects the payment recorded against the linked invoice.</div></div><script>window.onload=()=>window.print()<\/script></body></html>`;
 win.document.open();win.document.write(doc);win.document.close();
}

function renderRentals(){
 const q=($('#rentalSearch')?.value||'').toLowerCase();
 const rows=state.rentals.filter(r=>(rentalFilter==='All'||r.status===rentalFilter)&&[r.id,r.customer,r.vehicle].join(' ').toLowerCase().includes(q));
 const count=status=>state.rentals.filter(r=>r.status===status).length;
 if($('#rentalUpcomingMetric'))$('#rentalUpcomingMetric').textContent=count('Upcoming');
 if($('#rentalActiveMetric'))$('#rentalActiveMetric').textContent=count('Active');
 if($('#rentalCompletedMetric'))$('#rentalCompletedMetric').textContent=count('Completed');
 if($('#rentalCancelledMetric'))$('#rentalCancelledMetric').textContent=count('Cancelled');
 $('#rentalRows').innerHTML=rows.map(r=>`<tr><td><strong>${escapeHTML(r.id)}</strong>${r.source==='browser-preview'?'<small class="preview-record-tag">Browser preview · not in D1</small>':''}</td><td>${escapeHTML(r.customer)}</td><td>${escapeHTML(r.vehicle)}${r.sourceType==='partner'?'<small>Partner-sourced · '+escapeHTML(r.partnerName||'supplier')+' · Cost '+money(r.supplierTotal||0)+'</small>':''}</td><td>${fmtDate(r.pickup)}</td><td>${fmtDate(r.returned)}</td><td><strong>${daysInclusive(r.pickup,r.returned)}</strong></td><td>${statusBadge(r.status)}</td><td><div class="row-actions">${r.invoiceId||r.invoiceNumber?`<button class="table-action" data-rental-invoice="${escapeHTML(r.invoiceNumber||r.invoiceId)}" type="button">Download invoice</button>`:''}<button class="table-action" data-rental-edit="${escapeHTML(r.id)}" type="button">Edit</button>${r.status!=='Completed'&&r.status!=='Cancelled'?`<button class="table-action" data-rental-complete="${escapeHTML(r.id)}" type="button">Complete</button><button class="table-action rental-cancel-action" data-rental-cancel="${escapeHTML(r.id)}" type="button">Cancel</button>`:''}</div></td></tr>`).join('')||'<tr><td colspan="8">No rentals match this filter.</td></tr>';
}
$('#rentalRows').addEventListener('click',e=>{
 const invoiceButton=e.target.closest('[data-rental-invoice]');
 if(invoiceButton){const inv=state.invoices.find(x=>x.id===invoiceButton.dataset.rentalInvoice||x.dbId===invoiceButton.dataset.rentalInvoice);if(inv)downloadInvoicePDF(inv);else toast('The linked invoice could not be found. Refresh the financial records and try again.');return}
 const cancel=e.target.closest('[data-rental-cancel]');
 if(cancel){const r=state.rentals.find(x=>x.id===cancel.dataset.rentalCancel);if(r&&confirm(`Cancel rental ${r.id}? This will release the vehicle dates in this browser preview.`)){r.status='Cancelled';recordAudit('Rental cancelled','rentals',`${r.id} · ${r.vehicle} · ${r.pickup} to ${r.returned}`);save();renderOverview();renderRentals();renderFleet();toast('Rental cancelled in this browser preview.')}return}
 const complete=e.target.closest('[data-rental-complete]');
 if(complete){const r=state.rentals.find(x=>x.id===complete.dataset.rentalComplete);if(r&&confirm(`Mark rental ${r.id} as completed?`)){r.status='Completed';recordAudit('Rental completed','rentals',`${r.id} · ${r.vehicle}`);save();renderOverview();renderRentals();renderFleet();toast('Rental marked completed in this browser preview.')}return}
 const edit=e.target.closest('[data-rental-edit]');
 if(edit){const r=state.rentals.find(x=>x.id===edit.dataset.rentalEdit);if(!r)return;const customer=prompt('Customer name:',r.customer);if(customer===null)return;const vehicle=prompt('Vehicle:',r.vehicle);if(vehicle===null)return;const pickup=prompt('Pickup date (YYYY-MM-DD):',r.pickup);if(pickup===null)return;const returned=prompt('Return date (YYYY-MM-DD):',r.returned);if(returned===null)return;if(!pickup||!returned||returned<pickup){toast('Invalid rental dates.');return}const conflict=state.rentals.find(x=>x.id!==r.id&&x.vehicle===vehicle&&!['Completed','Cancelled'].includes(x.status)&&pickup<=x.returned&&returned>=x.pickup);if(conflict){toast(`Vehicle conflict: overlaps rental ${conflict.id}.`);return}r.customer=customer;r.vehicle=vehicle;r.pickup=pickup;r.returned=returned;recordAudit('Rental edited','rentals',`${r.id} · ${vehicle} · ${pickup} to ${returned}`);save();renderRentals();renderFleet();renderOverview();toast('Rental updated in this browser preview.')}
});

function daysBetweenISO(from,to){
 const a=new Date((from||'')+'T00:00:00Z'),b=new Date((to||'')+'T00:00:00Z');
 if(Number.isNaN(a.getTime())||Number.isNaN(b.getTime()))return null;
 return Math.round((b-a)/86400000);
}
function buildOperationalAlerts(){
 const today=localISODate(), alerts=[];
 state.maintenance.forEach(m=>{
  const status=m.status||'Scheduled', start=maintenanceStart(m), end=maintenanceEnd(m);
  if(['Completed','Cancelled'].includes(status)||!start)return;
  const until=daysBetweenISO(today,start), ongoing= start<=today&&end>=today;
  if(ongoing) alerts.push({level:'critical',title:'Vehicle in maintenance',detail:`${m.vehicle} · ${m.serviceType||'Service'} · until ${fmtDate(end)}`,action:'Review fleet'});
  else if(until!==null&&until>=0&&until<=7) alerts.push({level:until<=2?'warning':'info',title:until===0?'Maintenance starts today':`Maintenance in ${until} day${until===1?'':'s'}`,detail:`${m.vehicle} · ${m.serviceType||'Service'} · ${fmtDate(start)}${end!==start?' – '+fmtDate(end):''}`,action:'Review fleet'});
 });
 state.rentals.forEach(r=>{
  if(['Completed','Cancelled'].includes(r.status))return;
  const days=daysBetweenISO(today,r.pickup);
  if(days!==null&&days>=0&&days<=2) alerts.push({level:days===0?'warning':'info',title:days===0?'Rental pickup today':`Rental pickup in ${days} day${days===1?'':'s'}`,detail:`${r.vehicle} · ${r.customer} · ${fmtDate(r.pickup)}`,action:'Review rentals'});
  const endDays=daysBetweenISO(today,r.returned);
  if(endDays!==null&&endDays>=0&&endDays<=1) alerts.push({level:'warning',title:endDays===0?'Rental return due today':'Rental return due tomorrow',detail:`${r.vehicle} · ${r.customer} · ${fmtDate(r.returned)}`,action:'Review rentals'});
 });
 // Highlight any existing active rental/service overlap in demo data so staff can spot legacy conflicts.
 state.rentals.filter(r=>!['Completed','Cancelled'].includes(r.status)).forEach(r=>{
  const m=state.maintenance.find(m=>m.vehicle===r.vehicle&&!['Completed','Cancelled'].includes(m.status||'Scheduled')&&maintenanceOverlaps(m,r.pickup,r.returned));
  if(m)alerts.push({level:'critical',title:'Rental conflicts with maintenance',detail:`${r.vehicle} · rental ${fmtDate(r.pickup)} – ${fmtDate(r.returned)} overlaps service ${fmtDate(maintenanceStart(m))} – ${fmtDate(maintenanceEnd(m))}`,action:'Review fleet'});
 });
 return alerts.sort((a,b)=>(({critical:0,warning:1,info:2}[a.level])-({critical:0,warning:1,info:2}[b.level])));
}
function renderOperationalAlerts(){
 const alerts=buildOperationalAlerts();
 const content=alerts.length?alerts.map((a,i)=>`<article class="ops-alert ${a.level}"><span class="ops-alert-mark">${a.level==='critical'?'!':a.level==='warning'?'▲':'i'}</span><div class="ops-alert-copy"><strong>${escapeHTML(a.title)}</strong><small>${escapeHTML(a.detail)}</small></div><button type="button" class="text-button" data-alert-action="${a.action==='Review rentals'?'rentals':'fleet'}">${a.action}</button></article>`).join(''):'<div class="ops-alert-empty"><strong>All clear</strong><span>No upcoming rental or maintenance alerts in the current preview data.</span></div>';
 const ops=document.querySelector('#opsAlerts');
 if(ops)ops.innerHTML=`<div class="ops-alerts-heading"><div><h3>Operational alerts</h3><p>Upcoming deadlines and availability risks</p></div><span class="ops-alert-count">${alerts.length}</span></div><div class="ops-alerts-list">${content}</div>`;
 const fleet=document.querySelector('#fleetAlerts');
 if(fleet)fleet.innerHTML=`<div class="ops-alerts-heading"><div><h3>Fleet alerts</h3><p>Service windows and rental conflicts</p></div><span class="ops-alert-count">${alerts.filter(a=>a.level==='critical'||a.level==='warning').length}</span></div><div class="ops-alerts-list">${content}</div>`;
}
function renderFleet(){
 const today=localISODate();
 $('#fleetGrid').innerHTML=state.fleet.map(v=>{
  const service=state.maintenance.find(m=>m.vehicle===v.name&&maintenanceStart(m)<=today&&maintenanceEnd(m)>=today&&String(m.status||'Scheduled')!=='Completed'&&String(m.status||'Scheduled')!=='Cancelled');
  const rental=state.rentals.find(r=>r.vehicle===v.name&&!['Completed','Cancelled'].includes(r.status)&&r.pickup<=today&&r.returned>=today);
  const availability=service?'In maintenance':rental?'Rented':(v.status==='Unavailable'?'Unavailable':'Available');
  return `<article class="vehicle-card"><div class="vehicle-top"><div><h3>${escapeHTML(v.name)}</h3><p>${escapeHTML(v.plate)}</p></div>${statusBadge(availability)}</div><div class="vehicle-symbol">◇</div><div class="vehicle-stats"><div>Daily rate<strong>${money(v.rate)}</strong></div><div>Utilisation<strong>${v.util}%</strong></div></div><p style="margin-top:12px">${escapeHTML(service?`Service: ${service.note}`:v.service)}</p></article>`
 }).join('');
 const sorted=[...state.maintenance].sort((a,b)=>maintenanceStart(a).localeCompare(maintenanceStart(b)));
 $('#maintenanceList').innerHTML=sorted.map(m=>{
  const start=maintenanceStart(m), end=maintenanceEnd(m), status=m.status||'Scheduled';
  return `<div class="maintenance-item"><span class="metric-icon cream">⚙</span><div><strong>${escapeHTML(m.vehicle)} ${statusBadge(status)}</strong><small>${escapeHTML(m.serviceType||'Routine service')} · ${escapeHTML(m.note)}</small></div><time>${fmtDate(start)}${end!==start?' – '+fmtDate(end):''}</time></div>`
 }).join('')||'<div class="empty-state"><strong>No maintenance scheduled</strong><span>Add a service window to keep fleet availability accurate.</span></div>';
 renderOperationalAlerts();
}
function customerStats(c){
 const rentals=state.rentals.filter(r=>r.customer===c.name);
 const invoices=state.invoices.filter(i=>i.customer===c.name);
 const payments=state.payments.filter(p=>p.customer===c.name);
 const spend=payments.reduce((sum,p)=>sum+Number(p.amount||0),0);
 const billed=invoices.reduce((sum,i)=>sum+Number(i.total||0),0);
 const paid=invoices.reduce((sum,i)=>sum+Number(i.paid||0),0);
 return {rentals:rentals.length||Number(c.rentals||0),spend:spend||Number(c.spend||0),balance:Math.max(0,billed-paid),rentalRecords:rentals,invoices,payments};
}
function renderCustomers(){
 const q=($('#customerSearch')?.value||'').toLowerCase();
 const rows=state.customers.filter(c=>[c.name,c.email,c.phone].join(' ').toLowerCase().includes(q));
 $('#customerRows').innerHTML=rows.map((c,i)=>{const s=customerStats(c);return `<tr><td><div class="customer-cell">${avatar(c.name)}<strong>${escapeHTML(c.name)}</strong></div></td><td>${escapeHTML(c.email||'—')}</td><td>${escapeHTML(c.phone||'—')}</td><td>${s.rentals}</td><td><strong>${money(s.spend)}</strong></td><td>${escapeHTML(c.last||'—')}</td><td><button type="button" class="table-action" data-customer-profile="${escapeHTML(c.name)}">View profile</button></td></tr>`}).join('')||'<tr><td colspan="7">No customers found.</td></tr>';
}
$('#customerRows').addEventListener('click',e=>{
 const btn=e.target.closest('[data-customer-profile]');if(!btn)return;
 const c=state.customers.find(x=>x.name===btn.dataset.customerProfile);if(!c)return;
 const s=customerStats(c);
 const rentalHtml=s.rentalRecords.length?s.rentalRecords.map(r=>`<li><strong>${escapeHTML(r.id)}</strong> · ${escapeHTML(r.vehicle)} · ${fmtDate(r.pickup)} – ${fmtDate(r.returned)} · ${statusBadge(r.status)}</li>`).join(''):'<li>No rental records linked to this customer yet.</li>';
 const invoiceHtml=s.invoices.length?s.invoices.map(i=>`<li><strong>${escapeHTML(i.id)}</strong> · ${money(i.total)} billed · ${money(Math.max(0,i.total-i.paid))} outstanding · ${escapeHTML(i.status)}</li>`).join(''):'<li>No invoices recorded.</li>';
 const body=`<div class="profile-head">${avatar(c.name)}<div><h3>${escapeHTML(c.name)}</h3><p>${escapeHTML(c.email||'No email')} · ${escapeHTML(c.phone||'No phone')}</p></div></div><div class="profile-metrics"><div><span>Rental count</span><strong>${s.rentals}</strong></div><div><span>Recorded spend</span><strong>${money(s.spend)}</strong></div><div><span>Outstanding</span><strong>${money(s.balance)}</strong></div></div><h4>Rental history</h4><ul class="profile-list">${rentalHtml}</ul><h4>Invoices</h4><ul class="profile-list">${invoiceHtml}</ul>`;
 const dlg=$('#profileDialog');$('#profileContent').innerHTML=body;dlg.showModal();
});

$('#customerSearch').addEventListener('input',renderCustomers);
function fmtDate(s){if(!s)return '—';return new Date(s+'T12:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
function downloadCSV(name,rows){const csv=rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)}
$('#exportBtn').onclick=()=>downloadCSV('drivehub-command-overview-demo.csv',[['Metric','Value'],['Revenue recorded','24850'],['Active rentals',state.rentals.filter(r=>r.status==='Active').length],['Outstanding invoices',state.invoices.reduce((s,i)=>s+Math.max(0,i.total-i.paid),0)],['Pending reviews',state.reviews.filter(r=>r.status==='Pending').length]]);
$('#exportPayments').onclick=()=>downloadCSV('drivehub-demo-payments.csv',[['Receipt','Customer','Invoice','Date','Method','Amount'],...state.payments.map(p=>[p.id,p.customer,p.invoice,p.date,p.method,p.amount])]);
async function openAction(type){if(type==='rental'||type==='invoice'||type==='payment'){await Promise.all([loadD1Customers(),loadD1Vehicles({quiet:true}),loadD1Financials({quiet:true})]);}if(['partner','sourcedVehicle','supplierPayment','rental'].includes(type))await loadPartnerData({quiet:true});const dialog=$('#actionDialog'),fields=$('#dialogFields');$('#actionForm').dataset.type=type;const field=(label,name,kind='text',opts='',full=false,required=true)=>`<div class="field ${full?'full':''}"><label for="f-${name}">${label}${required?' *':''}</label>${kind==='select'?`<select id="f-${name}" name="${name}" ${required?'required':''}>${opts}</select>`:kind==='textarea'?`<textarea id="f-${name}" name="${name}" ${required?'required':''}></textarea>`:`<input id="f-${name}" name="${name}" type="${kind}" ${required?'required':''}>`}</div>`;let title='',html='';
const vehicleOptions=state.fleet.filter(v=>!d1VehiclesReady||v.source==='d1').map(v=>`<option value="${escapeHTML(v.id||v.name)}">${escapeHTML(v.name)}</option>`).join('');const customerOptions=state.customers.filter(c=>!d1CustomersReady||c.source==='d1').map(c=>`<option value="${escapeHTML(c.id||c.name)}">${escapeHTML(c.name)}</option>`).join('');const invoiceOptions=state.invoices.filter(i=>invoiceBalance(i)>0&&i.dbId&&i.customerId).map(i=>`<option value="${escapeHTML(i.dbId)}">${escapeHTML(i.id)} · ${escapeHTML(i.customer)} · ${money(invoiceBalance(i))} due</option>`).join('');const partnerOptions=rentalPartners.filter(p=>p.status==='active').map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.company_name)}</option>`).join('');
if(type==='vehicle'){title='Add vehicle to fleet';html=field('Vehicle name / model','name')+field('Registration number','plate')+field('Daily rate (GH₵)','rate','number')+field('Availability status','status','select','<option value="available">Available</option><option value="reserved">Reserved</option><option value="rented">Rented</option><option value="maintenance">In maintenance</option><option value="inactive">Inactive</option>')+field('Service due date','serviceDueOn','date','',false,false)+field('Notes','notes','textarea','',true,false)}
if(type==='customer'){title='Add customer';html=field('Full name','name')+field('Email address','email','email')+field('Phone number','phone','tel')+field('Customer notes','notes','textarea','',true,false)}
if(type==='invoice'){title='Create invoice';html=field('Customer','customer','select',customerOptions)+field('Vehicle','vehicle','select',vehicleOptions)+field('Pickup date','pickup','date')+field('Return date','returned','date')+field('Daily rate (GH₵)','rate','number')+field('Due date','due','date')+field('Notes','notes','textarea','',true,false)}
if(type==='payment'){title='Record payment';html=field('Invoice','invoice','select',invoiceOptions)+field('Payment date','date','date')+field('Amount received (GH₵)','amount','number')+field('Payment method','method','select','<option>Mobile Money</option><option>Bank transfer</option><option>Cash</option>')+field('Payment reference','reference','text','',true,false)}
if(type==='rental'){title='Add rental';html=field('Rental source','sourceType','select','<option value="owned">DriveHub GH fleet</option><option value="partner">Partner-sourced vehicle</option>')+field('Customer','customer','select',customerOptions)+field('DriveHub vehicle','vehicle','select',vehicleOptions)+field('Partner supplier','partnerId','select','<option value="">Choose partner</option>'+partnerOptions,false,false)+field('Partner vehicle / model','partnerVehicle','text','',false,false)+field('Registration number','partnerPlate','text','',false,false)+field('Customer daily rate (GH₵)','rate','number')+field('Supplier daily cost (GH₵)','supplierRate','number','',false,false)+field('Pickup date','pickup','date')+field('Return date','returned','date')+field('Rental status','status','select','<option>Upcoming</option><option>Active</option><option>Completed</option>')+field('Rental notes','notes','textarea','',true,false)+`<p class="helper-note full">Partner supplier rates and margin are private management data. Sourced vehicles are not added to the permanent DriveHub GH fleet.</p>`}
if(type==='partner'){title='Add rental partner';html=field('Company name','company_name')+field('Contact person','contact_name')+field('Phone number','phone','tel')+field('Email address','email','email')+field('Business address','address','text','',true,false)+field('Payment terms','payment_terms','text','',true,false)+field('Bank / mobile money details','payment_details','textarea','',true,false)+field('Internal notes','notes','textarea','',true,false)}
if(type==='sourcedVehicle'){title='Add partner-sourced vehicle';html=field('Supplier partner','partner_id','select','<option value="">Choose partner</option>'+partnerOptions)+field('Vehicle name / model','vehicle_name')+field('Registration number','registration_number','text','',false,false)+field('Supplier daily rate (GH₵)','supplier_rate','number')+field('Customer daily rate (GH₵)','customer_rate','number')+field('Available from','available_from','date','',false,false)+field('Available to','available_to','date','',false,false)+field('Notes / supplier conditions','notes','textarea','',true,false)}
if(type==='supplierPayment'){title='Record supplier payment';html=field('Supplier partner','partner_id','select','<option value="">Choose partner</option>'+partnerOptions)+field('Amount paid (GH₵)','amount','number')+field('Payment date','paid_on','date')+field('Payment method','payment_method','select','<option>Bank transfer</option><option>Mobile Money</option><option>Cash</option><option>Other</option>')+field('Payment reference','payment_reference','text','',true,false)+field('Notes','notes','textarea','',true,false)}
if(type==='maintenance'){title='Schedule vehicle maintenance';const serviceTypes='<option value="Routine service">Routine service</option><option value="Oil and filter">Oil and filter</option><option value="Tyres and brakes">Tyres and brakes</option><option value="Inspection">Inspection</option><option value="Repair">Repair</option><option value="Other">Other</option>';const serviceStatuses='<option value="Scheduled">Scheduled</option><option value="In progress">In progress</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option>';html=field('Vehicle','vehicle','select',vehicleOptions)+field('Service type','serviceType','select',serviceTypes)+field('Start date','startDate','date')+field('End date','endDate','date')+field('Status','status','select',serviceStatuses)+field('Service notes','note','textarea','',true)}
if(type==='review'){title='Add review record';html=field('Customer name','name')+field('Email','email','email','',false,false)+field('Vehicle','vehicle','select',vehicleOptions)+field('Rating','rating','select','<option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option>')+field('What went well','good','textarea','',true)+field('What could improve','improve','textarea','',true,false)}
$('#dialogTitle').textContent=title;fields.innerHTML=html;$('#dialogSubmit').textContent=type==='payment'||type==='supplierPayment'?'Record payment':type==='partner'?'Save partner':type==='sourcedVehicle'?'Save sourced vehicle':type==='review'?'Add review':'Save record';dialog.showModal();const sourceSelect=$('#dialogFields [name=sourceType]');if(sourceSelect){const sync=()=>{const partner=sourceSelect.value==='partner';['partnerId','partnerVehicle','partnerPlate','supplierRate'].forEach(n=>{const el=$(`#dialogFields [name=\"${n}\"]`);if(el){el.closest('.field').style.display=partner?'flex':'none';el.required=partner&&n!=='partnerPlate'}});const own=$('#dialogFields [name=vehicle]');if(own){own.closest('.field').style.display=partner?'none':'flex';own.required=!partner}};sourceSelect.addEventListener('change',sync);sync()}}
$('#addVehicleBtn').onclick=()=>openAction('vehicle');$('#addPartnerBtn')?.addEventListener('click',()=>openAction('partner'));$('#addSourcedVehicleBtn')?.addEventListener('click',()=>openAction('sourcedVehicle'));$('#recordSupplierPaymentBtn')?.addEventListener('click',()=>openAction('supplierPayment'));$('#addCustomerBtn').onclick=()=>openAction('customer');$('#closeProfileDialog').onclick=()=>$('#profileDialog').close();$('#quickAddBtn').onclick=()=>openAction('rental');$('#newInvoiceBtn').onclick=()=>openAction('invoice');$('#recordPaymentBtn').onclick=()=>openAction('payment');$('#newRentalBtn').onclick=()=>openAction('rental');$('#addMaintenanceBtn').onclick=()=>openAction('maintenance');$('#notificationsBtn').onclick=()=>{nav('overview');toast('Notifications: review approvals and overdue invoices are highlighted under Needs attention.')};
// Allow users to dismiss an action dialog even when required fields are still empty.
$('#actionForm').querySelectorAll('[value="cancel"]').forEach(button=>button.addEventListener('click',e=>{e.preventDefault();$('#actionDialog').close();}));
async function loadPartnerData({quiet=false}={}){
 try{
  const [pr,vr,sr]=await Promise.all(['/command/api/partners','/command/api/sourced-vehicles','/command/api/supplier-payments'].map(url=>fetch(url,{credentials:'same-origin',headers:{Accept:'application/json'}})));
  const [p,v,pay]=await Promise.all([pr.json(),vr.json(),sr.json()]);
  if(!pr.ok||!vr.ok||!sr.ok)throw new Error((p.error||v.error||pay.error||'Partner API unavailable'));
  rentalPartners=p.data||[];sourcedVehicles=v.data||[];supplierPayments=pay.data||[];partnersReady=true;renderPartners();return true;
 }catch(error){if(!quiet)toast(`Partner data could not be loaded from the database: ${error.message}. Apply migration 0003 and deploy the partner APIs first.`);console.warn('Partner data API unavailable',error);renderPartners();return false}
}
function renderPartners(){
 const rows=$('#partnerRows');if(!rows)return;
 $('#partnerCountMetric').textContent=rentalPartners.filter(p=>p.status==='active').length;
 $('#sourcedVehicleCountMetric').textContent=sourcedVehicles.length;
 $('#supplierPaymentsMetric').textContent=money(supplierPayments.reduce((s,p)=>s+Number(p.amount_minor||0)/100,0));
 $('#partnersConnectionState').textContent=partnersReady?'Connected':'Not connected';
 rows.innerHTML=rentalPartners.map(p=>`<tr><td><strong>${escapeHTML(p.company_name)}</strong><small>${escapeHTML(p.address||'')}</small></td><td>${escapeHTML(p.contact_name||'—')}</td><td>${escapeHTML(p.phone||'—')}<small>${escapeHTML(p.email||'')}</small></td><td>${escapeHTML(p.payment_terms||'Not specified')}</td><td>${statusBadge(p.status||'Active')}</td></tr>`).join('')||'<tr><td colspan="5">No rental partners registered yet. Add your first trusted supplier.</td></tr>';
 $('#sourcedVehicleRows').innerHTML=sourcedVehicles.map(v=>{const margin=(Number(v.customer_daily_rate_minor||0)-Number(v.supplier_daily_rate_minor||0))/100;return `<tr><td><strong>${escapeHTML(v.vehicle_name)}</strong></td><td>${escapeHTML(v.partner_name||'—')}</td><td>${escapeHTML(v.registration_number||'—')}</td><td>${money(Number(v.supplier_daily_rate_minor||0)/100)}</td><td>${money(Number(v.customer_daily_rate_minor||0)/100)}</td><td>${escapeHTML(v.available_from||'Any date')}${v.available_to?' – '+escapeHTML(v.available_to):''}</td><td><strong>${money(margin)}</strong></td></tr>`}).join('')||'<tr><td colspan="7">No partner vehicles registered. Add a sourced vehicle when a supplier confirms availability.</td></tr>';
 $('#supplierPaymentRows').innerHTML=supplierPayments.map(p=>`<tr><td>${escapeHTML(p.paid_on||'—')}</td><td>${escapeHTML(p.partner_name||'—')}</td><td><strong>${money(Number(p.amount_minor||0)/100)}</strong></td><td>${escapeHTML(p.payment_method||'—')}</td><td>${escapeHTML(p.payment_reference||'—')}</td></tr>`).join('')||'<tr><td colspan="5">No supplier payments recorded yet.</td></tr>';
}

$('#actionForm').addEventListener('submit',async e=>{if(e.submitter?.value==='cancel')return;e.preventDefault();const type=e.currentTarget.dataset.type;const data=Object.fromEntries(new FormData(e.currentTarget).entries());if(type==='partner'||type==='sourcedVehicle'||type==='supplierPayment'){
 const button=$('#dialogSubmit');button.disabled=true;
 let inlineError=$('#actionForm .action-save-error');if(!inlineError){inlineError=document.createElement('div');inlineError.className='action-save-error';inlineError.setAttribute('role','alert');inlineError.setAttribute('aria-live','polite');$('#dialogActions')?.prepend(inlineError);if(!$('#dialogActions'))$('#actionForm').appendChild(inlineError)}inlineError.textContent='';inlineError.hidden=true;
 try{let url,body;
 if(type==='partner'){url='/command/api/partners';body={company_name:data.company_name,contact_name:data.contact_name,phone:data.phone,email:data.email,address:data.address,payment_terms:data.payment_terms,payment_details:data.payment_details,notes:data.notes}}
 if(type==='sourcedVehicle'){url='/command/api/sourced-vehicles';body={partner_id:data.partner_id,vehicle_name:data.vehicle_name,registration_number:data.registration_number,supplier_daily_rate_minor:Math.round(Number(data.supplier_rate)*100),customer_daily_rate_minor:Math.round(Number(data.customer_rate)*100),available_from:data.available_from,available_to:data.available_to,notes:data.notes}}
 if(type==='supplierPayment'){url='/command/api/supplier-payments';body={partner_id:data.partner_id,amount_minor:Math.round(Number(data.amount)*100),paid_on:data.paid_on,payment_method:data.payment_method,payment_reference:data.payment_reference,notes:data.notes}}
 const response=await fetch(url,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.detail||payload.error||`API returned ${response.status}`);$('#actionDialog').close();await loadPartnerData({quiet:true});recordAudit(type==='partner'?'Rental partner created':type==='sourcedVehicle'?'Partner vehicle registered':'Supplier payment recorded','partners',JSON.stringify(payload.data||{}));save();toast(payload.warning|| (type==='partner'?'Rental partner saved to the database.':type==='sourcedVehicle'?'Sourced vehicle saved to the database.':'Supplier payment saved to the database.'));return;
 }catch(error){const message=`Record was not saved: ${error.message}. Use this error to identify the actual cause. If it says the migration is missing, apply command/migrations/0003_partner_sourcing.sql to the same D1 database bound to this deployment.`;inlineError.textContent=message;inlineError.hidden=false;toast(message);return}finally{button.disabled=false}
 }if(type==='vehicle'){
 const name=String(data.name||'').trim(),plate=String(data.plate||'').trim().toUpperCase(),rate=Number(data.rate);
 if(name.length<2||!Number.isFinite(rate)||rate<0){toast('Enter a vehicle name and a valid non-negative daily rate.');return}
 if(d1VehiclesReady){const button=$('#dialogSubmit');button.disabled=true;try{const response=await fetch('/command/api/vehicles',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},credentials:'same-origin',body:JSON.stringify({name,registration_number:plate||null,daily_rate_minor:Math.round(rate*100),status:data.status||'available',service_due_on:data.serviceDueOn||null,notes:data.notes||null})});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||`Vehicle API returned ${response.status}`);await loadD1Vehicles({quiet:true});recordAudit('Vehicle created','fleet',`${name} · ${plate||'No registration'} · ${money(rate)}`);save();$('#actionDialog').close();renderFleet();toast('Vehicle saved to the connected fleet database.');return}catch(error){toast(`Vehicle was not saved: ${error.message}. Check your staff permissions and database connection.`);return}finally{button.disabled=false}}
 const exists=state.fleet.some(v=>String(v.plate||'').toLowerCase()===plate.toLowerCase()&&plate);if(exists){toast('That registration number is already in the fleet.');return}
 state.fleet.unshift({name,plate:plate||'Registration not entered',status:({available:'Available',reserved:'Reserved',rented:'Rented',maintenance:'In maintenance',inactive:'Inactive'})[data.status]||'Available',rate,util:0,service:data.serviceDueOn?`Service due ${fmtDate(data.serviceDueOn)}`:(data.notes||'Service date not recorded')});recordAudit('Vehicle created','fleet',`${name} · ${plate||'No registration'} · ${money(rate)}`);save();$('#actionDialog').close();renderFleet();renderOverview();toast('Vehicle added to the fleet list.');return;
}else if(type==='customer'){
 const name=data.name.trim(),email=data.email.trim().toLowerCase(),phone=data.phone.trim();
 if(!name||(!email&&!phone)){toast('Enter a customer name and at least an email address or phone number.');return}
 const duplicate=state.customers.some(c=>c.name.trim().toLowerCase()===name.toLowerCase()||(email&&c.email&&c.email.trim().toLowerCase()===email)||(phone&&c.phone&&c.phone.replace(/\s+/g,'')===phone.replace(/\s+/g,'')));
 if(duplicate){toast('A customer with the same name, email or phone already exists.');return}
 const submitCustomer=async()=>{
  const button=$('#dialogSubmit');button.disabled=true;
  try{
   const response=await fetch('/command/api/customers',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({full_name:name,email:email||null,phone:phone||null,notes:data.notes.trim()||null})});
   const payload=await response.json().catch(()=>({}));
   if(!response.ok) throw new Error(payload.error||`Customer API returned ${response.status}`);
   const created=normalizeD1Customer(payload.data||{full_name:name,email,phone,notes:data.notes.trim()});
   state.customers=[created,...state.customers.filter(c=>String(c.name||'').trim().toLowerCase()!==name.toLowerCase())];
   d1Customers=[created,...d1Customers.filter(c=>String(c.name||'').trim().toLowerCase()!==name.toLowerCase())];
   save();renderCustomers();renderOverview();$('#actionDialog').close();nav('customers');toast('Customer saved to the connected database.');
  }catch(error){toast(`Customer was not saved to D1: ${error.message}. Check Cloudflare Access and the customer API; no local-only copy was created.`)}finally{button.disabled=false}
 };
 submitCustomer();return;
}else if(type==='invoice'){const days=daysInclusive(data.pickup,data.returned);if(new Date(data.returned)<new Date(data.pickup)){toast('Return date must be on or after pickup date.');return}const total=days*Number(data.rate);state.invoices.unshift({id:`INV-2026-${String(state.invoices.length+19).padStart(3,'0')}`,customer:data.customer,vehicle:data.vehicle,issued:new Date().toISOString().slice(0,10),due:data.due,total,paid:0,status:'Unpaid'});save();renderInvoices();renderCustomers();renderOverview();toast(`Invoice created in demo: ${money(total)} for ${days} billable days.`);nav('invoices')}else if(type==='payment'){
 const inv=state.invoices.find(i=>(i.dbId||i.id)===data.invoice||i.id===data.invoice);const amount=Number(data.amount);
 if(!inv){toast('Select a valid invoice before recording a payment.');return}if(!data.date){toast('Enter the payment date.');return}if(!Number.isFinite(amount)||amount<=0){toast('Enter a payment amount greater than zero.');return}if(amount>invoiceBalance(inv)){toast('Payment exceeds the remaining invoice balance.');return}
 if(!d1FinancialReady||!inv.dbId||!inv.customerId){toast('Live invoice data is not connected. Refresh the Command Centre and try again; no local-only payment was created.');return}
 const button=$('#dialogSubmit');button.disabled=true;
 try{const method=({Cash:'cash','Bank transfer':'bank_transfer','Mobile Money':'mobile_money',Card:'card',Other:'other'})[data.method]||'other';const response=await fetch('/command/api/payments',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({invoice_id:inv.dbId,customer_id:inv.customerId,amount_minor:Math.round(amount*100),payment_method:method,received_at:data.date,reference:data.reference||null})});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||`Payment API returned ${response.status}`);const refreshed=await loadD1Financials({quiet:false});$('#actionDialog').close();recordAudit('Payment recorded','payments',`${inv.id} · ${money(amount)} · ${method}`);toast(refreshed?`Payment saved. Receipt ${payload.data?.receipt_number||''} is now available in Payments & receipts.`:`Payment saved as ${payload.data?.receipt_number||''}, but the dashboard could not refresh. Reload the page to view the receipt.`)}catch(error){toast(`Payment was not saved: ${error.message}. No browser-only payment was created.`)}finally{button.disabled=false}
}else if(type==='rental'){
 if(!data.pickup||!data.returned||data.returned<data.pickup){toast('Enter valid rental dates. Return date must be on or after pickup date.');return}
 const sourced=data.sourceType==='partner';if(sourced){toast('Automatic invoicing for partner-sourced rentals is not yet connected to the D1 rental ledger. Please use the DriveHub GH fleet option for now; partner rental invoicing must be integrated separately to avoid unlinked financial records.');return}
 const customer=state.customers.find(c=>c.id===data.customer&&c.source==='d1');const vehicle=state.fleet.find(v=>v.id===data.vehicle&&v.source==='d1');const rate=Number(data.rate);
 if(!d1CustomersReady||!d1VehiclesReady||!customer||!vehicle){toast('Live customer and vehicle records are required. Refresh the Command Centre and select a customer and vehicle from the connected database.');return}
 if(!Number.isFinite(rate)||rate<=0){toast('Enter a daily rate greater than zero.');return}
 const conflict=state.rentals.find(r=>r.vehicleId===vehicle.id&&!['Completed','Cancelled'].includes(r.status)&&data.pickup<=r.returned&&data.returned>=r.pickup);if(conflict){toast(`Vehicle conflict: ${vehicle.name} overlaps rental ${conflict.id} (${conflict.pickup} to ${conflict.returned}).`);return}
 const maintenanceConflict=state.maintenance.find(m=>m.vehicle===vehicle.name&&!['Completed','Cancelled'].includes(m.status||'Scheduled')&&maintenanceOverlaps(m,data.pickup,data.returned));if(maintenanceConflict){toast(`Vehicle unavailable: ${maintenanceConflict.serviceType||'maintenance'} is scheduled during this rental.`);return}
 const button=$('#dialogSubmit');button.disabled=true;
 try{const rentalId=`RNT-${crypto.randomUUID()}`;const response=await fetch('/command/api/rentals',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({rental_id:rentalId,customer_id:customer.id,vehicle_id:vehicle.id,pickup_date:data.pickup,return_date:data.returned,daily_rate_minor:Math.round(rate*100),status:String(data.status||'Upcoming').toLowerCase(),notes:data.notes||null})});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||`Rental API returned ${response.status}`);const refreshed=await loadD1Financials({quiet:false});$('#actionDialog').close();recordAudit('Rental created with invoice','rentals',`${payload.data?.rental_id||rentalId} · ${customer.name} · ${vehicle.name} · invoice ${payload.data?.invoice_number||''}`);toast(refreshed?`Rental saved and invoice ${payload.data?.invoice_number||''} issued automatically. Download it from this rental or the Invoices section.`:`Rental and invoice ${payload.data?.invoice_number||''} were saved, but the dashboard could not refresh. Reload the page to view them.`);nav('rentals');return}catch(error){toast(`Rental was not saved: ${error.message}. No browser-only rental or invoice was created.`)}finally{button.disabled=false}
}else if(type==='maintenance'){
 if(!data.startDate||!data.endDate||data.endDate<data.startDate){toast('Enter a valid service window. End date must be on or after start date.');return}
 const serviceStatus=data.status||'Scheduled';
 if(!['Completed','Cancelled'].includes(serviceStatus)){
  const rentalConflict=state.rentals.find(r=>r.vehicle===data.vehicle&&!['Completed','Cancelled'].includes(r.status)&&data.startDate<=r.returned&&data.endDate>=r.pickup);
  if(rentalConflict){toast(`Maintenance overlaps rental ${rentalConflict.id} (${rentalConflict.pickup} to ${rentalConflict.returned}). Reschedule service or resolve the rental first.`);return}
  const serviceConflict=state.maintenance.find(m=>m.vehicle===data.vehicle&&!['Completed','Cancelled'].includes(m.status||'Scheduled')&&maintenanceOverlaps(m,data.startDate,data.endDate));
  if(serviceConflict){toast(`This vehicle already has a maintenance window from ${fmtDate(maintenanceStart(serviceConflict))} to ${fmtDate(maintenanceEnd(serviceConflict))}.`);return}
 }
 const record={id:'MNT-'+Date.now(),vehicle:data.vehicle,serviceType:data.serviceType||'Routine service',startDate:data.startDate,endDate:data.endDate,date:data.startDate,status:serviceStatus,note:data.note||''};
 state.maintenance.unshift(record);
 recordAudit('Maintenance scheduled','fleet',`${record.vehicle} · ${record.serviceType} · ${record.startDate} to ${record.endDate} · ${record.status}`);
 toast('Maintenance schedule saved in this browser preview.');
 nav('fleet')
}else if(type==='review'){toast('Use the public review form to submit a review. Command Centre displays reviews saved in D1.');nav('reviews');return}save();$('#actionDialog').close();renderOverview();renderReviews();renderInvoices();renderPayments();renderRentals();renderFleet();renderCustomers()});

function reportDateAllowed(date){
 const from=$('#reportStartDate')?.value||'',to=$('#reportEndDate')?.value||'';
 if(from&&to&&to<from){toast('Report end date must be on or after the start date.');return false}
 return (!from||date>=from)&&(!to||date<=to)
}
function generateReport(type){
 let headers=[],records=[],dateOf=()=>'',summary='';
 if(type==='invoices'){
  headers=['Invoice','Customer','Issue date','Total','Paid','Balance','Status'];
  records=state.invoices.filter(i=>reportDateAllowed(i.date||i.issueDate||'')).map(i=>[i.id,i.customer,i.date||i.issueDate||'',Number(i.total||0),Number(i.paid||0),Math.max(0,Number(i.total||0)-Number(i.paid||0)),effectiveInvoiceStatus(i)]);
  summary=`${records.length} invoices · balance ${money(records.reduce((s,r)=>s+Number(r[5]||0),0))}`;
 }else if(type==='fleet'){
  headers=['Vehicle','Plate','Recorded status','Daily rate','Utilisation'];
  records=state.fleet.map(v=>[v.name,v.plate,v.status,v.rate,(v.util||0)+'%']);
  summary=`${records.length} vehicles in fleet records`;
 }else if(type==='reviews'){
  headers=['Review','Customer','Vehicle','Rating','Status','Date'];
  records=state.reviews.filter(r=>reportDateAllowed(r.date||'')).map(r=>[r.id,r.name,r.vehicle,r.rating,r.status,r.date]);
  summary=`${records.length} reviews · average rating ${records.length?(records.reduce((s,r)=>s+Number(r[3]||0),0)/records.length).toFixed(1):'—'}`;
 }else if(type==='payments'){
  headers=['Payment','Customer','Invoice','Date','Method','Amount'];
  records=state.payments.filter(p=>reportDateAllowed(p.date||'')).map(p=>[p.id,p.customer,p.invoice,p.date,p.method,Number(p.amount||0)]);
  summary=`${records.length} payments · total received ${money(records.reduce((s,r)=>s+Number(r[5]||0),0))}`;
 }else if(type==='maintenance'){
  headers=['Vehicle','Service type','Start date','End date','Status','Notes'];
  records=state.maintenance.filter(m=>reportDateAllowed(maintenanceStart(m))||reportDateAllowed(maintenanceEnd(m))).map(m=>[m.vehicle,m.serviceType||'Routine service',maintenanceStart(m),maintenanceEnd(m),m.status||'Scheduled',m.note||'']);
  summary=`${records.length} maintenance records`;
 }else{
  headers=['Rental','Customer','Vehicle','Pickup','Return','Days','Daily rate','Rental total','Status'];
  records=state.rentals.filter(r=>reportDateAllowed(r.pickup||'')).map(r=>{const days=daysInclusive(r.pickup,r.returned);return [r.id,r.customer,r.vehicle,r.pickup,r.returned,days,Number(r.rate||0),Number(r.rate||0)*days,r.status]});
  summary=`${records.length} rentals · recorded rental value ${money(records.reduce((s,r)=>s+Number(r[7]||0),0))}`;
 }
 const rows=[headers,...records];
 downloadCSV(`drivehub-${type}-report-demo.csv`,rows);
 const tableRows=records.slice(0,12).map(row=>`<tr>${row.map(cell=>`<td>${escapeHTML(String(cell??''))}</td>`).join('')}</tr>`).join('');
 $('#reportOutput').innerHTML=`<div class="report-output-head"><div><p class="eyebrow">REPORT PREVIEW</p><h2>${type[0].toUpperCase()+type.slice(1)} report</h2><p class="section-desc">${escapeHTML(summary)}</p></div><button type="button" class="btn btn-primary" id="exportCurrentReport">Export CSV</button></div><div class="table-wrap"><table class="data-table"><thead><tr>${headers.map(h=>`<th>${escapeHTML(h)}</th>`).join('')}</tr></thead><tbody>${tableRows||`<tr><td colspan="${headers.length}">No records match the selected dates.</td></tr>`}</tbody></table></div>${records.length>12?`<p class="section-desc">Showing first 12 of ${records.length} records. The CSV contains all matching records.</p>`:''}<p class="report-caveat">Preview based on records stored in this browser. Verify figures before using for official accounting.</p>`;
 const exportBtn=$('#exportCurrentReport');
 if(exportBtn)exportBtn.onclick=()=>{downloadCSV(`drivehub-${type}-report-demo.csv`,rows);toast('CSV report exported.')};
 toast('Report generated and CSV downloaded.');
}
$$('[data-report]').forEach(b=>b.onclick=()=>generateReport(b.dataset.report));
$('#clearReportDates')?.addEventListener('click',()=>{$('#reportStartDate').value='';$('#reportEndDate').value='';toast('Report date filters cleared.')});

$('#saveSettings').onclick=()=>{localStorage.setItem('dh-command-settings',JSON.stringify({name:$('#businessName').value,email:$('#businessEmail').value,phone:$('#businessPhone').value}));toast('Preferences saved in this browser preview.')};

document.addEventListener('click',e=>{const button=e.target.closest('[data-alert-action]');if(!button)return;nav(button.dataset.alertAction);});

renderOverview();renderReviews();renderInvoices();renderPayments();renderRentals();renderFleet();renderCustomers();
const requestedView=(location.hash||'').slice(1);const validViews=['overview','reviews','invoices','payments','rentals','fleet','customers','partners','reports','audit','settings'];nav(validViews.includes(requestedView)?requestedView:'overview');
loadD1Customers();
loadD1Vehicles({quiet:true});
loadD1Financials({quiet:true});
loadD1Reviews({quiet:true});
window.addEventListener('hashchange',()=>{const view=(location.hash||'').slice(1);if(validViews.includes(view)&&view!==currentView)nav(view)});
