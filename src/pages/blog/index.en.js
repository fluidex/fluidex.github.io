import { graphql } from "gatsby";

import Blog from "./_base";
export default Blog;

export const query = graphql`
  query($langKey: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: {
        fields: { contentType: { eq: "posts" }, langKey: { eq: $langKey } }
      }
      sort: { order: DESC, fields: frontmatter___date }
    ) {
      nodes {
        fields {
          slug
        }
        excerpt
        timeToRead
        frontmatter {
          date
          description
          title
          tags
        }
      }
    }
  }
`;
