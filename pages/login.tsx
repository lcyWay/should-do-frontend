import React from 'react'
import clsx from 'clsx'
import { io } from "socket.io-client";
import * as yup from 'yup';
import ReCAPTCHA from "react-google-recaptcha";
import { useSnackbar } from 'notistack';

import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { api } from '../api';
import { socket_server } from '../config';
import { notificationConfig } from '../components/Alert';

import { TypeInput } from '../components/Input';
import { TypeButton } from '../components/Button';

import styles from '../styles/pages/Login.module.scss';

const text = [
  {
    eng: 'Login successfully',
    rus: 'Авторизация выполнена успешно'
  },
  {
    eng: 'Account is not activated. Check your email:',
    rus: 'Пользователь не активирован. Проверьте свою почту:'
  },
  {
    eng: 'Login',
    rus: 'Авторизация'
  },
  {
    eng: 'Back to Home',
    rus: 'Вернуться на главную'
  },
  {
    eng: 'email',
    rus: 'почта'
  },
  {
    eng: 'password',
    rus: 'пароль'
  },
  {
    eng: 'Login',
    rus: 'Войти'
  },
  {
    eng: "Don't have an account?",
    rus: 'У вас нет аккаунта?'
  },
  {
    eng: 'Registration',
    rus: 'Регистрация'
  },
]

const api_massage_codes = {
  "001": {
    eng: 'Wrong credentionals',
    rus: 'Данные введены неправильно'
  }
}

function Login({ theme, user, setUser, setSocket, lang }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  if (user !== null) {
    router.push(`/profile/${user.name}`)
  }

  const [captcha, setCaptcha] = React.useState(false);
  const [state, setState] = React.useState({
    email: '',
    password: ''
  })

  let schema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required(),
  });

  const handleChange = (value: string, path: string) => {
    const newState = { ...state };
    newState[path] = value;
    setState(newState);
  }

  const handleLogin = async () => {
    if (captcha) {
      schema
        .isValid(state)
        .then(async function (valid) {
          if (valid) {
            api('login', state).then(async (d) => {
              const data = await d.json();
              if (!d.ok) {
                enqueueSnackbar(api_massage_codes[data.message_code][lang], { ...notificationConfig, variant: 'error' });
              } else {
                const socket = io(socket_server);
                socket.emit('LOGIN', { name: data.name });
                if (data.isActivated) {
                  enqueueSnackbar(text[0][lang], { ...notificationConfig, variant: 'success' });
                } else {
                  enqueueSnackbar(`${text[1][lang]} ${data.email}`, { ...notificationConfig, variant: 'success' });
                }
                setSocket(socket);
                setUser(data);
                router.push(`/profile/${data.name}`)
              }
            })
          }
        })
    }
  }

  return (
    <div className={clsx('container', 'without_padding', styles.center)}>
      <Head><title>{text[2][lang]}</title></Head>
      <div className={clsx(styles.form_container)}>
        <div className={styles.back}>
          <Link href='/'>
            <a>{text[3][lang]}</a>
          </Link>
        </div>

        <div className={styles.forms}>
          {TypeInput(state.email, (e: string) => handleChange(e, 'email'), theme, text[4][lang])}
          {TypeInput(state.password, (e: string) => handleChange(e, 'password'), theme, text[5][lang], true)}
        </div>

        <div className={styles.flex_center}>
          <ReCAPTCHA
            sitekey="6LdQRbAaAAAAAJjgWi6ffTYVZi9EjNcnnt5zpre-"
            onChange={() => setCaptcha(true)}
            hl={lang === 'eng' ? 'en' : 'ru'}
          />
        </div>

        <div className={styles.flex_center}>
          {TypeButton(text[6][lang], theme, null, handleLogin)}
        </div>
        <div className={styles.flex_center}>
          <span>{text[7][lang]}</span>
          <Link href='/registration'><a><b>{text[8][lang]}</b></a></Link>
        </div>
      </div>
    </div>
  )
}

export default Login
