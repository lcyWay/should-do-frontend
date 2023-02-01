import React from "react";
import { GetServerSideProps } from "next";
import { FormattedMessage } from "react-intl";

import { api } from "api";

// const api_message_code = {
//   "001": {
//     en: "User is already activated",
//     ru: "Пользователь уже активирован",
//   },
//   "002": {
//     en: "User activated successfully",
//     ru: "Пользователь успешно активирован",
//   },
//   "003": {
//     en: "Wrong activation url!",
//     ru: "Неправильная ссылка активации",
//   },
//   "004": {
//     en: "Error with database probably",
//     ru: "Возможно, ошибка в базе данных",
//   },
// };

function Activate({ res }: { res: any }) {
  // const { enqueueSnackbar } = useSnackbar();
  // const statuses = {
  //   200: "success",
  //   201: "",
  //   400: "error",
  //   500: "error",
  // };
  // enqueueSnackbar(api_message_code[res.code][lang], { ...notificationConfig, variant: statuses[res.status] });
  if (res.status == 200) {
    localStorage.removeItem("userdata");
    setTimeout(() => {
      location.replace("/");
    }, 5000);
  } else {
    setTimeout(() => {
      location.replace("/");
    }, 5000);
  }
  return (
    <div className="container">
      {res.status == 200 && <FormattedMessage id="activation.activated" />}
      {<FormattedMessage id="activation.redirect" />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  let status;

  const code = await api("activation", { id }).then(async (d) => {
    const data = await d.json();
    status = d.status;
    return data.message_code;
  });

  return {
    props: {
      res: {
        code,
        status,
      },
    },
  };
};

export default Activate;
