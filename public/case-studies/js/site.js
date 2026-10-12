/* Site-wide settings shared by every case study.
   Add a project here once its page exists, and the side nav,
   previous/next links and footer update on every page. */

window.SITE = {
  name: 'Aditi Manish Joshi',
  initials: 'AJ',

  // Where "Back" and the home mark go: the portfolio homepage.
  home: '/',

  // Order here = order of the previous/next links.
  // slug     must match <body data-project="…"> on the page
  // href     the case study page
  // back     optional anchor on the homepage to return to
  projects: [
    {
      slug: 'ai-coding-agent',
      title: 'Enterprise AI Coding Agent',
      href: 'ai-coding-agent.html',
      back: '#work',
    },
    {
      slug: 'fintech-platform',
      title: 'Scaling an Enterprise Banking Platform',
      href: 'fintech-platform.html',
      back: '#work',
    },
    {
      slug: 'transit-passes',
      title: 'Bulk Travel Passes for Organisations',
      href: 'transit-passes.html',
      back: '#work',
    },
  ],
};
