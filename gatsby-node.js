// const validateOptionalRelation =
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

const mapWorksRowToMovementType = ({
  description,
  name,
  multiMovementWorkId,
  workId,
}) => ({
  description,
  name,
  multiMovementWorkId,
  workId,
})

const mapWorksRowToWorkType = ({
  category,
  description,
  movements,
  name,
  workId,
  multiMovementWorkId,
}) => ({
  category,
  description,
  id: workId,
  internal: {
    type: multiMovementWorkId
      ? "MultiMovementWorkMovement"
      : "SingleMovementWork",
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
          console.log("*** WHAT? RUNNING TRACKS RESOLVER")
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
          console.log("*** HELLO")
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
          const { accumulatedMultiMovementWorks, finalWorks } = works.reduce(
            (accumulator, work, index) => {
              const isMultiMovementWork = Boolean(work.multiMovementWorkId)
              const isLast = index === works.length - 1

              if (isMultiMovementWork) {
                const previousMultiMovementWork =
                  accumulator.accumulatedMultiMovementWorks[
                    accumulator.accumulatedMultiMovementWorks.length - 1
                  ]

                if (previousMultiMovementWork) {
                  const isSameId =
                    previousMultiMovementWork.multiMovementWorkId ===
                    work.multiMovementWorkId

                  if (isSameId) {
                    accumulator.accumulatedMultiMovementWorks.push(
                      mapWorksRowToMovementType(work)
                    )
                  }

                  if (!isSameId || isLast) {
                    accumulator.finalWorks.push({})
                    accumulator.multiMovementWorks = []
                  }
                }

                if (isLast) {
                  accumulator.finalWorks.push({})
                  accumulator.multiMovementWorks = []
                }
              }

              if (!isMultiMovementWork) {
                accumulator.finalWorks.push(mapWorksRowToWorkType(work))
              }

              return accumulator
            },
            { accumulatedMultiMovementWorks: [], finalWorks: [] }
          )

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

          return mapWorksRowToWorkType(work)
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
      // MultiMovementWorkMovement: {},
      // MultiMovementWork: {
      //   category: {
      //     type: "String",
      //     resolve(source, args, context, info) {
      //       return "hello"
      //     },
      //   },
      //   // resolve(source, args, context, info) {
      //   //   return mapWorksRowToWorkType(source)
      //   // },
      //   // type: "MultiMovementWork",
      // },
      // SingleMovementWork: {
      //   resolve(source, args, context, info) {
      //     return mapWorksRowToWorkType(source)
      //   },
      //   type: "MultiMovementWork",
      // },
      // MultiMovementWorkMovement: {
      //   resolve(source, args, context, info) {
      //     return mapWorksRowToWorkType(source)
      //   },
      //   type: "MultiMovementWork",
      // },
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
