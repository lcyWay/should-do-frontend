import React from 'react';
import Head from 'next/head'
import Link from 'next/link'

import { TypeButton } from '../components/Button';
import { TypeImage } from '../components/Image'

import styles from '../styles/pages/Home.module.scss';
import clsx from 'clsx';

export default function Home({ theme, setTheme }) {
  const switchThemeImage = TypeImage(theme !== 'dark' ? '/moon.svg' : '/sun.svg', 'sun', false, 25);
  const handleChangeTheme = () => setTheme(theme === 'dark' ? 'primary' : 'dark');

  return (
    <>
      <Head><title>Task Management</title></Head>

      <div className={styles.welcome}>
        <div className={styles.animation}>
          <h3>What should I do ?</h3>
          <p>Next.JS/TypeScript task management web application!</p>
          {TypeButton('Get Started!', theme, '/registration')}
        </div>
      </div>

      <div className='container'>
        <div className={styles.divider}></div>

        <div className={styles.grid}>
          <div className={clsx(styles.grid_block)}>
            <div>{TypeImage('/registration.svg', 'registration', false, 60)}</div>
            <div>Free registration</div>
          </div>
          <div className={clsx(styles.grid_block)}>
            <div>{TypeImage('/book.svg', 'learn', false, 60)}</div>
            <div>Easy to learn</div>
          </div>
          <div className={clsx(styles.grid_block)}>
            <div>{TypeImage('/report.svg', 'profile', false, 60)}</div>
            <div>Convenient and informative profile page</div>
          </div>
          <div className={clsx(styles.grid_block)}>
            <div>{TypeImage('/watch.svg', 'watch', false, 60)}</div>
            <div>Watch the progress of other users</div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.footer}>
          <div className={styles.part_footer}>
            <div className={styles.footer_block}>
              I will realy glad if you visit my "About" page:
            </div>
            <Link href='/about'>
              <a>
                <b>Visit about page</b>
              </a>
            </Link>
          </div>

          <div className={styles.part_footer}>
            <div className={styles.theme_switcher}>
              Switch to theme {theme !== 'dark' ? 'Dark Colors' : 'Light Colors'}:
              {TypeButton(switchThemeImage, theme, null, handleChangeTheme, 'small')}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
