/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useMemo } from "react"
import { Helmet, HelmetProps } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

type MetaEntries = Exclude<HelmetProps["meta"], undefined>

interface SEOProps {
  description?: string
  lang?: string
  meta?: MetaEntries
  title: string
}

const SEO = React.memo<SEOProps>(
  ({ description = "", lang = "en", meta = [], title }) => {
    const { site } = useStaticQuery(
      graphql`
        query {
          site {
            siteMetadata {
              title
              description
              author
            }
          }
        }
      `
    )

    const metaDescription = description || site.siteMetadata.description

    const htmlAttributes = useMemo(() => ({ lang }), [lang])

    const metaToUse: MetaEntries = useMemo(
      () => [
        {
          name: "description",
          content: metaDescription,
        },
        ...meta,
      ],
      [metaDescription, meta]
    )

    return (
      <Helmet
        htmlAttributes={htmlAttributes}
        title={title}
        titleTemplate={`%s | ${site.siteMetadata.title}`}
        meta={metaToUse}
      />
    )
  }
)

export default SEO
