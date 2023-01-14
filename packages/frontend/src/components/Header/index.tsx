import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";

import { PageProps } from "pages/_app";

import { UserType } from "types";

interface HeaderInterface {
  user?: UserType;
}

function Header({ theme, user, toggleTheme, toggleLocale, locale, socket }: PageProps<HeaderInterface>) {
  const { push } = useRouter();

  const handleLogout = React.useCallback(() => {
    document.cookie = "userdata=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    socket.disconnect();
    push("/");
  }, [push, socket]);

  const menu = React.useMemo(
    () => (
      <>
        <LinkComponent href="/">
          <FormattedMessage id="navigation.home" />
        </LinkComponent>
        <LinkComponent href="/users">
          <FormattedMessage id="navigation.users" />
        </LinkComponent>
        <LinkComponent href="/about">
          <FormattedMessage id="navigation.about" />
        </LinkComponent>
      </>
    ),
    [],
  );

  return (
    <HeaderContainer>
      <HeaderContent>
        <NavigationContainer hideOnMobile>{menu}</NavigationContainer>
        <MenuButton>
          <img style={{ width: 18, height: 18 }} src={theme !== "dark" ? "/menu-dark.svg" : "/menu.svg"} />
        </MenuButton>
        <NavigationContainer>
          <NavigationComponent onClick={toggleLocale}>
            <img src={`/flags/flag-${locale === "ru" ? "en" : "ru"}.svg`} />
            {locale === "ru" ? "English" : "Русский"}
          </NavigationComponent>
          <NavigationComponent onClick={toggleTheme}>
            <img style={{ width: 18, height: 18 }} src={theme === "dark" ? "/icons/sun.svg" : "/icons/ph_moon.svg"} />
          </NavigationComponent>
          {user ? (
            <>
              <LinkComponent href={`/profile/${user.name}`}>
                <FormattedMessage id="header.profile" />
              </LinkComponent>
              <NavigationComponent onClick={handleLogout}>
                <FormattedMessage id="header.logout" />
              </NavigationComponent>
            </>
          ) : (
            <>
              <LinkComponent href="/login">
                <FormattedMessage id="header.login" />
              </LinkComponent>
              <LinkComponent href="/registration">
                <FormattedMessage id="header.registration" />
              </LinkComponent>
            </>
          )}
        </NavigationContainer>
      </HeaderContent>
    </HeaderContainer>
  );
}

const HeaderContainer = styled("div")`
  background: ${({ theme }) => theme.layout.primary};
  font-size: 16px;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid ${({ theme }) => theme.layout.gray};
`;

const HeaderContent = styled("div")`
  margin: auto;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  height: 49px;

  @media (min-width: 768px) {
    height: 61px;
  }

  @media (min-width: 1200px) {
    height: 67px;
  }
`;

const NavigationContainer = styled("div")<{ hideOnMobile?: boolean }>`
  display: ${({ hideOnMobile }) => (hideOnMobile ? "none" : "flex")};
  height: 100%;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const MenuButton = styled("div")`
  display: flex;
  padding: 0 10px;
  align-items: center;

  @media (min-width: 768px) {
    display: none;
  }
`;

const NavigationComponent = styled("div")`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0 10px;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  gap: 8px;
  color: ${({ theme }) => theme.text.primary};

  img {
    width: 24px;
    height: 24px;
  }

  &:hover {
    transition: 0.15s border ease-in-out;
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

const LinkComponent = styled(Link)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0 10px;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  gap: 8px;
  color: ${({ theme }) => theme.text.primary};

  img {
    width: 24px;
    height: 24px;
  }

  &:hover {
    transition: 0.15s border ease-in-out;
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

export default React.memo(Header);
