import React from "react";
import dayjs from "dayjs";
import Link from "next/link";
import Head from "next/head";
import styled from "styled-components";
import { GetServerSideProps } from "next";
import relativeTime from "dayjs/plugin/relativeTime";
import { FormattedMessage, useIntl } from "react-intl";

import { NotificationContext } from "components/Notifications";

import Button from "primitives/Button";

import { initialize } from "utils/initialize";

import { UserType } from "types";
import { apiBeba } from "api";

import { PageProps } from "./_app";

dayjs.extend(relativeTime);

interface UsersInterface extends PageProps {
  users: UserType[];
  user: UserType;
}

function Users({ users, user }: UsersInterface) {
  const intl = useIntl();

  const { createNotification } = React.useContext(NotificationContext);

  const [state, setState] = React.useState<UserType[] | []>(users);
  const [count, setCount] = React.useState(10);

  const [loading, setLoading] = React.useState(false);
  const [showButton, setShowButton] = React.useState(true);

  const handleUpload = React.useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setCount(count + 10);

    const data = await apiBeba("users", { count: count + 10 });
    setLoading(false);

    if (!data || !data?.ok || !data?.users) {
      createNotification(intl.formatMessage({ id: "notification.all_users_are_showed" }));
      setShowButton(false);
      return;
    }

    createNotification(intl.formatMessage({ id: "notification.success" }));
    setState(data?.users);
  }, [count, createNotification, intl, loading]);

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: "users.title" })}</title>
      </Head>

      <Container>
        {state.map((e) => {
          const isOnline = user ? user.name !== e.name && e.online : e.online;
          return (
            <Link key={e.name} href={`/profile/${e.name}`}>
              <CardContainer>
                <CardHeaderContainer>
                  <img src={e.imageUrl || "/icons/user.svg"} alt="" />
                  {e.name}
                </CardHeaderContainer>
                <OnlineContainer online={!isOnline}>
                  <OnlineStatus online={!isOnline} />
                  {isOnline ? dayjs(e.online).fromNow() : "online"}
                </OnlineContainer>
              </CardContainer>
            </Link>
          );
        })}
        {showButton && (
          <ButtonContainer>
            <Button onClick={handleUpload}>
              <FormattedMessage id="users.load_more" />
            </Button>
          </ButtonContainer>
        )}
      </Container>
    </>
  );
}

const Container = styled("div")`
  margin: 20px auto;
  max-width: 1000px;
  width: calc(100% - 20px);
  padding: 0 10px;
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const CardContainer = styled("div")`
  display: flex;
  background: ${({ theme }) => theme.layout.primary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.layout.gray};
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const CardHeaderContainer = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 32px;
    border-radius: 50%;
    object-fit: cover;
    height: 32px;
  }
`;

const OnlineContainer = styled("div")<{ online: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ online, theme }) => (online ? theme.colors.primary : theme.text.hint)};
`;

const OnlineStatus = styled("div")<{ online: boolean }>`
  display: flex;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 2px;
  background: ${({ theme, online }) => (online ? theme.colors.primary : theme.layout.gray)};
`;

const ButtonContainer = styled("div")`
  display: flex;
  margin-top: 10px;
  justify-content: center;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await initialize(context);
  const data = await apiBeba("users", { count: 10 });

  return {
    props: {
      user,
      users: data ? data?.users || [] : [],
    },
  };
};

export default React.memo(Users);
