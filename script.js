const menuToggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');
menuToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false');}));
const today=new Date();const localDate=d=>{const x=new Date(d.getTime()-d.getTimezoneOffset()*60000);return x.toISOString().slice(0,10)};
const pickupDate=document.getElementById('pickupDate'),returnDate=document.getElementById('returnDate');
if(pickupDate&&returnDate){pickupDate.min=localDate(today);returnDate.min=localDate(today);pickupDate.addEventListener('change',()=>{returnDate.min=pickupDate.value;if(returnDate.value&&returnDate.value<pickupDate.value)returnDate.value=pickupDate.value;});}
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
document.querySelectorAll('[data-car]').forEach(link=>link.addEventListener('click',()=>{const vehicle=document.getElementById('vehicle');if(vehicle)vehicle.value=link.dataset.car;}));
const toast=document.getElementById('toast');let toastTimer;function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),4500);}
const bookingForm=document.getElementById('bookingForm');bookingForm?.addEventListener('submit',e=>{e.preventDefault();if(!pickupDate||!returnDate)return;const pickup=pickupDate.value,ret=returnDate.value;if(!pickup||!ret){showToast('Please choose your pickup and return dates.');return;}if(ret<pickup){showToast('Please choose a return date on or after your pickup date.');return;}const days=Math.round((new Date(ret+'T12:00:00')-new Date(pickup+'T12:00:00'))/86400000)+1;const vehicle=document.getElementById('vehicle')?.value||'Any available car';const location=document.getElementById('pickup')?.value||'DriveHub GH Office, Westland';const msg=`Hello DriveHub GH, I would like to enquire about a self-drive rental.\n\nPreferred vehicle: ${vehicle}\nPickup location: ${location}\nPickup date: ${pickup}\nReturn date: ${ret}\nRental days (pickup and return dates counted): ${days}\n\nPlease confirm availability, rate and rental requirements.`;window.open('https://wa.me/233204116245?text='+encodeURIComponent(msg),'_blank','noopener');showToast('WhatsApp is opening with your rental enquiry. Please send the message to contact our team.');});


