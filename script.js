const menuToggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');
menuToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false');}));
const today=new Date();const localDate=d=>{const x=new Date(d.getTime()-d.getTimezoneOffset()*60000);return x.toISOString().slice(0,10)};
const pickupDate=document.getElementById('pickupDate'),returnDate=document.getElementById('returnDate');
if(pickupDate&&returnDate){pickupDate.min=localDate(today);returnDate.min=localDate(today);pickupDate.addEventListener('change',()=>{returnDate.min=pickupDate.value;if(returnDate.value&&returnDate.value<pickupDate.value)returnDate.value=pickupDate.value;});}
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
document.querySelectorAll('[data-car]').forEach(link=>link.addEventListener('click',()=>{const vehicle=document.getElementById('vehicle');if(vehicle)vehicle.value=link.dataset.car;}));
const toast=document.getElementById('toast');let toastTimer;function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),4500);}
const bookingForm=document.getElementById('bookingForm');bookingForm?.addEventListener('submit',e=>{e.preventDefault();if(!pickupDate||!returnDate)return;const pickup=pickupDate.value,ret=returnDate.value;const selectedVehicle=document.getElementById('vehicle')?.value||'';const region=document.getElementById('pickupRegion')?.value||'';const location=(document.getElementById('pickup')?.value||'').trim();if(!selectedVehicle){showToast('Please select a vehicle, or choose Help me choose, before continuing.');document.querySelector('[data-ride-vehicle]')?.focus();return;}if(!pickup||!ret){showToast('Please choose your pickup and return dates.');return;}if(ret<pickup){showToast('Please choose a return date on or after your pickup date.');return;}if(!region||!location){showToast('Please enter your destination region and town.');return;}const days=Math.round((new Date(ret+'T12:00:00')-new Date(pickup+'T12:00:00'))/86400000)+1;const purpose=document.getElementById('ridePurpose')?.value||'Not specified';const msg=`Hello DriveHub GH, I would like to enquire about a self-drive rental.\n\nPreferred vehicle: ${selectedVehicle}\nTrip purpose: ${purpose}\nDestination region: ${region}\nTown / exact destination: ${location}\nPickup date: ${pickup}\nReturn date: ${ret}\nRental days (pickup and return dates counted): ${days}\n\nPlease confirm availability, rate and rental requirements.`;window.open('https://wa.me/233204116245?text='+encodeURIComponent(msg),'_blank','noopener');showToast('WhatsApp is opening with your rental enquiry. Please send the message to contact our team.');});



