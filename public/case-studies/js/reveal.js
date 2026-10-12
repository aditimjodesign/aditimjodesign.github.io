/* Case study entrance motion. css/reveal.css hides the targets from first
   paint; this script only staggers them and adds .is-in to show them.

   On load: the dock and side nav drop in, then the hero's pieces fade up
   one after another, 0.1s apart. The cover's rows rise in turn and its badges
   pop in last.
   On scroll: each section's blocks fade up as they enter the viewport, with a
   short stagger when several arrive together.

   Load after js/case-study.js so the nav and back links it builds exist. */

(() => {
  const root = document.documentElement;
  if (!root.classList.contains('cs-reveal')) return;
  window.__csReveal = true;

  const delay = (node, seconds) => {
    node.style.setProperty('--reveal-delay', `${seconds}s`);
    return node;
  };
  const show = (nodes) => requestAnimationFrame(() => requestAnimationFrame(() => {
    nodes.forEach((n) => n.classList.add('is-in'));
  }));

  document.addEventListener('DOMContentLoaded', () => {
    const onLoad = [];

    // Nav
    document.querySelectorAll('.cs-dock-bar, .site-logo, .cs-side').forEach((n) => onLoad.push(n));

    // Hero, one piece at a time
    const hero = document.querySelector('.cs-hero');
    if (hero) {
      [...hero.children].forEach((child, i) => onLoad.push(delay(child, i * 0.1)));

      // Inside the cover: rows rise after the cover itself, badges pop last
      const cover = hero.querySelector('.cs-cover');
      if (cover) {
        const coverDelay = [...hero.children].indexOf(cover) * 0.1;
        cover.querySelectorAll('.ui-row').forEach((row, i) => onLoad.push(delay(row, coverDelay + 0.35 + i * 0.08)));
        cover.querySelectorAll('.badge').forEach((badge, i) => onLoad.push(delay(badge, coverDelay + 0.6 + i * 0.08)));
      }
    }
    show(onLoad);

    // Everything after the hero reveals on scroll
    const blocks = [
      ...document.querySelectorAll('.cs-section > *'),
      ...document.querySelectorAll('.cs-pager, .cs-footer'),
    ];
    const io = new IntersectionObserver((entries) => {
      const arriving = entries.filter((e) => e.isIntersecting).map((e) => e.target);
      arriving.forEach((node, i) => {
        delay(node, Math.min(i, 5) * 0.08);
        node.classList.add('is-in');
        io.unobserve(node);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    blocks.forEach((b) => io.observe(b));
  });
})();
