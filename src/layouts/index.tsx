import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "../components/Header"

const Layout = React.memo(({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div>
      <Header siteTitle={data.site.siteMetadata.title} />
      {children}
    </div>
  )
})

export default Layout
