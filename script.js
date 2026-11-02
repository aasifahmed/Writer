(function () {
  'use strict';
  var DEFAULT_AGE = 'Ages 5–17';
  var DEFAULT_DESC = 'A new illustrated adventure by Sam Oliver. Tap the button below to see it on Amazon.';

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-header .nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      toggle.setAttribute('aria-expanded', nav.classList.toggle('open'));
    });
  }

  // Popup (built once, reused for every book)
  var modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="book-title">' +
    '<button class="modal-close" aria-label="Close">&times;</button>' +
    '<img alt="">' +
    '<div class="modal-info"><span class="age"></span><h2 id="book-title"></h2><p class="desc"></p>' +
    '<a class="btn btn-berry" target="_blank" rel="noopener noreferrer">Buy on Amazon</a></div></div>';
  document.body.appendChild(modal);

  var q = function (s) { return modal.querySelector(s); };
  var closeBtn = q('.modal-close'), buyBtn = q('.btn'), opener = null;

  function openBook(b, trigger) {
    opener = trigger;
    q('img').src = 'gallery/' + b.img;
    q('img').alt = b.title + ' book cover';
    q('.age').textContent = b.age;
    q('h2').textContent = b.title;
    q('.desc').textContent = b.desc;
    buyBtn.href = 'https://www.amazon.com/dp/' + b.asin;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeBook() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (opener) opener.focus();
  }

  closeBtn.addEventListener('click', closeBook);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeBook(); });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeBook();
    if (e.key === 'Tab') { // keep focus inside the popup
      var first = closeBtn, last = buyBtn;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Book cards: <div class="grid" data-books="1" data-limit="4"></div>
  document.querySelectorAll('[data-books]').forEach(function (grid) {
    var list = (window.BOOKS_PAGES || {})[grid.dataset.books] || [];
    if (!list.length) {
      grid.innerHTML = '<p class="empty">More books are on the way. Check back soon!</p>';
      return;
    }
    list.slice(0, +grid.dataset.limit || list.length).forEach(function (row) {
      var book = { title: row[0], img: row[1], asin: row[2], age: row[3] || DEFAULT_AGE, desc: row[4] || DEFAULT_DESC };
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'card';
      card.setAttribute('aria-label', 'About ' + book.title);
      var img = document.createElement('img');
      img.src = 'gallery/' + book.img;
      img.alt = book.title + ' book cover';
      img.loading = 'lazy';
      var name = document.createElement('span');
      name.className = 'card-title';
      name.textContent = book.title;
      card.append(img, name);
      card.addEventListener('click', function () { openBook(book, card); });
      grid.appendChild(card);
    });
  });

  // Contact form: posts to data-endpoint if set, otherwise opens the visitor's email app
  var form = document.getElementById('contact-form');
  if (form) {
    var note = document.getElementById('form-note');
    var say = function (msg) { note.textContent = msg; note.classList.add('show'); };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var endpoint = form.dataset.endpoint;
      if (endpoint) {
        fetch(endpoint, { method: 'POST', body: d, headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error();
            form.reset();
            say('Thank you, your message has been received.');
          })
          .catch(function () { say('Something went wrong. Please try again or email Sam directly.'); });
      } else {
        var body = d.get('message') + '\n\nFrom: ' + d.get('first') + ' ' + d.get('last') + ' (' + d.get('email') + ')';
        window.location.href = 'mailto:' + form.dataset.email +
          '?subject=' + encodeURIComponent(d.get('subject')) + '&body=' + encodeURIComponent(body);
        say('Opening your email app to send the message…');
      }
    });
  }
})();
