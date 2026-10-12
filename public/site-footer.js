/* One footer for every page: <site-footer></site-footer>.
   The homepage (React) and every static page use this element, so the
   contact links, status, note and legal links live in one place. Styles are
   in /site-footer.css, loaded from here. */

(() => {
  const FOOTER = {
    email: 'aditimjo@gmail.com',
    linkedin: 'https://www.linkedin.com/in/aditimjo/',
    status: 'Dublin, IE · Available now',
    note: 'Learn, ideate, design, test, and repeat.',
    author: 'Aditi Manish Joshi',
  };

  const MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>';
  const IN = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';

  if (!document.querySelector('link[data-site-footer]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/site-footer.css';
    css.dataset.siteFooter = '';
    document.head.append(css);
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      if (this.firstElementChild) return;
      this.innerHTML = `
        <footer class="site-footer">
          <p class="site-footer__links">
            <a class="site-footer__icon" href="mailto:${FOOTER.email}" aria-label="Email ${FOOTER.email}" title="Email ${FOOTER.email}">${MAIL}</a>
            <a class="site-footer__icon" href="${FOOTER.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn profile (opens in a new tab)" title="LinkedIn profile">${IN}</a>
          </p>
          <p class="site-footer__status">${FOOTER.status}</p>
          <p class="site-footer__note">${FOOTER.note}</p>
          <p class="site-footer__legal">
            <span>© ${new Date().getFullYear()} Developed by ${FOOTER.author}</span>
            <span aria-hidden="true">·</span>
            <a href="/privacy.html">Privacy</a>
            <span aria-hidden="true">·</span>
            <a href="/terms.html">Terms</a>
          </p>
        </footer>`;
    }
  }

  if (!customElements.get('site-footer')) customElements.define('site-footer', SiteFooter);
})();
