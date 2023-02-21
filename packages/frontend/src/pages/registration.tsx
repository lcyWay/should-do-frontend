import React from "react";
import Head from "next/head";
import Link from "next/link";
import jsonwebtoken from "jsonwebtoken";
import styled from "styled-components";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import ReCAPTCHA from "react-google-recaptcha";

import { NotificationContext } from "components/Notifications";

import Button from "primitives/Button";
import Input from "primitives/Input";

import { initialize } from "utils/initialize";

import { googleApiKey } from "config";
import { apiNextServer } from "api";

import { PageProps } from "./_app";

function Register({ locale }: PageProps) {
  const intl = useIntl();
  const router = useRouter();

  const { createNotification } = React.useContext(NotificationContext);

  const [loading, setLoading] = React.useState(false);

  const [captcha, setCaptcha] = React.useState(false);
  const [state, setState] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = React.useCallback(
    (value: string, path: keyof typeof state) => {
      const newState = { ...state };
      newState[path] = value;
      setState(newState);
    },
    [state]
  );

  const handleRegister = React.useCallback(async () => {
    if (loading || !captcha) return;

    const { username, password, email } = state;
    if (!username || !password || !email) return;

    if (!email.includes("@") || !email.includes(".")) {
      createNotification(intl.formatMessage({ id: "notification.wrong_email" }));
      return;
    }

    setLoading(true);

    const data = await apiNextServer("registration", { name: username, password, email });

    if (!data || data === null || typeof data !== "object" || !data.ok) {
      createNotification(intl.formatMessage({ id: "notification.error" }));
      setLoading(false);
      return;
    }

    createNotification(intl.formatMessage({ id: "notification.registration.code_" + data.code_message }));
    document.cookie = `userdata=${jsonwebtoken.sign({ email, password }, "jjjwwwttt")}; path=/`;
    setTimeout(() => router.push("/profile/" + state.username), 1000);
  }, [captcha, createNotification, intl, loading, router, state]);

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: "registration.title" })}</title>
      </Head>

      <Container>
        <FormContainer>
          <Title>
            <FormattedMessage id="registration.title" />
          </Title>

          <FieldsContainer>
            <TextField>
              <span>username</span>
              <Input onChange={(e) => handleChange(e, "username")} value={state.username} />
            </TextField>
            <TextField>
              <span>email</span>
              <Input onChange={(e) => handleChange(e, "email")} value={state.email} />
            </TextField>
            <TextField>
              <span>password</span>
              <Input onChange={(e) => handleChange(e, "password")} value={state.password} password />
            </TextField>
          </FieldsContainer>

          <ReCAPTCHA sitekey={googleApiKey} onChange={() => setCaptcha(true)} hl={locale} />

          <div>
            <Button loading={loading} onClick={handleRegister}>
              <FormattedMessage id="registration.registration_button" />
            </Button>
          </div>
          <div>
            <FormattedMessage id="registration.have_an_account" />{" "}
            <Link href="/login">
              <b>
                <FormattedMessage id="registration.login" />
              </b>
            </Link>
          </div>
        </FormContainer>
      </Container>
    </>
  );
}

const Container = styled("div")`
  margin: auto;
  max-width: 1000px;
  width: calc(100% - 20px);
  padding: 0 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FormContainer = styled("div")`
  max-width: 440px;
  width: calc(100% - 40px);
  margin: 20px auto;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.layout.primary};
  border: 1px solid ${({ theme }) => theme.layout.gray};
`;

const Title = styled("div")`
  font-size: 20px;
  letter-spacing: 1px;
  text-align: center;
`;

const FieldsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
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

export default React.memo(Register);
