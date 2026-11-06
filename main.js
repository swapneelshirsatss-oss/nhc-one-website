// Amenity tabs
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-selected',x===b));
  document.querySelectorAll('.panel').forEach(p=>p.hidden=p.dataset.p!==b.dataset.t);
});

// Popups: any link to #book opens the dialog; [data-open] opens by id
const book=document.getElementById('book');
document.querySelectorAll('a[href="#book"]').forEach(a=>a.onclick=e=>{e.preventDefault();book.showModal();});
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.open).showModal());
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('nav-open')));

// Ad tracking: push events to GTM dataLayer (set up the Google Ads conversion tags on these events in GTM)
window.dataLayer=window.dataLayer||[];
document.querySelectorAll('[data-cta]').forEach(a=>a.addEventListener('click',()=>dataLayer.push({event:'cta_click',cta:a.dataset.cta})));

// Lead forms. Paste the Apps Script web-app URL (see lead-endpoint.gs) here.
const ENDPOINT=window.NHC_ENDPOINT||'';
document.querySelectorAll('form.lead').forEach(f=>f.addEventListener('submit',async e=>{
  e.preventDefault();
  const msg=f.querySelector('.msg'),d=Object.fromEntries(new FormData(f));
  if(!d.name||!/^[0-9+ ]{10,15}$/.test(d.phone||'')){msg.textContent='Please enter your name and a valid phone number.';return;}
  const btn=f.querySelector('button[type=submit]');btn.disabled=true;
  try{
    if(ENDPOINT)await fetch(ENDPOINT,{method:'POST',mode:'no-cors',body:JSON.stringify({...d,form:f.dataset.form,page:location.href})});
    dataLayer.push({event:'generate_lead',form:f.dataset.form});    location.href='thank-you.html';
  }catch(_){msg.textContent='Something went wrong. Please call +91 8087 8087 07.';btn.disabled=false;}
}));

// Scroll reveal (IntersectionObserver, transform + opacity only)
const targets=document.querySelectorAll('.intro .two>*,#amenities .wrap>*,.specs>div,#specifications h2,#gallery .wrap>p,#gallery h2,.grid figure,.two.rev>*,#nearby .wrap>*,.near>div,.decision .wrap>*,.step .wrap>*,.rera .wrap,.contact .wrap>*');
targets.forEach(el=>{el.classList.add('rv');el.style.setProperty('--i',[...el.parentNode.children].indexOf(el)%4);});
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{rootMargin:'0px 0px -8% 0px'});
  targets.forEach(el=>io.observe(el));
}else targets.forEach(el=>el.classList.add('in'));
