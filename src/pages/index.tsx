import React from "react"

import BackgroundImage from "../components/BackgroundImage"
import SEO from "../components/seo"

const IndexPage = React.memo(() => (
  <>
    <SEO title="Home" />
    <BackgroundImage />
  </>
))

export default IndexPage
