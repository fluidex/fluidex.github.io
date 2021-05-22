import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import PostList from "../components/post-list";
import styled from "styled-components";
import { StyledLinkWithLang } from "../components/styled-link";
import { useTranslation } from "react-i18next";

const HomePage = ({ data, pageContext }) => {
  const { t } = useTranslation();

  const posts = data.allMarkdownRemark.nodes;
  const intro = data.markdownRemark.html;
  const title = data.markdownRemark.frontmatter.title;

  return (
    <Layout title={title} langKey={pageContext.langKey || "en"}>
      <Intro
        dangerouslySetInnerHTML={{
          __html: intro,
        }}
      />

      <PostList posts={posts} langKey={pageContext.langKey} />
      <StyledLinkWithLang
        css={`
          display: block;
          margin-top: var(--size-800);
          margin-bottom: var(--size-800);
          margin-left: auto;
          margin-right: auto;
          width: fit-content;
        `}
        langKey={pageContext.langKey}
        to="/blog"
      >
        {t("viewAllPosts")}
      </StyledLinkWithLang>
    </Layout>
  );
};

export default HomePage;

const Intro = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 60ch;
  align-items: center;
  margin-right: auto;
  margin-left: auto;
  margin-top: var(--size-800);
  margin-bottom: var(--size-900);
  text-align: center;

  & p {
    text-transform: capitalize;
    font-size: var(--size-400);
  }

  @media screen and (max-width: 700px) {
    & h1 {
      font-size: var(--size-700);
    }
  }

  a {
    color: inherit;
    text-decoration: underline;
    text-decoration-thickness: 0.125rem;
  }
`;

export const pageQuery = graphql`
  query($slug: String!, $langKey: String!) {
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
      limit: 9
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