/* DriveHub GH Concierge: real model responses through the same-origin Cloudflare Pages Function. */
(()=>{
 const root=document.querySelector('.concierge-page'); if(!root)return;
 const messages=document.getElementById('conciergeMessages'),form=document.getElementById('conciergeForm'),input=document.getElementById('conciergeInput'),suggestions=document.getElementById('conciergeSuggestions'),reset=document.getElementById('conciergeReset');
 const phone='233204116245'; let history=[]; let busy=false;
 const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function addMessage(text,who){
  const wrap=document.createElement('div');wrap.className='chat-message '+(who==='user'?'user-message':'assistant-message');
  const now=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  if(who!=='user'){const avatar=document.createElement('div');avatar.className='message-avatar';avatar.textContent='DH';wrap.appendChild(avatar);}
  const content=document.createElement('div');content.className='message-content';
  const sender=document.createElement('span');sender.className='message-sender';sender.textContent=(who==='user'?'YOU':'DRIVEHUB AI CONCIERGE')+' · '+now;
  const bubble=document.createElement('div');bubble.className='message-bubble';
  String(text).split(/\n{2,}/).forEach(part=>{const p=document.createElement('p');p.textContent=part; bubble.appendChild(p);});
  content.append(sender,bubble);wrap.appendChild(content);messages.appendChild(wrap);messages.scrollTop=messages.scrollHeight;return wrap;
 }
 function addAssistant(text,withWhatsApp=false){
  const wrap=addMessage(text,'assistant');
  if(withWhatsApp){const p=document.createElement('p');p.className='assistant-handoff';const a=document.createElement('a');a.href='https://wa.me/'+phone+'?text='+encodeURIComponent('Hello DriveHub GH, I need help with a self-drive rental enquiry.');a.target='_blank';a.rel='noopener';a.textContent='Continue with the DriveHub team on WhatsApp ↗';p.appendChild(a);wrap.querySelector('.message-bubble').appendChild(p);}
  messages.scrollTop=messages.scrollHeight;
 }
 function setBusy(on){busy=on;input.disabled=on;form.querySelector('button[type="submit"]').disabled=on;form.querySelector('button[type="submit"] span').textContent=on?'Thinking…':'Send';}
 function addSuggestions(labels){if(!labels?.length)return;const chips=document.createElement('div');chips.className='chat-suggestions';labels.forEach(label=>{const b=document.createElement('button');b.type='button';b.dataset.prompt=label;b.textContent=label;chips.appendChild(b);});messages.appendChild(chips);messages.scrollTop=messages.scrollHeight;}
 async function send(text){
  const clean=String(text||'').trim();if(!clean||busy)return;
  addMessage(clean,'user');if(suggestions)suggestions.remove();messages.querySelectorAll('.chat-suggestions').forEach(el=>el.remove());input.value='';setBusy(true);
  const typing=document.createElement('div');typing.className='chat-message assistant-message chat-typing';typing.innerHTML='<div class="message-avatar">DH</div><div class="message-content"><span class="message-sender">DRIVEHUB AI CONCIERGE</span><div class="message-bubble">Thinking through your question…</div></div>';messages.appendChild(typing);messages.scrollTop=messages.scrollHeight;
  history.push({role:'user',content:clean});history=history.slice(-12);
  try{
   const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history})});
   const data=await response.json().catch(()=>({}));
   if(!response.ok||!data.reply)throw new Error(data.error||'Assistant temporarily unavailable');
   typing.remove();history.push({role:'assistant',content:data.reply});history=history.slice(-12);addAssistant(data.reply);
  }catch(err){
   typing.remove();history.pop();addAssistant('I’m having trouble reaching the AI service right now. I don’t want to guess or give you incorrect rental information. Please try again shortly, or contact our team directly and they’ll help confirm the details.',true);
  }finally{setBusy(false);input.focus();}
 }
 form?.addEventListener('submit',e=>{e.preventDefault();send(input.value);});
 root.addEventListener('click',e=>{const chip=e.target.closest('[data-prompt]');if(!chip)return;const prompt=chip.dataset.prompt;if(prompt){document.querySelectorAll('.concierge-topic').forEach(b=>b.classList.toggle('is-active',b===chip));send(prompt);}});
 reset?.addEventListener('click',()=>{if(busy)return;messages.innerHTML='';history=[];addAssistant('Welcome back. I’m your DriveHub GH AI Concierge. Tell me where you’re going, when you need a car, or what you’d like to know about renting.');addSuggestions(['Help me choose a car','How does pricing work?','What documents do I need?']);input.focus();});
 const pickup=document.getElementById('tripPickup'),ret=document.getElementById('tripReturn');const localDate=d=>{const x=new Date(d.getTime()-d.getTimezoneOffset()*60000);return x.toISOString().slice(0,10);};if(pickup&&ret){pickup.min=localDate(new Date());ret.min=localDate(new Date());pickup.addEventListener('change',()=>{ret.min=pickup.value||localDate(new Date());if(ret.value&&ret.value<ret.min)ret.value=ret.min;});}
 document.getElementById('conciergeTripForm')?.addEventListener('submit',e=>{e.preventDefault();if(!pickup.value||!ret.value)return;if(ret.value<pickup.value){ret.setCustomValidity('Return date must be on or after pickup date.');ret.reportValidity();return;}ret.setCustomValidity('');const days=Math.round((new Date(ret.value+'T12:00:00')-new Date(pickup.value+'T12:00:00'))/86400000)+1;const vehicle=document.getElementById('tripVehicle').value;const purpose=document.getElementById('tripPurpose').value;const msg=`Hello DriveHub GH, please help me plan a self-drive rental.\n\nPreferred vehicle: ${vehicle}\nPickup date: ${pickup.value}\nReturn date: ${ret.value}\nRental duration: ${days} calendar days (pickup and return dates both counted)\nMain use: ${purpose}\n\nPlease confirm availability, total price, documents and pickup arrangements before I commit.`;window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(msg),'_blank','noopener');});
})();
