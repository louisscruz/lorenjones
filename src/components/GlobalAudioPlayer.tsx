import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { IconButton } from "@zendeskgarden/react-buttons"
import styled, { css, keyframes } from "styled-components"
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

declare var ResizeObserver: any

interface SingleMovementWork extends Work {
  __typename: "SingleMovementWork"
  category: string
}

interface MultiMovementWorkMovement extends Work {
  __typename: "MultiMovementWorkMovement"
  multiMovementWork: MultiMovementWork
}

interface MultiMovementWork extends Work {
  __typename: "MultiMovementWork"
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

const scrollTitleRight = keyframes`
  0% {
    transform: translateX(0%)
  }
  10% {
    transform: translateX(0%)
  }
  35% {
    opacity: 1;
  }
  54.98% {
    opacity: 0;
    transform: translateX(-120%)
  }
  54.99% {
    transform: translateX(100%)
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translateX(0%)
  }
`

const TitleContainer = styled.span`
  flex: 1;
  overflow: hidden;
`

const animation = css`
  ${scrollTitleRight} 15s ease-in-out infinite;
`

const Title = styled.p<{ hasTitleScroll: boolean }>`
  animation: ${({ hasTitleScroll }) => (hasTitleScroll ? animation : "none;")};
  width: 100%;
  white-space: nowrap;
`

const Information = styled.span`
  display: flex;
`

const Time = styled.span``

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
          __typename
          id
          name
        }
        ... on MultiMovementWorkMovement {
          __typename
          id
          name
          multiMovementWork {
            __typename
            category
            description
            id
            name
          }
        }
      }
      youtubeLink
    }
  }
