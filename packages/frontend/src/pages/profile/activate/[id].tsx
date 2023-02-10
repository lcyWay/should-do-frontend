import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { FormattedMessage, useIntl } from "react-intl";

import { apiNextServer } from "api";

import { NotificationContext } from "components/Notifications";

interface ActivateInterface {
  code: string;
  success: boolean;
}

function Activate({ code, success }: ActivateInterface) {
  const intl = useIntl();
  const { replace } = useRouter();

  const { createNotification } = React.useContext(NotificationContext);

  const [notificaitonWasShowed, setNotificaitonWasShowed] = React.useState(false);

  React.useEffect(() => {
    if (notificaitonWasShowed) return;
    setNotificaitonWasShowed(true);
    createNotification(intl.formatMessage({ id: "activation.message." + code }));
    setTimeout(() => replace("/"), 5000);
  }, [code, createNotification, intl, notificaitonWasShowed, replace]);

  return (
    <Container>
      {success && <FormattedMessage id="activation.activated" />}
      {<FormattedMessage id="activation.redirect" />}
    </Container>
  );
}

const Container = styled("div")`
  margin: auto;
  text-align: center;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const result = await apiNextServer("activation", { id });
  const code = result?.message_code;
  const success = !!result?.success;

  if (!result || typeof code !== "string")
    return {
      props: {},
      redirect: {
        destination: "/",
      },
    };

  return {
    props: {
      code,
      success,
    },
  };
};

export default React.memo(Activate);
