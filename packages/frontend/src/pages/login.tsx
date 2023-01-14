import React from "react";
import clsx from "clsx";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import jsonwebtoken from "jsonwebtoken";
import { GetServerSideProps } from "next";
import ReCAPTCHA from "react-google-recaptcha";

import Button from "primitives/Button";
import Input from "primitives/Input";

import { api } from "api";
import { initialize } from "utils/initialize";

import { TypeInput } from "components/Input";

import styles from "styles/pages/Login.module.scss";

import { PageProps } from "./_app";
import styled from "styled-components";

const text = [
  {
    en: "Login successfully",
    ru: "Авторизация выполнена успешно",
  },
  {
    en: "Account is not activated. Check your email:",
    ru: "Пользователь не активирован. Проверьте свою почту:",
  },
  {
    en: "Login",
    ru: "Авторизация",
  },
  {
    en: "Back to Home",
    ru: "Вернуться на главную",
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
    en: "Login",
    ru: "Войти",
  },
  {
    en: "Don't have an account?",
    ru: "У вас нет аккаунта?",
  },
  {
    en: "Registration",
    ru: "Регистрация",
  },
];

const api_massage_codes = {
  "001": {
    en: "Wrong credentionals",
    ru: "Данные введены неправильно",
  },
};

function Login({ locale }: PageProps) {
  const router = useRouter();

  const [captcha] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = React.useCallback(async () => {
    if (!captcha) return;
    setLoading(true);
    api("login", { email, password }).then(async (d) => {
      const data = await d.json();
      if (!d.ok) {
        // enqueueSnackbar(api_massage_codes[data.message_code][locale], { ...notificationConfig, variant: "error" });
        setLoading(false);
      } else {
        // const socket = io(socket_server);
        // socket.emit("LOGIN", { name: data.name });
        if (data.isActivated) {
          // enqueueSnackbar(text[0][locale], { ...notificationConfig, variant: "success" });
        } else {
          // enqueueSnackbar(`${text[1][locale]} ${data.email}`, { ...notificationConfig, variant: "success" });
        }
        document.cookie = `userdata=${jsonwebtoken.sign({ email, password }, "jjjwwwttt")}; path=/`;
        router.push(`/profile/${data.name}`);
      }
    });
  }, [email, password, router, captcha]);

  return (
    <div className={clsx("container", "without_padding", styles.center)}>
      <Head>
        <title>{text[2][locale]}</title>
      </Head>
      <div className={clsx(styles.form_container)}>
        <div className={styles.back}>
          <Link href="/">{text[3][locale]}</Link>
        </div>

        <FieldsContainer>
          <TextField>
            <span>email</span>
            <Input value={email} onChange={setEmail} />
          </TextField>
          <TextField>
            <span>password</span>
            <Input value={password} onChange={setPassword} password />
          </TextField>
        </FieldsContainer>

        {/* <div className={styles.flex_center}>
          <ReCAPTCHA sitekey="6LdQRbAaAAAAAJjgWi6ffTYVZi9EjNcnnt5zpre-" onChange={() => setCaptcha(true)} hl={locale} />
        </div> */}

        <div className={styles.flex_center}>
          <Button onClick={() => !loading && handleLogin()}>{text[6][locale]}</Button>
        </div>
        <div className={styles.flex_center}>
          <span>{text[7][locale]}</span>
          <Link href="/registration">
            <b>{text[8][locale]}</b>
          </Link>
        </div>
      </div>
    </div>
  );
}

const FieldsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px;
`;

const TextField = styled("div")`
  display: flex;
  align-items: center;

  span {
    width: 120px;
  }
`;

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

export default React.memo(Login);
