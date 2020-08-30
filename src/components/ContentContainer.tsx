import React from "react"
import styled from "styled-components"

const OuterContentContainer = styled.div`
  background-color: white;
  border-radius: 4px;
  flex: 1;
  margin: 36px 24px;
  max-width: 720px;
  padding: 24px 24px;
  width: 100%;
`
const InnerContentContainer = styled.div`
  background-color: white;
  border-radius: 4px;
  flex: 1;
  margin: 36px 24px;
  max-width: 960px;
  padding: 24px 12px;
`
const ContentContainer = React.memo(({ children }) => (
  <OuterContentContainer>
    <InnerContentContainer>{children}</InnerContentContainer>
  </OuterContentContainer>
))

export default OuterContentContainer
