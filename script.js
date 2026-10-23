const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
menuToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false');}));
const today=new Date();const localDate=d=>{const x=new Date(d.getTime()-d.getTimezoneOffset()*60000);return x.toISOString().slice(0,10)};
const pickupDate=document.getElementById('pickupDate'),returnDate=document.getElementById('returnDate');
pickupDate.min=localDate(today);returnDate.min=localDate(today);
pickupDate.addEventListener('change',()=>{returnDate.min=pickupDate.value;if(returnDate.value&&returnDate.value<pickupDate.value)returnDate.value=pickupDate.value;});
document.getElementById('year').textContent=new Date().getFullYear();
document.querySelectorAll('[data-car]').forEach(link=>link.addEventListener('click',()=>{document.getElementById('vehicle').value=link.dataset.car; }));
const toast=document.getElementById('toast');let toastTimer;
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),4500)}
document.getElementById('bookingForm').addEventListener('submit',e=>{e.preventDefault();const pickup=pickupDate.value,ret=returnDate.value;if(ret<pickup){showToast('Please choose a return date on or after your pickup date.');return;}const days=Math.round((new Date(ret+'T12:00:00')-new Date(pickup+'T12:00:00'))/86400000)+1;const vehicle=document.getElementById('vehicle').value;const location=document.getElementById('pickup').value;const msg=`Hello DriveHub GH, I would like to enquire about a self-drive rental.\n\nPreferred vehicle: ${vehicle}\nPickup location: ${location}\nPickup date: ${pickup}\nReturn date: ${ret}\nRental days (pickup and return dates counted): ${days}\n\nPlease confirm availability, rate and rental requirements.`;window.open('https://wa.me/233204116245?text='+encodeURIComponent(msg),'_blank','noopener');showToast('Opening WhatsApp with your rental enquiry. Please send the message to contact our team.');});
