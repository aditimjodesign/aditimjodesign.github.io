/* Interactive process timeline (<div data-process>). Each step's node is a
   button that opens its explanation; only one is open at a time. The dashed
   connectors turn solid for steps already passed, and Previous/Next buttons
   move through the steps. Arrow keys move between the nodes. */

(() => {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-process]').forEach((root) => {
      const steps = [...root.querySelectorAll('.proc__step')];
      const nodes = steps.map((s) => s.querySelector('.proc__node'));
      const count = root.querySelector('.proc__count');
      const prev = root.querySelector('[data-proc="prev"]');
      const next = root.querySelector('[data-proc="next"]');
      let current = 0;

      const show = (i, focus) => {
        current = Math.max(0, Math.min(steps.length - 1, i));
        steps.forEach((s, n) => {
          s.classList.toggle('is-active', n === current);
          s.classList.toggle('is-past', n < current);
          nodes[n].setAttribute('aria-expanded', String(n === current));
        });
        count.textContent = `Step ${current + 1} of ${steps.length}`;
        prev.disabled = current === 0;
        next.disabled = current === steps.length - 1;
        if (focus) nodes[current].focus();
      };

      nodes.forEach((node, i) => {
        node.addEventListener('click', () => show(i));
        node.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); show(i + 1, true); }
          if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1, true); }
        });
      });
      prev.addEventListener('click', () => show(current - 1));
      next.addEventListener('click', () => show(current + 1));
      show(0);
    });
  });
})();
