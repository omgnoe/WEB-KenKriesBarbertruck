// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflow = '';
      }, 800);
    }
  });
  
  // Prevent scrolling during preloader
  document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('loaded')) {
      document.body.style.overflow = 'hidden';
    }
  });
  
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  
    document.querySelectorAll('.nav-links a').forEach(a=>{
      a.addEventListener('click', ()=>{
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  // Smooth scroll with header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const href = this.getAttribute('href'); if (!href || href === '#') return;
      const target = document.querySelector(href); if (!target) return;
      e.preventDefault();
      const headerOffset = 80;
      const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    });
  });
  
  // Reveal on scroll (Album ausnehmen, damit Bilder mobil sofort sichtbar sind)
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.opacity='1';
        entry.target.style.transform='translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:0.1, rootMargin:'0px 0px -100px 0px'});
  
  // NICHT auf #album anwenden
  document.querySelectorAll('.service-card, .location-card, .video-item, section:not(.album)').forEach(el=>{
    el.style.opacity='0'; el.style.transform='translateY(24px)';
    el.style.transition='opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });
  
  // Counters
  (function(){
    const counters = document.querySelectorAll('.stat h3');
    counters.forEach(counter=>{
      const raw = counter.innerText.replace('+','');
      const value = parseInt(raw,10);
      if(isNaN(value)) return;
      let current = 0; const duration = 1600; const inc = value/(duration/16);
      const tick = ()=>{
        current += inc;
        if(current < value){ counter.innerText = Math.floor(current) + '+'; requestAnimationFrame(tick); }
        else counter.innerText = raw;
      };
      const io = new IntersectionObserver((es)=>{
        es.forEach(e=>{ if(e.isIntersecting){ tick(); io.unobserve(counter); } });
      },{threshold:0.6});
      io.observe(counter);
    });
  })();
  
  // Tabs (Services)
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      tabButtons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
      const key = btn.dataset.tab;
      const panel = document.getElementById(`tab-${key}`);
      if (panel) panel.classList.add('active');
    });
  });
  
  // Video: poster -> iframe (nocookie)
  function loadIframeFor(item){
    const vid = item.dataset.yt;
    const title = item.dataset.title || 'Video';
    if(!vid) return;
    const iframe = document.createElement('iframe');
    iframe.setAttribute('title', title);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.src = `https://www.youtube-nocookie.com/embed/${vid}?rel=0&modestbranding=1&autoplay=1`;
    iframe.style.width = '100%';
    iframe.style.height = '315px';
    item.innerHTML = '';
    item.appendChild(iframe);
  }
  document.querySelectorAll('.video-item .video-poster').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const item = btn.closest('.video-item');
      loadIframeFor(item);
    });
  });
  
  // SimplyBook Widgets — helles Theme auf weißer Karte
  window.addEventListener('load', () => {
    new SimplybookWidget({
      "widget_type": "iframe",
      "url": "https://kkbt.simplybook.it",
      "theme": "default",
      "theme_settings": {
        "sb_base_color": "#000000",
        "btn_color_1": "#000000",
        "booking_nav_bg_color": "#ffffff",
        "body_bg_color": "#ffffff",
        "dark_font_color": "#000000",
        "light_font_color": "#ffffff",
        "timeline_hide_unavailable": "1",
        "hide_past_days": "0",
        "timeline_show_end_time": "0",
        "timeline_modern_display": "as_slots",
        "display_item_mode": "block",
        "sb_company_label_color": "#000000",
        "hide_img_mode": "0",
        "show_sidebar": "1",
        "sb_busy": "#cccccc",
        "sb_available": "#000000"
      },
      "timeline": "modern",
      "datepicker": "top_calendar",
      "container_id": "booking-widget"
    });
  
    new SimplybookWidget({
      "widget_type": "reviews",
      "url": "https://kkbt.simplybook.it",
      "theme": "default",
      "theme_settings": {
        "sb_base_color": "#000000",
        "btn_color_1": "#000000",
        "booking_nav_bg_color": "#ffffff",
        "body_bg_color": "#ffffff",
        "dark_font_color": "#000000",
        "light_font_color": "#ffffff"
      },
      "container_id": "reviews-widget"
    });
  });
  
  // Cookie Banner
  (function(){
    const KEY = 'cookieConsent';
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
  
    const accepted = localStorage.getItem(KEY);
    if (!accepted) { banner.hidden = false; }
  
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
  
    function close(save){
      if (save) localStorage.setItem(KEY, 'true');
      banner.hidden = true;
    }
    acceptBtn?.addEventListener('click', ()=>close(true));
    declineBtn?.addEventListener('click', ()=>close(false));
  })();