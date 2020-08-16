import { graphql, useStaticQuery } from "gatsby"
import React from "react"
import styled from "styled-components"
import BackgroundImage from "gatsby-background-image"

interface ArtDirectedBackgroundProps {
  readonly className?: string
}

const StyledInnerWrapper = styled.div`
  display: flex;
  height: calc(100vh - 120px);
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Name = styled.h1`
  color: white;
  font-size: 128px;
  font-weight: 900;
  line-height: 128px;
  text-shadow: 0px 0px 14px rgba(150, 150, 150, 1);
`

const Composer = styled.h2`
  color: white;
  font-size: 96px;
  font-weight: 900;
  line-height: 96px;
  text-shadow: 0px 0px 14px rgba(150, 150, 150, 1);
`

const query = graphql`
  query {
    mobileImage: file(relativePath: { eq: "loren-jones-portrait.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 490, quality: 100) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    desktopImage: file(relativePath: { eq: "loren-jones.jpg" }) {
      childImageSharp {
        fluid(quality: 100, maxWidth: 3968) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`

const ArtDirectedBackground = React.memo<ArtDirectedBackgroundProps>(
  ({ className }) => {
    const { mobileImage, desktopImage } = useStaticQuery(query)
    // Set up the array of image data and `media` keys.
    // You can have as many entries as you'd like.
    const sources = [
      mobileImage.childImageSharp.fluid,
      {
        ...desktopImage.childImageSharp.fluid,
        media: `(min-width: 491px)`,
      },
    ]

    return (
      <BackgroundImage
        Tag={`section`}
        id={`media-test`}
        fluid={sources}
        className={className}
      >
        <StyledInnerWrapper>
          <Name>Loren Jones</Name>
          <Composer>Composer</Composer>
        </StyledInnerWrapper>
      </BackgroundImage>
    )
  }
)

const StyledArtDirectedBackground = styled(ArtDirectedBackground)`
  width: 100%;
  height: 100%;
  /* You should set a background-size as the default value is "cover"! */
  // background-size: auto 100%;
  background-size: cover;
  // margin-top: -60px;
  /* So we won't have the default "lightgray" background-color. */
  background-color: transparent;
  background-position: center top;
`

export default StyledArtDirectedBackground