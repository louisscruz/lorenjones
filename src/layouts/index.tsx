import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import { ThemeProvider, DEFAULT_THEME } from "@zendeskgarden/react-theming"
import "@zendeskgarden/css-bedrock"

import Header from "../components/Header"
import Footer from "../components/Footer"

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`

const MainContainer = styled.main`
  flex: 1;
`

const Layout = React.memo(({ children }) => {
  const data = useStaticQuery(query)

  return (
    <ThemeProvider theme={DEFAULT_THEME}>
      <PageContainer>
        <Header siteTitle={data.site.siteMetadata.title} />
        <MainContainer>{children}</MainContainer>
        <Footer />
      </PageContainer>
    </ThemeProvider>
  )
})

export default Layout
