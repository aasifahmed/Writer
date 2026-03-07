  // ── Navigation ──
  function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(a =>
      a.classList.toggle('active', a.dataset.page === page)
    );
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(initReveal, 60);
    return false;
  }

  // ── Mobile menu ──
  function toggleMenu() {
    const btn = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  }
  function closeMenu() {
    document.getElementById('hamburger').classList.remove('open');
    document.getElementById('mobileMenu').classList.remove('open');
  }

  // ── Books filter ──
  function filterBooks(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.bk-card').forEach(card => {
      const show = cat === 'all' || card.dataset.cat === cat;
      card.style.display = show ? 'block' : 'none';
      if (show) {
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 30);
      }
    });
  }

  // ── Contact form ──
  function handleSubmit(e) {
    e.preventDefault();
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('successBanner').style.display = 'block';
  }

  // ── Scroll Reveal ──
  function initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal, .bk-card, .tl-item').forEach(el => obs.observe(el));
  }
  initReveal();

  // Prevent default on hash links
  document.querySelectorAll('a[href="#"]').forEach(a =>
    a.addEventListener('click', e => e.preventDefault())
  );