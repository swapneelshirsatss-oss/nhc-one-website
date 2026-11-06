window.dataLayer=window.dataLayer||[];
const dlg=document.getElementById('enq');

// Keep ad click IDs and UTMs for the whole visit, so a lead is traced to its campaign even after a reload.
const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid','fbclid'];
const q=new URLSearchParams(location.search);
keys.forEach(k=>{if(q.get(k))sessionStorage.setItem(k,q.get(k));});

// One form markup (the hero one) is cloned into the closing section and the popup.
const hero=document.querySelector('form.lead-form[data-form-id=hero]');
document.querySelectorAll('[data-form-slot]').forEach(s=>{
  const f=hero.cloneNode(true);f.dataset.formId=s.dataset.formSlot;f.cta_source.value=s.dataset.formSlot+'-form';
  (s.querySelector('.core')||s).appendChild(f);
});
document.querySelectorAll('form.lead-form').forEach(f=>keys.forEach(k=>{f[k].value=sessionStorage.getItem(k)||'';}));

// Open the enquiry popup from any [data-enquire] button
const modalForm=dlg.querySelector('form');
document.querySelectorAll('[data-enquire]').forEach(b=>b.addEventListener('click',()=>{
  modalForm.request.value=b.dataset.enquire;modalForm.cta_source.value=b.dataset.source;
  dataLayer.push({event:'cta_click',cta:b.dataset.source,intent:b.dataset.enquire});
  dlg.showModal();
}));
dlg.querySelector('[data-close]').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});

// Call and WhatsApp clicks (set these up as Ads conversions in GTM on 'contact_click')
document.querySelectorAll('[data-track]').forEach(a=>a.addEventListener('click',()=>dataLayer.push({event:'contact_click',method:a.dataset.track,cta:a.dataset.source})));

document.addEventListener('submit',async e=>{
  const form=e.target;if(!form.matches('form.lead-form'))return;
  e.preventDefault();
  const status=form.querySelector('.status'),d=Object.fromEntries(new FormData(form));
  if(d.website)return; // honeypot: bots fill the hidden field
  if(!d.name.trim()){status.textContent='Please enter your name.';return;}
  if(!/^[6-9][0-9]{9}$/.test(d.phone)){status.textContent='Enter a valid 10-digit mobile number without +91.';return;}
  if(!d.timeline){status.textContent='Please choose when you plan to buy.';return;}
  const btn=form.querySelector('button[type=submit]');btn.disabled=true;status.textContent='Sending…';
  try{
    if(window.NHC_ENDPOINT)await fetch(window.NHC_ENDPOINT,{method:'POST',mode:'no-cors',body:JSON.stringify({...d,form:'landing',page:location.href})});
    dataLayer.push({event:'generate_lead',form:'landing',source:d.cta_source,timeline:d.timeline});
    location.href='thank-you.html';
  }catch(_){status.textContent='Something went wrong. Please call +91 8087 8087 07.';btn.disabled=false;}
});

// Scroll reveal (IntersectionObserver, transform + opacity only)
const els=document.querySelectorAll('.rv');
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{rootMargin:'0px 0px -8% 0px'});
  els.forEach(el=>{el.style.setProperty('--i',[...el.parentNode.children].filter(c=>c.classList.contains('rv')).indexOf(el));io.observe(el);});
}else els.forEach(el=>el.classList.add('in'));

// Count-up for the key facts when they scroll into view
if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&'IntersectionObserver' in window){
  const cio=new IntersectionObserver(es=>es.forEach(en=>{
    if(!en.isIntersecting)return;cio.unobserve(en.target);
    const el=en.target,to=+el.dataset.to,t0=performance.now(),dur=1600;
    (function step(t){const p=Math.min((t-t0)/dur,1);el.textContent=Math.round(to*(1-Math.pow(1-p,4)));if(p<1)requestAnimationFrame(step);})(t0);
  }),{threshold:.6});
  document.querySelectorAll('[data-to]').forEach(el=>{el.textContent='0';cio.observe(el);});
}
