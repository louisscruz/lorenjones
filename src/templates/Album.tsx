import React, { useMemo } from "react"
import { Paragraph, LG, XXL } from "@zendeskgarden/react-typography"

import { Album, Immutable, Track } from "../types"
import ContentContainer from "../components/ContentContainer"
import LocalAudioPlayer from "../components/LocalAudioPlayer"

type AlbumTrackProps = Immutable<{
  index: number
  track: Track
}>

type AlbumProps = Immutable<{
  pageContext: {
    album: Album
  }
}>

const AlbumTrack = React.memo<AlbumTrackProps>(({ index, track }) => (
  <div>
    <div>
      {index}. {track.work.name}
    </div>
    <LocalAudioPlayer track={track} />
  </div>
))

const Albums = React.memo<AlbumProps>(({ pageContext: { album } }) => {
  const descriptionParagraphs = useMemo(() => album.description.split("\n"), [
    album.description,
  ])

  const albumImageAltText = useMemo(() => `${album.name} Album Cover`, [album])

  return (
    <ContentContainer>
      <img alt={albumImageAltText} {...album.imageFile.childImageSharp.fixed} />
      <XXL>{album.name}</XXL>
      {descriptionParagraphs.map((paragraph, index) => (
        <Paragraph key={index}>{paragraph}</Paragraph>
      ))}
      <LG>Excerpts</LG>
      {album.tracks.map((track, index) => (
        <AlbumTrack key={track.id} index={index + 1} track={track} />
      ))}
    </ContentContainer>
  )
})

export default Albums
