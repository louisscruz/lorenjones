import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { IconButton } from "@zendeskgarden/react-buttons"
import styled from "styled-components"
import { Dropdown, Item, Menu, Trigger } from "@zendeskgarden/react-dropdowns"
import { useStaticQuery, graphql } from "gatsby"
import PlayIcon from "@zendeskgarden/svg-icons/src/16/play-fill.svg"
import PauseIcon from "@zendeskgarden/svg-icons/src/16/pause-fill.svg"
import ChevronLeft from "@zendeskgarden/svg-icons/src/12/chevron-double-left-fill.svg"
import ChevronRight from "@zendeskgarden/svg-icons/src/12/chevron-double-right-fill.svg"
import MenuIcon from "@zendeskgarden/svg-icons/src/12/menu-fill.svg"

interface SliderProps {
  readonly onChange: (_: number) => void
  readonly onStartSeek: () => () => void
  readonly value: number
}

interface Album {
  id: string
  name: string
  tracks: Track[]
}

interface Track {
  album?: Album
  audioLink: string
  id: string
  work: TrackableWork
  youtubeLink?: string
}

interface Work {
  description?: string
  id: string
  name: string
}

interface SingleMovementWork extends Work {
  category: string
}

interface MultiMovementWorkMovement extends Work {}

interface MultiMovementWork extends Work {
  category: string
  movements: MultiMovementWorkMovement[]
}

type TrackableWork = SingleMovementWork | MultiMovementWorkMovement

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
    tracks {
      album {
        id
        name
      }
      audioLink
      id
      work {
        ... on SingleMovementWork {
          id
          name
        }
        ... on MultiMovementWorkMovement {
          id
          name
        }
      }
      youtubeLink
    }
  }
