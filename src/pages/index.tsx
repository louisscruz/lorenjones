import React from "react"
import styled from "styled-components"

import SEO from "../components/seo"
import LorenJonesSvg from "../images/loren-jones.svg"

const Container = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`

const StyledH1 = styled.h1`
  color: white;
  font-size: 68px;
  font-weight: 600;
  z-index: 1;
`
const StyledH2 = styled.h1`
  color: white;
  margin-top: 56px;
  line-height: 56px;
  font-size: 52px;
  font-weight: 600;
  z-index: 1;
`

const StyledBackgroundSvg = styled(LorenJonesSvg)`
  bottom: 0;
  position: fixed;
  z-index: 0;
`

const IndexPage = React.memo(() => (
  <>
    <SEO title="Home" />
    <StyledBackgroundSvg />
    <Container>
      <StyledH1>Loren Jones</StyledH1>
      <StyledH2>Composer</StyledH2>
    </Container>
  </>
))

export default IndexPage
