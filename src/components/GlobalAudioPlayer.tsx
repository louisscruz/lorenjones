import React, { useCallback, useRef, useState, useEffect } from "react"
import { IconButton } from "@zendeskgarden/react-buttons"
// import { Progress } from "@zendeskgarden/react-loaders"
import styled from "styled-components"
import { Dropdown, Item, Menu, Trigger } from "@zendeskgarden/react-dropdowns"
import { useStaticQuery, graphql } from "gatsby"
import PlayIcon from "@zendeskgarden/svg-icons/src/16/play-fill.svg"
import PauseIcon from "@zendeskgarden/svg-icons/src/16/pause-fill.svg"
import ChevronLeft from "@zendeskgarden/svg-icons/src/12/chevron-double-left-fill.svg"
import ChevronRight from "@zendeskgarden/svg-icons/src/12/chevron-double-right-fill.svg"
import MenuIcon from "@zendeskgarden/svg-icons/src/12/menu-fill.svg"

const PlayerContainer = styled.div`
  align-items: center;
  background-color: white;
  display: flex;
  flex-direction: row;
  width: 100%;
  z-index: 10;
`

const StartColumn = styled.div``

const EndColumn = styled.div`
  flex: 1;
`

const Title = styled.p`
  width: 100%;
`

const StyledPlayIconButton = styled(IconButton)`
  margin: 0 4px;
`

const query = graphql`
  query GetTracks {
    allGoogleSheetTracksRow(sort: { fields: playlistIndex }) {
      nodes {
        albumId
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

const SliderContainer = styled.div`
  background-color: lightgrey;
  border-radius: 3px;
  color: green;
  height: 6px;
  margin: 4px 0;
  &:hover {
    cursor: pointer;
  }
`

interface SliderProgressProps {
  readonly value: number
}

const SliderProgress = styled.div.attrs<SliderProgressProps>(({ value }) => ({
  style: {
    width: `${value}%`,
  },
}))<SliderProgressProps>`
  background: currentColor;
  border-radius: 3px;
  height: 6px;
