const path = require("path")
const kebabCase = require("lodash/kebabCase")

const mapAlbumsRowToAlbumType = ({ albumId, description, name }) => ({
  description,
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
  {
    description,
    instrumentation,
    name,
    multiMovementWorkId,
    otherComposerCredit,
    workId,
  },
  { multiMovementWorksById, tracksByWorkId }
) => ({
  description,
  id: workId,
  instrumentation,
  internal: {
    type: "MultiMovementWorkMovement",
  },
  multiMovementWorkId,
  multiMovementWork: mapWorksRowToMultiMovementWork(
    multiMovementWorksById[multiMovementWorkId]
  ),
  name,
  otherComposerCredit,
  tracks: (tracksByWorkId[workId] || []).map(mapTracksRowToTrackType),
  workId,
})

const mapWorksRowToMultiMovementWork = ({
  category,
  description,
  instrumentation,
  multiMovementWorkId,
  name,
  otherComposerCredit,
}) => ({
  category,
  description,
  id: multiMovementWorkId,
  instrumentation,
  internal: {
    type: "MultiMovementWork",
  },
  movements: [],
  multiMovementWorkId,
  name,
  otherComposerCredit,
})

const mapWorksRowToSingleMovementWorkType = (
  { category, description, instrumentation, name, otherComposerCredit, workId },
  { tracksByWorkId }
) => ({
  category,
  description,
  id: workId,
  instrumentation,
  internal: {
    type: "SingleMovementWork",
  },
  name,
  otherComposerCredit,
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
                multiMovementWorksById,
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
              multiMovementWorksById,
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

exports.createResolvers = ({ createResolvers, reporter }) => {
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
      imageFile: {
        resolve(source, args, context, info) {
          const kebabCaseName = kebabCase(source.name)

          return context.nodeModel
            .runQuery({
              query: {
                filter: {
                  relativePath: { regex: `images/albums/${kebabCaseName}/` },
                },
              },
              type: "File",
              firstOnly: true,
            })
            .then(file => {
              if (!file) {
                throw new Error(
                  `Expected album of ${source.name} to have an associated image. See the developer documentation in README.md.`
                )
              }

              return file
            })
        },
        type: "File",
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

          const multiMovementWorks = context.nodeModel.getAllNodes(
            {
              type: "googleSheetMultiMovementWorksRow",
            },
            {
              connectionType: "googleSheetMultiMovementWorksRow",
            }
          )

          const multiMovementWorksById = multiMovementWorks.reduce(
            (accumulator, work) => {
              accumulator[work.multiMovementWorkId] = work
              return accumulator
            },
            {}
          )

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
              multiMovementWorksById,
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

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const result = await graphql(
    `
      {
        albums {
          description
          id
          imageFile {
            childImageSharp {
              fixed {
                base64
                width
                height
                src
                srcSet
              }
            }
          }
          name
          tracks {
            audioLink
            id
            work {
              __typename
              description
              id
              instrumentation
              name
              otherComposerCredit
              ... on SingleMovementWork {
                category
              }
            }
            youtubeLink
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild("Error getting albums")
    return
  }

  const albumTemplate = path.resolve("src/templates/Album.tsx")

  result.data.albums.forEach(album => {
    const safePath = kebabCase(album.name)
    createPage({
      path: `/music/album/${safePath}`,
      component: albumTemplate,
      context: {
        album,
      },
    })
  })
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
      description: String!
      id: ID!
      imageFile: File!
      name: String!
    }

    interface Work {
      description: String
      id: ID!
      instrumentation: String
      name: String!
      otherComposerCredit: String
    }

    type SingleMovementWork implements Node & Work {
      category: String!
      description: String
      id: ID!
      instrumentation: String
      name: String!
      otherComposerCredit: String
      tracks: [Track!]!
    }

    type MultiMovementWorkMovement implements Node & Work {
      description: String
      id: ID!
      instrumentation: String
      name: String!
      tracks: [Track!]!
      otherComposerCredit: String
      multiMovementWork: MultiMovementWork!
    }

    type MultiMovementWork implements Node & Work {
      category: String!
      description: String
      id: ID!
      instrumentation: String
      movements: [MultiMovementWorkMovement!]!
      name: String!
      otherComposerCredit: String
    }
  `
  createTypes(typeDefs)
}
