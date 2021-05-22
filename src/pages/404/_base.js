import React from "react";
import Layout from "../../components/layout";
import { Ghost } from "react-kawaii";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

const NotFoundPage = ({ pageContext }) => {
  const { t } = useTranslation();
  return (
    <Layout title={t("404NotFound")} langKey={pageContext.langKey}>
      <meta http-equiv = "refresh" content = "1.5; url = /" />
      <NotFoundPageWrapper>
        <Ghost size={240} mood="sad" color="#E0E4E8" />
        <Trans i18nKey="oops404">
          <h1>OOPS..</h1>
          <p>404. Page not found. Redirecting to home page...</p>
        </Trans>
      </NotFoundPageWrapper>
    </Layout>
  );
};

export default NotFoundPage;

const NotFoundPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
