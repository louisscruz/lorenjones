import React, { useState } from "react"
import { Paragraph, XXL } from "@zendeskgarden/react-typography"
import { Tabs, TabList, Tab, TabPanel } from "@zendeskgarden/react-tabs"
import { useStaticQuery, graphql } from "gatsby"

import ContentContainer from "../components/ContentContainer"

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
  } = useStaticQuery(query)

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
            {content.split("\n").map(paragraph => (
              <Paragraph>{paragraph}</Paragraph>
            ))}
          </TabPanel>
        ))}
      </Tabs>
      <XXL>Quotes</XXL>
      {quotes.map(({ content, id, name, title, url }) => (
        <div>
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
