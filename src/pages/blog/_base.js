import React from "react";
import Layout from "../../components/layout";
import PostList from "../../components/post-list";
import LinkWithLang from "../../components/link-with-lang";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Blog = ({ data, pageContext }) => {
  const { t } = useTranslation();
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout title={t("blog")} langKey={pageContext.langKey}>
      <HeaderWrapper>
        <h1>{t("blog")}</h1>

        <LinkWithLang
          css={`
            margin-top: var(--size-400);
            color: inherit;
            text-transform: uppercase;
          `}
          langKey={pageContext.langKey}
          to="/tags"
        >
          {t("viewAllTags")}
        </LinkWithLang>
      </HeaderWrapper>

      <PostList posts={posts} langKey={pageContext.langKey} />
    </Layout>
  );
};

export default Blog;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: var(--size-900);
  margin-bottom: var(--size-700);

  h1 {
    max-width: none;
  }
`;
