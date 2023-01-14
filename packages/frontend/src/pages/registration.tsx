import React from "react";
import clsx from "clsx";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import ReCAPTCHA from "react-google-recaptcha";

import { TypeButton } from "components/Button";
import { TypeInput } from "components/Input";

import { initialize } from "utils/initialize";
import { api } from "api";

import styles from "styles/pages/Login.module.scss";
import { PageProps } from "./_app";

const text = [
  {
    en: "A confirmation mail will be sent to this email: ",
    ru: "Письмо с подтверждением будет отправлено на эту почту: ",
  },
  {
    en: "Loading...",
    ru: "Загрузка...",
  },
  {
    en: "Invalid credentionals",
    ru: "Некорректно указаны данные",
  },
  {
    en: "Username must be without spaces",
    ru: "Имя пользователя должно быть без пробелов",
  },
  {
    en: "Registration",
    ru: "Регистрация",
  },
  {
    en: "Back to home",
    ru: "Вернуться на главную",
  },
  {
    en: "username",
    ru: "имя",
  },
  {
    en: "email",
    ru: "почта",
  },
  {
    en: "password",
    ru: "пароль",
  },
  {
    en: "Register",
    ru: "Зарегистрироваться",
  },
  {
    en: (
      <span>
        A confirmation mail will be sent to this <b>email</b>!
      </span>
    ),
    ru: (
      <span>
        Письмо с подтверждением будет выслано на <b>указанную почту</b>!
      </span>
    ),
  },
  {
    en: "Have an account?",
    ru: "Уже есть аккаунт?",
  },
  {
    en: "Login",
    ru: "Войти",
  },
];

const api_message_codes = {
  "001": {
    en: "User with that username already exist",
    ru: "Пользователь с таким именем уже существует",
  },
  "002": {
    en: "User with that email already exist",
    ru: "Пользователь с такой почтой уже существует",
  },
  "003": {
    en: "Check your email for complete registration",
    ru: "Проверьте свою почту для завершения регистрации",
  },
};

function Register({ theme, locale }: PageProps) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const [captcha, setCaptcha] = React.useState(false);
  const [state, setState] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (value: string, path: string) => {
    const newState = { ...state };
    newState[path] = value;
    setState(newState);
  };

  const handleRegister = () => {
    setLoading(true);
    if (captcha) {
      if (state.username.split(" ").length < 2) {
        schema.isValid(state).then(function (valid) {
          if (valid) {
            if (window.confirm(text[0][locale] + state.email)) {
              // enqueueSnackbar(text[1][locale], { ...notificationConfig });
              api("registration", { name: state.username, password: state.password, email: state.email }).then(
                async (d) => {
                  const data = await d.json();
                  if (d.ok) {
                    // enqueueSnackbar(api_message_codes[data.code_message][locale], {
                    //   ...notificationConfig,
                    //   variant: "success",
                    // });
                    router.push("/login");
                  } else {
                    // enqueueSnackbar(api_message_codes[data.code_message][locale], {
                    //   ...notificationConfig,
                    //   variant: "error",
                    // });
                  }
                  setLoading(false);
                },
              );
            } else {
              setLoading(false);
            }
          } else {
            setLoading(false);
            // enqueueSnackbar(text[2][locale], { ...notificationConfig, variant: "error" });
          }
        });
      } else {
        setLoading(false);
        // enqueueSnackbar(text[3][locale], { ...notificationConfig, variant: "error" });
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className={clsx("container", "without_padding", styles.center)}>
      <Head>
        <title>{text[4][locale]}</title>
      </Head>

      <div className={clsx(styles.form_container)}>
        <div className={styles.back}>
          <Link href="/">{text[5][locale]}</Link>
        </div>

        <div className={styles.forms}>
          {TypeInput(state.username, (e: string) => handleChange(e, "username"), theme, text[6][locale])}
          {TypeInput(state.email, (e: string) => handleChange(e, "email"), theme, text[7][locale])}
          {TypeInput(state.password, (e: string) => handleChange(e, "password"), theme, text[8][locale], true)}
        </div>

        <div className={styles.flex_center}>
          <ReCAPTCHA sitekey="6LdQRbAaAAAAAJjgWi6ffTYVZi9EjNcnnt5zpre-" onChange={() => setCaptcha(true)} hl={locale} />
        </div>

        <div className={styles.flex_center}>
          {TypeButton(text[9][locale], theme, null, () => !loading && handleRegister())}
        </div>
        <div className={styles.flex_center}>{text[10][locale]}</div>
        <div className={styles.flex_center}>
          <span>{text[11][locale]}</span>
          <Link href="/login">
            <b>{text[12][locale]}</b>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await initialize(context);

  if (user)
    return {
      redirect: {
        destination: "/profile/" + user.name,
      },
      props: {},
    };

  return {
    props: {},
  };
};

export default React.memo(Register);
