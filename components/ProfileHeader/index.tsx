import React from 'react'

import { useRouter } from 'next/router'
import Link from 'next/link'

import styles from '../../styles/pages/Profile.module.scss'
import { TypeImage } from '../Image'

function ProfileHeader({ theme, user }) {
  const router = useRouter();
  const path = router.pathname;

  const userCorrect = user ? user.isActivated : false

  return (
    userCorrect &&
    path !== '/' &&
    path !== '/about' &&
    path !== '/users' &&
    path !== '/login'
  ) && (
      <div className='container without_padding'>
        <div className={styles.navbar}>
          <Link href={`/profile/${user.name}`}>
            <a className={styles[theme]}>
              {TypeImage('/home.svg', 'home', false, 15)}
            </a>
          </Link>
          <Link href={`/profile/daily/${user.name}`}>
            <a className={styles[theme]}>Daily tasks</a>
          </Link>
          <Link href={`/profile/objectives/${user.name}`}>
            <a className={styles[theme]}>Objectives</a>
          </Link>
          <Link href='/profile/options'>
            <a className={styles[theme]}>Options</a>
          </Link>
        </div>
      </div>
    )
}

export default ProfileHeader
