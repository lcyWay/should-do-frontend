import React from 'react'
import Head from 'next/head'

import styles from '../styles/pages/About.module.scss'

function About({ theme }) {
  return (
    <>
      <Head><title>About me</title></Head>

      <div className='container'>
        <div className={styles.welcome}>
          <h4>Thank you for visiting this page.</h4>
        </div>
        <div>
          Hello! My name is <b>Andrew</b>. I'm 19 years old. I have been working as a frontend developer at the <b>"Contour Components"</b> company for 1 year.
          Now I'm looking for a half-time front-end developer job.
        </div>
        <h4>My professoinal skills:</h4>

        <div className={styles.divider}><b>Frontend:</b></div>
        <div>- JavaScript, TypeScript</div>
        <div>- ReactJS, Next.js</div>
        <div>- Redux, Redux Thunk</div>
        <div>- GraphQL</div>
        <div>- CSS, SCSS/SASS</div>
        <div>- Material UI, Semantic UI, React Bootstrap, Materialize</div>

        <div className={styles.divider}><b>Backend:</b></div>
        <div>- Node.js, Express</div>
        <div>- MongoDB, Firebase</div>
        <div>- Socket.IO</div>

        <div className={styles.divider}><b>Other:</b></div>
        <div>- Webpack</div>
        <div>- Git</div>
        <div>- Eslint</div>
        <div>- BEM(CSS)</div>
        <div>- Work experience with Figma, Heroku, Netlify, Vercel</div>

        <div className={styles.divider}></div>
        <div>GitHub: <a className={styles[theme]} href="https://github.com/carepuw">https://github.com/carepuw</a></div>
        <div>Telegram: @carepuw</div>
      </div>
    </>
  )
}

export default About