/* Find Your Ride: category selection, live trip summary, inclusive rental-day count. */
(()=>{
 const root=document.querySelector('.ride-page'); if(!root)return;
 const vehicle=document.getElementById('vehicle'),pickup=document.getElementById('pickupDate'),ret=document.getElementById('returnDate');
 const purpose=document.getElementById('ridePurpose'),duration=document.getElementById('durationText');
 const summaryVehicle=document.getElementById('summaryVehicle'),summaryNote=document.getElementById('summaryVehicleNote');
 const summaryImage=document.getElementById('summaryVehicleImage'),summaryPurposeLabel=document.getElementById('summaryPurposeLabel');
 const summaryArt=document.getElementById('summaryCarArt'),emptyState=document.getElementById('summaryEmptyState');
 const summaryPickup=document.getElementById('summaryPickup'),summaryReturn=document.getElementById('summaryReturn'),summaryDays=document.getElementById('summaryDays');
 const destinationRegion=document.getElementById('pickupRegion'),destinationTown=document.getElementById('pickup'),summaryDestination=document.getElementById('summaryPickupArea');
 const progress=[...root.querySelectorAll('.ride-progress span')];
 const labels={
  'Help me choose':['Help me choose','We’ll match a car to your plans.'],
  'Toyota Prado':['Toyota Prado','Space and presence for bigger plans.'],
  'Mitsubishi Outlander':['Mitsubishi Outlander','Versatile comfort for everyday plans and getaways.'],
  'Toyota RAV4':['Toyota RAV4','A versatile choice for city days and escapes.'],
  'Hyundai Santa Fe':['Hyundai Santa Fe','A refined option for relaxed travel.'],
  'Honda CR-V':['Honda CR-V','Comfort and versatility for everyday journeys.'],
  'Toyota Land Cruiser V8':['Toyota Land Cruiser V8','Full-size presence for longer journeys and special occasions.'],
  // Legacy links are normalised below; these labels keep old bookmarks readable.
  'Any available car':['Help me choose','We’ll match a car to your plans.'],
  'SUV':['Choose from our SUV fleet','Select a model below.']
 };
 const localDate=d=>{const x=new Date(d.getTime()-d.getTimezoneOffset()*60000);return x.toISOString().slice(0,10)};
 const formatDate=v=>{if(!v)return 'Choose a date';const d=new Date(v+'T12:00:00');return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});};
 function refresh(){
  const choice=vehicle?.value||'',label=choice?(labels[choice]||[choice,'Selected for your journey.']):['Choose your ride','Select a vehicle or ask us to help.'];
  if(summaryVehicle)summaryVehicle.textContent=label[0];if(summaryNote)summaryNote.textContent=label[1];
  const imageByChoice={
   'Help me choose':['',''],
   'Any available car':['',''],
   'SUV':['',''],
   'Toyota Prado':['assets/fleet/toyota-prado.webp','Toyota Prado from the DriveHub GH fleet'],
   'Mitsubishi Outlander':['assets/fleet/mitsubishi-outlander.webp','Mitsubishi Outlander from the DriveHub GH fleet'],
   'Toyota RAV4':['assets/fleet/toyota-rav4.webp','Toyota RAV4 from the DriveHub GH fleet'],
   'Hyundai Santa Fe':['assets/fleet/hyundai-santa-fe.webp','Hyundai Santa Fe from the DriveHub GH fleet'],
   'Honda CR-V':['assets/fleet/honda-cr-v.webp','Honda CR-V from the DriveHub GH fleet'],
   'Toyota Land Cruiser V8':['assets/fleet/toyota-land-cruiser-v8.webp','Toyota Land Cruiser V8 from the DriveHub GH fleet']
  };
  const visual=imageByChoice[choice]||['',''];
  const hasVehicle=Boolean(choice&&visual[0]);
  if(summaryArt){summaryArt.classList.toggle('is-empty',!hasVehicle);}
  if(emptyState)emptyState.hidden=hasVehicle;
  if(summaryImage){summaryImage.hidden=!hasVehicle;if(hasVehicle){summaryImage.style.opacity='1';if(summaryImage.getAttribute('src')!==visual[0])summaryImage.src=visual[0];summaryImage.alt=visual[1];}}
  root.querySelectorAll('.summary-visual-kicker,.summary-art-label').forEach(el=>el.hidden=!hasVehicle);
  const purposeText=purpose?.value||'City driving';
  const purposeLabels={'City driving':'MADE FOR CITY DAYS','Family trip':'MADE FOR FAMILY TIME','Business':'MADE FOR BUSINESS','Weekend away':'MADE FOR GETAWAYS','Other':'MADE FOR YOUR PLANS'};
  if(summaryPurposeLabel)summaryPurposeLabel.textContent=purposeLabels[purposeText]||'MADE FOR YOUR PLANS';
  const region=destinationRegion?.value||'',town=(destinationTown?.value||'').trim();if(summaryDestination){summaryDestination.textContent=region&&town?`${town}, ${region}`:region?`${region} · Add a town`:town?`${town} · Choose a region`:'Choose your destination';}
  const a=pickup?.value||'',b=ret?.value||'';if(summaryPickup)summaryPickup.textContent=formatDate(a);if(summaryReturn)summaryReturn.textContent=formatDate(b);
  let days=0;if(a&&b&&b>=a)days=Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/86400000)+1;
  if(summaryDays)summaryDays.textContent=days?`${days} ${days===1?'day':'days'}`:'— days';
  if(duration){if(days)duration.textContent=`${days} ${days===1?'rental day':'rental days'} · pickup and return dates both count`;else duration.textContent='Choose your dates to see your rental duration.';}
  if(progress.length>=3){progress[0].classList.add('progress-active');progress[1].classList.toggle('progress-active',Boolean(a&&b&&days));progress[2].classList.toggle('progress-active',Boolean(a&&b&&days&&purpose?.value));}
 }
 root.querySelectorAll('[data-ride-vehicle]').forEach(btn=>btn.addEventListener('click',()=>{
  if(vehicle)vehicle.value=btn.dataset.rideVehicle;
  root.querySelectorAll('[data-ride-vehicle]').forEach(card=>{const active=card===btn;card.classList.toggle('is-selected',active);card.setAttribute('aria-pressed',String(active));});refresh();
 }));
 root.querySelectorAll('[data-purpose]').forEach(btn=>btn.addEventListener('click',()=>{
  if(purpose)purpose.value=btn.dataset.purpose;
  root.querySelectorAll('[data-purpose]').forEach(chip=>{const active=chip===btn;chip.classList.toggle('is-active',active);chip.setAttribute('aria-pressed',String(active));});refresh();
 }));
 if(pickup&&ret){pickup.min=localDate(new Date());ret.min=pickup.value||localDate(new Date());pickup.addEventListener('change',()=>{ret.min=pickup.value||localDate(new Date());if(ret.value&&ret.value<ret.min)ret.value=ret.min;refresh();});ret.addEventListener('change',refresh);}
 destinationRegion?.addEventListener('change',refresh);destinationTown?.addEventListener('input',refresh);
 const query=new URLSearchParams(location.search);const requested=query.get('vehicle');
 const modelNames=['Toyota Prado','Mitsubishi Outlander','Toyota RAV4','Hyundai Santa Fe','Honda CR-V','Toyota Land Cruiser V8'];
 function selectModel(name){
  const match=[...root.querySelectorAll('[data-ride-vehicle]')].find(b=>b.dataset.rideVehicle.toLowerCase()===String(name).toLowerCase());
  if(match){match.click();return true;}return false;
 }
 if(requested&&vehicle){
  const normalized=requested.toLowerCase().trim();
  const exact=modelNames.find(name=>name.toLowerCase()===normalized);
  if(exact)selectModel(exact);
  else if(['help me choose','any available car','any car'].includes(normalized)){vehicle.value='Help me choose';root.querySelectorAll('[data-ride-vehicle]').forEach(card=>{card.classList.remove('is-selected');card.setAttribute('aria-pressed','false');});refresh();}
  else if(normalized==='suv')selectModel('Toyota Prado');
  else if(normalized.includes('outlander'))selectModel('Mitsubishi Outlander');
  else if(normalized.includes('prado'))selectModel('Toyota Prado');
  else if(normalized.includes('rav4'))selectModel('Toyota RAV4');
  else if(normalized.includes('santa fe'))selectModel('Hyundai Santa Fe');
  else if(normalized.includes('cr-v')||normalized.includes('crv'))selectModel('Honda CR-V');
  else if(normalized.includes('v8')||normalized.includes('land cruiser'))selectModel('Toyota Land Cruiser V8');
  else {vehicle.value='Help me choose';refresh();}
 }
 refresh();
})();

