const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = n => 'GH₵ ' + Number(n).toLocaleString('en-GH',{maximumFractionDigits:2});
const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initial = {
 reviews:[
  {id:'RV-104',name:'Ama Mensah',email:'ama@example.com',vehicle:'Toyota RAV4',rating:5,date:'2026-10-23',status:'Pending',good:'The vehicle was comfortable and pickup was straightforward.',improve:'A short reminder about the return time would be helpful.'},
  {id:'RV-103',name:'Kojo Asare',email:'kojo@example.com',vehicle:'Toyota Prado',rating:4,date:'2026-10-22',status:'Pending',good:'Plenty of space for the family and luggage.',improve:'It would be helpful to have the fuel policy explained at booking.'},
  {id:'RV-102',name:'Nana Owusu',email:'nana@example.com',vehicle:'Honda CR-V',rating:5,date:'2026-10-21',status:'Pending',good:'The car suited our plans and was comfortable throughout.',improve:''},
  {id:'RV-101',name:'Esi Boateng',email:'esi@example.com',vehicle:'Mitsubishi Outlander',rating:5,date:'2026-10-18',status:'Approved',good:'Helpful communication and a smooth journey.',improve:''},
  {id:'RV-100',name:'Yaw Kwarteng',email:'yaw@example.com',vehicle:'Hyundai Santa Fe',rating:4,date:'2026-10-16',status:'Approved',good:'Comfortable car for a busy week.',improve:'More colour options would be nice.'},
  {id:'RV-099',name:'Kofi Nartey',email:'kofi@example.com',vehicle:'Toyota Land Cruiser V8',rating:3,date:'2026-10-12',status:'Rejected',good:'The trip was okay.',improve:'I had a question about the booking.'}
 ],
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
function save(){try{localStorage.setItem('dh-command-demo',JSON.stringify(state));return true}catch(e){toast('Could not save in this browser. Storage may be full or disabled.');return false}}
// D1 customer integration: keep local demo records intact while adding database records.
let d1Customers = [];
let d1CustomersReady = false;
let d1Rentals = [];
let d1RentalsReady = false;
function normalizeD1Rental(row){return {id:row.id,customer_id:row.customer_id,vehicle_id:row.vehicle_id,customer:row.customer_name||'',vehicle:row.vehicle_name||'',pickup:row.pickup_date,returned:row.return_date,rate:Number(row.daily_rate_minor||0)/100,status:({upcoming:'Upcoming',active:'Active',completed:'Completed',cancelled:'Cancelled'})[String(row.status||'upcoming').toLowerCase()]||row.status,source:'d1'};}
async function loadD1Rentals({quiet=false}={}){try{const response=await fetch('/command/api/rentals?limit=200',{headers:{Accept:'application/json'},credentials:'same-origin'});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||`Rental API returned ${response.status}`);if(!Array.isArray(payload.data))throw new Error('Rental API returned an unexpected response.');d1Rentals=payload.data.map(normalizeD1Rental);d1RentalsReady=true;renderRentals();renderOverview();renderFleet();return true;}catch(error){if(!quiet)toast(`Could not load saved rentals: ${error.message}. Browser preview records are retained.`);console.warn('D1 rental sync unavailable; retaining local rental records.',error);return false;}}
async function updateD1RentalStatus(rental,status){const response=await fetch('/command/api/rentals',{method:'PATCH',credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({id:rental.id,status:status.toLowerCase()})});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||`Rental API returned ${response.status}`);await loadD1Rentals({quiet:true});}
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

