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

function Register({ user, theme }) {
  const { enqueueSnackbar } = useSnackbar();
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
  }

  const handleRegister = () => {
    if (captcha) {
      if (state.username.split(' ').length < 2) {
        schema
          .isValid(state)
          .then(function (valid) {
            if (valid) {
              if (window.confirm('A confirmation mail will be sent to this email: ' + state.email)) {
                enqueueSnackbar('Loading...', { ...notificationConfig });
                api('registration', { name: state.username, password: state.password, email: state.email })
                  .then(async d => {
                    const data = await d.json();
                    if (d.ok) {
                      enqueueSnackbar(data.message, { ...notificationConfig, variant: 'success' });
                      router.push('/login');
                    } else {
                      enqueueSnackbar(data.message, { ...notificationConfig, variant: 'error' })
                    }
                  })
              }
            } else {
              enqueueSnackbar('Invalid credentionals', { ...notificationConfig, variant: 'error' })
            }
          });
      } else {
        enqueueSnackbar('Username must be without spaces ', { ...notificationConfig, variant: 'error' })
      }
    }
  }

  return (
    <div className={clsx('container', 'without_padding', styles.center)}>
      <Head><title>Registration</title></Head>

      <div className={clsx(styles.form_container)}>
        <div className={styles.back}>
          <Link href='/'>
            <a>Back to Home </a>
          </Link>
        </div>

        <div className={styles.forms}>
          {TypeInput(state.username, (e: string) => handleChange(e, 'username'), theme, 'username')}
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
          {TypeButton('Register', theme, null, handleRegister)}
        </div>
        <div className={styles.flex_center}>
          <span>A confirmation mail will be sent to this <b>email</b></span>
        </div>
        <div className={styles.flex_center}>
          <span>Have an account?</span>
          <Link href='/login'><a><b>Login</b></a></Link>
        </div>
      </div>
    </div>
  )
}

export default Register;
