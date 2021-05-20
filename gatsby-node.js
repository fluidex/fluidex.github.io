const path = require(`path`);

const toKebabCase = (str) => {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-");
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          nodes {
            fields {
              contentType
              slug
              langKey
            }
            frontmatter {
              template
            }
          }
        }
        tagsGroup: allMarkdownRemark(
          limit: 2000
          filter: { fields: { contentType: { eq: "posts" } } }
        ) {
          group(field: frontmatter___tags) {
            fieldValue
          }
        }
      }
    `
  );

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    );
    return;
  }

  const tags = result.data.tagsGroup.group;
  const allMarkdownNodes = result.data.allMarkdownRemark.nodes;

  const blogMarkdownNodes = allMarkdownNodes.filter(
    (node) => node.fields.contentType === `posts`
  );
  const zhBlogMarkdownNodes = blogMarkdownNodes.filter(
    (node) => node.fields.langKey === "zh"
  );
  const enBlogMarkdownNodes = blogMarkdownNodes.filter(
    (node) => node.fields.langKey === "en"
  );

  const pageMarkdownNodes = allMarkdownNodes.filter(
    (node) => node.fields.contentType === `pages`
  );

  const createBlogPages = (nodes) => {
    nodes.forEach((node, index) => {
      let prevSlug = null;
      let nextSlug = null;

      if (index > 0) {
        prevSlug = nodes[index - 1].fields.slug;
      }

      if (index < nodes.length - 1) {
        nextSlug = nodes[index + 1].fields.slug;
      }

      createPage({
        path: node.fields.slug,
        component: path.resolve(`./src/templates/post-template.js`),
        context: {
          slug: node.fields.slug,
          prevSlug: prevSlug,
          nextSlug: nextSlug,
          langKey: node.fields.langKey,
        },
      });
    });
  };

  if (zhBlogMarkdownNodes.length > 0) {
    createBlogPages(zhBlogMarkdownNodes);
  }

  if (enBlogMarkdownNodes.length > 0) {
    createBlogPages(enBlogMarkdownNodes);
  }

  if (pageMarkdownNodes.length > 0) {
    pageMarkdownNodes.forEach((node) => {
      if (node.frontmatter.template) {
        const templateFile = `${String(node.frontmatter.template)}.js`;

        const createPageOptions = {
          path: node.fields.slug,
          component: path.resolve(`src/templates/${templateFile}`),
          context: {
            slug: node.fields.slug,
            langKey: node.fields.langKey,
          },
        };

        createPage(createPageOptions);

        if (createPageOptions.path === "/en/index/") {
          createPage({
            ...createPageOptions,
            path: "/",
          });
        }
      }
    });
  }

  const langKeys = ["en", "zh"];
  tags.forEach((tag) => {
    langKeys.forEach((langKey) => {
      createPage({
        path: `/${langKey}/tags/${toKebabCase(tag.fieldValue)}/`,
        component: path.resolve(`./src/templates/tags-template.js`),
        context: {
          tag: tag.fieldValue,
          langKey,
        },
      });
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const fileNode = getNode(node.parent);

    createNodeField({
      node,
      name: `contentType`,
      value: fileNode.sourceInstanceName,
    });

    if (fileNode.sourceInstanceName === "posts" && node.fields.slug) {
      const slugWithoutLangKey = node.fields.slug.split(/\/[a-z]{2}\//).pop();
      node.fields.slug = `/${node.fields.langKey}/blog${slugWithoutLangKey}`;
    }
  }
};

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  // Match all invalid paths to the localised 404 pages.
  // Check if the page is a localized 404.
  if (page.path.match(/^\/[a-z]{2}\/404\/$/)) {
    const oldPage = { ...page };
    // Get the language code from the path, and match all paths
    // starting with this code (apart from other valid paths).
    const langCode = page.path.split(`/`)[1];
    page.matchPath = `/${langCode}/*`;
    // Recreate the modified page.
    deletePage(oldPage);
    createPage(page);

    if (langCode === "en") {
      page.matchPath = `/*`;
      createPage(page);
    }
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      template: String
      tags: [String!]
    }

    type Fields {
      slug: String
      contentType: String
    }
  `);
};