`

interface SliderProps {
  readonly onChange: (_: number) => void
  readonly onStartSeek: () => () => void
  readonly value: number
}

const noOp = () => {}

const getNextPercentage = (
  event: MouseEvent,
  sliderContainerRef: React.MutableRefObject<HTMLDivElement>
) => {
  const {
    left: initialStartPosition,
    right: initialEndPosition,
  } = sliderContainerRef.current.getBoundingClientRect()
  const width = initialEndPosition - initialStartPosition
  const mousePositionWithOffset = event.pageX - initialStartPosition
  return (mousePositionWithOffset / width) * 100
}

const Slider = React.memo<SliderProps>(({ onChange, onStartSeek, value }) => {
  const [localSeekValue, setLocalSeekValue] = useState<number>(null)
  const onStopSeekRef = useRef(noOp)

  const sliderContainerRef = useRef<HTMLDivElement>()

  const localSeekValueRef = useRef<number>(localSeekValue)

  useEffect(() => {
    localSeekValueRef.current = localSeekValue
  }, [localSeekValue])

  const handleMouseDown = useCallback(
    event => {
      if (event.button !== 0) return
      onStopSeekRef.current = onStartSeek()
      let percentage = getNextPercentage(event, sliderContainerRef)
      let isAnimationFrameRequested = false

      const handleSeekSlide = event => {
        if (isAnimationFrameRequested) return
        const {
          left: startPosition,
          right: endPosition,
        } = sliderContainerRef.current.getBoundingClientRect()

        if (event.pageX <= startPosition && localSeekValueRef.current !== 0) {
          setLocalSeekValue(0)
        } else if (
          event.pageX >= endPosition &&
          localSeekValueRef.current !== 100
        ) {
          setLocalSeekValue(100)
        }

        if (event.pageX < startPosition || event.pageX > endPosition) return

        const width = endPosition - startPosition
        const mousePositionWithOffset = event.pageX - startPosition
        percentage = (mousePositionWithOffset / width) * 100

        isAnimationFrameRequested = true

        requestAnimationFrame(() => {
          isAnimationFrameRequested = false
          setLocalSeekValue(percentage)
        })
      }

      document.addEventListener("mousemove", handleSeekSlide)
      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", handleSeekSlide)

          onStopSeekRef.current()
          onStopSeekRef.current = noOp

          onChange(percentage)
          setLocalSeekValue(null)
        },
        { once: true }
      )
    },
    [onChange]
  )

  const handleKeyDown = useCallback(
    event => {
      switch (event.which) {
        // Left arrow and down arrow
        case 37: {
          const nextPercentage = Math.max(Math.round(value - 1), 0)
          onChange(nextPercentage)
          return
        }
        // Right arrow and up arrow
        case 39: {
          const nextPercentage = Math.min(Math.round(value + 1), 100)
          onChange(nextPercentage)
          return
        }
        // Page down
        case 34: {
          const nextPercentage = Math.max(Math.round(value - 10), 0)
          onChange(nextPercentage)
          return
        }
        // Page up
        case 33: {
          const nextPercentage = Math.min(Math.round(value + 10), 100)
          onChange(nextPercentage)
          return
        }
        // Home
        case 36: {
          onChange(0)
          return
        }
        // End
        case 35: {
          onChange(100)
          return
        }
      }
    },
    [onChange, value]
  )

  const valueToUse = localSeekValue || value

  return (
    <SliderContainer
      aria-valuetext="Seek audio bar"
      aria-valuenow={valueToUse}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      ref={sliderContainerRef}
    >
      <SliderProgress value={valueToUse} />
    </SliderContainer>
  )
})

// TODO:
//
// Styling of progress bar (border + focus styles)
// Add current time and duration display
// Add callbacks for global player control from local players
//
const GlobalAudioPlayer = React.memo(() => {
  const {
    allGoogleSheetTracksRow: { nodes: tracks },
  } = useStaticQuery(query)
  const audioRef = useRef<HTMLAudioElement>()

  const [currentTrack, setCurrentTrack] = useState(tracks[0])
  const [isPlaying, setIsPlaying] = useState(false)

  const handleSelect = useCallback(track => {
    setCurrentTrack(track)
  }, [])
  const handlePreviousClick = useCallback(() => {
    const currentTrackIndex = tracks.findIndex(track => track === currentTrack)
    const nextTrackIndex =
      (currentTrackIndex + tracks.length - 1) % tracks.length

    setCurrentTrack(tracks[nextTrackIndex])
  }, [currentTrack, tracks])
  const handlePlayClick = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [isPlaying])
  const handleNextClick = useCallback(() => {
    const currentTrackIndex = tracks.findIndex(track => track === currentTrack)
    const nextTrackIndex =
      (currentTrackIndex + tracks.length + 1) % tracks.length

    setCurrentTrack(tracks[nextTrackIndex])
  }, [currentTrack, isPlaying, tracks])

  const isPlayingRef = useRef(isPlaying)

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    if (isPlayingRef.current) {
      audioRef.current.play()
    }
  }, [currentTrack])

  const currentDurationRef = useRef(0)
  const currentTimeRef = useRef(0)

  const [currentProgress, setCurrentProgress] = useState(0)

  const handleLoadedMetadata = useCallback(e => {
    currentDurationRef.current = audioRef.current.duration
    const progress = (currentTimeRef.current / currentDurationRef.current) * 100

    setCurrentProgress(progress)
  }, [])

  const handleTimeUpdate = useCallback(e => {
    currentTimeRef.current = audioRef.current.currentTime
    const progress = (currentTimeRef.current / currentDurationRef.current) * 100

    setCurrentProgress(progress)
  }, [])

  const handleSliderChange = useCallback((value: number) => {
    setCurrentProgress(value)
    const duration = audioRef.current.duration
    const newCurrentTime = (duration * value) / 100
    audioRef.current.currentTime = newCurrentTime
  }, [])

  const handleStartSeek = useCallback(() => {
    const isPlaying = isPlayingRef.current

    if (isPlaying) {
      audioRef.current.pause()
    }

    return () => {
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [])

  return (
    <PlayerContainer>
      <StartColumn>
        <IconButton
          aria-label="Previous"
          onClick={handlePreviousClick}
          size="small"
        >
          <ChevronLeft />
        </IconButton>
        <StyledPlayIconButton
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={handlePlayClick}
          isPrimary
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </StyledPlayIconButton>
        <IconButton aria-label="Next" onClick={handleNextClick} size="small">
          <ChevronRight />
        </IconButton>
        <Dropdown
          downshiftProps={downshiftProps}
          onSelect={handleSelect}
          selectedItem={currentTrack}
        >
          <Trigger>
            <IconButton aria-label="Playlist" size="small">
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
        <Slider
          onChange={handleSliderChange}
          onStartSeek={handleStartSeek}
          value={currentProgress}
        />
      </EndColumn>
      <audio
        ref={audioRef}
        onEnded={handleNextClick}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        src={currentTrack.audioLink}
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </PlayerContainer>
  )
})

export default GlobalAudioPlayer
