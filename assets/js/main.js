// Main JS for Aventro-like behavior: navbar, AOS init, smooth scroll, back-to-top
document.addEventListener('DOMContentLoaded', function(){
  // Navbar transparent -> solid on scroll
  const header = document.querySelector('.nav-container');
  const topOffset = 80;
  function onScroll(){
    if(window.scrollY > topOffset){
      header.classList.add('header-solid');
      header.classList.remove('header-transparent');
    } else {
      header.classList.add('header-transparent');
      header.classList.remove('header-solid');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll);

  // AOS init if present
  if(window.AOS){ AOS.init({duration:800, easing:'ease-in-out', once:true}); }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  // Back to top
  const back = document.createElement('button');
  back.className='back-to-top';
  back.innerHTML='↑';
  document.body.appendChild(back);
  window.addEventListener('scroll', ()=>{
    if(window.scrollY>400) back.style.display='block'; else back.style.display='none';
  });
  back.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

  // Mobile nav toggle (Bootstrap typically handles this, but ensure fallback)
  document.querySelectorAll('.navbar-toggler').forEach(btn=>btn.addEventListener('click', ()=>{
    const target = document.querySelector(btn.getAttribute('data-bs-target'));
    if(target) target.classList.toggle('show');
  }));
});