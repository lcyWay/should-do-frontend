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

function Login({ theme, user, setUser, setSocket }) {
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
                alert(data.message)
              } else {
                const socket = io(socket_server);
                socket.emit('LOGIN', { name: data.name });
                if (data.isActivated) {
                  enqueueSnackbar('Login successfully', { ...notificationConfig, variant: 'success' });
                } else {
                  enqueueSnackbar(`Account is not activated. Check your email: ${data.email}`, { ...notificationConfig, variant: 'success' });
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
      <Head><title>Login</title></Head>
      <div className={clsx(styles.form_container)}>
        <div className={styles.back}>
          <Link href='/'>
            <a>Back to Home </a>
          </Link>
        </div>

        <div className={styles.forms}>
          {TypeInput(state.email, (e: string) => handleChange(e, 'email'), theme, 'email')}
          {TypeInput(state.password, (e: string) => handleChange(e, 'password'), theme, 'password', true)}
        </div>

        <div className={styles.flex_center}>
          <ReCAPTCHA
            sitekey="6LdQRbAaAAAAAJjgWi6ffTYVZi9EjNcnnt5zpre-"
            onChange={() => setCaptcha(true)}
          />
        </div>

        <div className={styles.flex_center}>
          {TypeButton('Login', theme, null, handleLogin)}
        </div>
        <div className={styles.flex_center}>
          <span>Don't have an account?</span>
          <Link href='/registration'><a><b>Registration</b></a></Link>
        </div>
      </div>
    </div>
  )
}

export default Login
