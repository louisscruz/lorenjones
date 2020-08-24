require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const path = require("path")

const {
  GOOGLE_SPREADSHEET_ID,
  GOOGLE_SERVICE_ACCOUNT_CREDENTIALS,
} = process.env

const isGitHubActionsWorkflowRun = Boolean(process.env.GITHUB_RUN_ID)
if (isGitHubActionsWorkflowRun && !GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
  throw new Error("Missing environment variables")
}

const googleServiceAccountCredentials = isGitHubActionsWorkflowRun
  ? JSON.parse(GOOGLE_SERVICE_ACCOUNT_CREDENTIALS.trim().replace(/\n/g, "\\n"))
  : require("./.google-service-account-credentials.json")

function checkEnv(envName) {
  if (
    typeof process.env[envName] === "undefined" ||
    process.env[envName] === ""
  ) {
    throw `Missing required environment variables: ${envName}`
  }
}

try {
  checkEnv("NODE_ENV")
  checkEnv("GOOGLE_SPREADSHEET_ID")
  checkEnv("GATSBY_CONTACT_FORM_POST_URL")
  checkEnv("GATSBY_LORENS_EMAIL_ADDRESS")
  checkEnv("GOOGLE_DRIVE_FOLDER_ID")
  checkEnv("GOOGLE_SPREADSHEET_ID")
} catch (e) {
  throw new Error(e)
}

module.exports = {
  // For GitHub Pages
  pathPrefix: "/lorenjones",
  siteMetadata: {
    title: `Loren Jones Music`,
    description: `The music of composer and instrumentalist Loren Jones`,
    author: "@luckycatfactory",
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    "gatsby-plugin-layout",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    "gatsby-plugin-styled-components",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-source-google-sheets",
      options: {
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        worksheetTitle: "albums",
        credentials: googleServiceAccountCredentials,
      },
    },
    {
      resolve: "gatsby-source-google-sheets",
      options: {
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        worksheetTitle: "bios",
        credentials: googleServiceAccountCredentials,
      },
    },
    {
      resolve: "gatsby-source-google-sheets",
      options: {
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        worksheetTitle: "quotes",
        credentials: googleServiceAccountCredentials,
      },
    },
    {
      resolve: "gatsby-source-google-sheets",
      options: {
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        worksheetTitle: "tracks",
        credentials: googleServiceAccountCredentials,
      },
    },
    {
      resolve: "gatsby-source-google-sheets",
      options: {
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        worksheetTitle: "version",
        credentials: googleServiceAccountCredentials,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: [/node_modules\/.*\.svg/, /images\/.*\.svg/],
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
