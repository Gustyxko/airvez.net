/* =================== UTILITÀ GLOBALI =================== */

/* ✅ Evidenzia la lingua attiva in base al path (/it, /en, /es) */
(function(){
  const current = (location.pathname.split('/')[1] || 'it').toLowerCase();
  document.querySelectorAll('.lang-switch a').forEach(a=>{
    if(a.dataset.lang === current){
      a.classList.add('is-active');
      a.setAttribute('aria-current','true');
    }
  });
})();

/* ✅ Effetto reveal (se in futuro userai class="reveal") */
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

/* =================== NAV MOBILE (burger + chiudi automatico) =================== */
(function(){
  const cb     = document.getElementById('nav-check');   // checkbox
  const nav    = document.getElementById('mainnav');     // ul
  const burger = document.querySelector('.nav-burger');  // label
  if(!cb || !nav || !burger) return;

  const syncBodyClass = () => {
    document.body.classList.toggle('is-nav-open', cb.checked);
    burger.setAttribute('aria-expanded', cb.checked ? 'true' : 'false');
  };
  cb.addEventListener('change', syncBodyClass);
  syncBodyClass();

  nav.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{ cb.checked = false; syncBodyClass(); }, {passive:true});
  });

  document.addEventListener('click',(e)=>{
    if(!cb.checked) return;
    const inside = nav.contains(e.target) || burger.contains(e.target) || e.target === cb;
    if(!inside){ cb.checked = false; syncBodyClass(); }
  }, {passive:true});

  document.addEventListener('keydown',(e)=>{
    if(e.key === 'Escape'){ cb.checked = false; syncBodyClass(); }
  });
})();

/* =================== COOKIE BAR + GA4 (persistente, GDPR) =================== */
(function(){
  const GA_ID = 'G-YM7R3Q6F85';              // 👈 tu ID GA4
  const bar   = document.getElementById('cookie-bar');
  if(!bar) return;

  // lee elección previa
  const consent = localStorage.getItem('avz-consent');

  // muestra sólo si no hay elección previa
  if(!consent){
    bar.hidden = false;
  }

  function injectGA(){
    if(window.__gaInjected) return;           // evita doble inyección
    window.__gaInjected = true;

    const s1 = document.createElement('script');
    s1.async = true;
    s1.src   = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s1);

    const s2 = document.createElement('script');
    s2.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    `;
    document.head.appendChild(s2);
  }

  // si ya aceptó anteriormente, inyecta GA de inmediato
  if(consent === 'granted'){ injectGA(); }

  // 🔒 Delegación de eventos (click/pointer/touch) sobre la barra
  function handleChoice(action){
    if(action === 'accept'){
      localStorage.setItem('avz-consent','granted');
      injectGA();
    }else{
      localStorage.setItem('avz-consent','denied');
    }
    bar.remove(); // cierra siempre
  }

  const delegated = (ev) => {
    const t = ev.target.closest('[data-consent]');
    if(!t) return;
    ev.preventDefault();
    ev.stopPropagation();
    const action = t.getAttribute('data-consent'); // 'accept' | 'decline'
    handleChoice(action);
  };

  // Soporte amplio para móviles (tap/click)
  bar.addEventListener('pointerup', delegated, {passive:false, capture:true});
  bar.addEventListener('click',     delegated, {passive:false, capture:true});
  bar.addEventListener('touchend',  delegated, {passive:false, capture:true});

  // evita que clics en la barra se propaguen a overlays de fondo
  bar.addEventListener('click', function(ev){ ev.stopPropagation(); }, true);
})();

/* =================== TRACCIAMENTO CLICK (CTA / link importanti) =================== */
(function(){
  function hasGA(){ return typeof gtag === 'function'; }
  const map = [
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
      }, {passive:true, capture:true});
    });
  });
})();

