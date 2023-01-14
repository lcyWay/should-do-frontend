import React from "react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Socket } from "socket.io-client";
import { IntlProvider } from "react-intl";
import NextNprogress from "nextjs-progressbar";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import Header from "components/Header";
import ProfileHeader from "components/ProfileHeader";
import Notifications from "components/Notifications";

import useSocket from "hooks/useSocket";

import { theme as styledTheme } from "styles/theme";

import ruLocales from "locales/ru.json";
import enLocales from "locales/en.json";

import "../styles/globals.scss";

export type Theme = "light" | "dark";
export type Locale = "ru" | "en";

export interface PageProps {
  theme: Theme;
  locale: Locale;
  socket: Socket;
  toggleTheme: () => void;
  toggleLocale: () => void;
}

function MyApp({ Component, pageProps }: AppProps) {
  const { socket } = useSocket({ user: pageProps.user || null });
  const { replace, query, route, locale: routerLocale } = useRouter();

  const [theme, setTheme] = React.useState<Theme>("light");
  const [locale, setLocale] = React.useState<Locale>(routerLocale as Locale);

  React.useEffect(() => {
    const storageTheme = localStorage.getItem("theme");
    const storageLocale = localStorage.getItem("locale");
    if (storageTheme) setTheme(storageTheme as Theme);
    if (storageLocale) setLocale(storageLocale as Locale);
  }, []);

  React.useEffect(() => {
    if (routerLocale === locale) return;
    replace({ query, pathname: route }, undefined, { locale });
  }, [locale, route, query, routerLocale, replace]);

  const toggleTheme = React.useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  }, [theme]);

  const toggleLocale = React.useCallback(() => {
    const newLocale = locale === "ru" ? "en" : "ru";
    localStorage.setItem("locale", newLocale);
    setLocale(newLocale);
  }, [locale]);

  const localeMessages = React.useMemo(() => (locale === "en" ? enLocales : ruLocales), [locale]);

  return (
    <IntlProvider messages={localeMessages} locale={locale}>
      <ThemeProvider theme={styledTheme[theme]}>
        <GlobalStyles />
        <NextNprogress
          color="#7c7ce4"
          startPosition={0.3}
          stopDelayMs={200}
          height={2}
          options={{ easing: "ease", speed: 200 }}
        />
        <Notifications>
          <Header
            theme={theme}
            locale={locale}
            socket={socket}
            toggleTheme={toggleTheme}
            toggleLocale={toggleLocale}
            {...pageProps}
          />
          <ProfileHeader locale={locale} {...pageProps} />
          <Component
            theme={theme}
            locale={locale}
            socket={socket}
            toggleTheme={toggleTheme}
            toggleLocale={toggleLocale}
            {...pageProps}
          />
        </Notifications>
      </ThemeProvider>
    </IntlProvider>
  );
}

const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.layout.secondary};
  }

  * {
    text-decoration: none;
    color: ${({ theme }) => theme.text.primary};
  }
`;

export default MyApp;
