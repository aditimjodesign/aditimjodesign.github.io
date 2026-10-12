/* Click-to-zoom for case-study figures.

   - fills each <img data-fig="key"> alt text from window.FIGURES (js/figures.js)
   - wraps every figure image in a <button>, and gives the HTML-built mockups
     an "Enlarge" button, so every figure can be opened from the keyboard
   - one native <dialog>: Esc or a click outside closes it, left/right arrows
     move between figures on the page, and focus goes back to the figure
     that opened it */

(() => {
  const FIG = window.FIGURES || {};

  const ICON_EXPAND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>';
  const ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  const ICON_PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>';
  const ICON_NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';

  const button = (cls, label, html) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.setAttribute('aria-label', label);
    if (html) b.innerHTML = html;
    return b;
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Alt text comes from the content file
    document.querySelectorAll('img[data-fig]').forEach((img) => {
      img.alt = (FIG[img.dataset.fig] && FIG[img.dataset.fig].alt) || '';
    });

    const items = [];

    // Screens: the image itself becomes the button
    document.querySelectorAll('.cs-main figure img[data-fig], .cs-main .cs-feature img[data-fig]').forEach((img) => {
      if (img.closest('.cs-cover')) return;
      const label = img.alt || 'figure';
      const trigger = button('cs-zoom', `Enlarge image: ${label}`);
      img.replaceWith(trigger);
      trigger.append(img);
      items.push({
        trigger,
        label,
        caption: img.closest('figure')?.querySelector('figcaption')?.textContent || '',
        make: () => {
          const big = new Image();
          big.src = img.getAttribute('src');
          big.alt = img.alt;
          big.width = img.width;
          big.height = img.height;
          return big;
        },
      });
    });

    // The cover device image can be enlarged too
    document.querySelectorAll('.cs-cover img[data-fig]').forEach((img) => {
      const label = img.alt || 'cover image';
      const fig = img.closest('figure');
      const trigger = button('cs-zoom-btn', `Enlarge image: ${label}`, ICON_EXPAND);
      fig.append(trigger);
      items.push({ trigger, label, caption: '', make: () => { const b = new Image(); b.src = img.getAttribute('src'); b.alt = img.alt; b.width = img.width; b.height = img.height; return b; } });
    });

    // HTML-built mockups: an Enlarge button, and a cloned copy in the dialog
    document.querySelectorAll('.cs-main figure.cs-media').forEach((fig) => {
      if (fig.querySelector('img') || fig.closest('.cs-cover') || fig.hasAttribute('data-no-zoom')) return;
      const caption = fig.querySelector('figcaption')?.textContent || '';
      const label = (fig.querySelector('[role="img"]')?.getAttribute('aria-label')) || caption || 'diagram';
      const trigger = button('cs-zoom-btn', `Enlarge diagram: ${label}`, ICON_EXPAND);
      fig.append(trigger);
      items.push({
        trigger,
        label,
        caption,
        make: () => {
          const wrap = document.createElement('div');
          wrap.className = 'cs-lb__mock';
          [...fig.children].forEach((c) => {
            if (c === trigger || c.tagName === 'FIGCAPTION') return;
            const copy = c.cloneNode(true);
            copy.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
            copy.querySelectorAll('button, a').forEach((n) => n.setAttribute('tabindex', '-1'));
            wrap.append(copy);
          });
          wrap.setAttribute('aria-hidden', 'true');
          return wrap;
        },
      });
    });

    // Keep DOM order so the arrows follow the page
    items.sort((a, b) => (a.trigger.compareDocumentPosition(b.trigger) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    if (!items.length) return;

    const dialog = document.createElement('dialog');
    dialog.className = 'cs-lb';
    dialog.setAttribute('aria-label', 'Enlarged figure');
    dialog.innerHTML = `
      <div class="cs-lb__inner">
        <figure class="cs-lb__fig">
          <div class="cs-lb__stage"></div>
          <figcaption class="cs-lb__caption"></figcaption>
        </figure>
      </div>`;
    const inner = dialog.querySelector('.cs-lb__inner');
    const stage = dialog.querySelector('.cs-lb__stage');
    const captionEl = dialog.querySelector('.cs-lb__caption');
    const count = document.createElement('p');
    count.className = 'cs-lb__count';
    count.setAttribute('aria-live', 'polite');
    const close = button('cs-lb__btn cs-lb__close', 'Close', ICON_CLOSE);
    const prev = button('cs-lb__btn cs-lb__prev', 'Previous figure', ICON_PREV);
    const next = button('cs-lb__btn cs-lb__next', 'Next figure', ICON_NEXT);
    inner.append(count, close, prev, next);
    document.body.append(dialog);

    let index = 0;
    let opener = null;

    const fit = () => {
      const img = stage.querySelector('img');
      if (!img || !img.naturalWidth) return;
      const ratio = img.naturalWidth / img.naturalHeight;
      // up to twice natural size, inside the viewport
      const w = Math.min(img.naturalWidth * 2, window.innerWidth * 0.92, window.innerHeight * 0.78 * ratio);
      img.style.width = `${Math.round(w)}px`;
    };

    const show = (i) => {
      index = (i + items.length) % items.length;
      const item = items[index];
      stage.replaceChildren(item.make());
      captionEl.textContent = item.caption || item.label;
      count.textContent = `${index + 1} of ${items.length}`;
      const img = stage.querySelector('img');
      if (img) { img.addEventListener('load', fit, { once: true }); fit(); }
    };

    const open = (i) => {
      opener = items[i].trigger;
      show(i);
      document.documentElement.style.overflow = 'hidden';
      dialog.showModal();
      close.focus();
    };

    items.forEach((item, i) => item.trigger.addEventListener('click', () => open(i)));

    close.addEventListener('click', () => dialog.close());
    prev.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    // a click on the empty area around the figure is a click on the dialog itself
    dialog.addEventListener('click', (e) => { if (e.target === dialog || e.target === inner) dialog.close(); });
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    });
    dialog.addEventListener('close', () => {
      document.documentElement.style.overflow = '';
      stage.replaceChildren();
      if (opener) opener.focus();
    });
    window.addEventListener('resize', () => { if (dialog.open) fit(); });
  });
})();