function nav(view){currentView=view;try{if(location.hash!==`#${view}`)history.replaceState(null,'',`#${view}`)}catch{};$$('.nav-item[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));$$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${view}`));const titles={overview:'Overview',reviews:'Reviews & reputation',invoices:'Invoices',payments:'Payments & receipts',rentals:'Rental operations',fleet:'Fleet management',customers:'Customers',reports:'Reports & insights',audit:'Audit trail',settings:'Settings'};$('#crumbCurrent').textContent=titles[view]||view; if(view==='audit') renderAudit();$('#pageTitle').innerHTML=view==='overview'?'Good evening. <em>Let\'s move.</em>':titles[view];$('#eyebrow').textContent=view==='overview'?'YOUR BUSINESS, AT A GLANCE':'DRIVEHUB GH · '+titles[view].toUpperCase();$('#pageSubtitle').textContent=({overview:"A clear view of today's activity across DriveHub GH.",reviews:'Listen, respond and decide what gets published.',invoices:'Keep every rental charge and balance accounted for.',payments:'Track recorded payments and issue receipts.',rentals:'Know what is booked, active and due back.',fleet:'Make every vehicle work harder and stay road-ready.',customers:'Understand your customers and their rental history.',reports:'Turn day-to-day activity into clear business decisions.',settings:'Manage company preferences and production readiness.'})[view];$('#sidebar').classList.remove('open');if(view==='reviews')renderReviews();if(view==='invoices')renderInvoices();if(view==='payments')renderPayments();if(view==='rentals'){renderRentals();loadD1Rentals({quiet:true});}if(view==='fleet')renderFleet();if(view==='customers')renderCustomers()}
$$('.nav-item[data-view]').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.view)));
$$('[data-goto]').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.goto)));
$('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#dismissNotice').addEventListener('click',()=>$('.demo-notice').remove());

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
function renderRecent(){const rows=state.rentals.slice(0,4);$('#recentRentals').innerHTML=rows.map(r=>`<tr><td><div class="customer-cell">${avatar(r.customer)}<div><strong>${escapeHTML(r.customer)}</strong><small>${r.id}</small></div></div></td><td>${escapeHTML(r.vehicle)}</td><td>${fmtDate(r.pickup)} – ${fmtDate(r.returned)}<small>${daysInclusive(r.pickup,r.returned)} billable days</small></td><td><strong>${money(r.rate*daysInclusive(r.pickup,r.returned))}</strong></td><td>${statusBadge(r.status)}</td></tr>`).join('')}
function renderOverview(){renderKpis();renderChart();renderAttention();renderRecent()}
function renderReviews(){const q=($('#reviewSearch')?.value||'').toLowerCase();let arr=state.reviews.filter(r=>(reviewFilter==='All'||r.status===reviewFilter)&&[r.name,r.vehicle,r.good,r.improve,r.id].join(' ').toLowerCase().includes(q));$('#reviewsList').innerHTML=arr.length?arr.map(r=>`<article class="review-card"><div class="review-card-head"><div class="review-person">${avatar(r.name)}<div><strong>${escapeHTML(r.name)}</strong><small>${escapeHTML(r.id)} · ${fmtDate(r.date)} · ${escapeHTML(r.email)}</small></div></div><div><div class="stars" aria-label="${r.rating} out of 5">${'★'.repeat(r.rating)}<span style="color:#e9ddda">${'★'.repeat(5-r.rating)}</span></div><div style="text-align:right;margin-top:7px">${statusBadge(r.status)}</div></div></div><div class="review-meta"><span>${escapeHTML(r.vehicle)}</span><span>${r.rating}/5 rating</span></div><p class="review-text"><strong>What went well</strong><br>${escapeHTML(r.good||'No comment provided.')}</p>${r.improve?`<p class="review-text"><strong>What could improve</strong><br>${escapeHTML(r.improve)}</p>`:''}<div class="review-actions">${r.status==='Pending'?`<button class="btn-approve" data-review-action="Approved" data-id="${r.id}">✓ Approve & publish</button><button class="btn-reject" data-review-action="Rejected" data-id="${r.id}">× Reject</button>`:`<button class="btn-neutral" data-review-action="Pending" data-id="${r.id}">Return to pending</button>`}<span class="spacer"></span><button class="btn-neutral" data-review-detail="${r.id}">View details</button></div></article>`).join(''):'<div class="empty-state"><strong>No reviews in this view</strong>Try another status filter or search term.</div>';$$('[data-review-action]').forEach(b=>b.onclick=()=>{const r=state.reviews.find(x=>x.id===b.dataset.id);if(!r)return;if(b.dataset.reviewAction==='Approved'&&!confirm('Approve this review for public publication?'))return;r.status=b.dataset.reviewAction;save();renderReviews();renderOverview();toast(`Review ${r.id} moved to ${r.status.toLowerCase()}.`)});$$('[data-review-detail]').forEach(b=>b.onclick=()=>{const r=state.reviews.find(x=>x.id===b.dataset.reviewDetail);alert(`Review ${r.id}\\nCustomer: ${r.name}\\nEmail: ${r.email}\\nVehicle: ${r.vehicle}\\nRating: ${r.rating}/5\\nDate: ${r.date}\\nStatus: ${r.status}\\n\\nWhat went well: ${r.good||'—'}\\n\\nWhat could improve: ${r.improve||'—'}\\n\\nDemo note: portrait uploads and real public publishing are not connected in this preview.`)});$('#avgRating').innerHTML=(state.reviews.reduce((s,r)=>s+r.rating,0)/Math.max(1,state.reviews.length)).toFixed(1)+' <small>/ 5</small>';$('#approvedMonth').textContent=state.reviews.filter(r=>r.status==='Approved').length+10}
$('#reviewFilters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;reviewFilter=b.dataset.filter;$$('#reviewFilters button').forEach(x=>x.classList.toggle('selected',x===b));renderReviews()});$('#reviewSearch').addEventListener('input',renderReviews);
function renderInvoices(){
 refreshInvoiceStatuses();
 const total=state.invoices.reduce((s,i)=>s+Number(i.total||0),0);
 const paid=state.invoices.reduce((s,i)=>s+Number(i.paid||0),0);
 const balance=state.invoices.reduce((s,i)=>s+invoiceBalance(i),0);
 if($('#invoiceTotalMetric'))$('#invoiceTotalMetric').textContent=money(total);
 if($('#invoicePaidMetric'))$('#invoicePaidMetric').textContent=money(paid);
 if($('#invoiceBalanceMetric'))$('#invoiceBalanceMetric').textContent=money(balance);
 let rows=state.invoices.filter(i=>invoiceFilter==='All'||effectiveInvoiceStatus(i)===invoiceFilter);
 $('#invoiceRows').innerHTML=rows.map(i=>`<tr><td><strong>${escapeHTML(i.id)}</strong><small>${escapeHTML(i.vehicle||'')}</small></td><td>${escapeHTML(i.customer)}</td><td>${fmtDate(i.issued)}</td><td>${fmtDate(i.due)}</td><td><strong>${money(i.total)}</strong></td><td>${money(invoiceBalance(i))}</td><td>${statusBadge(effectiveInvoiceStatus(i))}</td><td><div class="row-actions"><button class="table-action" type="button" data-invoice-download="${escapeHTML(i.id)}">Download PDF</button><button class="table-action" type="button" data-invoice-share="${escapeHTML(i.id)}">Share PDF</button><button class="table-action" type="button" data-invoice-print="${escapeHTML(i.id)}">Print</button></div></td></tr>`).join('')||'<tr><td colspan="8">No invoices match this filter.</td></tr>';
}
$('#invoiceRows').addEventListener('click',async e=>{
 const b=e.target.closest('[data-invoice-download],[data-invoice-share],[data-invoice-print]');if(!b)return;
 const inv=state.invoices.find(i=>i.id===(b.dataset.invoiceDownload||b.dataset.invoiceShare||b.dataset.invoicePrint));if(!inv)return;
 if(b.hasAttribute('data-invoice-print')){printInvoice(inv);return}
 try{const file=await buildInvoicePDF(inv);if(b.hasAttribute('data-invoice-share'))await sharePDF(file,`${inv.id}.pdf`);else downloadPDF(file,`${inv.id}.pdf`)}catch(error){console.error(error);toast('PDF generation failed. Use Print and choose Save as PDF, or try again when online.')}
});
async function loadJsPDF(){
 if(window.jspdf?.jsPDF)return window.jspdf.jsPDF;
 if(!window._drivehubJsPDFPromise)window._drivehubJsPDFPromise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js';script.onload=()=>window.jspdf?.jsPDF?resolve(window.jspdf.jsPDF):reject(new Error('PDF library did not load'));script.onerror=()=>reject(new Error('Could not load PDF library'));document.head.appendChild(script)});
 return window._drivehubJsPDFPromise;
}
function invoiceContext(i){
 const customer=state.customers.find(c=>String(c.name||'').trim().toLowerCase()===String(i.customer||'').trim().toLowerCase())||{};
 const rental=state.rentals.find(r=>String(r.customer||'').trim().toLowerCase()===String(i.customer||'').trim().toLowerCase()&&(!i.vehicle||r.vehicle===i.vehicle))||{};
 const vehicle=state.fleet.find(v=>v.name===i.vehicle)||{};
 const days=i.days||((rental.pickup&&rental.returned)?daysInclusive(rental.pickup,rental.returned):0);
 const rate=Number(i.rate??rental.rate??(days?Number(i.total||0)/days:Number(i.total||0)));
 return {customer,rental,vehicle,days,rate,pickup:i.pickup||rental.pickup||'',returned:i.returned||rental.returned||'',pickupLocation:i.pickupLocation||'DriveHub GH Office, Westland.',description:i.description||i.notes||'Vehicle rental'};
}
async function addDriveHubLogo(doc){
 try{const response=await fetch('/assets/drivehub-logo.png',{cache:'force-cache'});if(!response.ok)return;const blob=await response.blob();const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob)});doc.addImage(data,'PNG',14,8,47,20)}catch(e){console.warn('DriveHub logo unavailable for PDF',e)}
}
function pdfText(doc,text,x,y,maxWidth=180){doc.text(String(text??'—'),x,y,{maxWidth});}
function pdfRule(doc,y,color=[220,214,211]){doc.setDrawColor(...color);doc.setLineWidth(.25);doc.line(14,y,196,y)}
function pdfSection(doc,title,y){doc.setFillColor(35,29,30);doc.rect(14,y-5,182,8,'F');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text(title.toUpperCase(),17,y);doc.setTextColor(35,29,30);return y+9}
function pdfPair(doc,label,value,x,y,w=85){doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.setTextColor(105,97,98);doc.text(label,x,y);doc.setTextColor(35,29,30);doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.text(String(value??'—'),x+34,y,{maxWidth:w-36});}
async function buildInvoicePDF(i){
 const JsPDF=await loadJsPDF();const doc=new JsPDF({orientation:'portrait',unit:'mm',format:'a4'});const c=invoiceContext(i);const status=effectiveInvoiceStatus(i);const balance=invoiceBalance(i);const issue=i.issued||localISODate();
 await addDriveHubLogo(doc);
 doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(190,25,49);doc.text('CAR RENTAL',195,12,{align:'right'});
 doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(65,59,60);doc.text('22 Baiden Avenue | 2nd Manu Street',195,17,{align:'right'});doc.text('Westland, Accra - Ghana',195,21,{align:'right'});doc.text('Phone: 0204116245',195,27,{align:'right'});doc.text('Email: drivehubgh1@gmail.com',195,31,{align:'right'});
 doc.setDrawColor(200,16,46);doc.setLineWidth(1.5);doc.line(14,36,196,36);doc.setTextColor(35,29,30);doc.setFont('helvetica','bold');doc.setFontSize(16);doc.text('RENTAL INVOICE',14,45);
 let y=51;doc.setFillColor(250,245,226);doc.rect(14,y,182,14,'F');doc.setFontSize(8);doc.setTextColor(90,84,84);doc.text('Invoice No.',17,y+5);doc.text('Issue Date',112,y+5);doc.text('Booking / Rental Ref.',17,y+11);doc.text('Payment Status',112,y+11);doc.setFont('helvetica','bold');doc.setTextColor(35,29,30);doc.text(String(i.id||'—'),48,y+5);doc.text(fmtDate(issue),143,y+5);doc.text(String(i.rentalRef||c.rental.id||'—'),48,y+11);doc.setTextColor(status==='Paid'?35:190,status==='Paid'?135:25,status==='Paid'?65:49);doc.text(status,143,y+11);y+=21;
 y=pdfSection(doc,'Customer details',y);pdfPair(doc,'Customer name',i.customer,17,y,88);pdfPair(doc,'Phone number',c.customer.phone||'—',108,y,85);y+=7;pdfPair(doc,'Email / Address',c.customer.email||c.customer.address||'—',17,y,88);pdfPair(doc,'Vehicle / Model',i.vehicle,108,y,85);y+=7;pdfPair(doc,'Registration No.',c.vehicle.plate||c.vehicle.registration_number||'—',17,y,88);pdfPair(doc,'Pickup location',c.pickupLocation,108,y,85);y+=10;
 y=pdfSection(doc,'Vehicle & rental details',y);pdfPair(doc,'Pickup date / time',c.pickup?`${fmtDate(c.pickup)} 00:00`:'—',17,y,88);pdfPair(doc,'Rental duration (days)',c.days||'—',108,y,85);y+=7;pdfPair(doc,'Return date / time',c.returned?`${fmtDate(c.returned)} 00:00`:'—',17,y,88);pdfPair(doc,'Daily rate (GH₵)',`GH₵ ${c.rate.toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2})}`,108,y,85);y+=12;
 y=pdfSection(doc,'Charges & payment breakdown',y);doc.setFillColor(235,235,237);doc.rect(14,y-4,182,9,'F');doc.setFont('helvetica','bold');doc.setFontSize(7);doc.setTextColor(55,50,51);doc.text('#',17,y+1);doc.text('Description',30,y+1);doc.text('Qty / Days',100,y+1,{align:'center'});doc.text('Unit Price (GH₵)',130,y+1,{align:'center'});doc.text('Discount (GH₵)',158,y+1,{align:'center'});doc.text('Amount (GH₵)',193,y+1,{align:'right'});y+=8;
 const lineAmount=Number(i.subtotal??i.total??(c.days*c.rate));const qty=c.days||1;const unit=Number(i.unitPrice??c.rate);const discount=Number(i.discount||0);doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.text('1',18,y);const desc=doc.splitTextToSize(c.description,62);doc.text(desc,30,y);doc.text(String(qty),100,y,{align:'center'});doc.text(unit.toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2}),130,y,{align:'center'});doc.text(discount.toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2}),158,y,{align:'center'});doc.text(lineAmount.toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2}),193,y,{align:'right'});y+=Math.max(9,desc.length*4)+3;pdfRule(doc,y);y+=7;
 const additional=Number(i.additionalFees||i.tax||0);const subtotal=Number(i.subtotal??i.total??lineAmount);const totalDue=Number(i.total||0);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text('Payment method: Cash / Mobile Money / Bank Transfer / Card',17,y);doc.text('Subtotal',130,y);doc.setFont('helvetica','bold');doc.text(`GH₵ ${subtotal.toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2})}`,193,y,{align:'right'});y+=6;doc.setFont('helvetica','normal');doc.text('Additional fees / taxes',130,y);doc.text(`GH₵ ${additional.toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2})}`,193,y,{align:'right'});y+=7;doc.setFillColor(200,16,46);doc.rect(112,y-5,84,9,'F');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.text('TOTAL DUE',115,y);doc.text(`GH₵ ${totalDue.toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2})}`,193,y,{align:'right'});y+=8;doc.setTextColor(35,29,30);doc.setFont('helvetica','normal');doc.text('Amount paid',17,y);doc.setFont('helvetica','bold');doc.text(`GH₵ ${Number(i.paid||0).toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2})}`,104,y,{align:'right'});doc.text('BALANCE',115,y);doc.text(`GH₵ ${balance.toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2})}`,193,y,{align:'right'});y+=13;
 if(status==='Paid'){doc.setTextColor(36,135,50);doc.setFont('helvetica','bold');doc.setFontSize(17);doc.text('PAID',158,y,{angle: -12,align:'center'});y+=3}
 y=pdfSection(doc,'Terms & notes',y);doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.setTextColor(75,70,70);const terms=doc.splitTextToSize(i.notes||'Please return the vehicle at the agreed time and in the condition received. Any damage, fuel differences, traffic fines or late-return charges may be assessed according to the rental agreement.',178);doc.text(terms,16,y);y+=Math.max(14,terms.length*4)+5;pdfRule(doc,y);y+=9;doc.setFontSize(8);doc.setTextColor(55,50,51);doc.text('Customer Signature: __________________________',17,y);doc.text('Authorised By: ___________________________',112,y);y+=13;doc.setTextColor(190,25,49);doc.setFont('helvetica','bold');doc.text('Thank you for choosing DriveHub GH.',105,y,{align:'center'});y+=6;doc.setTextColor(70,65,65);doc.setFont('helvetica','normal');doc.setFontSize(7);doc.text('DriveHub GH | 0204116245 | drivehubgh1@gmail.com',105,y,{align:'center'});
 return doc.output('blob');
}
function downloadPDF(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('PDF downloaded.');}
async function sharePDF(blob,name){const file=new File([blob],name,{type:'application/pdf'});if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({files:[file],title:name,text:'DriveHub GH document'});toast('Share sheet opened.')}else{downloadPDF(blob,name);toast('PDF downloaded. Attach it to WhatsApp or email to share with the client.')}}
function printInvoice(i){
 const c=invoiceContext(i),status=effectiveInvoiceStatus(i);const win=window.open('','_blank','width=820,height=900');if(!win){toast('Allow pop-ups to print the invoice.');return}
 const logo='/assets/drivehub-logo.png';const htmlDoc=`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHTML(i.id)} — DriveHub GH</title><style>@page{size:A4;margin:12mm}body{font:12px Arial,sans-serif;color:#211b1c;margin:0}header{display:flex;justify-content:space-between;align-items:center;border-bottom:4px solid #c8102e;padding-bottom:12px}.logo{width:160px;max-height:60px;object-fit:contain}.company{text-align:right;font-size:10px;line-height:1.5}h1{font-size:20px;margin:12px 0;color:#211b1c}.meta{display:grid;grid-template-columns:1fr 1fr;background:#fff7e3;padding:10px;gap:7px;font-size:11px}.section{background:#211b1c;color:#fff;padding:7px;font-weight:bold;font-size:10px;margin-top:15px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px 0}.pair{display:grid;grid-template-columns:125px 1fr;border-bottom:1px solid #e7dfdd;padding:7px 5px;font-size:10px}.label{color:#70696a}.value{font-weight:bold;background:#fff8e5;padding:3px}.charges{width:100%;border-collapse:collapse;margin-top:0;font-size:10px}.charges th{background:#e8e8ea}.charges td,.charges th{padding:8px 5px;border-bottom:1px solid #ddd;text-align:left}.charges td:last-child,.charges th:last-child{text-align:right}.totals{margin:12px 0 0 auto;width:52%;font-size:11px}.totals div{display:flex;justify-content:space-between;padding:5px}.grand{background:#c8102e;color:white;font-weight:bold}.balance{font-weight:bold;border-bottom:2px solid #c8102e}.terms{background:#f2f2f4;padding:10px;font-size:10px;line-height:1.5}.signatures{display:flex;justify-content:space-between;margin-top:35px;font-size:10px}.foot{text-align:center;color:#c8102e;font-weight:bold;margin-top:20px}.subfoot{text-align:center;font-size:9px;margin-top:8px}.stamp{color:#26852f;border:3px solid #26852f;padding:5px 12px;display:inline-block;transform:rotate(-10deg);font-weight:bold;font-size:17px;margin:10px 0}small{font-size:9px}</style></head><body><header><img class="logo" src="${logo}"><div class="company"><strong>CAR RENTAL</strong><br>22 Baiden Avenue | 2nd Manu Street<br>Westland, Accra - Ghana<br>Phone: 0204116245<br>Email: drivehubgh1@gmail.com</div></header><h1>RENTAL INVOICE / RECEIPT</h1><div class="meta"><div>Invoice No. <strong>${escapeHTML(i.id)}</strong></div><div>Issue Date <strong>${escapeHTML(fmtDate(i.issued||localISODate()))}</strong></div><div>Booking / Rental Ref. <strong>${escapeHTML(i.rentalRef||c.rental.id||'—')}</strong></div><div>Payment Status <strong>${escapeHTML(status)}</strong></div></div><div class="section">CUSTOMER DETAILS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; VEHICLE & RENTAL DETAILS</div><div class="grid"><div><div class="pair"><span class="label">Customer Name</span><span class="value">${escapeHTML(i.customer)}</span></div><div class="pair"><span class="label">Phone Number</span><span class="value">${escapeHTML(c.customer.phone||'—')}</span></div><div class="pair"><span class="label">Email / Address</span><span class="value">${escapeHTML(c.customer.email||c.customer.address||'—')}</span></div></div><div><div class="pair"><span class="label">Vehicle / Model</span><span class="value">${escapeHTML(i.vehicle)}</span></div><div class="pair"><span class="label">Registration No.</span><span class="value">${escapeHTML(c.vehicle.plate||'—')}</span></div><div class="pair"><span class="label">Pickup Location</span><span class="value">${escapeHTML(c.pickupLocation)}</span></div></div></div><div class="grid"><div class="pair"><span class="label">Pickup Date / Time</span><span class="value">${escapeHTML(c.pickup?fmtDate(c.pickup)+' 00:00':'—')}</span></div><div class="pair"><span class="label">Rental Duration (days)</span><span class="value">${c.days||'—'}</span></div><div class="pair"><span class="label">Return Date / Time</span><span class="value">${escapeHTML(c.returned?fmtDate(c.returned)+' 00:00':'—')}</span></div><div class="pair"><span class="label">Daily Rate (GH₵)</span><span class="value">${money(c.rate)}</span></div></div><div class="section">CHARGES & PAYMENT BREAKDOWN</div><table class="charges"><thead><tr><th>#</th><th>Description</th><th>Qty / Days</th><th>Unit Price (GH₵)</th><th>Discount (GH₵)</th><th>Amount (GH₵)</th></tr></thead><tbody><tr><td>1</td><td>${escapeHTML(c.description)}</td><td>${c.days||1}</td><td>${money(c.rate)}</td><td>${money(i.discount||0)}</td><td>${money(i.subtotal??i.total)}</td></tr></tbody></table><div class="totals"><div><span>Subtotal</span><strong>${money(i.subtotal??i.total)}</strong></div><div><span>Additional fees / taxes</span><strong>${money(i.additionalFees||i.tax||0)}</strong></div><div class="grand"><span>TOTAL DUE</span><strong>${money(i.total)}</strong></div><div><span>Amount Paid (GH₵)</span><strong>${money(i.paid||0)}</strong></div><div class="balance"><span>BALANCE</span><strong>${money(invoiceBalance(i))}</strong></div></div>${status==='Paid'?'<div style="text-align:center"><span class="stamp">PAID</span></div>':''}<div class="section">TERMS & NOTES</div><div class="terms">${escapeHTML(i.notes||'Please return the vehicle at the agreed time and in the condition received. Any damage, fuel differences, traffic fines or late-return charges may be assessed according to the rental agreement.')}</div><div class="signatures"><span>Customer Signature: __________________________</span><span>Authorised By: ___________________________</span></div><div class="foot">Thank you for choosing DriveHub GH.</div><div class="subfoot">DriveHub GH | 0204116245 | drivehubgh1@gmail.com</div><script>window.onload=()=>window.print()<\/script></body></html>`;
 win.document.open();win.document.write(htmlDoc);win.document.close();
}

