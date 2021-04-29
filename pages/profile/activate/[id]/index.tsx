import React from 'react'
import { useSnackbar } from 'notistack';

import { notificationConfig } from '../../../../components/Alert';
import { api } from '../../../../api';

function index({ res }) {
  const { enqueueSnackbar } = useSnackbar();
  const statuses = {
    200: 'success',
    201: '',
    400: 'error',
    500: 'error'
  }
  enqueueSnackbar(res.mes, { ...notificationConfig, variant: statuses[res.status] });
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
    {res.status == 200 && <p>Authentication complete! Thank you. Now you can Login.</p>}
    <p>In 5 seconds you will be redirected to the main page.</p>
  </div>
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  let status;

  const mes = await api('activation', { id })
    .then(async d => {
      const data = await d.json();
      status = d.status;
      return data.message
    })

  return {
    props: {
      res: {
        mes,
        status
      }
    },
  }
}

export default index
