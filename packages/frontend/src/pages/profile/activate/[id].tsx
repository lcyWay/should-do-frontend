import React from "react";
// import { useSnackbar } from 'notistack';

import { notificationConfig } from "../../../../components/Alert";
import { api } from "../../../../api";

const text = [
  {
    en: <p>Authentication complete! Thank you. Now you can Login.</p>,
    ru: <p>Пользователь активирован! Спасибо. Теперь вы можете выполнить вход в аккаунт.</p>,
  },
  {
    en: <p>In 5 seconds you will be redirected to the main page.</p>,
    ru: <p>Через 5 секунд вы будете перенаправлены на главную страницу.</p>,
  },
];

const api_message_code = {
  "001": {
    en: "User is already activated",
    ru: "Пользователь уже активирован",
  },
  "002": {
    en: "User activated successfully",
    ru: "Пользователь успешно активирован",
  },
  "003": {
    en: "Wrong activation url!",
    ru: "Неправильная ссылка активации",
  },
  "004": {
    en: "Error with database probably",
    ru: "Возможно, ошибка в базе данных",
  },
};

function index({ res, lang }) {
  // const { enqueueSnackbar } = useSnackbar();
  const statuses = {
    200: "success",
    201: "",
    400: "error",
    500: "error",
  };
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
      {res.status == 200 && text[0][lang]}
      {text[1][lang]}
    </div>
  );
}

export async function getServerSideProps(context) {
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
}

export default index;
