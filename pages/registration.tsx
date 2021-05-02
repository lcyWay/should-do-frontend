import React from 'react'
import clsx from 'clsx';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import ReCAPTCHA from "react-google-recaptcha";

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router'

import { TypeButton } from '../components/Button';
import { TypeInput } from '../components/Input';

import { notificationConfig } from '../components/Alert';
import { api } from '../api';

import styles from '../styles/pages/Login.module.scss'

const text = [
  {
    eng: 'A confirmation mail will be sent to this email: ',
    rus: 'Письмо с подтверждением будет отправлено на эту почту: '
  },
  {
    eng: 'Loading...',
    rus: 'Загрузка...'
  },
  {
    eng: 'Invalid credentionals',
    rus: 'Некорректно указаны данные'
  },
  {
    eng: 'Username must be without spaces',
    rus: 'Имя пользователя должно быть без пробелов'
  },
  {
    eng: 'Registration',
    rus: 'Регистрация'
  },
  {
    eng: 'Back to home',
    rus: 'Вернуться на главную'
  },
  {
    eng: 'username',
    rus: 'имя'
  },
  {
    eng: "email",
    rus: 'почта'
  },
  {
    eng: 'password',
    rus: 'пароль'
  },
  {
    eng: 'Register',
    rus: 'Зарегистрироваться'
  },
  {
    eng: <span>A confirmation mail will be sent to this <b>email</b>!</span>,
    rus: <span>Письмо с подтверждением будет выслано на <b>указанную почту</b>!</span>
  },
  {
    eng: 'Have an account?',
    rus: 'Уже есть аккаунт?'
  },
  {
    eng: 'Login',
    rus: 'Войти'
  },
]

const api_message_codes = {
  "001": {
    eng: 'User with that username already exist',
    rus: 'Пользователь с таким именем уже существует'
  },
  "002": {
    eng: 'User with that email already exist',
    rus: 'Пользователь с такой почтой уже существует'
  },
  "003": {
    eng: 'Check your email for complete registration',
    rus: 'Проверьте свою почту для завершения регистрации'
  },
}


function Register({ user, theme, lang }) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  if (user !== null) {
    router.push(`/profile/${user.name}`)
  }

  let schema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  const [captcha, setCaptcha] = React.useState(false);
  const [state, setState] = React.useState({
    username: '',
    email: '',
    password: ''
  })

  const handleChange = (value: string, path: string) => {
    const newState = { ...state };
    newState[path] = value;
    setState(newState);
  };

  const handleRegister = () => {
    setLoading(true);
    if (captcha) {
      if (state.username.split(' ').length < 2) {
        schema
          .isValid(state)
          .then(function (valid) {
            if (valid) {
              if (window.confirm(text[0][lang] + state.email)) {
                enqueueSnackbar(text[1][lang], { ...notificationConfig });
                api('registration', { name: state.username, password: state.password, email: state.email })
                  .then(async d => {
                    const data = await d.json();
                    if (d.ok) {
                      enqueueSnackbar(api_message_codes[data.code_message][lang], { ...notificationConfig, variant: 'success' });
                      router.push('/login');
                    } else {
                      enqueueSnackbar(api_message_codes[data.code_message][lang], { ...notificationConfig, variant: 'error' })
                    }
                    setLoading(false);
                  })
              } else {
                setLoading(false);
              }
            } else {
              setLoading(false);
              enqueueSnackbar(text[2][lang], { ...notificationConfig, variant: 'error' })
            }
          });
      } else {
        setLoading(false);
        enqueueSnackbar(text[3][lang], { ...notificationConfig, variant: 'error' })
      }
    } else {
      setLoading(false);
    }
  }

  return (
    <div className={clsx('container', 'without_padding', styles.center)}>
      <Head><title>{text[4][lang]}</title></Head>

      <div className={clsx(styles.form_container)}>
        <div className={styles.back}>
          <Link href='/'>
            <a>{text[5][lang]}</a>
          </Link>
        </div>

        <div className={styles.forms}>
          {TypeInput(state.username, (e: string) => handleChange(e, 'username'), theme, text[6][lang])}
          {TypeInput(state.email, (e: string) => handleChange(e, 'email'), theme, text[7][lang])}
          {TypeInput(state.password, (e: string) => handleChange(e, 'password'), theme, text[8][lang], true)}
        </div>

        <div className={styles.flex_center}>
          <ReCAPTCHA
            sitekey="6LdQRbAaAAAAAJjgWi6ffTYVZi9EjNcnnt5zpre-"
            onChange={() => setCaptcha(true)}
            hl={lang === 'eng' ? 'en' : 'ru'}
          />
        </div>

        <div className={styles.flex_center}>
          {TypeButton(text[9][lang], theme, null, () => !loading && handleRegister())}
        </div>
        <div className={styles.flex_center}>
          {text[10][lang]}
        </div>
        <div className={styles.flex_center}>
          <span>{text[11][lang]}</span>
          <Link href='/login'><a><b>{text[12][lang]}</b></a></Link>
        </div>
      </div>
    </div>
  )
}

export default Register;
