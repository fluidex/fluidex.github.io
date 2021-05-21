import React from "react";
import Container from "./container";
import styled from "styled-components";
import SocialLinks from "./social-links";
import { Trans } from "react-i18next";

const Footer = () => {
  return (
    <StyledFooter>
      <FooterWrapper>
        <SocialLinks />

        <FooterAttribution>
          <Trans i18nKey="copyright">
            Copyright {{ year: new Date().getFullYear() }} Team Fluidex. All
            rights reserved.
          </Trans>
        </FooterAttribution>
      </FooterWrapper>
    </StyledFooter>
  );
};

export default Footer;

const StyledFooter = styled.footer`
  padding-top: var(--size-300);
  padding-bottom: var(--size-300);
`;

const FooterAttribution = styled.p`
  font-size: var(--size-300);

  & a {
    color: inherit;
  }
`;

const FooterWrapper = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;
