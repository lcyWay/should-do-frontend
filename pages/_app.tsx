import React from 'react'
import jwt from 'jwt-decode'
import NextNprogress from 'nextjs-progressbar';
import { SnackbarProvider } from 'notistack';
import jsonwebtoken from 'jsonwebtoken'
import { io } from "socket.io-client";

import { UserType } from '../types';
import { socket_server } from '../config';

import Header from '../components/Header';
import ProfileHeader from '../components/ProfileHeader';

import '../styles/globals.scss'

function MyApp(props) {
  const { Component, pageProps } = props;
  const [theme, setTheme] = React.useState<string>('primary');
  const [lang, setLang] = React.useState<string>('eng');
  const [user, setUser] = React.useState<null | UserType | undefined>(undefined);
  const [useSocket, setSocket] = React.useState<any>(false);
  const [showMenu, setShowMenu] = React.useState(false);

  React.useEffect(function () {
    const storageTheme = localStorage.getItem('theme');
    const storageLang = localStorage.getItem('lang');
    if (localStorage.getItem('userdata') && !user) {
      const user: UserType = jwt(localStorage.getItem('userdata'));
      user.online = null;
      setUser(user);
      const socket = io(socket_server);
      socket.emit('LOGIN', { name: user.name });
      setSocket(socket);
    } else { setUser(null) }
    if (storageTheme && (theme !== storageTheme)) {
      setTheme(storageTheme)
    }
    if (storageLang && (lang !== storageLang)) {
      setLang(storageLang)
    }
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log("Service Worker registration successful with scope: ", registration.scope);
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  const handleChangeTheme = (type: string) => {
    localStorage.setItem('theme', type);
    setTheme(type);
  }
  const handleChangeLang = (type: string) => {
    localStorage.setItem('lang', type);
    setLang(type);
  }
  const handleSetUser = (data: UserType | null) => {
    localStorage.setItem('userdata', jsonwebtoken.sign(data, 'jjjwwwttt'));
    setUser(data);
  }

  return (user !== undefined) && <SnackbarProvider>
    <NextNprogress
      color={theme === 'dark' ? 'rgb(230, 230, 230)' : 'rgb(0, 112, 243)'}
      startPosition={0.3}
      stopDelayMs={200}
      height={2}
      options={{ easing: 'ease', speed: 200 }}
    />
    <Header
      showMenu={showMenu}
      setShowMenu={(t) => setShowMenu(t)}
      lang={lang}
      socket={useSocket}
      setUser={(e: null) => setUser(e)}
      user={user}
      theme={theme}
    />
    <div onClick={() => setShowMenu(false)}>
      <ProfileHeader lang={lang} theme={theme} user={user} />
      <Component
        setSocket={(d) => setSocket(d)}
        user={user}
        setUser={(u: UserType | null) => handleSetUser(u)}
        theme={theme}
        setTheme={(type: string) => handleChangeTheme(type)}
        lang={lang}
        setLang={(type: string) => handleChangeLang(type)}
        {...pageProps}
      />
    </div>
  </SnackbarProvider>
}

export default MyApp
