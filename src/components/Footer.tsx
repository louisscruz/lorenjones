import React from "react"
import styled from "styled-components"

import GlobalAudioPlayer from "./GlobalAudioPlayer"

const StyledFooter = styled.footer`
  background-color: white;
  display: flex;
  flex-direction: column;
  height: 60px;
  z-index: 10;
`

const FooterContainer = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 auto;
  max-width: 960px;
  width: 100%;
`

const Footer = React.memo(() => {
  return (
    <StyledFooter>
      <FooterContainer>
        <GlobalAudioPlayer />
      </FooterContainer>
    </StyledFooter>
  )
})

export default Footer
