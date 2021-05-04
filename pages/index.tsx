import React from 'react';
import Head from 'next/head'
import Link from 'next/link'

import { TypeButton } from '../components/Button';
import { TypeImage } from '../components/Image'

import styles from '../styles/pages/Home.module.scss';
import clsx from 'clsx';

const text = [
  {
    eng: 'Task Management',
    rus: 'Менеджер задач'
  },
  {
    eng: 'Get Started!',
    rus: 'Зарегистрироваться'
  },
  {
    eng: 'Free registration',
    rus: 'Бесплатная регистрация'
  },
  {
    eng: 'Easy to learn',
    rus: 'Легко освоить'
  },
  {
    eng: 'Convenient and informative profile page',
    rus: 'Удобная и информативная страница профиля'
  },
  {
    eng: 'Watch the progress of other users',
    rus: 'Наблюдайте за прогрессом других пользователей'
  },
  {
    eng: 'I will realy glad if you visit my "About" page:',
    rus: 'Я буду очень рад, если вы посетите мою страницу "Обо мне"'
  },
  {
    eng: 'Visit about page',
    rus: 'Посетить страницу "Обо мне"'
  },
  {
    eng: {
      primary: 'Switch to theme "Dark Colors"',
      dark: 'Switch to theme "Light Colors"'
    },
    rus: {
      primary: 'Сменить тему на "Темные цвета"',
      dark: 'Сменить тему на "Светлые цвета"'
    }
  },
  {
    eng: 'Switch to Russian language',
    rus: 'Сменить на Русский язык'
  },
]

export default function Home({ theme, setTheme, lang, setLang }) {
  const switchThemeImage = TypeImage(theme !== 'dark' ? '/moon.svg' : '/sun.svg', 'sun', false, 25);
  const switchLangImage = TypeImage(lang !== 'eng' ? '/check-box.svg' : '/blank-check-box.svg', 'check', false, 25);

  const handleChangeTheme = () => setTheme(theme === 'dark' ? 'primary' : 'dark');
  const handleChangeLang = () => setLang(lang === 'eng' ? 'rus' : 'eng');

  return (
    <>
      <Head><title>{text[0][lang]}</title></Head>

      <div className={styles.welcome}>
        <div className={styles.animation}>
          <h3>What should I do ?</h3>
          <p>Next.JS/TypeScript task management progressive web application!</p>
          {TypeButton(text[1][lang], theme, '/registration')}
        </div>
      </div>

      <div className='container'>
        <div className={styles.divider}></div>

        <div className={styles.grid}>
          <div className={clsx(styles.grid_block)}>
            <div>{TypeImage('/registration.svg', 'registration', false, 60)}</div>
            <div>{text[2][lang]}</div>
          </div>
          <div className={clsx(styles.grid_block)}>
            <div>{TypeImage('/book.svg', 'learn', false, 60)}</div>
            <div>{text[3][lang]}</div>
          </div>
          <div className={clsx(styles.grid_block)}>
            <div>{TypeImage('/report.svg', 'profile', false, 60)}</div>
            <div>{text[4][lang]}</div>
          </div>
          <div className={clsx(styles.grid_block)}>
            <div>{TypeImage('/watch.svg', 'watch', false, 60)}</div>
            <div>{text[5][lang]}</div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.footer}>
          <div className={styles.part_footer}>
            <div className={styles.footer_block}>
              {text[6][lang]}
            </div>
            <Link href='/about'>
              <a>
                <b>{text[7][lang]}</b>
              </a>
            </Link>
          </div>

          <div className={styles.part_footer}>
            <div className={styles.switchers}>
              {text[8][lang][theme]}:
              {TypeButton(switchThemeImage, theme, null, handleChangeTheme, 'small')}
            </div>
            <div className={styles.switchers}>
              {text[9][lang]}:
              {TypeButton(switchLangImage, theme, null, handleChangeLang, 'small')}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
