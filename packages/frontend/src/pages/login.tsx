import React from "react";
import Link from "next/link";
import Head from "next/head";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouter } from "next/router";
import jsonwebtoken from "jsonwebtoken";
import { GetServerSideProps } from "next";
import styled from "styled-components";
import ReCAPTCHA from "react-google-recaptcha";

import Button from "primitives/Button";
import Input from "primitives/Input";

import { NotificationContext } from "components/Notifications";

import { initialize } from "utils/initialize";

import { googleApiKey } from "config";
import { apiNextServer } from "api";

import { PageProps } from "./_app";

function Login({ locale }: PageProps) {
  const intl = useIntl();
  const router = useRouter();

  const { createNotification } = React.useContext(NotificationContext);

  const [captcha, setCaptcha] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = React.useCallback(async () => {
    if (loading || !captcha || !email || !password) return;

    setLoading(true);
    apiNextServer("login", { email, password })
      .then((data) => {
        if (!data || !data._id) {
          createNotification(intl.formatMessage({ id: "notification.user_not_found" }));
          return;
        }

        createNotification(intl.formatMessage({ id: "notification.success" }));

        document.cookie = `userdata=${jsonwebtoken.sign(
          { email, password },
          process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string
        )}; path=/`;

        router.push(`/profile/${data.name}`);
      })
      .finally(() => setLoading(false));
  }, [captcha, loading, email, password, createNotification, intl, router]);

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: "login.title" })}</title>
      </Head>
      <Container>
        <FormContainer>
          <Title>
            <FormattedMessage id="login.title" />
          </Title>

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

          <ReCAPTCHA sitekey={googleApiKey} onChange={() => setCaptcha(true)} hl={locale} />

          <div>
            <Button onClick={() => !loading && handleLogin()}>
              <FormattedMessage id="login.login_button" />
            </Button>
          </div>
          <div>
            <span>
              <FormattedMessage id="login.no_account" />{" "}
            </span>
            <Link href="/registration">
              <b>
                <FormattedMessage id="login.registration" />
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

export default React.memo(Login);
