import React from 'react'
import clsx from 'clsx'

import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './Header.module.scss'

function Header({ theme, user, setUser, socket }) {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('userdata');
    router.push('/login');
    setUser(null);
    socket.disconnect();
  }

  return (
    <div className={clsx(styles.background, styles[theme])}>
      <div className={styles.container}>
        <div>
          <Link href='/'>
            <a>
              Home
            </a>
          </Link>
          <Link href='/users'>
            <a>
              Users
            </a>
          </Link>
          <Link href='/about'>
            <a>
              About me
            </a>
          </Link>
        </div>
        <div>
          <Link href={user ? `/profile/${user.name}` : '/login'}>
            <a>{user ? 'Profile' : 'Login'}</a>
          </Link>
          |
          {user
            ?
            <span onClick={handleLogout}>Logout</span>
            :
            <Link href='/registration'>
              <a>Register</a>
            </Link>
          }
        </div>
      </div>
    </div>
  )
}

export default Header
