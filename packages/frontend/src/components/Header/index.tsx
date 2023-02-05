import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";

import MenuSvg from "svg/MenuSvg";

import { PageProps } from "pages/_app";
import { UserType } from "types";

import ModalMenu from "./ModalMenu";

interface HeaderInterface extends PageProps {
  user?: UserType;
}

function Header({ theme, user, toggleTheme, toggleLocale, locale, socket }: HeaderInterface) {
  const { push } = useRouter();

  const [menuVisibility, setMenuVisibility] = React.useState(false);

  const handleMenuOpen = React.useCallback(() => setMenuVisibility(true), []);
  const handleMenuClose = React.useCallback(() => setMenuVisibility(false), []);

  const handleLogout = React.useCallback(() => {
    document.cookie = "userdata=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    socket.disconnect();
    handleMenuClose();
    push("/");
  }, [push, handleMenuClose, socket]);

  return (
    <HeaderContainer>
      <HeaderContent>
        <NavigationContainer hideOnMobile>
          <NavigationComponent>
            <Link href="/">
              <FormattedMessage id="navigation.home" />
            </Link>
          </NavigationComponent>
          <NavigationComponent>
            <Link href="/users">
              <FormattedMessage id="navigation.users" />
            </Link>
          </NavigationComponent>
        </NavigationContainer>
        <MenuButton onClick={handleMenuOpen}>
          <MenuSvg />
        </MenuButton>
        <ModalMenu locale={locale} toggleLocale={toggleLocale} visibility={menuVisibility} onClose={handleMenuClose}>
          <MenuContentContainer>
            <NavigationComponent onClick={handleMenuClose}>
              <Link href="/">
                <FormattedMessage id="navigation.home" />
              </Link>
            </NavigationComponent>
            <NavigationComponent onClick={handleMenuClose}>
              <Link href="/users">
                <FormattedMessage id="navigation.users" />
              </Link>
            </NavigationComponent>
            {user ? (
              <>
                <NavigationComponent onClick={handleMenuClose}>
                  <Link href={`/profile/${user.name}`}>
                    <FormattedMessage id="header.profile" />
                  </Link>
                </NavigationComponent>
                <NavigationComponent onClick={handleLogout}>
                  <FormattedMessage id="header.logout" />
                </NavigationComponent>
              </>
            ) : (
              <>
                <NavigationComponent onClick={handleMenuClose}>
                  <Link href="/login">
                    <FormattedMessage id="header.login" />
                  </Link>
                </NavigationComponent>
                <NavigationComponent onClick={handleMenuClose}>
                  <Link href="/registration">
                    <FormattedMessage id="header.registration" />
                  </Link>
                </NavigationComponent>
              </>
            )}
          </MenuContentContainer>
        </ModalMenu>
        <NavigationContainer>
          <NavigationComponent hideOnMobile onClick={toggleLocale}>
            <img src={`/flags/flag-${locale === "ru" ? "en" : "ru"}.svg`} />
            {locale === "ru" ? "English" : "Русский"}
          </NavigationComponent>
          <NavigationComponent onClick={toggleTheme}>
            <img style={{ width: 18, height: 18 }} src={theme === "dark" ? "/icons/sun.svg" : "/icons/ph_moon.svg"} />
          </NavigationComponent>
          {user ? (
            <>
              <NavigationComponent hideOnMobile>
                <Link href={`/profile/${user.name}`}>
                  <FormattedMessage id="header.profile" />
                </Link>
              </NavigationComponent>
              <NavigationComponent hideOnMobile onClick={handleLogout}>
                <FormattedMessage id="header.logout" />
              </NavigationComponent>
            </>
          ) : (
            <>
              <NavigationComponent hideOnMobile>
                <Link href="/login">
                  <FormattedMessage id="header.login" />
                </Link>
              </NavigationComponent>
              <NavigationComponent hideOnMobile>
                <Link href="/registration">
                  <FormattedMessage id="header.registration" />
                </Link>
              </NavigationComponent>
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
  height: 67px;

  @media (max-width: 768px) {
    height: 61px;
  }

  @media (max-width: 1200px) {
    height: 49px;
  }
`;

const NavigationContainer = styled("div")<{ hideOnMobile?: boolean }>`
  display: flex;
  height: 100%;

  @media (max-width: 768px) {
    display: ${({ hideOnMobile }) => (hideOnMobile ? "none" : "flex")};
  }
`;

const MenuContentContainer = styled("div")`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 10px;

  div {
    border: 1px solid ${({ theme }) => theme.layout.gray};
    border-radius: 4px;
    padding: 4px 10px;
    min-width: 80px;
    justify-content: center;
    background: ${({ theme }) => theme.layout.primary};
  }
`;

const MenuButton = styled("div")`
  display: none;
  padding: 0 10px;
  align-items: center;

  svg {
    fill: ${({ theme }) => theme.text.primary};
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavigationComponent = styled("div")<{ hideOnMobile?: boolean }>`
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

  @media (max-width: 768px) {
    display: ${({ hideOnMobile }) => (hideOnMobile ? "none" : "flex")};
  }
`;

export default React.memo(Header);
