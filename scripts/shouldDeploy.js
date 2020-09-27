// We want this script to be fast. At the time of this writing, two dependencies
// are required:
//
// * google-spreadsheet
// * dotenv (but only in development)
//
const fs = require("fs")
const { GoogleSpreadsheet } = require("google-spreadsheet")
const http = require("http")
const path = require("path")

const loadConditionalEnvironment = () =>
  new Promise(resolve => {
    if (process.env.GITHUB_WORKFLOW) {
      resolve()
    }

    require("dotenv").config({
      path: path.join(__dirname, "../.env.development"),
    })

    resolve()
  })

const getEnvironment = () =>
  loadConditionalEnvironment().then(
    () =>
      new Promise((resolve, reject) => {
        if (!process.env.GOOGLE_SPREADSHEET_ID) {
          reject(
            new Error(
              "Expected GOOGLE_SPREADSHEET_ID to be present, but it was not."
            )
          )
        } else if (!process.env.GOOGLE_SPREADSHEET_WORKSHEET_ID) {
          reject(
            new Error(
              "Expected GOOGLE_SPREADSHEET_WORKSHEET_ID to be present, but it was not."
            )
          )
        }

        resolve({
          GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID,
          GOOGLE_SPREADSHEET_WORKSHEET_ID:
            process.env.GOOGLE_SPREADSHEET_WORKSHEET_ID,
        })
      })
  )

const getCurrentPublishedRevisionDate = () => {
  const options = {
    host: "louisscruz.github.io",
    path: "/lorenjones/",
  }

  return new Promise((resolve, reject) => {
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
            reject(new Error("Failed to find the revised meta tag."))
          } else {
            const contentIndex = lastRevisionMetaIndex + selector.length
            const lastRevision = responseString.slice(
              contentIndex,
              contentIndex + 22
            )
            resolve(lastRevision)
          }
        })
      })
      .end()
  })
}

const CREDENTIALS_PATH = path.join(
  __dirname,
  "../.google-service-account-credentials.json"
)

const getGoogleCredentials = () =>
  new Promise((resolve, reject) => {
    if (process.env.GITHUB_WORKFLOW) {
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
        reject(new Error("Unable to get credentials"))
      }

      resolve(
        JSON.parse(
          process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS.trim().replace(
            /\n/g,
            "\\n"
          )
        )
      )
    }

    fs.readFile(CREDENTIALS_PATH, (error, content) => {
      if (error) {
        reject(new Error("Unable to get credentials"))
      }

      try {
        const parsedCredentials = JSON.parse(content)
        resolve(parsedCredentials)
      } catch (e) {
        reject(new Error("Failed to parse credentials"))
      }
    })
  })

const getSheet = (credentials, spreadsheetId, worksheetId) => {
  const sheet = new GoogleSpreadsheet(spreadsheetId)

  return sheet
    .useServiceAccountAuth(credentials)
    .then(() => sheet.loadInfo())
    .then(
      () =>
        new Promise((resolve, reject) => {
          const worksheet = sheet.sheetsById[worksheetId]

          if (!worksheet) {
            reject(new Error("Unable to find worksheet for version"))
          }

          resolve(worksheet)
        })
    )
}

const getSheetRevisionDate = (spreadsheetId, worksheetId) =>
  getGoogleCredentials()
    .then(credentials => getSheet(credentials, spreadsheetId, worksheetId))
    .then(sheet => sheet.getRows())
    .then(
      rows =>
        new Promise((resolve, reject) => {
          const updatedAt = rows[0]["updated-at"]

          if (!updatedAt) {
            reject(
              new Error(
                "Expected there to be an updated-at value, but there was not. Check the sheet."
              )
            )
          }

          resolve(updatedAt)
        })
    )

getEnvironment()
  .then(({ GOOGLE_SPREADSHEET_ID, GOOGLE_SPREADSHEET_WORKSHEET_ID }) =>
    getSheetRevisionDate(GOOGLE_SPREADSHEET_ID, GOOGLE_SPREADSHEET_WORKSHEET_ID)
      .then(sheetsDate => {
        console.log(
          `The Google sheet shows as being last revised: ${sheetsDate}`
        )
        return sheetsDate
      })
      .then(sheetsDate =>
        getCurrentPublishedRevisionDate().then(publishedDate => {
          console.log(
            `The website shows as being last revised: ${publishedDate}`
          )
          return [sheetsDate, publishedDate]
        })
      )
      .then(([sheetsDate, publishedDate]) => {
        // This check is completely dependent on the date and time format being
        // string comparable.
        console.log(sheetsDate > publishedDate)
      })
      .then(() => {
        console.log(
          "The Google sheet looks to have been updated. A publish should occur!"
        )
      })
  )
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
