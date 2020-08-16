const http = require("http")

const options = {
  host: "louisscruz.github.io",
  path: "/lorenjones/",
}

http
  .request(options, response => {
    let responseString = ""

    response.on("data", chunk => {
      responseString += chunk
    })

    response.on("end", () => {
      const selector = '<meta name="revised" content="'
      const lastRevisionMetaIndex = responseString.indexOf(selector)
      if (lastRevisionMetaIndex === -1) {
        console.error("Failed to find the revised meta tag.")
        process.exit(1)
      } else {
        const contentIndex = lastRevisionMetaIndex + selector.length
        const lastRevision = responseString.slice(
          contentIndex,
          contentIndex + 19
        )
        console.log(lastRevision)
      }
    })
  })
  .end()
