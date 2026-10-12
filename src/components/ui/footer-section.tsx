// The footer is one shared custom element (public/site-footer.js), the same
// one every static page uses, so the homepage and the inner pages never drift.
function Footerdemo() {
  return <site-footer />
}

export { Footerdemo }