`

interface GlobalPlayerContextValue {
  audioRef: React.RefObject<HTMLAudioElement>
  currentTrack: Track | null
  isPlaying: boolean
  moveToNextTrack: () => void
  moveToPreviousTrack: () => void
  moveToTrack: (id: string) => void
  pause: () => void
  play: () => void
  tracks: Track[]
}

const GlobalPlayerContext = React.createContext<GlobalPlayerContextValue>({
  audioRef: { current: null },
  currentTrack: null,
  isPlaying: false,
  moveToNextTrack: () => {},
  moveToPreviousTrack: () => {},
  moveToTrack: (_: string) => {},
  pause: () => {},
  play: () => {},
  tracks: [],
})

export const GlobalPlayerProvider = React.memo(({ children }) => {
  const { tracks } = useStaticQuery<{
    tracks: Track[]
  }>(query)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTrack, setCurrentTrack] = useState(() => {
    if (tracks.length) {
      return tracks[0]
    }
    return null
  })
  const [isPlaying, setIsPlaying] = useState(false)

  const tracksById = useMemo(
    () =>
      tracks.reduce<{ [id: string]: Track }>((accumulator, track) => {
        accumulator[track.id] = track
        return accumulator
      }, {}),
    [tracks]
  )

  const moveToTrack = useRef((id: string) => {
    const nextTrack = tracksById[id]

    if (nextTrack) {
      setCurrentTrack(nextTrack)
    }
  })

  const currentTrackRef = useRef(currentTrack)

  useEffect(() => {
    currentTrackRef.current = currentTrack
  }, [currentTrack])

  const moveToPreviousTrackRef = useRef(() => {
    if (!currentTrackRef.current) return
    const {
      current: { id },
    } = currentTrackRef
    const currentTrackIndex = tracks.findIndex(
      (track: Track) => track.id === id
    )
    const nextTrackIndex =
      (currentTrackIndex + tracks.length - 1) % tracks.length

    moveToTrack.current(tracks[nextTrackIndex].id)
  })

  const moveToNextTrackRef = useRef(() => {
    if (!currentTrackRef.current) return
    const {
      current: { id },
    } = currentTrackRef
    const currentTrackIndex = tracks.findIndex(
      (track: Track) => track.id === id
    )
    const nextTrackIndex =
      (currentTrackIndex + tracks.length + 1) % tracks.length

    moveToTrack.current(tracks[nextTrackIndex].id)
  })

  const pause = useRef(() => {
    if (!audioRef.current) return

    audioRef.current.pause()
    setIsPlaying(false)
  })
  const play = useRef(() => {
    if (!audioRef.current) return

    audioRef.current.play()
    setIsPlaying(true)
  })

  const providerValue = useMemo(
    () => ({
      audioRef,
      currentTrack,
      isPlaying,
      moveToNextTrack: moveToNextTrackRef.current,
      moveToPreviousTrack: moveToPreviousTrackRef.current,
      moveToTrack: moveToTrack.current,
      pause: pause.current,
      play: play.current,
      tracks,
    }),
    [currentTrack, isPlaying, pause, play, tracks]
  )

  return (
    <GlobalPlayerContext.Provider value={providerValue}>
      {children}
    </GlobalPlayerContext.Provider>
  )
})

export const useGlobalAudioPlayer: () => GlobalPlayerContextValue = () => {
  return useContext(GlobalPlayerContext)
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

const GlobalAudioPlayer = React.memo(() => {
  const {
    audioRef,
    currentTrack,
    isPlaying,
    moveToNextTrack,
    moveToPreviousTrack,
    moveToTrack,
    pause,
    play,
    tracks,
  } = useGlobalAudioPlayer()

  const handleSelect = useCallback(track => {
    moveToTrack(track.id)
  }, [])

  const handlePlayClick = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying])

  const isPlayingRef = useRef(isPlaying)

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    if (isPlayingRef.current) {
      play()
    }
  }, [currentTrack])

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
      pause()
    }

    return () => {
      if (isPlaying) {
        play()
      }
    }
  }, [])

  const timeToDisplay = `${formatTime(currentTimeRef.current)} / ${formatTime(
    currentDurationRef.current
  )}`

  const nameToDisplay = useMemo(() => {
    if (!currentTrack) return ""

    if (currentTrack.work.__typename === "SingleMovementWork") {
      return currentTrack.work.name
    }

    const multiMovementWorkName = currentTrack.work.multiMovementWork.name

    return `${multiMovementWorkName}: ${currentTrack.work.name}`
  }, [currentTrack])

  const titleContainerRef = useRef<HTMLElement>(null)
  const titleTextRef = useRef<HTMLParagraphElement>(null)
  const resizeObserverRef = useRef<any>()
  const [hasTitleScroll, setHasTitleScroll] = useState(false)

  const hasTitleScrollRef = useRef(hasTitleScroll)
  useEffect(() => {
    hasTitleScrollRef.current = hasTitleScroll
  }, [hasTitleScroll])

  useEffect(() => {
    if (resizeObserverRef.current) return

    resizeObserverRef.current = new ResizeObserver(() => {
      if (!titleTextRef.current) return

      if (titleTextRef.current.offsetWidth < titleTextRef.current.scrollWidth) {
        setHasTitleScroll(true)
      } else if (hasTitleScrollRef.current) {
        setHasTitleScroll(false)
      }
    })

    resizeObserverRef.current.observe(titleContainerRef.current)

    return () => {
      resizeObserverRef.current.unobserve(titleContainerRef.current)
    }
  }, [])

  return (
    <PlayerContainer>
      <StartColumn>
        <IconButton
          aria-label="Previous"
          onClick={moveToPreviousTrack}
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
        <IconButton aria-label="Next" onClick={moveToNextTrack} size="small">
          <ChevronRight />
        </IconButton>
        {tracks.length > 0 && (
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
                  {track.work.name}
                </Item>
              ))}
            </Menu>
          </Dropdown>
        )}
      </StartColumn>
      <EndColumn>
        <Information>
          {currentTrack && (
            <TitleContainer aria-label={nameToDisplay} ref={titleContainerRef}>
              <Title hasTitleScroll={hasTitleScroll} ref={titleTextRef}>
                {nameToDisplay}
              </Title>
            </TitleContainer>
          )}
          {currentTrack && (
            <Time aria-label={timeToDisplay}>({timeToDisplay})</Time>
          )}
        </Information>
        <Slider
          onChange={handleSliderChange}
          onStartSeek={handleStartSeek}
          value={currentProgress}
        />
      </EndColumn>
      {currentTrack && (
        <audio
          ref={audioRef}
          onEnded={moveToNextTrack}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          src={currentTrack.audioLink}
        >
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      )}
    </PlayerContainer>
  )
})

export default GlobalAudioPlayer
