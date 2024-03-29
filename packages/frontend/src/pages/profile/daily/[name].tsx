import React from "react";
import Head from "next/head";
import { useIntl } from "react-intl";
import { GetServerSideProps } from "next";

import { UserType } from "types";
import { apiNextServer } from "api";
import { initialize } from "utils/initialize";

import CreatePage from "views/CreatePage";
import { PageProps } from "pages/_app";

interface DailyInterface extends PageProps {
  profile: UserType;
  user: UserType;
}

function Daily(props: DailyInterface) {
  const intl = useIntl();
  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: "tasks.daily_title" })}</title>
      </Head>
      <CreatePage page="daily" {...props} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await initialize(context);

  if (!user)
    return {
      props: {},
      redirect: "/login",
    };

  const { name } = context.query;
  const profile = await apiNextServer("daily/tasks", { name });

  return {
    props: {
      profile,
      user,
    },
  };
};

export default React.memo(Daily);
