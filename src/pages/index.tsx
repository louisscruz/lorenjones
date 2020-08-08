import React from "react"
import { Link } from "gatsby"

import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = React.memo(() => (
  <>
    <SEO title="Home" />
    <h1>Loren Jones</h1>
    <p>Composer and Instrumentalist</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
  </>
))

export default IndexPage
