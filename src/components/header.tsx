import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { Anchor } from "@zendeskgarden/react-buttons"

interface HeaderProps {
  readonly siteTitle: string
}

const StyledHeader = styled.header`
  background-color: white;
  z-index: 10;
`

const HeaderContainer = styled.div`
  z-index: 1;
  height: 60px;
  margin: 0 auto;
  max-width: 960px;
  padding: 1.45rem 1.0875rem;
`

const StyledLink = styled(Link)`
  margin: 0 12px;
  text-decoration: none;
`

const Header = React.memo<HeaderProps>(({ siteTitle }) => (
  <StyledHeader>
    <HeaderContainer>
      <StyledLink to="/">Home</StyledLink>
      <StyledLink to="/about">About</StyledLink>
      <StyledLink to="/music">Music</StyledLink>
      <Anchor
        href="https://www.flickr.com/photos/134139109@N08/albums"
        isExternal
      >
        Photos
      </Anchor>
      <StyledLink to="/contact">Contact</StyledLink>
    </HeaderContainer>
  </StyledHeader>
))

export default Header
