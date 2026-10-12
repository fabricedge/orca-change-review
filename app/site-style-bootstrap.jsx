import React from 'react'

export function SiteStyleBootstrap() {
  return (
    <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('orca-review:site-style:v1')==='readme')document.documentElement.dataset.siteStyle='readme'}catch{}` }} />
  )
}
