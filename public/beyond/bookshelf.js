/* Renders the shelf from window.BOOKSHELF (beyond/books.js): covers on shelf
   boards, five to a row (three on phones). The first time a row scrolls into
   view its books start stacked at the left end and slide out onto the shelf.
   Hover or focus shows a book's title and author. */

(() => {
  const mount = document.querySelector('[data-shelf]');
  const data = window.BOOKSHELF;
  if (!mount || !data || !data.books) return;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 700px)');
  let observer;

  function arrange(row) {
    row.dataset.state = 'arranging';
    requestAnimationFrame(() => requestAnimationFrame(() => { row.dataset.state = 'arranged'; }));
  }

  function render() {
    if (observer) observer.disconnect();
    const perRow = narrow.matches ? 3 : 5;
    mount.textContent = '';
    mount.style.setProperty('--per-row', perRow);
    for (let i = 0; i < data.books.length; i += perRow) {
      const row = document.createElement('div');
      row.className = 'book-shelf-row';
      row.dataset.state = reduce.matches ? 'arranged' : 'stacked';
      const slots = document.createElement('div');
      slots.className = 'book-shelf-slots';
      slots.setAttribute('role', 'list');
      data.books.slice(i, i + perRow).forEach((b, col) => {
        const slot = document.createElement('div');
        slot.className = 'book-shelf-slot';
        slot.setAttribute('role', 'listitem');
        slot.style.setProperty('--book-col', col);
        const label = b.author ? `${b.title}, by ${b.author}` : b.title;
        slot.innerHTML =
          `<article class="book-cover" tabindex="0" aria-label="${esc(label + (b.favourite ? ', one of my favourites' : ''))}">` +
          `<img src="${esc(b.cover)}" alt="" width="240" height="360" loading="lazy" decoding="async" draggable="false">` +
          `<div class="book-cover__info"><strong>${esc(b.title)}</strong>${b.author ? `<span>${esc(b.author)}</span>` : ''}${b.favourite ? '<em>Favourite</em>' : ''}</div>` +
          `</article>`;
        slots.append(slot);
      });
      const board = document.createElement('div');
      board.className = 'book-shelf-board';
      board.setAttribute('aria-hidden', 'true');
      row.append(slots, board);
      mount.append(row);
    }
    if (reduce.matches) return;
    observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        arrange(e.target);
        observer.unobserve(e.target);
      });
    }, { threshold: 0.3 });
    mount.querySelectorAll('.book-shelf-row').forEach((r) => observer.observe(r));
  }

  render();
  // re-flow when the row length changes (phone <-> wider)
  narrow.addEventListener('change', render);
})();
