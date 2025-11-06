/* Evidenzia la lingua corrente */
(function(){
  try{
    const path = location.pathname; // es: /it/index.html
    const current = path.split('/')[1] || 'it'; // it | en | es (default it)
    document.querySelectorAll('.lang-switch a').forEach(a=>{
      const lang = a.dataset.lang;
      if(lang === current){ a.classList.add('is-active'); a.setAttribute('aria-current','true'); }
    });
  }catch(e){}
})();

/* Effetto reveal on scroll */
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
  },{ rootMargin: '0px 0px -10% 0px' });
  els.forEach(el=>io.observe(el));
})();
