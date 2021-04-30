import React from 'react'
import clsx from 'clsx'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { TypeButton } from '../Button'

import styles from './Header.module.scss'
import { TypeImage } from '../Image'

const text = [
  {
    eng: 'Home',
    rus: 'Главная'
  },
  {
    eng: 'Users',
    rus: 'Пользователи'
  },
  {
    eng: 'About me',
    rus: 'Обо мне'
  },
  {
    eng: 'Profile',
    rus: 'Профиль'
  },
  {
    eng: 'Login',
    rus: 'Войти'
  },
  {
    eng: 'Logout',
    rus: 'Выйти'
  },
  {
    eng: 'Registration',
    rus: 'Регистрация'
  },
]

function Header({ theme, user, setUser, socket, lang, showMenu, setShowMenu }) {
  const menuImage = TypeImage(theme !== 'dark' ? '/menu-dark.svg' : '/menu.svg', 'menu', false, 25);

  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('userdata');
    router.push('/login');
    setUser(null);
    socket.disconnect();
  }

  const menu = () => <>
    <Link href='/'>
      <a>
        {text[0][lang]}
      </a>
    </Link>
    <Link href='/users'>
      <a>
        {text[1][lang]}
      </a>
    </Link>
    <Link href='/about'>
      <a>
        {text[2][lang]}
      </a>
    </Link>
  </>

  const handleCloseMenu = (e) => {
    if (!e.nativeEvent.path.includes(document.getElementById('show-menu-div'))) {
      setShowMenu(false);
    }
  }

  return (
    <div onClick={handleCloseMenu} className={clsx(styles.background, styles[theme])}>
      <div className={styles.container}>
        <div className={styles.header}>{menu()}</div>
        <div id="show-menu-div" className={styles.button}>
          {TypeButton(menuImage, theme === 'dark' ? theme : null, null, () => setShowMenu(!showMenu), 'small')}
        </div>
        {showMenu && <div className={clsx(styles.openHeader, styles[`header_${theme}`])}>{menu()}</div>}
        <div>
          <Link href={user ? `/profile/${user.name}` : '/login'}>
            <a>{user ? text[3][lang] : text[4][lang]}</a>
          </Link>
          |
          {user
            ?
            <span onClick={handleLogout}>{text[5][lang]}</span>
            :
            <Link href='/registration'>
              <a>{text[6][lang]}</a>
            </Link>
          }
        </div>
      </div>
    </div>
  )
}

export default Header
