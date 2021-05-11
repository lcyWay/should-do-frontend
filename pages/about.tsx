import React from 'react'
import Head from 'next/head'

import styles from '../styles/pages/About.module.scss'

const text = [
  {
    eng: 'About me',
    rus: 'Обо мне'
  },
  {
    eng: 'Thank you for visiting this page.',
    rus: 'Спасибо за посещение этой страницы.'
  },
  {
    eng: <>Hello! My name is <b>Andrew</b>. I'm 19 years old. I have been working as a frontend developer at the <b>"Contour Components"</b> company for 1 year. I am currently looking for a second job as a part-time front-end developer and plan to combine it with my old job.</>,
    rus: <>Здравствуйте! Меня зовут <b>Андрей</b>. Мне 19 лет. Я работаю фронтенд-разработчиком на полставки в компании <b>"Contour Components"</b> на протяжении 1 года. Сейчас я ищу вторую работу фронтенд-разработчиком на полставки и планирую совмещать её со старой работой.</>
  },
  {
    eng: 'My professoinal skills:',
    rus: 'Мои профессиональные навыки:'
  }
]

function About({ theme, lang }) {
  return (
    <>
      <Head><title>{text[0][lang]}</title></Head>

      <div className='container'>
        <div className={styles.welcome}><h4>{text[1][lang]}</h4></div>
        <div>{text[2][lang]}</div>
        <h4>{text[3][lang]}</h4>

        <div className={styles.divider}><b>Frontend:</b></div>
        <div>- JavaScript, TypeScript</div>
        <div>- ReactJS, Next.js</div>
        <div>- Redux, Redux Thunk</div>
        <div>- GraphQL</div>
        <div>- CSS, SCSS/SASS</div>
        <div>- Material UI, Semantic UI, React Bootstrap, Materialize</div>
        <div>- Lodash, RxJs</div>
        <div>- Service Workers</div>
        <div>- Jest</div>

        <div className={styles.divider}><b>Backend:</b></div>
        <div>- Node.js, Express</div>
        <div>- MongoDB, Firebase</div>
        <div>- Socket.IO</div>

        <div className={styles.divider}><b>Other:</b></div>
        <div>- Webpack, Babel</div>
        <div>- Git</div>
        <div>- Eslint</div>
        <div>- Work experience with Figma, Heroku, Netlify, Vercel</div>

        <div className={styles.divider}></div>
        <div>hh.ru: <a className={styles[theme]} href="https://mytischi.hh.ru/resume/1c30dedcff087d47ab0039ed1f4b73776e3552#key-skills">Резюме Frontend Developer (hh.ru)</a></div>
        <div>Habr: <a className={styles[theme]} href="https://career.habr.com/carepuw">Career Habr</a></div>
        <div>GitHub: <a className={styles[theme]} href="https://github.com/carepuw">https://github.com/carepuw</a></div>
        <div>Telegram: @carepuw</div>
      </div>
    </>
  )
}

export default About
