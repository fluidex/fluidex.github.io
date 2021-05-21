import React from "react";
import Layout from "../../components/layout";
import LinkWithLang from "../../components/link-with-lang";
import { useTranslation } from "react-i18next";

const toKebabCase = (str) => {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-");
};

const Tags = ({ data, pageContext }) => {
  const { t } = useTranslation();
  const tags = data.allMarkdownRemark.group;

  return (
    <Layout title={t("allTags")} langKey={pageContext.langKey}>
      <h1>{t("allTags")}</h1>

      <ul>
        {tags.map((tag) => (
          <li key={tag.fieldValue}>
            <LinkWithLang
              langKey={pageContext.langKey}
              to={`/tags/${toKebabCase(tag.fieldValue)}/`}
            >
              {tag.fieldValue} ({tag.totalCount})
            </LinkWithLang>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Tags;
