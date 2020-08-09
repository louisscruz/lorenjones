import React, { useCallback, useState } from "react"
import { IconButton } from "@zendeskgarden/react-buttons"
import { Progress } from "@zendeskgarden/react-loaders"
import styled from "styled-components"
import { Dropdown, Item, Menu, Trigger } from "@zendeskgarden/react-dropdowns"
import { useStaticQuery, graphql } from "gatsby"
import PlayIcon from "@zendeskgarden/svg-icons/src/16/play-fill.svg"
import ChevronLeft from "@zendeskgarden/svg-icons/src/12/chevron-double-left-fill.svg"
import ChevronRight from "@zendeskgarden/svg-icons/src/12/chevron-double-right-fill.svg"
import MenuIcon from "@zendeskgarden/svg-icons/src/12/menu-fill.svg"

const PlayerContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
`

const StartColumn = styled.div``

const EndColumn = styled.div`
  flex: 1;
`

const Title = styled.p`
  width: 100%;
`

const query = graphql`
  query GetTracks {
    allGoogleSheetTracksRow(sort: { fields: playlistIndex }) {
      nodes {
        albumRowIdentifier
        audioLink
        description
        id
        name
      }
    }
  }
`

const downshiftProps = {
  itemToString: item => (item ? item.id : ""),
}

const GlobalAudioPlayer = React.memo(() => {
  const {
    allGoogleSheetTracksRow: { nodes: tracks },
  } = useStaticQuery(query)

  const [currentTrack, setCurrentTrack] = useState(tracks[0])
  const handleSelect = useCallback(track => {
    setCurrentTrack(track)
  }, [])
  const handlePreviousClick = useCallback(() => {
    const currentTrackIndex = tracks.findIndex(track => track === currentTrack)
    const nextTrackIndex =
      (currentTrackIndex + tracks.length - 1) % tracks.length

    setCurrentTrack(tracks[nextTrackIndex])
  }, [currentTrack, tracks])
  const handleNextClick = useCallback(() => {
    const currentTrackIndex = tracks.findIndex(track => track === currentTrack)
    const nextTrackIndex =
      (currentTrackIndex + tracks.length + 1) % tracks.length

    setCurrentTrack(tracks[nextTrackIndex])
  }, [currentTrack, tracks])

  return (
    <PlayerContainer>
      <StartColumn>
        <IconButton onClick={handlePreviousClick} size="small">
          <ChevronLeft />
        </IconButton>
        <IconButton>
          <PlayIcon />
        </IconButton>
        <IconButton onClick={handleNextClick} size="small">
          <ChevronRight />
        </IconButton>
        <Dropdown
          downshiftProps={downshiftProps}
          onSelect={handleSelect}
          selectedItem={currentTrack}
        >
          <Trigger>
            <IconButton aria-label="playlist" size="small">
              <MenuIcon />
            </IconButton>
          </Trigger>
          <Menu hasArrow>
            {tracks.map(track => (
              <Item key={track.id} value={track}>
                {track.name}
              </Item>
            ))}
          </Menu>
        </Dropdown>
      </StartColumn>
      <EndColumn>
        <Title>{currentTrack.name}</Title>
        <Progress value={30} />
      </EndColumn>
    </PlayerContainer>
  )
})

export default GlobalAudioPlayer
