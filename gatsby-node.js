const mapAlbumsRowToAlbumType = ({ albumId, name }) => ({
  id: albumId,
  name,
})

const mapTracksRowToTrackType = ({ albumId, audioLink, trackId, workId }) => ({
  albumId,
  audioLink,
  id: trackId,
  workId,
})

const mapWorksRowToMultiMovementWorkMovementType = (
  { description, name, multiMovementWorkId, workId },
  { tracksByWorkId }
) => ({
  description,
  id: workId,
  internal: {
    type: "MultiMovementWorkMovement",
  },
  multiMovementWorkId,
  name,
  tracks: (tracksByWorkId[workId] || []).map(mapTracksRowToTrackType),
  workId,
})

const mapWorksRowToMultiMovementWork = ({
  category,
  description,
  name,
  multiMovementWorkId,
}) => ({
  category,
  description,
  id: multiMovementWorkId,
  internal: {
    type: "MultiMovementWork",
  },
  movements: [],
  multiMovementWorkId,
  name,
})

const mapWorksRowToSingleMovementWorkType = (
  { category, description, name, workId },
  { tracksByWorkId }
) => ({
  category,
  description,
  id: workId,
  internal: {
    type: "SingleMovementWork",
  },
  name,
  tracks: (tracksByWorkId[workId] || []).map(mapTracksRowToTrackType),
})

