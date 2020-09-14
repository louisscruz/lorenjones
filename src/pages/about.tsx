import React, { useState } from "react"
import { Paragraph, MD, XXL } from "@zendeskgarden/react-typography"
import { Tabs, TabList, Tab, TabPanel } from "@zendeskgarden/react-tabs"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

import ContentContainer from "../components/ContentContainer"
import SEO from "../components/seo"

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

const QuoteContainer = styled.div`
  margin-bottom: 16px;
`

const QuoteText = styled(Paragraph)`
  background-color: #e8e8e8;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
`

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

  return (
    <>
      <ContentContainer>
        <SEO title="About" />
        <XXL>About</XXL>
        <Tabs>
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
      </ContentContainer>
      <ContentContainer>
        <XXL>Quotes</XXL>
        {quotes.map(({ content, id, name, title, url }) => (
          <QuoteContainer key={id}>
            <QuoteText key={id}>{content}</QuoteText>
            <MD isBold>
              {name}, {title}
            </MD>
          </QuoteContainer>
        ))}
      </ContentContainer>
    </>
  )
})

export default About