`

interface UseGlobalAudioPlayerResponse {
  isPlaying: Boolean
  selectedTrack: Track
  selectTrack: (id: string) => void
  tracks: Track[]
}

const useGlobalAudioPlayer: () => UseGlobalAudioPlayerResponse = () => {
  const { tracks } = useStaticQuery<{
    tracks: Track[]
  }>(query)
  const [selectedTrack, setSelectedTrack] = useState(tracks[0])

  const tracksById = useMemo(
    () =>
      tracks.reduce<{ [id: string]: Track }>((accumulator, track) => {
        accumulator[track.id] = track
        return accumulator
      }, {}),
    [tracks]
  )

  const selectedTrackRef = useRef(selectedTrack)

  useEffect(() => {
    selectedTrackRef.current = selectedTrack
  }, [selectedTrack])

  const selectTrack = useRef((id: string) => {
    const nextTrack = tracksById[id]

    if (nextTrack) {
      setSelectedTrack(nextTrack)
    }
  })

  const response = useMemo(
    () => ({
      isPlaying: false,
      selectTrack: selectTrack.current,
      selectedTrack,
      tracks,
    }),
    [selectedTrack, tracks]
  )

  return response
}

const downshiftProps = {
  itemToString: (item: { id: string }) => (item ? item.id : ""),
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

const noOp = () => {}

const getNextPercentage = (
  event: MouseEvent,
  sliderContainerRef: React.RefObject<HTMLDivElement>
): number => {
  if (!sliderContainerRef.current) return 0

  const {
    left: initialStartPosition,
    right: initialEndPosition,
  } = sliderContainerRef.current.getBoundingClientRect()
  const width = initialEndPosition - initialStartPosition
  const mousePositionWithOffset = event.pageX - initialStartPosition
  return (mousePositionWithOffset / width) * 100
}

const Slider = React.memo<SliderProps>(({ onChange, onStartSeek, value }) => {
  const [localSeekValue, setLocalSeekValue] = useState<number>(0)
  const onStopSeekRef = useRef(noOp)

  const sliderContainerRef = useRef<HTMLDivElement>(null)

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

      const handleSeekSlide = (event: MouseEvent) => {
        if (isAnimationFrameRequested || !sliderContainerRef.current) return
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
          setLocalSeekValue(0)
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

const formatTime = (timeInSeconds: number) => {
  const date = new Date(0)
  date.setSeconds(timeInSeconds)
  return date.toISOString().substr(14, 5)
}

const useForceRerender = () => {
  const [count, setCount] = useState(0)

  const rerender = useRef(() => {
    setCount(previousCount => previousCount + 1)
  })

  return rerender.current
}

// TODO:
//
// Add callbacks for global player control from local players
//
const GlobalAudioPlayer = React.memo(() => {
  const {
    // isPlaying,
    selectTrack,
    selectedTrack,
    tracks,
  } = useGlobalAudioPlayer()
  const audioRef = useRef<HTMLAudioElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)

  const handleSelect = useCallback(track => {
    selectTrack(track.id)
  }, [])
  const handlePreviousClick = useCallback(() => {
    const currentTrackIndex = tracks.findIndex(
      (track: Track) => track.id === selectedTrack.id
    )
    const nextTrackIndex =
      (currentTrackIndex + tracks.length - 1) % tracks.length

    selectTrack(tracks[nextTrackIndex].id)
  }, [selectedTrack, tracks])
  const handlePlayClick = useCallback(() => {
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      audioRef.current?.play()
      setIsPlaying(true)
    }
  }, [isPlaying])
  const handleNextClick = useCallback(() => {
    const currentTrackIndex = tracks.findIndex(
      (track: Track) => track.id === selectedTrack.id
    )
    debugger
    const nextTrackIndex =
      (currentTrackIndex + tracks.length + 1) % tracks.length

    selectTrack(tracks[nextTrackIndex].id)
  }, [selectedTrack, isPlaying, tracks])

  const isPlayingRef = useRef(isPlaying)

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    if (isPlayingRef.current) {
      audioRef.current?.play()
    }
  }, [selectedTrack])

  const currentDurationRef = useRef(0)
  const currentTimeRef = useRef(0)

  const [currentProgress, setCurrentProgress] = useState(0)

  // Force re-render is used because we handle time/duration updates
  // imperatively for performance reasons. In specific state transitions, we
  // need a render to occur.
  const forceRerender = useForceRerender()

  const handleLoadedMetadata = useCallback(
    e => {
      currentDurationRef.current = audioRef.current?.duration || 0
      const progress =
        (currentTimeRef.current / currentDurationRef.current) * 100

      setCurrentProgress(progress)
      forceRerender()
    },
    [forceRerender]
  )

  const handleTimeUpdate = useCallback(e => {
    currentTimeRef.current = audioRef.current?.currentTime || 0
    const progress = (currentTimeRef.current / currentDurationRef.current) * 100

    setCurrentProgress(progress)
  }, [])

  const handleSliderChange = useCallback((value: number) => {
    setCurrentProgress(value)
    const duration = audioRef.current?.duration || 0
    const newCurrentTime = (duration * value) / 100
    if (audioRef.current) {
      audioRef.current.currentTime = newCurrentTime || 0
    }
  }, [])

  const handleStartSeek = useCallback(() => {
    const isPlaying = isPlayingRef.current

    if (isPlaying) {
      audioRef.current?.pause()
    }

    return () => {
      if (isPlaying) {
        audioRef.current?.play()
      }
    }
  }, [])

  const timeToDisplay = `${formatTime(currentTimeRef.current)} / ${formatTime(
    currentDurationRef.current
  )}`

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
          selectedItem={selectedTrack}
        >
          <Trigger>
            <IconButton aria-label="Playlist" size="small">
              <MenuIcon />
            </IconButton>
          </Trigger>
          <Menu hasArrow>
            {tracks.map(track => (
              <Item key={track.id} value={track}>
                {track.work.name}
              </Item>
            ))}
          </Menu>
        </Dropdown>
      </StartColumn>
      <EndColumn>
        <Title>
          {selectedTrack.work.name} ({timeToDisplay})
        </Title>
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
        src={selectedTrack.audioLink}
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </PlayerContainer>
  )
})

export default GlobalAudioPlayer
