import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import PostList from "../components/post-list";
import { StyledLinkWithLang } from "../components/styled-link";
import LinkWithLang from "../components/link-with-lang";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

const TagsTemplate = ({ pageContext, data }) => {
  const { t } = useTranslation();
  const { tag, langKey } = pageContext;
  const { totalCount } = data.allMarkdownRemark;
  const posts = data.allMarkdownRemark.nodes;
  const title = `${t("postsTagged")} ${tag}`;

  return (
    <Layout title={title} langKey={langKey}>
      <TagsTemplateWrapper>
        <Title>
          <Trans i18nKey="numberOfPostsTagged">
            {{ totalCount }} posts tagged "{{ tag }}"
          </Trans>
        </Title>
        <LinkWithLang
          css={`
            margin-top: var(--size-400);
            display: inline-block;
            color: inherit;
            text-transform: uppercase;
          `}
          to="/tags"
          langKey={langKey}
        >
          {t("viewAllTags")}
        </LinkWithLang>
        <PostList posts={posts} langKey={pageContext.langKey} />

        <StyledLinkWithLang
          css={`
            margin-top: var(--size-400);
            display: inline-block;
          `}
          to="/tags"
          langKey={langKey}
        >
          {t("viewAllTags")}
        </StyledLinkWithLang>
      </TagsTemplateWrapper>
    </Layout>
  );
};

export default TagsTemplate;

const TagsTemplateWrapper = styled.div`
  padding-top: var(--size-900);
`;

const Title = styled.h1`
  font-size: var(--size-700);
`;

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { tags: { in: [$tag] } }
        fields: { contentType: { eq: "posts" } }
      }
    ) {
      totalCount
      nodes {
        fields {
          slug
        }
        frontmatter {
          date
          description
          tags
          title
        }
        timeToRead
        excerpt
      }
    }
  }
`;
