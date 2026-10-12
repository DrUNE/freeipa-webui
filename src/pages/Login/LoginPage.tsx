import React from "react";
import { css } from "@patternfly/react-styles";

import {
  BackgroundImage,
  Brand,
  List,
  ListVariant,
  Login,
  LoginHeader,
  LoginFooter,
  LoginMainHeader,
  LoginMainBody,
  LoginMainFooter,
} from "@patternfly/react-core";

interface LoginPageProps extends React.HTMLProps<HTMLDivElement> {
  /** Anything that can be rendered inside of the login page (e.g. <LoginPageForm>) */
  children?: React.ReactNode;
  /** Additional classes added to the login page */
  className?: string;
  /** Attribute that specifies the URL of the brand image for the login page */
  brandImgSrc?: string;
  /** Attribute that specifies the alt text of the brand image for the login page */
  brandImgAlt?: string;
  /** Attribute that specifies the URL of the background image for the login page */
  backgroundImgSrc?: string;
  /** Content rendered inside of the text component of the login page */
  loginPageContent?: React.ReactNode;
  /** Items rendered inside of the footer list component of the login page */
  footerListItems?: React.ReactNode;
  /** Adds list variant styles for the footer list component of the login page. The only current value is'inline' */
  footerListVariants?: ListVariant.inline;
  /** Title for the login main body header of the login page */
  loginTitle: string;
  /** Subtitle for the login main body header of the login page */
  loginSubtitle?: string;
  /** Header utilities for the login main body header of the login page */
  headerUtilities?: React.ReactNode;
  /** Content rendered inside of login main footer band to display a sign up for account message */
  signUpForAccountMessage?: React.ReactNode;
  /** Content rendered inside of login main footer band to display a forgot credentials link. */
  forgotCredentials?: React.ReactNode;
  /** Content rendered inside of social media login footer section */
  socialMediaLoginContent?: React.ReactNode;
  /** Adds an accessible name to the social media login list. */
  socialMediaLoginAriaLabel?: string;
}

export const LoginPage = ({
  children = null,
  className = "",
  brandImgSrc = "",
  brandImgAlt = "",
  backgroundImgSrc = "",
  footerListItems = null,
  loginPageContent = null,
  footerListVariants,
  loginTitle,
  loginSubtitle,
  headerUtilities,
  signUpForAccountMessage = null,
  forgotCredentials = null,
  socialMediaLoginContent = null,
  socialMediaLoginAriaLabel,
  ...props
}: LoginPageProps) => {
  const HeaderBrand = <Brand src={brandImgSrc} alt={brandImgAlt} />;
  const Header = <LoginHeader headerBrand={HeaderBrand} />;
  const Footer = (
    <LoginFooter>
      {loginPageContent}
      <List variant={footerListVariants}>{footerListItems}</List>
    </LoginFooter>
  );

  return (
    <>
      {backgroundImgSrc && <BackgroundImage src={backgroundImgSrc} />}
      <Login
        header={Header}
        footer={Footer}
        className={css(className)}
        {...props}
      >
        <LoginMainHeader
          title={loginTitle}
          subtitle={loginSubtitle}
          headerUtilities={headerUtilities}
        />
        <LoginMainBody>{children}</LoginMainBody>
        {(socialMediaLoginContent ||
          forgotCredentials ||
          signUpForAccountMessage) && (
          <LoginMainFooter
            socialMediaLoginContent={socialMediaLoginContent}
            socialMediaLoginAriaLabel={socialMediaLoginAriaLabel}
            forgotCredentials={forgotCredentials}
            signUpForAccountMessage={signUpForAccountMessage}
          />
        )}
      </Login>
    </>
  );
};
LoginPage.displayName = "LoginPage";
