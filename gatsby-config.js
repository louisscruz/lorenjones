const path = require("path")

const env = require("./.env")

module.exports = {
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
        spreadsheetId: env.googleSpreadsheetId,
        worksheetTitle: "albums",
        credentials: env.googleServiceAccountCredentials,
      },
    },
    {
      resolve: "gatsby-source-google-sheets",
      options: {
        spreadsheetId: env.googleSpreadsheetId,
        worksheetTitle: "tracks",
        credentials: env.googleServiceAccountCredentials,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /node_modules/,
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
