import React, { useMemo } from "react"
import { graphql, Link, useStaticQuery } from "gatsby"
import { Paragraph, LG, XL, XXL } from "@zendeskgarden/react-typography"
import { Accordion } from "@zendeskgarden/react-accordions"
import styled from "styled-components"
import kebabCase from "lodash/kebabCase"

import ContentContainer from "../components/ContentContainer"
import SEO from "../components/seo"
import {
  Album,
  isMultiMovementWork,
  Immutable,
  ListableWork,
  MultiMovementWorkMovement,
  isSingleMovementWork,
} from "../types"
import LocalAudioPlayer from "../components/LocalAudioPlayer"

type WorksByGenreProps = Immutable<{
  works: Immutable<ListableWork[]>
}>

interface WorksByGenreAccumulator {
  partitionedWorks: Record<string, Array<Immutable<ListableWork>>>
  partitionOrder: string[]
}

type MovemmentEntryProps = Immutable<{
  index: number
  movement: MultiMovementWorkMovement
}>

type WorkEntryProps = Immutable<{
  work: ListableWork
}>

type AlbumsProps = Immutable<{
  albums: Album[]
}>

const WorkEntryContainer = styled.div`
  background-color: #e8e8e8;
  border-radius: 3px;
  padding: 8px;
  margin-bottom: 8px;
`

const AlbumsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`

const AlbumContainer = styled.div`
  align-items: center;
  background-color: #e8e8e8;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  margin: 12px 0;
  max-width: 300px;
  min-height: 300px;
  padding: 12px;
`

const AlbumImg = styled.img`
  max-width: 80%;
  height: auto;
`

const StyledTitle = styled(XXL)`
  margin-bottom: 24px;
`

const StyledMovementListItem = styled.li`
  align-items: center;
  display: flex;
  height: 32px;
  margin: 4px;
  > button {
    margin-left: 8px;
  }
`

const Albums = React.memo<AlbumsProps>(({ albums }) => {
  return (
    <>
      <XL>Albums</XL>
      <AlbumsContainer>
        {albums.map(album => (
          <AlbumContainer key={album.id}>
            <AlbumImg
              alt="Woodward's Gardens Album Cover"
              {...album.imageFile.childImageSharp.fixed}
            />
            <LG isBold>{album.name}</LG>
            <Link to={`/music/album/${kebabCase(album.name)}`}>More Info</Link>
          </AlbumContainer>
        ))}
      </AlbumsContainer>
    </>
  )
})

const MovementEntry = React.memo<MovemmentEntryProps>(({ index, movement }) => (
  <StyledMovementListItem key={movement.id}>
    {index + 1}. {movement.name}
    {movement.tracks.map(track => (
      <LocalAudioPlayer key={track.id} track={track} />
    ))}
  </StyledMovementListItem>
))

const WorkEntry = React.memo<WorkEntryProps>(({ work }) => {
  return (
    <WorkEntryContainer>
      <LG isBold>{work.name}</LG>
      {work.instrumentation && <Paragraph>{work.instrumentation}</Paragraph>}
      {isSingleMovementWork(work) &&
        work.tracks.map(track => (
          <LocalAudioPlayer key={track.id} track={track} />
        ))}
      {work.description && <div>{work.description}</div>}
      {isMultiMovementWork(work) &&
        work.name === "Dancing on the Brink of the World" && (
          <Link to="/music/dancing-on-the-brink-of-the-world">
            View Project Page
          </Link>
        )}
      {isMultiMovementWork(work) && (
        <ol>
          {work.movements.map((movement, index) => (
            <MovementEntry
              index={index}
              key={movement.id}
              movement={movement}
            />
          ))}
        </ol>
      )}
    </WorkEntryContainer>
  )
})

const WorksByGenre = React.memo<WorksByGenreProps>(({ works }) => {
  const worksByGenre = useMemo(
    () =>
      works.reduce<WorksByGenreAccumulator>(
        (accumulator, work) => {
          const { category } = work
          if (
            Object.prototype.hasOwnProperty.call(
              accumulator.partitionedWorks,
              category
            )
          ) {
            accumulator.partitionedWorks[category].push(work)
          } else {
            accumulator.partitionedWorks[category] = [work]
            accumulator.partitionOrder.push(category)
          }

          return accumulator
        },
        { partitionedWorks: {}, partitionOrder: [] }
      ),
    [works]
  )

  return (
    <>
      <XL>Works by Genre</XL>
      <Accordion level={3}>
        {worksByGenre.partitionOrder.map(category => (
          <Accordion.Section key={category}>
            <Accordion.Header>
              <Accordion.Label>{category}</Accordion.Label>
            </Accordion.Header>
            <Accordion.Panel>
              {worksByGenre.partitionedWorks[category].map(
                work =>
                  !work.otherComposerCredit && (
                    <WorkEntry key={work.id} work={work} />
                  )
              )}
            </Accordion.Panel>
          </Accordion.Section>
        ))}
      </Accordion>
    </>
  )
})

const query = graphql`
  query AlbumsAndWorks {
    albums {
      id
      imageFile {
        childImageSharp {
          fixed {
            ...GatsbyImageSharpFixed
          }
        }
      }
      name
      tracks {
        audioLink
        id
        work {
          id
          name
        }
      }
    }
    works {
      ... on SingleMovementWork {
        __typename
        category
        description
        id
        instrumentation
        name
        otherComposerCredit
        tracks {
          audioLink
          id
        }
      }
      ... on MultiMovementWork {
        __typename
        category
        description
        id
        movements {
          ... on MultiMovementWorkMovement {
            description
            id
            name
            tracks {
              audioLink
              id
            }
          }
        }
        name
      }
    }
  }
`

const Music = React.memo(() => {
  const { albums, works } = useStaticQuery(query)

  return (
    <ContentContainer>
      <SEO title="Music" />
      <StyledTitle>Music</StyledTitle>
      <Albums albums={albums} />
      <WorksByGenre works={works} />
    </ContentContainer>
  )
})

export default Music
