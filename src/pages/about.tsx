import React, { useState } from "react"
import { Paragraph, XXL } from "@zendeskgarden/react-typography"
import { Tabs, TabList, Tab, TabPanel } from "@zendeskgarden/react-tabs"
import { useStaticQuery, graphql } from "gatsby"

import ContentContainer from "../components/ContentContainer"

interface Bio {
  readonly content: string
  readonly id: string
  readonly name: string
}

interface Quote {
  readonly content: string
  readonly id: string
  readonly name: string
  readonly title: string
  readonly url: string
}

const query = graphql`
  query BiosQuery {
    allGoogleSheetBiosRow(sort: { fields: tabIndex }) {
      nodes {
        content
        id
        name
      }
    }
    allGoogleSheetQuotesRow(sort: { fields: orderIndex }) {
      nodes {
        content
        id
        name
        title
        url
      }
    }
  }
`

const About = React.memo(() => {
  const {
    allGoogleSheetBiosRow: { nodes: bios },
    allGoogleSheetQuotesRow: { nodes: quotes },
  } = useStaticQuery<{
    allGoogleSheetBiosRow: {
      nodes: Array<Bio>
    }
    allGoogleSheetQuotesRow: {
      nodes: Array<Quote>
    }
  }>(query)

  const [currentBio, setCurrentBio] = useState(bios[0].name)

  return (
    <ContentContainer>
      <XXL>About</XXL>
      <Tabs selectedItem={currentBio} onChange={setCurrentBio}>
        <TabList>
          {bios.map(({ id, name }) => (
            <Tab item={name} key={id}>
              {name}
            </Tab>
          ))}
        </TabList>
        {bios.map(({ content, id, name }) => (
          <TabPanel item={name} key={id}>
            {content.split("\n").map((paragraph, index) => (
              <Paragraph key={index}>{paragraph}</Paragraph>
            ))}
          </TabPanel>
        ))}
      </Tabs>
      <XXL>Quotes</XXL>
      {quotes.map(({ content, id, name, title, url }) => (
        <div key={id}>
          <Paragraph key={id}>{content}</Paragraph>
          <Paragraph>
            {name}, {title}
          </Paragraph>
        </div>
      ))}
    </ContentContainer>
  )
})

export default About