const getAllWorks = context => {
  const works = context.nodeModel.getAllNodes(
    {
      type: "googleSheetWorksRow",
    },
    {
      connectionType: "googleSheetWorksRow",
    }
  )
  const multiMovementWorks = context.nodeModel.getAllNodes(
    {
      type: "googleSheetMultiMovementWorksRow",
    },
    {
      connectionType: "googleSheetMultiMovementWorksRow",
    }
  )
  const tracks = context.nodeModel.getAllNodes(
    {
      type: "googleSheetTracksRow",
    },
    {
      connectionType: "googleSheetTracksRow",
    }
  )

  const multiMovementWorksById = multiMovementWorks.reduce(
    (accumulator, work) => {
      accumulator[work.multiMovementWorkId] = work
      return accumulator
    },
    {}
  )
  const tracksByWorkId = tracks.reduce((accumulator, track) => {
    if (!accumulator[track.workId]) {
      accumulator[track.workId] = []
    }

    accumulator[track.workId].push(track)

    return accumulator
  }, {})

  const { accumulatedMultiMovementWork, finalWorks } = works.reduce(
    (accumulator, work) => {
      const { accumulatedMultiMovementWork, finalWorks } = accumulator
      const isMultiMovementWork = Boolean(work.multiMovementWorkId)

      // In this case, we are visiting a multi-movement work.
      if (isMultiMovementWork) {
        // In this case, we were already accumulating a multi-movement
        // work.
        if (accumulatedMultiMovementWork) {
          const isSameId =
            accumulatedMultiMovementWork.id === work.multiMovementWorkId
          // In this case, the work we're currently looking at should be
          // tacked onto the current multi-movement work we're
          // accumulating.
          if (isSameId) {
            accumulator.accumulatedMultiMovementWork.movements.push(
              mapWorksRowToMultiMovementWorkMovementType(work, {
                tracksByWorkId,
              })
            )
            // In this case, the work we're looking at is a movement to
            // another multi-movement work. We need to flush the current
            // accumulated multi-movement work and start a new multi-
            // movement work to accumulate on.
          } else {
            finalWorks.push(accumulator.accumulatedMultiMovementWork)
            accumulator.accumulatedMultiMovementWork = mapWorksRowToMultiMovementWork(
              work
            )
          }
          // In this case, this is the first multi-movement work that
          // we've seen. Let's start accumulating.
        } else {
          const multiMovementWork =
            multiMovementWorksById[work.multiMovementWorkId]
          accumulator.accumulatedMultiMovementWork = mapWorksRowToMultiMovementWork(
            multiMovementWork
          )
          accumulator.accumulatedMultiMovementWork.movements.push(
            mapWorksRowToMultiMovementWorkMovementType(work, {
              tracksByWorkId,
            })
          )
        }
        // In this case, we're vising a single movement work.
      } else {
        // In this case, we have an accumulated multi-movement work, so
        // we need to flush it before adding the single movement work.
        if (accumulatedMultiMovementWork) {
          finalWorks.push(accumulator.accumulatedMultiMovementWork)
          accumulator.accumulatedMultiMovementWork = null
        }

        accumulator.finalWorks.push(
          mapWorksRowToSingleMovementWorkType(work, { tracksByWorkId })
        )
      }

      return accumulator
    },
    { accumulatedMultiMovementWork: null, finalWorks: [] }
  )

  // In this case, we ended with a multi-movement accumulated work. So,
  // we need to flush.
  if (accumulatedMultiMovementWork) {
    finalWorks.push(accumulatedMultiMovementWork)
  }

  return finalWorks
}

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Album: {
      tracks: {
        resolve(source, args, context, info) {
          const tracks = context.nodeModel
            .getAllNodes(
              {
                type: "googleSheetTracksRow",
              },
              {
                connectionType: "googleSheetTracksRow",
              }
            )
            .filter(({ albumId }) => albumId === source.id)

          if (!tracks.length) {
            throw new Error(
              `Expected tracks to exist for album with albumId of ${source.id}.`
            )
          }

          return tracks.map(mapTracksRowToTrackType)
        },
        type: ["Track"],
      },
    },
    Query: {
      albums: {
        resolve(source, args, context, info) {
          return context.nodeModel
            .getAllNodes(
              {
                type: "googleSheetAlbumsRow",
              },
              {
                connectionType: "googleSheetAlbumsRow",
              }
            )
            .map(mapAlbumsRowToAlbumType)
        },
        type: ["Album"],
      },
      tracks: {
        resolve(source, args, context, info) {
          const works = getAllWorks(context)
          const worksById = works.reduce((accumulator, work) => {
            accumulator[work.id] = works
            return accumulator
          }, {})

          return context.nodeModel
            .getAllNodes(
              {
                type: "googleSheetTracksRow",
              },
              {
                connectionType: "googleSheetTracksRow",
              }
            )
            .map(trackRow => mapTracksRowToTrackType(trackRow, { worksById }))
        },
        type: ["Track"],
      },
      works: {
        resolve(source, args, context, info) {
          return getAllWorks(context)
        },
        type: ["Work"],
      },
    },
    Track: {
      album: {
        resolve(source, args, context, info) {
          if (!source.albumId) return null

          const album = context.nodeModel
            .getAllNodes(
              { type: "googleSheetAlbumsRow" },
              { connectionType: "googleSheetAlbumsRow" }
            )
            .find(({ albumId }) => albumId === source.albumId)

          if (!album) {
            throw new Error(
              `Expected album with albumId of ${source.albumId} to be found.`
            )
          }

          return mapAlbumsRowToAlbumType(album)
        },
      },
      work: {
        resolve(source, args, context, info) {
          const work = context.nodeModel
            .getAllNodes(
              { type: "googleSheetWorksRow" },
              { connectionType: "googleSheetWorksRow" }
            )
            .find(({ workId }) => workId === source.workId)

          if (!work) {
            throw new Error(
              `Expected work with workId of ${source.workId} to be found.`
            )
          }

          const tracks = context.nodeModel
            .getAllNodes(
              { type: "googleSheetTracksRow" },
              { connectionType: "googleSheetTracksRow" }
            )
            .filter(({ workId }) => workId === source.workId)

          const tracksByWorkId = tracks.reduce((accumulator, track) => {
            if (!accumulator[track.workId]) {
              accumulator[track.workId] = []
            }

            accumulator[track.workId].push(track)

            return accumulator
          }, {})

          if (work.multiMovementWorkId) {
            return mapWorksRowToMultiMovementWorkMovementType(work, {
              tracksByWorkId,
            })
          }

          return mapWorksRowToSingleMovementWorkType(work, { tracksByWorkId })
        },
        type: "Work",
      },
    },
  }

  createResolvers(resolvers)
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Track implements Node {
      album: Album
      audioLink: String!
      id: ID!
      work: Work!
      youtubeLink: String
    }

    type Album {
      id: ID!
      name: String!
    }

    interface Work {
      description: String
      id: ID!
      name: String!
    }

    type SingleMovementWork implements Node & Work {
      category: String!
      description: String
      id: ID!
      name: String!
      tracks: [Track!]!
    }

    type MultiMovementWorkMovement implements Node & Work {
      description: String
      id: ID!
      name: String!
      tracks: [Track!]!
    }

    type MultiMovementWork implements Node & Work {
      category: String!
      description: String
      id: ID!
      movements: [MultiMovementWorkMovement!]!
      name: String!
    }
  `
  createTypes(typeDefs)
}
