/* Case study template behaviour. Builds the parts that are the same on
   every case study from window.SITE (js/site.js) and the page's own sections:

   - mobile "← Back" link (the dock from js/site-nav.js links home)
   - side nav, from every <section data-nav="Label">
   - section labels (kickers), from data-nav unless the section has its own
   - previous / next links, from SITE.projects
   - footer, from SITE.footer
   - active-section highlighting in the side nav */

(() => {
  const SITE = window.SITE || { name: '', initials: '', home: '#', footer: { line: '', links: [] }, projects: [] };

  const el = (tag, props = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    });
    [].concat(children).forEach((c) => node.append(c));
    return node;
  };

  const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const main = document.querySelector('.cs-main');
    const hero = document.querySelector('.cs-hero');
    const sections = [...document.querySelectorAll('.cs-section[data-nav]')];

    const projects = SITE.projects || [];
    const index = projects.findIndex((p) => p.slug === body.dataset.project);
    const project = projects[index];
    const backHref = SITE.home + (project?.back || '');

    // Section ids and kickers
    sections.forEach((s) => {
      const label = s.dataset.nav;
      if (!s.id) s.id = slugify(label);
      if (!s.querySelector(':scope > .cs-kicker') && s.dataset.kicker !== 'none') {
        s.prepend(el('p', { class: 'cs-kicker', text: s.dataset.kicker || label }));
      }
    });

    // Side nav
    const links = sections.map((s) => el('a', { href: `#${s.id}`, class: 'cs-side__link', text: s.dataset.nav }));
    const back = el('a', { href: backHref, class: 'cs-side__back' }, [el('span', { 'aria-hidden': 'true', text: '←' }), ' Back']);
    body.prepend(el('nav', { class: 'cs-side', 'aria-label': 'Case study sections' }, [back, ...links]));

    // Mobile back link
    hero?.prepend(el('a', { href: backHref, class: 'cs-back-mobile', text: '← Back' }));

    // Previous / next
    if (main) {
      const allWork = { title: 'All work', href: SITE.home };
      const prev = projects[index - 1] || allWork;
      const next = index >= 0 ? projects[index + 1] : null;
      const item = (p, label, isNext) => el('a', { href: p.href, class: `cs-pager__item${isNext ? ' cs-pager__item--next' : ''}` }, [
        el('span', { class: 'cs-pager__label', text: label }),
        el('span', { class: 'cs-pager__title', text: p.title }),
      ]);
      const pager = el('nav', { class: 'cs-pager', 'aria-label': 'More projects' }, [item(prev, 'Previous page', false)]);
      if (next) pager.append(item(next, 'Next page', true));
      main.append(pager);
    }

    // Footer: the shared <site-footer> element (/site-footer.js)
    body.insertBefore(document.createElement('site-footer'), main?.nextSibling || null);

    // Active section: an IntersectionObserver watches a thin band 35% down the
    // viewport; the section crossing that band is the active one. At the very
    // bottom, the last section wins even if it's too short to reach the band.
    if (!sections.length) return;
    const setActive = (id) => links.forEach((a) => {
      const on = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    setActive(sections[0].id);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      }, { rootMargin: '-35% 0px -64% 0px', threshold: 0 });
      sections.forEach((s) => io.observe(s));
      const last = sections[sections.length - 1];
      const end = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) setActive(last.id);
      }, { threshold: 0 });
      const sentinel = el('div', { 'aria-hidden': 'true', style: 'height:1px' });
      (main || body).append(sentinel);
      end.observe(sentinel);
    }
  });
})();
