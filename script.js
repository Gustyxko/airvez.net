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
/* === Banner cookie per GA4 === */
(function(){
  var bar = document.getElementById('cookie-bar');
  if(!bar) return;

  // Se l’utente non ha ancora scelto, mostra il banner
  if(!localStorage.getItem('avz-consent')){
    bar.hidden = false;
  }

  function injectGA(id){
    // evita doppi insert
    if (window.__gaInjected) return; window.__gaInjected = true;
    var s1=document.createElement('script'); s1.async=true;
    s1.src='https://www.googletagmanager.com/gtag/js?id='+id;
    document.head.appendChild(s1);
    var s2=document.createElement('script');
    s2.innerHTML = "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}"+
                   "gtag('js', new Date()); gtag('config', '"+id+"');";
    document.head.appendChild(s2);
  }

  document.getElementById('cookie-accept')?.addEventListener('click', function(){
    localStorage.setItem('avz-consent','granted');
    bar.remove();
    injectGA('G-XXXXXXXXXX'); // 👈 sostituisci
  });

  document.getElementById('cookie-decline')?.addEventListener('click', function(){
    localStorage.setItem('avz-consent','denied');
    bar.remove();
  });
})();
