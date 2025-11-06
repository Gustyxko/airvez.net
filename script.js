/* === Evidenzia lingua attiva === */
(function(){
  try{
    const current = (location.pathname.split('/')[1] || 'it').toLowerCase(); // it | en | es
    document.querySelectorAll('.lang-switch a').forEach(a=>{
      if(a.dataset.lang === current){ a.classList.add('is-active'); a.setAttribute('aria-current','true'); }
    });
  }catch(e){}
})();

/* === Reveal on scroll === */
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window) || !els.length){
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

/* === Menu mobile: chiudi dopo click / fuori / ESC === */
(function(){
  const cb  = document.getElementById('nav-check');
  const nav = document.getElementById('mainnav');
  const burger = document.querySelector('.nav-burger');
  if(!cb || !nav || !burger) return;

  // chiudi quando clicchi un link del menu
  nav.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{ cb.checked = false; }, {passive:true});
  });

  // chiudi cliccando fuori dal menu
  document.addEventListener('click', (e)=>{
    if(!cb.checked) return;
    const inside = nav.contains(e.target) || burger.contains(e.target) || e.target === cb;
    if(!inside) cb.checked = false;
  }, {passive:true});

  // chiudi con ESC (desktop)
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') cb.checked = false;
  });
})();
