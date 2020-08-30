import React from "react"
import { Paragraph, XXL } from "@zendeskgarden/react-typography"

import SEO from "../components/seo"
import ContentContainer from "../components/ContentContainer"

const NotFoundPage = React.memo(() => (
  <ContentContainer>
    <SEO title="404: Not found" />
    <XXL>Not Found</XXL>
    <Paragraph>There's nothing to be seen here, fellow traveler.</Paragraph>
  </ContentContainer>
))

export default NotFoundPage
