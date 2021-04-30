import React from 'react'
import { useSnackbar } from 'notistack';

import { notificationConfig } from '../../../../components/Alert';
import { api } from '../../../../api';

const text = [
  {
    eng: <p>Authentication complete! Thank you. Now you can Login.</p>,
    rus: <p>Пользователь активирован! Спасибо. Теперь вы можете выполнить вход в аккаунт.</p>
  },
  {
    eng: <p>In 5 seconds you will be redirected to the main page.</p>,
    rus: <p>Через 5 секунд вы будете перенаправлены на главную страницу.</p>
  },
]

const api_message_code = {
  "001": {
    eng: 'User is already activated',
    rus: 'Пользователь уже активирован'
  },
  "002": {
    eng: 'User activated successfully',
    rus: 'Пользователь успешно активирован'
  },
  "003": {
    eng: 'Wrong activation url!',
    rus: 'Неправильная ссылка активации'
  },
  "004": {
    eng: 'Error with database probably',
    rus: 'Возможно, ошибка в базе данных'
  },
}

function index({ res, lang }) {
  const { enqueueSnackbar } = useSnackbar();
  const statuses = {
    200: 'success',
    201: '',
    400: 'error',
    500: 'error'
  }
  enqueueSnackbar(api_message_code[res.code][lang], { ...notificationConfig, variant: statuses[res.status] });
  if (res.status == 200) {
    localStorage.removeItem('userdata');
    setTimeout(() => {
      location.replace('/');
    }, 5000);
  } else {
    setTimeout(() => {
      location.replace('/');
    }, 5000);
  }
  return <div className="container">
    {res.status == 200 && text[0][lang]}
    {text[1][lang]}
  </div>
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  let status;

  const code = await api('activation', { id })
    .then(async d => {
      const data = await d.json();
      status = d.status;
      return data.message_code
    })

  return {
    props: {
      res: {
        code,
        status
      }
    },
  }
}

export default index
