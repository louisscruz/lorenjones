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

const mapWorksRowToWorkType = ({
  category,
  description,
  movements,
  name,
  workId,
  multiMovementWorkId,
}) => ({
  __typeName: multiMovementWorkId ? "MultiMovementWork" : "SingleMovementWork",
  category,
  description,
  id: workId,
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
          const things =
            [
              {
                workId: "1",
                description: "hello",
                name: "Ohlone Song",
                category: "Hello",
              },
            ] ||
            context.nodeModel.getAllNodes({
              type: "googleSheetWorksRow",
            })

          console.log("*** here", things, things.map(mapWorksRowToWorkType))
          return things.map(mapWorksRowToWorkType)
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
      // MultiMovementWork: {
      //   resolve(source, args, context, info) {
      //     return mapWorksRowToWorkType(source)
      //   },
      //   type: "MultiMovementWork",
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

    type SingleMovementWork implements Work {
      category: String!
      description: String
      id: ID!
      name: String!
    }

    type MultiMovementWorkMovement implements Work {
      description: String
      id: ID!
      name: String!
    }

    type MultiMovementWork implements Work {
      category: String!
      description: String
      id: ID!
      movements: [MultiMovementWorkMovement!]!
      name: String!
    }
  `
  createTypes(typeDefs)
}
