/// <reference types="vite/client" />

import "react"

// <site-footer> is a custom element defined in public/site-footer.js
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "site-footer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}
