import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

interface HeaderProps {
  readonly siteTitle: string
}

const StyledHeader = styled.header`
  // background-color: rgba(256, 256, 256, 0.8);
  z-index: 1;
`

const HeaderContainer = styled.div`
  z-index: 1;
  height: 60px;
  margin: 0 auto;
  max-width: 960px;
  padding: 1.45rem 1.0875rem;
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

const Header = React.memo<HeaderProps>(({ siteTitle }) => (
  <StyledHeader>
    <HeaderContainer>
      <StyledLink to="/">Home</StyledLink>
    </HeaderContainer>
  </StyledHeader>
))

export default Header
