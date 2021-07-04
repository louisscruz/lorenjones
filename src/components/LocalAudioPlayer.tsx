import React, { useCallback } from "react"
import { IconButton } from "@zendeskgarden/react-buttons"
import PlayIcon from "@zendeskgarden/svg-icons/src/12/play-fill.svg"
import PauseIcon from "@zendeskgarden/svg-icons/src/12/pause-fill.svg"

import { useGlobalAudioPlayer } from "./GlobalAudioPlayer"
import { Immutable, Track } from "../types"

type LocalAudioPlayerProps = Immutable<{
  track: Track
}>

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
    <IconButton isPrimary onClick={handlePlayerClick} size="small">
      {isCurrentTrackAndPlaying ? <PauseIcon /> : <PlayIcon />}
    </IconButton>
  )
})

export default LocalAudioPlayer