/* DriveHub GH Concierge: real model responses through the same-origin Cloudflare Pages Function. */
(()=>{
 const root=document.querySelector('.concierge-page'); if(!root)return;
 const messages=document.getElementById('conciergeMessages'),form=document.getElementById('conciergeForm'),input=document.getElementById('conciergeInput'),suggestions=document.getElementById('conciergeSuggestions'),reset=document.getElementById('conciergeReset');
 const phone='233204116245'; let history=[]; let busy=false;
 const openingByTime=()=>{
  let hour=new Date().getHours();
  try{hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Accra',hour:'2-digit',hourCycle:'h23'}).format(new Date()));}catch(e){}
  const groups=hour>=5&&hour<12?[
   ['Good morning.','What are we planning?','A fresh day, a new destination. Tell me what you need the car for and I’ll help narrow the fleet.','Are we thinking family time, business, or a little escape?'],
   ['Morning!','Where will the road take you?','Share a little about your day or trip. I’ll help you find a vehicle that fits.','What kind of drive do you have in mind?'],
   ['Good morning.','Let’s find your fit.','From city errands to longer journeys, let’s match your plans with the right car.','Where are you headed, and who’s coming along?']
  ]:hour>=12&&hour<17?[
   ['Good afternoon.','What can I help you plan?','Tell me the journey, the dates, or the kind of car you’re considering. We’ll take it from there.','What matters most: space, comfort, or everyday flexibility?'],
   ['Afternoon!','Let’s make the next move easy.','I can help you compare our six vehicles and prepare a clear rental enquiry.','What does your next trip look like?'],
   ['Good afternoon.','Where are we going?','A family plan, a work trip, or time away? I’ll help you shortlist the right ride.','What are you planning today?']
  ]:hour>=17&&hour<22?[
   ['Good evening.','Where can I take you?','Planning tomorrow or getting away soon? Tell me a little and I’ll help you choose your ride.','Is it family time, business, or a getaway?'],
   ['Evening!','Let’s plan a better drive.','Tell me what’s ahead and I’ll help match your plans to the DriveHub fleet.','Where are you headed, and when do you need the car?'],
   ['Good evening.','What are we setting up?','From a spacious SUV to a versatile everyday drive, let’s find what suits your plans.','What would make this trip feel just right?']
  ]:[
   ['Still planning?','Let’s make it simple.','I’m here to help you shortlist a car and prepare your rental enquiry whenever you’re ready.','What would you like to figure out first?'],
   ['Hello, night owl.','Where will you go next?','We can start with the vehicle, the dates, or the details you want to know before renting.','What’s on your mind?'],
   ['Welcome.','Your next trip starts here.','Tell me a little about your plans and I’ll help you take the next step.','Need a recommendation, rental details, or help with dates?']
  ];
  const chosen=groups[Math.floor(Math.random()*groups.length)];
  const note=hour<12?'Tell me your plans, and we’ll find a fit.':hour<17?'Start with your dates, route, or what matters most.':hour<22?'A few details are enough to get us started.':'Ask about a car, dates, or what to prepare.';
  return {title:chosen[0],accent:chosen[1],note,message:chosen[2],question:chosen[3]};
 };
 const setOpening=()=>{const o=openingByTime();const title=document.getElementById('partnerGreetingText'),accent=document.getElementById('partnerGreetingAccent'),note=document.getElementById('partnerGreetingNote'),message=document.getElementById('partnerWelcomeMessage'),question=document.getElementById('partnerWelcomeQuestion');if(title)title.textContent=o.title;if(accent)accent.textContent=o.accent;if(note)note.textContent=o.note;if(message)message.textContent=o.message;if(question)question.textContent=o.question;return o;};
 setOpening();
 const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function addMessage(text,who){
  const wrap=document.createElement('div');wrap.className='chat-message '+(who==='user'?'user-message':'assistant-message');
  const now=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  if(who!=='user'){const avatar=document.createElement('div');avatar.className='message-avatar';avatar.textContent='DH';wrap.appendChild(avatar);}
  const content=document.createElement('div');content.className='message-content';
  const sender=document.createElement('span');sender.className='message-sender';sender.textContent=(who==='user'?'YOU':'DRIVEHUB AI PARTNER')+' · '+now;
  const bubble=document.createElement('div');bubble.className='message-bubble';
  String(text).split(/\n{2,}/).forEach(part=>{const p=document.createElement('p');p.textContent=part; bubble.appendChild(p);});
  content.append(sender,bubble);wrap.appendChild(content);messages.appendChild(wrap);messages.scrollTop=messages.scrollHeight;return wrap;
 }
 function addAssistant(text,withWhatsApp=false){
  const wrap=addMessage(text,'assistant');
  const bubble=wrap.querySelector('.message-bubble');
  const fleetModels=[
   ['Toyota Prado','toyota-prado'],
   ['Mitsubishi Outlander','mitsubishi-outlander'],
   ['Toyota RAV4','toyota-rav4'],
   ['Hyundai Santa Fe','hyundai-santa-fe'],
   ['Honda CR-V','honda-cr-v'],
   ['Toyota Land Cruiser V8','toyota-land-cruiser-v8']
  ];
  const mentioned=fleetModels.filter(([name])=>String(text).toLowerCase().includes(name.toLowerCase()));
  if(mentioned.length){
   const actions=document.createElement('div');actions.className='concierge-car-actions';
   mentioned.forEach(([name,slug])=>{const a=document.createElement('a');a.href='/find-your-ride?vehicle='+encodeURIComponent(name);a.textContent='Choose '+name+' & enquire ↗';a.setAttribute('aria-label','Choose '+name+' and open a preselected rental enquiry');actions.appendChild(a);});
   bubble.appendChild(actions);
  }
  if(withWhatsApp){const p=document.createElement('p');p.className='assistant-handoff';const a=document.createElement('a');a.href='https://wa.me/'+phone+'?text='+encodeURIComponent('Hello DriveHub GH, I need help with a self-drive rental enquiry.');a.target='_blank';a.rel='noopener';a.textContent='Continue with the DriveHub team on WhatsApp ↗';p.appendChild(a);bubble.appendChild(p);}
  messages.scrollTop=messages.scrollHeight;
 }
 function setBusy(on){busy=on;input.disabled=on;form.querySelector('button[type="submit"]').disabled=on;form.querySelector('button[type="submit"] span').textContent=on?'Thinking…':'Send';form.setAttribute('aria-busy',String(on));}
 function addSuggestions(labels){if(!labels?.length)return;const chips=document.createElement('div');chips.className='chat-suggestions';labels.forEach(label=>{const b=document.createElement('button');b.type='button';b.dataset.prompt=label;b.textContent=label;chips.appendChild(b);});messages.appendChild(chips);messages.scrollTop=messages.scrollHeight;}
 async function send(text){
  const clean=String(text||'').trim();if(!clean||busy)return;
  addMessage(clean,'user');if(suggestions)suggestions.remove();messages.querySelectorAll('.chat-suggestions').forEach(el=>el.remove());input.value='';setBusy(true);
  const typing=document.createElement('div');typing.className='chat-message assistant-message chat-typing';typing.innerHTML='<div class="message-avatar">DH</div><div class="message-content"><span class="message-sender">DRIVEHUB AI PARTNER</span><div class="message-bubble">Thinking through your question…</div></div>';messages.appendChild(typing);messages.scrollTop=messages.scrollHeight;
  history.push({role:'user',content:clean});history=history.slice(-12);
  try{
   const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history})});
   const data=await response.json().catch(()=>({}));
   if(!response.ok||!data.reply)throw new Error(data.error||'Assistant temporarily unavailable');
   typing.remove();history.push({role:'assistant',content:data.reply});history=history.slice(-12);addAssistant(data.reply);
  }catch(err){
   typing.remove();history.pop();const q=clean.toLowerCase();let fallback='I can still guide you using the six vehicles published on our fleet page, but the live AI service is not responding right now. For confirmed prices, availability and rental terms, our team must verify the details.';
   if(/price|cost|rate|how much|deposit|fee/.test(q))fallback='I can’t verify a current rental rate or deposit from the website information available to me, and I won’t invent a price. Tell me your dates and preferred vehicle, and the DriveHub team can confirm the total. The live AI service is temporarily unavailable, so you can continue with our team on WhatsApp.';
   else if(/family|children|kids|weekend|everyday|city/.test(q))fallback='For a versatile family or everyday trip, I’d start with the Mitsubishi Outlander or Honda CR-V. The Outlander is positioned for flexible family plans; the CR-V for practical everyday journeys. If you expect a longer journey or want a more substantial SUV, consider the Toyota Prado. Exact suitability and availability need team confirmation.';
   else if(/luxury|special occasion|land cruiser|v8/.test(q))fallback='The Toyota Land Cruiser V8 is our full-size, premium-feeling option for longer journeys or special occasions. The Toyota Prado is a strong alternative if you want a substantial SUV without defaulting to the V8. The team will confirm the exact unit, availability and rate.';
   else if(/out of town|long journey|long trip|road trip/.test(q))fallback='For a longer journey, I’d shortlist the Toyota Prado and Mitsubishi Outlander. The Prado is positioned for bigger plans; the Outlander for flexible everyday and family travel. Share your route, dates and passenger/luggage needs so the team can confirm which vehicle is suitable.';
   addAssistant(fallback,true);
  }finally{setBusy(false);input.focus();}
 }
 form?.addEventListener('submit',e=>{e.preventDefault();send(input.value);});
 root.addEventListener('click',e=>{const chip=e.target.closest('[data-prompt]');if(!chip)return;const prompt=chip.dataset.prompt;if(prompt){if(chip.classList.contains('concierge-topic'))document.querySelectorAll('.concierge-topic').forEach(b=>b.classList.toggle('is-active',b===chip));send(prompt);}});
 reset?.addEventListener('click',()=>{if(busy)return;messages.innerHTML='';history=[];const opening=setOpening();addAssistant(opening.message+'\n\n'+opening.question);addSuggestions(['Help me choose a car','Compare two SUVs','What do I need to rent?']);input.focus();});
 const pickup=document.getElementById('tripPickup'),ret=document.getElementById('tripReturn');const localDate=d=>{const x=new Date(d.getTime()-d.getTimezoneOffset()*60000);return x.toISOString().slice(0,10);};if(pickup&&ret){pickup.min=localDate(new Date());ret.min=localDate(new Date());pickup.addEventListener('change',()=>{ret.min=pickup.value||localDate(new Date());if(ret.value&&ret.value<ret.min)ret.value=ret.min;});}
 document.getElementById('conciergeTripForm')?.addEventListener('submit',e=>{e.preventDefault();if(!pickup.value||!ret.value)return;if(ret.value<pickup.value){ret.setCustomValidity('Return date must be on or after pickup date.');ret.reportValidity();return;}ret.setCustomValidity('');const days=Math.round((new Date(ret.value+'T12:00:00')-new Date(pickup.value+'T12:00:00'))/86400000)+1;const vehicle=document.getElementById('tripVehicle').value;const purpose=document.getElementById('tripPurpose').value;const region=document.getElementById('tripRegion')?.value||'Not specified';const exactLocation=document.getElementById('tripLocation')?.value||'Not specified';const msg=`Hello DriveHub GH, please help me plan a self-drive rental.\n\nPreferred vehicle: ${vehicle}\nDestination region: ${region}\nTown / exact destination: ${exactLocation}\nPickup date: ${pickup.value}\nReturn date: ${ret.value}\nRental duration: ${days} calendar days (pickup and return dates both counted)\nMain use: ${purpose}\n\nPlease confirm availability, total price, documents and pickup arrangements before I commit.`;window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(msg),'_blank','noopener');});
})();


/* Reveal DriveHub testimonial sections as they enter the viewport. */
(() => {
  const sections = document.querySelectorAll('.testimonials-section');
  if (!sections.length) return;
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  sections.forEach(section => section.classList.add('motion-ready'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('motion-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  sections.forEach(section => observer.observe(section));
})();
