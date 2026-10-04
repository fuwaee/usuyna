gsap.registerPlugin(ScrollTrigger);
let lenis=null;if(window.Lenis){lenis=new Lenis({duration:1.15,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
const nav=document.querySelector('.main-nav');const burger=document.querySelector('.menu-toggle');
const setMenu=o=>{nav?.classList.toggle('open',o);burger?.classList.toggle('is-active',o);burger?.setAttribute('aria-expanded',String(o));};
burger?.addEventListener('click',e=>{e.stopPropagation();setMenu(!nav?.classList.contains('open'));});
const closeDrops=(ex=null)=>{document.querySelectorAll('.has-dropdown').forEach(i=>{if(i!==ex){i.classList.remove('is-open');i.querySelector('.nav-trigger')?.setAttribute('aria-expanded','false');}});};
document.querySelectorAll('.has-dropdown').forEach(it=>{const tr=it.querySelector('.nav-trigger');tr?.setAttribute('aria-expanded','false');tr?.addEventListener('click',e=>{e.stopPropagation();const willOpen=!it.classList.contains('is-open');closeDrops(it);it.classList.toggle('is-open',willOpen);tr.setAttribute('aria-expanded',String(willOpen));});it.querySelectorAll('.nav-dropdown a').forEach(a=>a.addEventListener('click',()=>closeDrops()));});
document.addEventListener('click',e=>{if(!(e.target instanceof Element)||!e.target.closest('.main-nav'))closeDrops();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrops();});
document.querySelectorAll('[data-split-words]').forEach(h=>{const ws=h.textContent.trim().split(/\s+/);h.innerHTML=ws.map(w=>`<span class="w"><span>${w}</span></span>`).join(' ');gsap.fromTo(h.querySelectorAll('.w > span'),{yPercent:115},{yPercent:0,duration:1,ease:'power4.out',stagger:.08,delay:.2});});
gsap.utils.toArray('[data-reveal-left]').forEach(el=>gsap.fromTo(el,{x:-46,opacity:0},{x:0,opacity:1,duration:.95,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 87%'}}));
gsap.utils.toArray('[data-reveal-right]').forEach((el,i)=>gsap.fromTo(el,{x:46,opacity:0},{x:0,opacity:1,duration:.95,delay:(i%3)*.07,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 87%'}}));
gsap.utils.toArray('[data-parallax]').forEach(el=>gsap.to(el,{yPercent:parseFloat(el.dataset.parallax||10),ease:'none',scrollTrigger:{trigger:el.closest('section')||el,scrub:1,start:'top bottom',end:'bottom top'}}));
const steps=[...document.querySelectorAll('.method-step')],bar=document.querySelector('.method-bar');
steps.forEach(s=>ScrollTrigger.create({trigger:s,start:'top center',end:'bottom center',onToggle(self){if(self.isActive){steps.forEach(x=>x.classList.remove('is-active'));s.classList.add('is-active');}}}));
if(bar)gsap.to(bar,{width:'100%',ease:'none',scrollTrigger:{trigger:'.method-right',start:'top 70%',end:'bottom 50%',scrub:.6}});
document.querySelectorAll('.magnetic').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.16,y:(e.clientY-r.top-r.height/2)*.16,duration:.35});});b.addEventListener('mouseleave',()=>gsap.to(b,{x:0,y:0,duration:.55,ease:'elastic.out(1,.5)'}));});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length>1){e.preventDefault();const t=document.querySelector(id);if(t)lenis?lenis.scrollTo(t,{offset:-headerOffset()}):t.scrollIntoView({behavior:'smooth'});setMenu(false);}}));
// Sinusoïde du hero : onde plate et stable + étoiles qui défilent (avancée infinie)
(() => {
  const canvases = [...document.querySelectorAll('canvas.sine-hero')];
  if (!canvases.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const states = canvases.map(cv => {
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    const stars = Array.from({ length: 42 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.4,
      v: Math.random() * 0.5 + 0.15,
      a: Math.random() * 0.5 + 0.25
    }));
    return { cv, ctx, W, H, stars, phase: Math.random() * Math.PI * 2 };
  });
  const draw = (st, t) => {
    const { ctx, W, H, stars } = st;
    const midY = H / 2, amp = H * 0.09, lambda = W * 0.5;
    ctx.clearRect(0, 0, W, H);
    // étoiles : dérive vers la gauche, recyclage à droite
    for (const s of stars) {
      s.x -= s.v;
      if (s.x < -2) { s.x = W + 2; s.y = Math.random() * H; }
      ctx.globalAlpha = s.a;
      ctx.fillStyle = '#d6f5ff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // sinusoïde plate et stable, phase qui avance => impression d'avancée
    ctx.strokeStyle = '#a5ddf5';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(165,221,245,.8)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 2) {
      const y = midY + amp * Math.sin((x / lambda) * Math.PI * 2 + st.phase);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    // point lumineux qui voyage sur l'onde
    const px = ((t * 0.045) % (W + 20)) - 10;
    const py = midY + amp * Math.sin((px / lambda) * Math.PI * 2 + st.phase);
    ctx.fillStyle = '#eef8ff';
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
  };
  if (reduced) { states.forEach(st => draw(st, 0)); return; }
  const loop = t => {
    for (const st of states) { st.phase += 0.035; draw(st, t); }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();

// --- Retour sur la page depuis un outil (lien retour, bouton retour, bfcache) ---
// Lenis peut garder une position interne périmée, ou le navigateur restaurer un scroll
// partiel : on resynchronise sur la position réelle pour que le header sticky reste bien
// plaqué en haut (et qu'une ancre comme #tools ne soit pas cachée derrière lui).
const headerOffset=()=>Math.round((document.querySelector('.site-header')?.getBoundingClientRect().height||100)+8);
const syncScrollState=()=>{const y=window.scrollY||window.pageYOffset||0;if(lenis)lenis.scrollTo(y,{immediate:true});ScrollTrigger.refresh();};
const scrollToHash=()=>{const h=location.hash;if(!/^#[A-Za-z][\w-]*$/.test(h))return;const t=document.querySelector(h);if(!t)return;lenis?lenis.scrollTo(t,{offset:-headerOffset(),immediate:true}):t.scrollIntoView();};
window.addEventListener('load',()=>{scrollToHash();syncScrollState();});
window.addEventListener('pageshow',e=>{if(e.persisted){scrollToHash();syncScrollState();}});

