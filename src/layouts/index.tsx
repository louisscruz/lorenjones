import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import { ThemeProvider, DEFAULT_THEME } from "@zendeskgarden/react-theming"
import "@zendeskgarden/css-bedrock"

import { GlobalPlayerProvider } from "../components/GlobalAudioPlayer"
import Header from "../components/header"
import Footer from "../components/Footer"

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const query = graphql`
  query SiteTitleQuery {
    allGoogleSheetVersionRow {
      nodes {
        updatedAt
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`

const MainContainer = styled.main`
  align-items: center;
  background-color: #2c2830;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
`
const Layout = React.memo(({ children }) => {
  const {
    site: {
      siteMetadata: { title },
    },
    allGoogleSheetVersionRow: { nodes: versions },
  } = useStaticQuery(query)
  const { updatedAt } = versions[0]

  return (
    <GlobalPlayerProvider>
      <ThemeProvider theme={DEFAULT_THEME}>
        <meta name="revised" content={updatedAt} />
        <PageContainer>
          <Header siteTitle={title} />
          <MainContainer>{children}</MainContainer>
          <Footer />
        </PageContainer>
      </ThemeProvider>
    </GlobalPlayerProvider>
  )
})

export default Layout
