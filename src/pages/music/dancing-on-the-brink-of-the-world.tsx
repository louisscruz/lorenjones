import React, { useLayoutEffect } from "react"
import { Paragraph, XXL } from "@zendeskgarden/react-typography"
import { graphql, useStaticQuery } from "gatsby"
import styled from "styled-components"
import BackgroundImage, { IFluidObject } from "gatsby-background-image"
import { Tabs, TabList, Tab, TabPanel } from "@zendeskgarden/react-tabs"

import { Immutable, Work, MultiMovementWork } from "../../types"
import ContentContainer from "../../components/ContentContainer"

type BackgroundSectionProps = Immutable<{
  className: string
  splashImageData: IFluidObject
}>

const StyledXXL = styled(XXL)`
  color: white;
  font-size: 100px;
  line-height: 100px;
`

const query = graphql`
  query {
    desktop: file(
      relativePath: { eq: "dancing-on-the-brink-of-the-world.jpg" }
    ) {
      childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`

const BackgroundSection = React.memo<BackgroundSectionProps>(
  ({ className, splashImageData }) => {
    return (
      <BackgroundImage
        Tag="section"
        className={className}
        fluid={splashImageData}
        backgroundColor={`#040e18`}
      >
        <StyledXXL isBold>Dancing on the Brink of the World</StyledXXL>
      </BackgroundImage>
    )
  }
)

const StyledBackgroundSection = styled(BackgroundSection)`
  width: 100%;
  min-height: 100vh;
  background-position: center center;
  background-repeat: repeat-y;
  background-size: cover;
`

// Less than ideal from a graphql perspective, but I want to get this working
// ASAP and it'll take a bit to get the gatsby-node.js to have a filter for the
const worksQuery = graphql`
  query GetWorksForDancingOnTheBrinkOfTheWorld {
    works {
      ... on MultiMovementWork {
        __typename
        id
        name
        movements {
          __typename
          description
          id
          name
        }
      }
    }
    desktop: file(
      relativePath: { eq: "dancing-on-the-brink-of-the-world.jpg" }
    ) {
      childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`

const DancingOnTheBrinkOfTheWorld = React.memo(() => {
  const {
    desktop: {
      childImageSharp: { fluid: splashImageData },
    },
    works,
  } = useStaticQuery<{
    desktop: { childImageSharp: { fluid: IFluidObject } }
    works: Work[]
  }>(worksQuery)

  const dancingOnTheBrinkOfTheWorld = works.find(
    work => work.name === "Dancing on the Brink of the World"
  ) as MultiMovementWork

  useLayoutEffect(() => {
    if (!dancingOnTheBrinkOfTheWorld) {
      throw new Error(
        "Expected Dancing on the Brink of the World to be present, but it was not. Check that the data is valid."
      )
    }
  }, [])

  return (
    <>
      <StyledBackgroundSection className="" splashImageData={splashImageData} />
      <ContentContainer>
        <XXL>
          It started off as an idea that came in the middle of the night.
        </XXL>
        <Paragraph>
          Twelve years ago when the idea of a musical history of San Francisco
          came to me in the middle of the night, little did I know what I was in
          for. After scribbling down over 20 movement titles, I eventually
          settled on 14, and began working more or less in chronological order
          on each one.
        </Paragraph>
        <Paragraph>
          Dancing on the Brink of the World is the name of an Ohlone song to
          which the words and music have been lost in time. Not only does the
          title reflect what it must have been like for the Bay Area’s original
          people who were all but destroyed by the invasion of the Europeans,
          but as history has unfolded, the little village that became San
          Francisco has now, more than ever, become the Brink of the World.
        </Paragraph>
        <Paragraph>
          The Ohlone, Mission Dolores, the Gold Rush, Chinatown, the Earthquake
          and Fire, Golden Gate Park, the Golden Gate Bridge, the Beatniks, the
          Psychedelic Scene, the Gay Movement. The music tells these stories.
        </Paragraph>
        <Paragraph>
          We begin 400 years ago when there were just a few small Ohlone
          villages scattered around the edge of the San Francisco bay.
        </Paragraph>
      </ContentContainer>
      <ContentContainer>
        <XXL>Movements</XXL>
        <Tabs isVertical>
          <TabList>
            {dancingOnTheBrinkOfTheWorld.movements.map(movement => (
              <Tab item={movement.id}>{movement.name}</Tab>
            ))}
          </TabList>
          {dancingOnTheBrinkOfTheWorld.movements.map(movement => (
            <TabPanel item={movement.id}>
              <Paragraph>{movement.description}</Paragraph>
            </TabPanel>
          ))}
        </Tabs>
      </ContentContainer>
    </>
  )
})

export default DancingOnTheBrinkOfTheWorld
