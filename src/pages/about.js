import * as React from "react"
import Header from "../components/header";
import Layout from "../components/layout";
import {graphql} from "gatsby";

const About = ({data, location}) => {
    const siteTitle = data.site.siteMetadata?.title || `Title`
    return (
        <Layout location={location} title={siteTitle}>
            this is about
        </Layout>
    )
};

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export default About;