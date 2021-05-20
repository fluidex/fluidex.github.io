import React from "react";
import SEO from "./seo";
import Header from "./header";
import Footer from "./footer";
import Container from "./container";
import GlobalStyle from "./global-styles";
import styled from "styled-components";

const Layout = ({
  children,
  title,
  description,
  socialImage = "",
  langKey,
}) => {
  return (
    <>
      <GlobalStyle />
      <SEO
        title={title}
        description={description}
        socialImage={socialImage}
        lang={langKey}
      />
      <LayoutWrapper>
        <Header langKey={langKey} />
        <main>
          <Container>{children}</Container>
        </main>
        <Footer langKey={langKey} />
      </LayoutWrapper>
    </>
  );
};

export default Layout;

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  & main {
    margin-top: auto;
    margin-bottom: auto;
  }

  & footer {
    margin-top: auto;
  }
`;
