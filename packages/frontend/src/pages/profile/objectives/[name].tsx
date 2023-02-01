import React from "react";
import Head from "next/head";
import { useIntl } from "react-intl";
import { GetServerSideProps } from "next";

import { apiBeba } from "api";
import { initialize } from "utils/initialize";

import { PageProps } from "pages/_app";

import { UserType } from "types";

import CreatePage from "views/CreatePage";

interface ObjectivesInterface extends PageProps {
  user: UserType;
  profile: UserType;
}

function Objectives(props: ObjectivesInterface) {
  const intl = useIntl();
  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: "tasks.objectives_title" })}</title>
      </Head>
      <CreatePage page="objectives" {...props} />
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
  const profile = await apiBeba("daily/tasks", { name });

  if (user.name !== profile.name)
    return {
      props: {},
      redirect: "/profile/objectives/" + user.name,
    };

  return {
    props: {
      profile,
      user,
    },
  };
};

export default React.memo(Objectives);
