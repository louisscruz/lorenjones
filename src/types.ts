export interface ImageSharpFixed {
  aspectRatio: number
  base64: string
  height: number
  originalName: string
  src: string
  srcSet: string
  srcWebp: string
  srcSetWebp: string
  tracedSVG: string
  width: number
}

export interface ImageSharpFluid {
  aspectRatio: number
  base64: string
  originalImg: string
  originalName: string
  presentationHeight: number
  presentationWidth: number
  sizes: string
  src: string
  srcSet: string
  srcWebp: string
  srcSetWebp: string
  tracedSVG: string
}

export interface ChildImageSharp {
  fixed: ImageSharpFixed
  fluid: ImageSharpFluid
}

export interface File {
  extension: string
  id: string
  relativePath: string
  childImageSharp: ChildImageSharp
}

export interface Album {
  __typename: "Album"
  description: string
  id: string
  imageFile: File
  name: string
  tracks: Track[]
}

export interface Track {
  __typename: "Track"
  album?: Album
  audioLink: string
  id: string
  work: TrackableWork
  youtubeLink?: string
}

export interface Work {
  __typename:
    | "SingleMovementWork"
    | "MultiMovementWorkMovement"
    | "MultiMovementWork"
  description?: string
  id: string
  instrumentation?: string
  name: string
  otherComposerCredit?: string
}

export interface SingleMovementWork extends Work {
  __typename: "SingleMovementWork"
  category: string
  tracks: Track[]
}

export interface MultiMovementWorkMovement extends Work {
  __typename: "MultiMovementWorkMovement"
  multiMovementWork: MultiMovementWork
  tracks: Track[]
}

export interface MultiMovementWork extends Work {
  __typename: "MultiMovementWork"
  category: string
  movements: MultiMovementWorkMovement[]
}

export type TrackableWork = SingleMovementWork | MultiMovementWorkMovement

export type ListableWork = SingleMovementWork | MultiMovementWork

export function isSingleMovementWork(work: Work): work is SingleMovementWork {
  return work.__typename === "SingleMovementWork"
}
export function isMultiMovementWork(work: Work): work is MultiMovementWork {
  return work.__typename === "MultiMovementWork"
}
export function isMultiMovementWorkMovement(
  work: Work
): work is MultiMovementWorkMovement {
  return work.__typename === "MultiMovementWorkMovement"
}

export type Immutable<T> = {
  readonly [K in keyof T]: Immutable<T[K]>
}
