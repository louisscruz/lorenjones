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

const mapWorksRowToMultiMovementWorkMovementType = ({
  description,
  name,
  multiMovementWorkId,
  workId,
}) => ({
  description,
  id: workId,
  name,
  multiMovementWorkId,
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

const mapWorksRowToSingleMovementWorkType = ({
  category,
  description,
  name,
  workId,
}) => ({
  category,
  description,
  id: workId,
  internal: {
    type: "SingleMovementWork",
  },
  name,
})

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Album: {
      tracks: {
        resolve(source, args, context, info) {
          const tracks = context.nodeModel
            .getAllNodes({
              type: "googleSheetTracksRow",
            })
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
            .getAllNodes({
              type: "googleSheetAlbumsRow",
            })
            .map(mapAlbumsRowToAlbumType)
        },
        type: ["Album"],
      },
      tracks: {
        resolve(source, args, context, info) {
          return context.nodeModel
            .getAllNodes({
              type: "googleSheetTracksRow",
            })
            .map(mapTracksRowToTrackType)
        },
        type: ["Track"],
      },
      works: {
        resolve(source, args, context, info) {
          const works = context.nodeModel.getAllNodes({
            type: "googleSheetWorksRow",
          })
          const multiMovementWorks = context.nodeModel.getAllNodes({
            type: "googleSheetMultiMovementWorksRow",
          })

          const multiMovementWorksById = multiMovementWorks.reduce(
            (accumulator, work) => {
              accumulator[work.multiMovementWorkId] = work
              return accumulator
            },
            {}
          )
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
                      mapWorksRowToMultiMovementWorkMovementType(work)
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
                  accumulator.accumulatedMultiMovementWork = mapWorksRowToMultiMovementWork(
                    work
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
                  mapWorksRowToSingleMovementWorkType(work)
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

          console.log("*** here", finalWorks)
          return finalWorks
        },
        type: ["Work"],
      },
    },
    Track: {
      album: {
        resolve(source, args, context, info) {
          if (!source.albumId) return null

          const album = context.nodeModel
            .getAllNodes({ type: "googleSheetAlbumsRow" })
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
            .getAllNodes({ type: "googleSheetWorksRow" })
            .find(({ workId }) => workId === source.workId)

          if (!work) {
            throw new Error(
              `Expected work with workId of ${source.workId} to be found.`
            )
          }

          return mapWorksRowToSingleMovementWorkType(work)
        },
        type: ["Work"],
      },
      Work: {
        type: ["Work"],
        resolve(source, args, context, info) {
          console.log("*** WORK RESOLVER")
          return {
            __typeName: "SingleMovementWork",
            category: "hello",
            description: "hello",
            id: "1",
            name: "name",
          }
        },
      },
      SingleMovementWork: {
        type: ["SingleMovementWork"],
        resolve(source, args, context, info) {
          return {
            __typeName: "SingleMovementWork",
            category: "hello",
            description: "hello",
            id: "1",
            name: "name",
          }
        },
      },
      MultiMovementWorkMovement: {
        type: ["MultiMovementWorkMovement"],
        resolve(source, args, context, info) {
          return {
            __typeName: "MultiMovementWorkMovement",
            description: "hello",
            id: "1",
            name: "name",
          }
        },
      },
      MultiMovementWork: {
        type: ["MultiMovementWork"],
        resolve(source, args, context, info) {
          return {
            __typeName: "MultiMovementWork",
            category: "hello",
            description: "hello",
            id: "1",
            name: "name",
          }
        },
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
    }

    type MultiMovementWorkMovement implements Node & Work {
      description: String
      id: ID!
      name: String!
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
