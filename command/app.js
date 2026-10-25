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
let reviewFilter='Pending', invoiceFilter='All', rentalFilter='All', currentView='overview';
function save(){try{localStorage.setItem('dh-command-demo',JSON.stringify(state));return true}catch(e){toast('Could not save in this browser. Storage may be full or disabled.');return false}}
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

function nav(view){currentView=view;$$('.nav-item[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));$$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${view}`));const titles={overview:'Overview',reviews:'Reviews & reputation',invoices:'Invoices',payments:'Payments & receipts',rentals:'Rental operations',fleet:'Fleet management',customers:'Customers',reports:'Reports & insights',settings:'Settings'};$('#crumbCurrent').textContent=titles[view]||view;$('#pageTitle').innerHTML=view==='overview'?'Good evening. <em>Let\'s move.</em>':titles[view];$('#eyebrow').textContent=view==='overview'?'YOUR BUSINESS, AT A GLANCE':'DRIVEHUB GH · '+titles[view].toUpperCase();$('#pageSubtitle').textContent=({overview:"A clear view of today's activity across DriveHub GH.",reviews:'Listen, respond and decide what gets published.',invoices:'Keep every rental charge and balance accounted for.',payments:'Track recorded payments and issue receipts.',rentals:'Know what is booked, active and due back.',fleet:'Make every vehicle work harder and stay road-ready.',customers:'Understand your customers and their rental history.',reports:'Turn day-to-day activity into clear business decisions.',settings:'Manage company preferences and production readiness.'})[view];$('#sidebar').classList.remove('open');if(view==='reviews')renderReviews();if(view==='invoices')renderInvoices();if(view==='payments')renderPayments();if(view==='rentals')renderRentals();if(view==='fleet')renderFleet();if(view==='customers')renderCustomers()}
$$('.nav-item[data-view]').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.view)));
$$('[data-goto]').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.goto)));
$('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#dismissNotice').addEventListener('click',()=>$('.demo-notice').remove());
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
function renderInvoices(){refreshInvoiceStatuses();let rows=state.invoices.filter(i=>invoiceFilter==='All'||effectiveInvoiceStatus(i)===invoiceFilter);$('#invoiceRows').innerHTML=rows.map(i=>`<tr><td><strong>${escapeHTML(i.id)}</strong><small>${escapeHTML(i.vehicle)}</small></td><td>${escapeHTML(i.customer)}</td><td>${fmtDate(i.issued)}</td><td>${fmtDate(i.due)}</td><td><strong>${money(i.total)}</strong></td><td>${money(Math.max(0,i.total-i.paid))}</td><td>${statusBadge(effectiveInvoiceStatus(i))}</td></tr>`).join('')||'<tr><td colspan="7">No invoices match this filter.</td></tr>'}
$('#invoiceFilters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;invoiceFilter=b.dataset.filter;$$('#invoiceFilters button').forEach(x=>x.classList.toggle('selected',x===b));renderInvoices()});
function renderPayments(){$('#paymentRows').innerHTML=state.payments.map(p=>`<tr><td><strong>${escapeHTML(p.id)}</strong></td><td>${escapeHTML(p.customer)}</td><td>${escapeHTML(p.invoice)}</td><td>${fmtDate(p.date)}</td><td>${escapeHTML(p.method)}</td><td><strong>${money(p.amount)}</strong></td></tr>`).join('');$('#paymentCount').textContent=state.payments.length}
function renderRentals(){const q=($('#rentalSearch')?.value||'').toLowerCase();const rows=state.rentals.filter(r=>(rentalFilter==='All'||r.status===rentalFilter)&&[r.id,r.customer,r.vehicle].join(' ').toLowerCase().includes(q));$('#rentalRows').innerHTML=rows.map(r=>`<tr><td><strong>${escapeHTML(r.id)}</strong></td><td>${escapeHTML(r.customer)}</td><td>${escapeHTML(r.vehicle)}</td><td>${fmtDate(r.pickup)}</td><td>${fmtDate(r.returned)}</td><td><strong>${daysInclusive(r.pickup,r.returned)}</strong></td><td>${statusBadge(r.status)}</td><td><div class="row-actions"><button class="table-action" data-rental-edit="${escapeHTML(r.id)}" type="button">Edit</button>${r.status!=='Completed'&&r.status!=='Cancelled'?`<button class="table-action" data-rental-complete="${escapeHTML(r.id)}" type="button">Complete</button>`:''}</div></td></tr>`).join('')||'<tr><td colspan="8">No rentals match this filter.</td></tr>'}
$('#rentalRows').addEventListener('click',e=>{const complete=e.target.closest('[data-rental-complete]');if(complete){const r=state.rentals.find(x=>x.id===complete.dataset.rentalComplete);if(r&&confirm(`Mark rental ${r.id} as completed?`)){r.status='Completed';save();renderOverview();renderRentals();renderFleet();toast('Rental marked completed in this browser preview.')}return}const edit=e.target.closest('[data-rental-edit]');if(edit){const r=state.rentals.find(x=>x.id===edit.dataset.rentalEdit);if(!r)return;const customer=prompt('Customer name:',r.customer);if(customer===null)return;const vehicle=prompt('Vehicle:',r.vehicle);if(vehicle===null)return;const pickup=prompt('Pickup date (YYYY-MM-DD):',r.pickup);if(pickup===null)return;const returned=prompt('Return date (YYYY-MM-DD):',r.returned);if(returned===null)return;if(!pickup||!returned||returned<pickup){toast('Invalid rental dates.');return}const conflict=state.rentals.find(x=>x.id!==r.id&&x.vehicle===vehicle&&!['Completed','Cancelled'].includes(x.status)&&pickup<=x.returned&&returned>=x.pickup);if(conflict){toast(`Vehicle conflict with ${conflict.id}.`);return}r.customer=customer;r.vehicle=vehicle;r.pickup=pickup;r.returned=returned;save();renderRentals();renderOverview();toast('Rental updated in this browser preview.')}});
$('#rentalFilters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;rentalFilter=b.dataset.filter;$$('#rentalFilters button').forEach(x=>x.classList.toggle('selected',x===b));renderRentals()});$('#rentalSearch').addEventListener('input',renderRentals);
function vehicleComputedStatus(v){
 if(v.status==='Maintenance') return 'Maintenance';
 const today=localISODate();
 const active=state.rentals.some(r=>r.vehicle===v.name&&r.status!=='Completed'&&r.status!=='Cancelled'&&r.pickup<=today&&r.returned>=today);
 const future=state.rentals.some(r=>r.vehicle===v.name&&r.status!=='Completed'&&r.status!=='Cancelled'&&r.pickup>today);
 if(active) return 'Rented';
 if(future) return 'Booked';
 return 'Available';
}
function renderFleet(){
 const available=state.fleet.filter(v=>vehicleComputedStatus(v)==='Available').length;
 const rented=state.fleet.filter(v=>vehicleComputedStatus(v)==='Rented').length;
 const booked=state.fleet.filter(v=>vehicleComputedStatus(v)==='Booked').length;
 const maintenance=state.fleet.filter(v=>vehicleComputedStatus(v)==='Maintenance').length;
 $('#fleetSummary').innerHTML=[['Total vehicles',state.fleet.length,'fleet-total'],['Available',available,'fleet-available'],['Rented',rented,'fleet-rented'],['Upcoming bookings',booked,'fleet-booked'],['Maintenance',maintenance,'fleet-maintenance']].map(x=>`<div class="fleet-summary-card"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');
 $('#fleetGrid').innerHTML=state.fleet.map((v,i)=>{const status=vehicleComputedStatus(v);return `<article class="vehicle-card"><div class="vehicle-top"><div><h3>${escapeHTML(v.name)}</h3><p>${escapeHTML(v.plate)}</p></div>${statusBadge(status)}</div><div class="vehicle-symbol">◇</div><div class="vehicle-stats"><div>Daily rate<strong>${money(v.rate)}</strong></div><div>Utilisation<strong>${Number(v.util)||0}%</strong></div></div><p class="vehicle-service">${escapeHTML(v.service||'Service status not recorded')}</p><div class="vehicle-actions"><button class="table-action" data-vehicle-edit="${i}" type="button">Edit vehicle</button><button class="table-action" data-vehicle-status="${i}" type="button">${status==='Maintenance'?'Mark available':'Set maintenance'}</button></div></article>`}).join('');
 $('#maintenanceList').innerHTML=state.maintenance.map(m=>`<div class="maintenance-item"><span class="metric-icon cream">⚙</span><div><strong>${escapeHTML(m.vehicle)}</strong><small>${escapeHTML(m.note)}</small></div><time>${fmtDate(m.date)}</time></div>`).join('')||'<p class="empty-state">No maintenance records yet.</p>';
}
$('#fleetGrid').addEventListener('click',e=>{
 const statusBtn=e.target.closest('[data-vehicle-status]');
 if(statusBtn){const v=state.fleet[Number(statusBtn.dataset.vehicleStatus)];if(!v)return;v.status=v.status==='Maintenance'?'Available':'Maintenance';if(v.status==='Maintenance')v.service='Under maintenance';else if(v.service==='Under maintenance')v.service='Service status to be confirmed';save();renderFleet();renderOverview();toast(`${v.name}: ${v.status==='Maintenance'?'marked for maintenance':'marked available'} in this browser preview.`);return}
 const editBtn=e.target.closest('[data-vehicle-edit]');
 if(editBtn){const v=state.fleet[Number(editBtn.dataset.vehicleEdit)];if(!v)return;
 const name=prompt('Vehicle make and model:',v.name);if(name===null)return;
 const plate=prompt('Registration number:',v.plate);if(plate===null)return;
 const rate=prompt('Daily rate in GH₵:',String(v.rate));if(rate===null)return;
 const service=prompt('Service note or next service date:',v.service||'');if(service===null)return;
 if(!name.trim()||!plate.trim()||!Number.isFinite(Number(rate))||Number(rate)<=0){toast('Enter a vehicle name, registration and positive daily rate.');return}
 if(state.fleet.some((x,i)=>i!==Number(editBtn.dataset.vehicleEdit)&&x.plate.toLowerCase()===plate.trim().toLowerCase())){toast('That registration number is already in the fleet.');return}
 const oldName=v.name;v.name=name.trim();v.plate=plate.trim();v.rate=Number(rate);v.service=service.trim();
 state.rentals.forEach(r=>{if(r.vehicle===oldName)r.vehicle=v.name});
 state.maintenance.forEach(m=>{if(m.vehicle===oldName)m.vehicle=v.name});
 save();renderFleet();renderRentals();renderOverview();toast('Vehicle details updated in this browser preview.');
 }
});

function renderCustomers(){const q=($('#customerSearch')?.value||'').toLowerCase();$('#customerRows').innerHTML=state.customers.filter(c=>[c.name,c.email,c.phone].join(' ').toLowerCase().includes(q)).map(c=>`<tr><td><div class="customer-cell">${avatar(c.name)}<strong>${escapeHTML(c.name)}</strong></div></td><td>${escapeHTML(c.email)}</td><td>${escapeHTML(c.phone)}</td><td>${c.rentals}</td><td><strong>${money(c.spend)}</strong></td><td>${escapeHTML(c.last)}</td></tr>`).join('')||'<tr><td colspan="6">No customers found.</td></tr>'}
$('#customerSearch').addEventListener('input',renderCustomers);
function fmtDate(s){if(!s)return '—';return new Date(s+'T12:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
function downloadCSV(name,rows){const csv=rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)}
$('#exportBtn').onclick=()=>downloadCSV('drivehub-command-overview-demo.csv',[['Metric','Value'],['Revenue recorded','24850'],['Active rentals',state.rentals.filter(r=>r.status==='Active').length],['Outstanding invoices',state.invoices.reduce((s,i)=>s+Math.max(0,i.total-i.paid),0)],['Pending reviews',state.reviews.filter(r=>r.status==='Pending').length]]);
$('#exportPayments').onclick=()=>downloadCSV('drivehub-demo-payments.csv',[['Receipt','Customer','Invoice','Date','Method','Amount'],...state.payments.map(p=>[p.id,p.customer,p.invoice,p.date,p.method,p.amount])]);
function openAction(type){const dialog=$('#actionDialog'),fields=$('#dialogFields');$('#actionForm').dataset.type=type;const field=(label,name,kind='text',opts='',full=false,required=true)=>`<div class="field ${full?'full':''}"><label for="f-${name}">${label}${required?' *':''}</label>${kind==='select'?`<select id="f-${name}" name="${name}" ${required?'required':''}>${opts}</select>`:kind==='textarea'?`<textarea id="f-${name}" name="${name}" ${required?'required':''}></textarea>`:`<input id="f-${name}" name="${name}" type="${kind}" ${required?'required':''}>`}</div>`;let title='',html='';
const vehicleOptions=state.fleet.map(v=>`<option>${escapeHTML(v.name)}</option>`).join('');const customerOptions=state.customers.map(c=>`<option>${escapeHTML(c.name)}</option>`).join('');const invoiceOptions=state.invoices.map(i=>`<option>${i.id}</option>`).join('');
if(type==='invoice'){title='Create invoice';html=field('Customer','customer','select',customerOptions)+field('Vehicle','vehicle','select',vehicleOptions)+field('Pickup date','pickup','date')+field('Return date','returned','date')+field('Daily rate (GH₵)','rate','number')+field('Due date','due','date')+field('Notes','notes','textarea','',true,false)}
if(type==='payment'){title='Record payment';html=field('Customer','customer','select',customerOptions)+field('Invoice','invoice','select',invoiceOptions)+field('Payment date','date','date')+field('Amount received (GH₵)','amount','number')+field('Payment method','method','select','<option>Mobile Money</option><option>Bank transfer</option><option>Cash</option>')+field('Payment reference','reference','text','',true,false)}
if(type==='rental'){title='Add rental';html=field('Customer','customer','select',customerOptions)+field('Vehicle','vehicle','select',vehicleOptions)+field('Pickup date','pickup','date')+field('Return date','returned','date')+field('Daily rate (GH₵)','rate','number')+field('Rental status','status','select','<option>Upcoming</option><option>Active</option><option>Completed</option>')}
if(type==='maintenance'){title='Add maintenance note';html=field('Vehicle','vehicle','select',vehicleOptions)+field('Due date','date','date')+field('Maintenance note','note','textarea','',true)}
if(type==='fleet'){title='Add vehicle to fleet';html=field('Vehicle make and model','name')+field('Registration number','plate')+field('Daily rate (GH₵)','rate','number')+field('Initial status','status','select','<option>Available</option><option>Maintenance</option>')+field('Service note / next service','service','text','',true,false)}
if(type==='review'){title='Add review record';html=field('Customer name','name')+field('Email','email','email','',false,false)+field('Vehicle','vehicle','select',vehicleOptions)+field('Rating','rating','select','<option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option>')+field('What went well','good','textarea','',true)+field('What could improve','improve','textarea','',true,false)}
$('#dialogTitle').textContent=title;fields.innerHTML=html;$('#dialogSubmit').textContent=type==='payment'?'Record payment':type==='review'?'Add review':'Save record';dialog.showModal()}
$('#quickAddBtn').onclick=()=>openAction('rental');$('#newInvoiceBtn').onclick=()=>openAction('invoice');$('#recordPaymentBtn').onclick=()=>openAction('payment');$('#newRentalBtn').onclick=()=>openAction('rental');$('#addMaintenanceBtn').onclick=()=>openAction('maintenance');$('#addVehicleBtn').onclick=()=>openAction('fleet');$('#notificationsBtn').onclick=()=>{nav('overview');toast('Notifications: review approvals and overdue invoices are highlighted under Needs attention.')};
$('#actionForm').addEventListener('submit',e=>{if(e.submitter?.value==='cancel')return;e.preventDefault();const type=e.currentTarget.dataset.type;const data=Object.fromEntries(new FormData(e.currentTarget).entries());if(type==='invoice'){const days=daysInclusive(data.pickup,data.returned);if(new Date(data.returned)<new Date(data.pickup)){toast('Return date must be on or after pickup date.');return}const total=days*Number(data.rate);state.invoices.unshift({id:`INV-2026-${String(state.invoices.length+19).padStart(3,'0')}`,customer:data.customer,vehicle:data.vehicle,issued:new Date().toISOString().slice(0,10),due:data.due,total,paid:0,status:'Unpaid'});toast(`Invoice created in demo: ${money(total)} for ${days} billable days.`);nav('invoices')}else if(type==='payment'){const inv=state.invoices.find(i=>i.id===data.invoice);const amount=Number(data.amount);if(!inv){toast('Select a valid invoice before recording a payment.');return}if(!data.date){toast('Enter the payment date.');return}if(!amount||amount<=0){toast('Enter a payment amount greater than zero.');return}if(inv&&amount>invoiceBalance(inv)){toast('Payment exceeds the remaining invoice balance.');return}if(inv){inv.paid=Number(inv.paid||0)+amount;inv.status=effectiveInvoiceStatus(inv)}state.payments.unshift({id:`RCT-2026-${String(state.payments.length+32).padStart(3,'0')}`,customer:data.customer,invoice:data.invoice,date:data.date,method:data.method,amount});toast('Payment recorded in this browser preview.')}else if(type==='rental'){if(!data.pickup||!data.returned||new Date(data.returned)<new Date(data.pickup)){toast('Enter valid rental dates. Return date must be on or after pickup date.');return}const conflict=state.rentals.find(r=>r.vehicle===data.vehicle&&r.status!=='Completed'&&r.status!=='Cancelled'&&data.pickup<=r.returned&&data.returned>=r.pickup);if(conflict){toast(`Vehicle conflict: ${data.vehicle} overlaps rental ${conflict.id} (${conflict.pickup} to ${conflict.returned}).`);return}if(!Number(data.rate)||Number(data.rate)<0){toast('Enter a valid daily rate.');return}state.rentals.unshift({id:`DH-${208+state.rentals.length+1}`,customer:data.customer,vehicle:data.vehicle,pickup:data.pickup,returned:data.returned,rate:Number(data.rate),status:data.status||'Upcoming'});toast(`Rental added. ${daysInclusive(data.pickup,data.returned)} billable days.`);nav('rentals')}else if(type==='fleet'){const plate=data.plate.trim();if(!data.name.trim()||!plate||!Number(data.rate)||Number(data.rate)<=0){toast('Enter a vehicle name, registration and positive daily rate.');return}if(state.fleet.some(v=>v.plate.toLowerCase()===plate.toLowerCase())){toast('That registration number is already registered.');return}state.fleet.push({name:data.name.trim(),plate,rate:Number(data.rate),status:data.status||'Available',util:0,service:data.service||'Service status not recorded'});toast('Vehicle added to this browser preview.');nav('fleet')}else if(type==='maintenance'){state.maintenance.unshift({vehicle:data.vehicle,date:data.date,note:data.note});toast('Maintenance note added.');nav('fleet')}else if(type==='review'){state.reviews.unshift({id:`RV-${105+state.reviews.length}`,name:data.name,email:data.email,vehicle:data.vehicle,rating:Number(data.rating),date:new Date().toISOString().slice(0,10),status:'Pending',good:data.good,improve:data.improve});toast('Review record added to pending moderation.');nav('reviews')}save();$('#actionDialog').close();renderOverview();renderReviews();renderInvoices();renderPayments();renderRentals();renderFleet();renderCustomers()});
$$('[data-report]').forEach(b=>b.onclick=()=>{const type=b.dataset.report;let rows;if(type==='invoices')rows=[['Invoice','Customer','Total','Paid','Balance','Status'],...state.invoices.map(i=>[i.id,i.customer,i.total,i.paid,Math.max(0,i.total-i.paid),i.status])];else if(type==='fleet')rows=[['Vehicle','Plate','Status','Daily rate','Utilisation'],...state.fleet.map(v=>[v.name,v.plate,v.status,v.rate,v.util+'%'])];else if(type==='reviews')rows=[['Review','Customer','Vehicle','Rating','Status','Date'],...state.reviews.map(r=>[r.id,r.name,r.vehicle,r.rating,r.status,r.date])];else rows=[['Rental','Customer','Vehicle','Pickup','Return','Days','Rate','Total'],...state.rentals.map(r=>[r.id,r.customer,r.vehicle,r.pickup,r.returned,daysInclusive(r.pickup,r.returned),r.rate,r.rate*daysInclusive(r.pickup,r.returned)])];downloadCSV(`drivehub-${type}-report-demo.csv`,rows);$('#reportOutput').innerHTML=`<h2>${type[0].toUpperCase()+type.slice(1)} report generated</h2><p class="section-desc">CSV download prepared from the current demo records. Connect live storage before using as an official business report.</p>`;toast('Demo report exported as CSV.')});
$('#saveSettings').onclick=()=>{localStorage.setItem('dh-command-settings',JSON.stringify({name:$('#businessName').value,email:$('#businessEmail').value,phone:$('#businessPhone').value}));toast('Preferences saved in this browser preview.')};
renderOverview();renderReviews();renderInvoices();renderPayments();renderRentals();renderFleet();renderCustomers();
