import React from "react"
import { useStaticQuery } from "gatsby"
import { XL, XXL } from "@zendeskgarden/react-typography"
import { Accordion } from "@zendeskgarden/react-accordions"

import ContentContainer from "../components/ContentContainer"
import SEO from "../components/seo"

const Albums = React.memo(() => {
  return <XL>Albums</XL>
})

const WorksByGenre = React.memo(() => {
  return (
    <>
      <XL>Works by Genre</XL>
      <Accordion level={3}>
        <Accordion.Section>
          <Accordion.Header>
            <Accordion.Label>Orchestral</Accordion.Label>
          </Accordion.Header>
          <Accordion.Panel>
            <div>
              <h1>Dancing on the Brink of the World</h1>
              <ul>
                <li>Ohlone Song</li>
              </ul>
            </div>
          </Accordion.Panel>
        </Accordion.Section>
        <Accordion.Section>
          <Accordion.Header>
            <Accordion.Label>Solo Guitar</Accordion.Label>
          </Accordion.Header>
          <Accordion.Panel>Here is some solo guitar music.</Accordion.Panel>
        </Accordion.Section>
        <Accordion.Section>
          <Accordion.Header>
            <Accordion.Label>Solo Piano</Accordion.Label>
          </Accordion.Header>
          <Accordion.Panel>Here is some solo piano music.</Accordion.Panel>
        </Accordion.Section>
        <Accordion.Section>
          <Accordion.Header>
            <Accordion.Label>Band</Accordion.Label>
          </Accordion.Header>
          <Accordion.Panel>Here is some solo band music.</Accordion.Panel>
        </Accordion.Section>
      </Accordion>
    </>
  )
})

const Music = React.memo(() => {
  return (
    <ContentContainer>
      <SEO title="Music" />
      <XXL>Music</XXL>
      <Albums />
      <WorksByGenre />
    </ContentContainer>
  )
})

export default Music
