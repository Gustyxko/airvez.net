/* =================== UTILITÀ GLOBALI =================== */

/* Evidenzia la lingua attiva in base al path (/it, /en, /es) */
(function(){
  const current = (location.pathname.split('/')[1] || 'it').toLowerCase();
  document.querySelectorAll('.lang-switch a').forEach(a=>{
    if(a.dataset.lang === current){
      a.classList.add('is-active');
      a.setAttribute('aria-current','true');
    }
  });
})();

/* Effetto reveal (se in futuro userai class="reveal") */
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  if(!('IntersectionObserver' in window)){
    els.forEach(el=>el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  },{ rootMargin:'0px 0px -10% 0px' });
  els.forEach(el=>io.observe(el));
})();

/* =================== NAV MOBILE =================== */
(function(){
  const cb     = document.getElementById('nav-check');   // checkbox
  const nav    = document.getElementById('mainnav');     // ul
  const burger = document.querySelector('.nav-burger');  // label
  if(!cb || !nav || !burger) return;

  // ✅ sincronizza stato sul body (solo per eventuali stili) + aria-expanded
  const syncBodyClass = () => {
    document.body.classList.toggle('is-nav-open', cb.checked);
    burger.setAttribute('aria-expanded', cb.checked ? 'true' : 'false');
  };
  cb.addEventListener('change', syncBodyClass);
  syncBodyClass();

  // ✅ chiudi quando clicchi un link del menu
  nav.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{ cb.checked = false; syncBodyClass(); }, {passive:true});
  });

  // ✅ chiudi cliccando fuori
  document.addEventListener('click',(e)=>{
    if(!cb.checked) return;
    const inside = nav.contains(e.target) || burger.contains(e.target) || e.target === cb;
    if(!inside){ cb.checked = false; syncBodyClass(); }
  }, {passive:true});

  // ✅ chiudi con ESC
  document.addEventListener('keydown',(e)=>{
    if(e.key === 'Escape'){ cb.checked = false; syncBodyClass(); }
  });
})();

/* === Banner cookie per GA4 (persistente, fix desktop/mobile) === */
document.addEventListener('DOMContentLoaded', function(){
  const GA_ID = 'G-YM7R3Q6F85';              // 👈 il tuo ID
  const bar   = document.getElementById('cookie-bar');
  if(!bar) return;

  const consent = localStorage.getItem('avz-consent');

  // Mostra solo se l'utente non ha ancora scelto
  if(!consent){
    bar.hidden = false;
  }

  function injectGA(){
    if(window.__gaInjected) return;           // evita doppia iniezione
    window.__gaInjected = true;

    // script gtag.js
    const s1 = document.createElement('script');
    s1.async = true;
    s1.src   = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s1);

    // init GA
    const s2 = document.createElement('script');
    s2.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    `;
    document.head.appendChild(s2);
  }

  // Se in passato ha accettato, inietta GA subito
  if(consent === 'granted'){ injectGA(); }

  // Click handlers (usiamo capture per battere eventuali overlay)
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  acceptBtn && acceptBtn.addEventListener('click', function(ev){
    ev.stopPropagation();
    localStorage.setItem('avz-consent','granted');
    bar.remove();
    injectGA();
  }, true);

  declineBtn && declineBtn.addEventListener('click', function(ev){
    ev.stopPropagation();
    localStorage.setItem('avz-consent','denied');
    bar.remove();
  }, true);

  // Protezione extra: se QUALCOSA copre la barra, forziamo i click a non propagare
  bar.addEventListener('click', function(ev){
    ev.stopPropagation();
  }, true);
});


/* === Tracciamento click CTA / link importanti === */
(function(){
  // esegui solo se GA è presente
  function hasGA(){ return typeof gtag === 'function'; }

  // Mappa rapida: selettore -> evento
  var map = [
    {sel: 'a[href*="calendly.com"]',          name: 'click_calendly'},
    {sel: 'a[href*="/it/prenota.html"]',      name: 'click_prenota'},
    {sel: 'a[href*="/it/contatti.html"]',     name: 'click_contatti'},
    {sel: 'a[href*="/it/supporta.html"]',     name: 'click_supporta'},
    {sel: 'a[href^="mailto:"]',               name: 'click_email'},
    {sel: 'a[href^="https://wa.me/"]',        name: 'click_whatsapp'},
    {sel: 'a[href*="paypal.com"]',            name: 'click_paypal'},
    {sel: 'a[href*="revolut.me"]',            name: 'click_revolut'}
  ];

  map.forEach(function(item){
    document.querySelectorAll(item.sel).forEach(function(a){
      a.addEventListener('click', function(){
        if(!hasGA()) return;
        gtag('event', item.name, {
          event_category: 'engagement',
          event_label: a.href
        });
      }, {passive:true});
    });
  });
})();
