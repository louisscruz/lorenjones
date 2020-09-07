import React, { useCallback, useMemo } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { LG, XL, XXL } from "@zendeskgarden/react-typography"
import { IconButton } from "@zendeskgarden/react-buttons"
import PlayIcon from "@zendeskgarden/svg-icons/src/12/play-fill.svg"
import PauseIcon from "@zendeskgarden/svg-icons/src/12/pause-fill.svg"
import { Accordion } from "@zendeskgarden/react-accordions"
import styled from "styled-components"

import ContentContainer from "../components/ContentContainer"
import SEO from "../components/seo"
import {
  Album,
  isMultiMovementWork,
  Immutable,
  ListableWork,
  MultiMovementWorkMovement,
  Track,
  isSingleMovementWork,
} from "../types"
import { useGlobalAudioPlayer } from "../components/GlobalAudioPlayer"

type WorksByGenreProps = Immutable<{
  works: Immutable<ListableWork[]>
}>

interface WorksByGenreAccumulator {
  partitionedWorks: Record<string, Array<Immutable<ListableWork>>>
  partitionOrder: string[]
}

type LocalAudioPlayerProps = Immutable<{
  track: Track
}>

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
  background-color: white;
  border: 1px solid grey;
  border-radius: 3px;
  padding: 8px;
`

const Albums = React.memo<AlbumsProps>(({ albums }) => {
  return (
    <>
      <XL>Albums</XL>
      {albums.map(album => (
        <div key={album.id}>{album.name}</div>
      ))}
    </>
  )
})

const LocalAudioPlayer = React.memo<LocalAudioPlayerProps>(({ track }) => {
  const {
    currentTrack,
    isPlaying,
    moveToTrack,
    pause,
    play,
  } = useGlobalAudioPlayer()

  const isCurrentTrack = currentTrack?.id === track.id
  const isCurrentTrackAndPlaying = isCurrentTrack && isPlaying

  const handlePlayerClick = useCallback(() => {
    if (isCurrentTrackAndPlaying) {
      pause()
    } else if (isCurrentTrack) {
      play()
    } else {
      moveToTrack(track.id)
      play()
    }
  }, [isCurrentTrack, isCurrentTrackAndPlaying, pause, play, track.id])

  return (
    <IconButton onClick={handlePlayerClick} size="small">
      {isCurrentTrackAndPlaying ? <PauseIcon /> : <PlayIcon />}
    </IconButton>
  )
})

const MovementEntry = React.memo<MovemmentEntryProps>(({ index, movement }) => (
  <li key={movement.id}>
    <span>
      {index + 1}. {movement.name}
    </span>
    {movement.tracks.map(track => (
      <LocalAudioPlayer key={track.id} track={track} />
    ))}
  </li>
))

const WorkEntry = React.memo<WorkEntryProps>(({ work }) => {
  return (
    <WorkEntryContainer>
      <LG isBold>{work.name}</LG>
      {work.description && <div>{work.description}</div>}
      {isSingleMovementWork(work) &&
        work.tracks.map(track => (
          <LocalAudioPlayer key={track.id} track={track} />
        ))}
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
              {worksByGenre.partitionedWorks[category].map(work => (
                <WorkEntry key={work.id} work={work} />
              ))}
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
      name
    }
    works {
      ... on SingleMovementWork {
        __typename
        category
        description
        id
        name
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
      <XXL>Music</XXL>
      <Albums albums={albums} />
      <WorksByGenre works={works} />
    </ContentContainer>
  )
})

export default Music