$('#invoiceFilters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;invoiceFilter=b.dataset.filter;$$('#invoiceFilters button').forEach(x=>x.classList.toggle('selected',x===b));renderInvoices()});
$('#rentalFilters').addEventListener('click',e=>{const b=e.target.closest('button[data-filter]');if(!b)return;rentalFilter=b.dataset.filter;$$('#rentalFilters button').forEach(x=>x.classList.toggle('selected',x===b));renderRentals()});
$('#rentalSearch').addEventListener('input',renderRentals);
function renderPayments(){
 const total=state.payments.reduce((s,p)=>s+Number(p.amount||0),0);
 if($('#paymentsReceivedMetric'))$('#paymentsReceivedMetric').textContent=money(total);
 if($('#paymentMethodsMetric'))$('#paymentMethodsMetric').textContent=new Set(state.payments.map(p=>p.method).filter(Boolean)).size;
 $('#paymentRows').innerHTML=state.payments.map(p=>`<tr><td><strong>${escapeHTML(p.id)}</strong></td><td>${escapeHTML(p.customer)}</td><td>${escapeHTML(p.invoice)}</td><td>${fmtDate(p.date)}</td><td>${escapeHTML(p.method)}</td><td><strong>${money(p.amount)}</strong></td><td><div class="row-actions"><button class="table-action" type="button" data-receipt-download="${escapeHTML(p.id)}">Download PDF</button><button class="table-action" type="button" data-receipt-share="${escapeHTML(p.id)}">Share PDF</button><button class="table-action" type="button" data-receipt-print="${escapeHTML(p.id)}">Print</button></div></td></tr>`).join('')||'<tr><td colspan="7">No payments recorded yet.</td></tr>';
 $('#paymentCount').textContent=state.payments.length;
}
$('#paymentRows').addEventListener('click',async e=>{const b=e.target.closest('[data-receipt-print],[data-receipt-download],[data-receipt-share]');if(!b)return;const p=state.payments.find(x=>x.id===(b.dataset.receiptPrint||b.dataset.receiptDownload||b.dataset.receiptShare));if(!p)return;if(b.hasAttribute('data-receipt-print')){printReceipt(p);return}try{const file=await buildReceiptPDF(p);if(b.hasAttribute('data-receipt-share'))await sharePDF(file,`${p.id}.pdf`);else downloadPDF(file,`${p.id}.pdf`)}catch(error){console.error(error);toast('PDF generation failed. Use Print and choose Save as PDF, or try again when online.')}});
async function buildReceiptPDF(p){
 const JsPDF=await loadJsPDF();const doc=new JsPDF({orientation:'portrait',unit:'mm',format:'a4'});const inv=state.invoices.find(i=>i.id===p.invoice);const c=invoiceContext(inv||{customer:p.customer,vehicle:'',total:p.amount,paid:p.amount,issued:p.date});
 await addDriveHubLogo(doc);doc.setFont('helvetica','bold');doc.setTextColor(190,25,49);doc.setFontSize(9);doc.text('CAR RENTAL',195,12,{align:'right'});doc.setTextColor(50,45,45);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text('22 Baiden Avenue | 2nd Manu Street',195,17,{align:'right'});doc.text('Westland, Accra - Ghana',195,21,{align:'right'});doc.text('Phone: 0204116245',195,27,{align:'right'});doc.text('Email: drivehubgh1@gmail.com',195,31,{align:'right'});doc.setDrawColor(200,16,46);doc.setLineWidth(1.5);doc.line(14,36,196,36);doc.setFont('helvetica','bold');doc.setFontSize(17);doc.setTextColor(35,29,30);doc.text('PAYMENT RECEIPT',14,47);let y=55;doc.setFillColor(250,245,226);doc.rect(14,y,182,16,'F');doc.setFontSize(9);doc.text('Receipt No.',18,y+6);doc.text(String(p.id),48,y+6);doc.text('Payment Date',115,y+6);doc.text(fmtDate(p.date),150,y+6);doc.text('Invoice No.',18,y+12);doc.text(String(p.invoice||'—'),48,y+12);doc.text('Payment Method',115,y+12);doc.text(String(p.method||'—'),150,y+12);y+=27;y=pdfSection(doc,'Customer details',y);pdfPair(doc,'Customer name',p.customer,17,y,175);y+=8;pdfPair(doc,'Phone number',c.customer.phone||'—',17,y,175);y+=8;pdfPair(doc,'Email address',c.customer.email||'—',17,y,175);y+=14;doc.setFillColor(200,16,46);doc.rect(14,y-5,182,24,'F');doc.setTextColor(255,255,255);doc.setFontSize(10);doc.text('AMOUNT RECEIVED',20,y+3);doc.setFontSize(19);doc.text(`GH₵ ${Number(p.amount||0).toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2})}`,190,y+10,{align:'right'});y+=31;doc.setTextColor(35,29,30);doc.setFontSize(9);doc.setFont('helvetica','normal');doc.text('Payment reference',17,y);doc.setFont('helvetica','bold');doc.text(String(p.reference||'—'),70,y);y+=8;doc.setFont('helvetica','normal');doc.text('Invoice total',17,y);doc.text(money(inv?.total||p.amount),190,y,{align:'right'});y+=7;doc.text('Total paid to date',17,y);doc.text(money(inv?.paid||p.amount),190,y,{align:'right'});y+=7;doc.setFont('helvetica','bold');doc.text('Outstanding balance',17,y);doc.text(money(inv?invoiceBalance(inv):0),190,y,{align:'right'});y+=17;doc.setFont('helvetica','normal');doc.setFontSize(9);doc.text('Thank you for your payment.',105,y,{align:'center'});y+=7;doc.setFontSize(8);doc.text('DriveHub GH | 0204116245 | drivehubgh1@gmail.com',105,y,{align:'center'});return doc.output('blob');
}
function printReceipt(p){
 const inv=state.invoices.find(i=>i.id===p.invoice);const win=window.open('','_blank','width=760,height=760');if(!win){toast('Allow pop-ups to print the receipt.');return}
 const html=`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHTML(p.id)} — DriveHub GH Receipt</title><style>@page{size:A4;margin:18mm}body{font:13px Arial,sans-serif;color:#211b1c;margin:0}.head{display:flex;justify-content:space-between;border-bottom:4px solid #c8102e;padding-bottom:15px}.logo{width:155px;object-fit:contain}.company{text-align:right;font-size:10px;line-height:1.6}h1{font-size:22px}.box{background:#fff7e3;padding:14px;display:grid;grid-template-columns:1fr 1fr;gap:12px}.amount{background:#c8102e;color:#fff;font-size:24px;font-weight:bold;padding:22px;margin:25px 0}.line{padding:12px 0;border-bottom:1px solid #ddd}.foot{text-align:center;color:#c8102e;margin-top:65px;font-weight:bold}</style></head><body><div class="head"><img class="logo" src="/assets/drivehub-logo.png"><div class="company"><b>CAR RENTAL</b><br>22 Baiden Avenue | 2nd Manu Street<br>Westland, Accra - Ghana<br>Phone: 0204116245<br>Email: drivehubgh1@gmail.com</div></div><h1>PAYMENT RECEIPT</h1><div class="box"><div>Receipt No. <b>${escapeHTML(p.id)}</b></div><div>Payment date <b>${escapeHTML(fmtDate(p.date))}</b></div><div>Customer <b>${escapeHTML(p.customer)}</b></div><div>Invoice No. <b>${escapeHTML(p.invoice)}</b></div><div>Payment method <b>${escapeHTML(p.method)}</b></div><div>Reference <b>${escapeHTML(p.reference||'—')}</b></div></div><div class="amount">AMOUNT RECEIVED &nbsp; ${money(p.amount)}</div><div class="line">Invoice total <b style="float:right">${money(inv?.total||p.amount)}</b></div><div class="line">Total paid to date <b style="float:right">${money(inv?.paid||p.amount)}</b></div><div class="line">Outstanding balance <b style="float:right">${money(inv?invoiceBalance(inv):0)}</b></div><div class="foot">Thank you for choosing DriveHub GH.</div><p style="text-align:center;font-size:10px">DriveHub GH | 0204116245 | drivehubgh1@gmail.com</p><script>window.onload=()=>window.print()<\/script></body></html>`;win.document.open();win.document.write(html);win.document.close();
}

function renderRentals(){
 const q=($('#rentalSearch')?.value||'').toLowerCase();
 const allRentals=[...d1Rentals,...state.rentals.filter(r=>!d1Rentals.some(d=>d.id===r.id))];
 const rows=allRentals.filter(r=>(rentalFilter==='All'||r.status===rentalFilter)&&[r.id,r.customer,r.vehicle].join(' ').toLowerCase().includes(q));
 const count=status=>allRentals.filter(r=>r.status===status).length;
 if($('#rentalUpcomingMetric'))$('#rentalUpcomingMetric').textContent=count('Upcoming');
 if($('#rentalActiveMetric'))$('#rentalActiveMetric').textContent=count('Active');
 if($('#rentalCompletedMetric'))$('#rentalCompletedMetric').textContent=count('Completed');
 if($('#rentalCancelledMetric'))$('#rentalCancelledMetric').textContent=count('Cancelled');
 $('#rentalRows').innerHTML=rows.map(r=>`<tr><td><strong>${escapeHTML(r.id)}</strong></td><td>${escapeHTML(r.customer)}</td><td>${escapeHTML(r.vehicle)}</td><td>${fmtDate(r.pickup)}</td><td>${fmtDate(r.returned)}</td><td><strong>${daysInclusive(r.pickup,r.returned)}</strong></td><td>${statusBadge(r.status)}</td><td><div class="row-actions"><button class="table-action" data-rental-edit="${escapeHTML(r.id)}" type="button">Edit</button>${r.status!=='Completed'&&r.status!=='Cancelled'?`<button class="table-action" data-rental-complete="${escapeHTML(r.id)}" type="button">Complete</button><button class="table-action rental-cancel-action" data-rental-cancel="${escapeHTML(r.id)}" type="button">Cancel</button>`:''}</div></td></tr>`).join('')||'<tr><td colspan="8">No rentals match this filter.</td></tr>';
}
$('#rentalRows').addEventListener('click',async e=>{
 const cancel=e.target.closest('[data-rental-cancel]');
 if(cancel){const id=cancel.dataset.rentalCancel;const r=d1Rentals.find(x=>x.id===id)||state.rentals.find(x=>x.id===id);if(r&&confirm(`Cancel rental ${r.id}? This will release the vehicle dates.`)){if(r.source==='d1'){try{cancel.disabled=true;await updateD1RentalStatus(r,'Cancelled');toast('Rental cancellation saved to the database.');}catch(error){toast(`Cancellation was not saved: ${error.message}`)}finally{cancel.disabled=false}}else{r.status='Cancelled';recordAudit('Rental cancelled','rentals',`${r.id} · ${r.vehicle} · ${r.pickup} to ${r.returned}`);save();renderOverview();renderRentals();renderFleet();toast('Rental cancelled in this browser preview.')}}return}
 const complete=e.target.closest('[data-rental-complete]');
 if(complete){const id=complete.dataset.rentalComplete;const r=d1Rentals.find(x=>x.id===id)||state.rentals.find(x=>x.id===id);if(r&&confirm(`Mark rental ${r.id} as completed?`)){if(r.source==='d1'){try{complete.disabled=true;await updateD1RentalStatus(r,'Completed');toast('Rental completion saved to the database.');}catch(error){toast(`Completion was not saved: ${error.message}`)}finally{complete.disabled=false}}else{r.status='Completed';recordAudit('Rental completed','rentals',`${r.id} · ${r.vehicle}`);save();renderOverview();renderRentals();renderFleet();toast('Rental marked completed in this browser preview.')}}return}
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
async function openAction(type){if(type==='rental'||type==='invoice'||type==='payment'){await Promise.all([loadD1Customers(),loadD1Vehicles({quiet:true})]);}const dialog=$('#actionDialog'),fields=$('#dialogFields');$('#actionForm').dataset.type=type;const field=(label,name,kind='text',opts='',full=false,required=true)=>`<div class="field ${full?'full':''}"><label for="f-${name}">${label}${required?' *':''}</label>${kind==='select'?`<select id="f-${name}" name="${name}" ${required?'required':''}>${opts}</select>`:kind==='textarea'?`<textarea id="f-${name}" name="${name}" ${required?'required':''}></textarea>`:`<input id="f-${name}" name="${name}" type="${kind}" ${required?'required':''}>`}</div>`;let title='',html='';
const vehicleOptions=state.fleet.map(v=>`<option>${escapeHTML(v.name)}</option>`).join('');const customerOptions=state.customers.map(c=>`<option>${escapeHTML(c.name)}</option>`).join('');const invoiceOptions=state.invoices.map(i=>`<option>${i.id}</option>`).join('');
if(type==='customer'){title='Add customer';html=field('Full name','name')+field('Email address','email','email')+field('Phone number','phone','tel')+field('Customer notes','notes','textarea','',true,false)}
if(type==='invoice'){title='Create invoice';html=field('Customer','customer','select',customerOptions)+field('Vehicle','vehicle','select',vehicleOptions)+field('Pickup date','pickup','date')+field('Return date','returned','date')+field('Daily rate (GH₵)','rate','number')+field('Description','description','text','',true,false)+field('Pickup location','pickupLocation','text','',true,false)+field('Discount (GH₵)','discount','number')+field('Additional fees / taxes (GH₵)','additionalFees','number')+field('Due date','due','date')+field('Terms & notes','notes','textarea','',true,false)}
if(type==='payment'){title='Record payment';html=field('Customer','customer','select',customerOptions)+field('Invoice','invoice','select',invoiceOptions)+field('Payment date','date','date')+field('Amount received (GH₵)','amount','number')+field('Payment method','method','select','<option>Mobile Money</option><option>Bank transfer</option><option>Cash</option>')+field('Payment reference','reference','text','',true,false)}
if(type==='rental'){title='Add rental';html=field('Customer','customer','select',customerOptions)+field('Vehicle','vehicle','select',vehicleOptions)+field('Pickup date','pickup','date')+field('Return date','returned','date')+field('Daily rate (GH₵)','rate','number')+field('Rental status','status','select','<option>Upcoming</option><option>Active</option><option>Completed</option>')}
if(type==='maintenance'){title='Schedule vehicle maintenance';const serviceTypes='<option value="Routine service">Routine service</option><option value="Oil and filter">Oil and filter</option><option value="Tyres and brakes">Tyres and brakes</option><option value="Inspection">Inspection</option><option value="Repair">Repair</option><option value="Other">Other</option>';const serviceStatuses='<option value="Scheduled">Scheduled</option><option value="In progress">In progress</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option>';html=field('Vehicle','vehicle','select',vehicleOptions)+field('Service type','serviceType','select',serviceTypes)+field('Start date','startDate','date')+field('End date','endDate','date')+field('Status','status','select',serviceStatuses)+field('Service notes','note','textarea','',true)}
if(type==='review'){title='Add review record';html=field('Customer name','name')+field('Email','email','email','',false,false)+field('Vehicle','vehicle','select',vehicleOptions)+field('Rating','rating','select','<option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option>')+field('What went well','good','textarea','',true)+field('What could improve','improve','textarea','',true,false)}
$('#dialogTitle').textContent=title;fields.innerHTML=html;$('#dialogSubmit').textContent=type==='payment'?'Record payment':type==='review'?'Add review':'Save record';dialog.showModal()}
$('#addCustomerBtn').onclick=()=>openAction('customer');$('#closeProfileDialog').onclick=()=>$('#profileDialog').close();$('#quickAddBtn').onclick=()=>openAction('rental');$('#newInvoiceBtn').onclick=()=>openAction('invoice');$('#recordPaymentBtn').onclick=()=>openAction('payment');$('#newRentalBtn').onclick=()=>openAction('rental');$('#addMaintenanceBtn').onclick=()=>openAction('maintenance');$('#notificationsBtn').onclick=()=>{nav('overview');toast('Notifications: review approvals and overdue invoices are highlighted under Needs attention.')};
// Allow users to dismiss an action dialog even when required fields are still empty.
$('#actionForm').querySelectorAll('[value="cancel"]').forEach(button=>button.addEventListener('click',e=>{e.preventDefault();$('#actionDialog').close();}));
$('#actionForm').addEventListener('submit',async e=>{if(e.submitter?.value==='cancel')return;e.preventDefault();const type=e.currentTarget.dataset.type;const data=Object.fromEntries(new FormData(e.currentTarget).entries());if(type==='customer'){
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
}else if(type==='invoice'){const days=daysInclusive(data.pickup,data.returned);if(!data.pickup||!data.returned||new Date(data.returned)<new Date(data.pickup)){toast('Return date must be on or after pickup date.');return}const rate=Number(data.rate),discount=Number(data.discount||0),additionalFees=Number(data.additionalFees||0);if(!Number.isFinite(rate)||rate<=0||discount<0||additionalFees<0){toast('Enter a valid positive daily rate and non-negative discount/fees.');return}const subtotal=Math.max(0,days*rate-discount),total=subtotal+additionalFees;const sequence=Math.max(102,...state.invoices.map(x=>Number(String(x.id||'').match(/^DHG-(\d+)$/)?.[1]||0)))+1;const invoice={id:`DHG-${String(sequence).padStart(5,'0')}`,customer:data.customer,vehicle:data.vehicle,issued:localISODate(),due:data.due,total,subtotal,paid:0,status:'Unpaid',pickup:data.pickup,returned:data.returned,days,rate,discount,additionalFees,description:data.description||'Vehicle rental',pickupLocation:data.pickupLocation||'DriveHub GH Office, Westland.',notes:data.notes||'',rentalRef:data.rentalRef||''};state.invoices.unshift(invoice);recordAudit('Invoice created','invoices',`${invoice.id} · ${invoice.customer} · ${money(total)}`);save();renderInvoices();renderCustomers();renderOverview();toast(`Invoice ${invoice.id} created: ${money(total)} for ${days} billable days.`);nav('invoices')}else if(type==='payment'){const inv=state.invoices.find(i=>i.id===data.invoice);const amount=Number(data.amount);if(!inv){toast('Select a valid invoice before recording a payment.');return}if(!data.date){toast('Enter the payment date.');return}if(!amount||amount<=0){toast('Enter a payment amount greater than zero.');return}if(inv&&amount>invoiceBalance(inv)){toast('Payment exceeds the remaining invoice balance.');return}if(inv){inv.paid=Number(inv.paid||0)+amount;inv.status=effectiveInvoiceStatus(inv)}state.payments.unshift({id:`RCT-2026-${String(state.payments.length+32).padStart(3,'0')}`,customer:data.customer,invoice:data.invoice,date:data.date,method:data.method,amount});save();renderInvoices();renderPayments();renderCustomers();renderOverview();toast('Payment recorded in this browser preview.')}else if(type==='rental'){if(!data.pickup||!data.returned||new Date(data.returned)<new Date(data.pickup)){toast('Enter valid rental dates. Return date must be on or after pickup date.');return}const conflict=[...d1Rentals,...state.rentals].find(r=>r.vehicle===data.vehicle&&!['Completed','Cancelled'].includes(r.status)&&data.pickup<=r.returned&&data.returned>=r.pickup);if(conflict){toast(`Vehicle conflict: ${data.vehicle} overlaps rental ${conflict.id} (${conflict.pickup} to ${conflict.returned}).`);return}const maintenanceConflict=state.maintenance.find(m=>m.vehicle===data.vehicle&&!['Completed','Cancelled'].includes(m.status||'Scheduled')&&maintenanceOverlaps(m,data.pickup,data.returned));if(maintenanceConflict){toast(`Vehicle unavailable: ${maintenanceConflict.serviceType||'maintenance'} is scheduled ${fmtDate(maintenanceStart(maintenanceConflict))}${maintenanceEnd(maintenanceConflict)!==maintenanceStart(maintenanceConflict)?' to '+fmtDate(maintenanceEnd(maintenanceConflict)):''} during this rental.`);return}if(!Number(data.rate)||Number(data.rate)<0){toast('Enter a valid daily rate.');return}const d1Customer=state.customers.find(c=>c.name===data.customer&&c.source==='d1');const d1Vehicle=state.fleet.find(v=>v.name===data.vehicle&&v.source==='d1');if(d1Customer&&d1Vehicle){const submit=$('#dialogSubmit');submit.disabled=true;try{const response=await fetch('/command/api/rentals',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({customer_id:d1Customer.id,vehicle_id:d1Vehicle.id,pickup_date:data.pickup,return_date:data.returned,daily_rate_minor:Math.round(Number(data.rate)*100),status:(data.status||'Upcoming').toLowerCase()})});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||`Rental API returned ${response.status}`);await loadD1Rentals({quiet:true});$('#actionDialog').close();nav('rentals');toast(`Rental saved to the database: ${daysInclusive(data.pickup,data.returned)} billable days.`);}catch(error){toast(`Rental was not saved to D1: ${error.message}. No local-only rental was created.`)}finally{submit.disabled=false}return;}state.rentals.unshift({id:`DH-${208+state.rentals.length+1}`,customer:data.customer,vehicle:data.vehicle,pickup:data.pickup,returned:data.returned,rate:Number(data.rate),status:data.status||'Upcoming'});recordAudit('Rental created','rentals',`${data.customer} · ${data.vehicle} · ${data.pickup} to ${data.returned}`);toast(`Rental added to this browser preview. ${daysInclusive(data.pickup,data.returned)} billable days.`);nav('rentals')}else if(type==='maintenance'){
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
}else if(type==='review'){state.reviews.unshift({id:`RV-${105+state.reviews.length}`,name:data.name,email:data.email,vehicle:data.vehicle,rating:Number(data.rating),date:new Date().toISOString().slice(0,10),status:'Pending',good:data.good,improve:data.improve});toast('Review record added to pending moderation.');nav('reviews')}save();$('#actionDialog').close();renderOverview();renderReviews();renderInvoices();renderPayments();renderRentals();renderFleet();renderCustomers()});

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
const requestedView=(location.hash||'').slice(1);const validViews=['overview','reviews','invoices','payments','rentals','fleet','customers','reports','audit','settings'];nav(validViews.includes(requestedView)?requestedView:'overview');
loadD1Customers();
loadD1Vehicles({quiet:true});
loadD1Rentals({quiet:true});
window.addEventListener('hashchange',()=>{const view=(location.hash||'').slice(1);if(validViews.includes(view)&&view!==currentView)nav(view)});
