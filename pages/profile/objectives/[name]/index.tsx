import React from 'react'
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router'
import Head from 'next/head';

import { TaskType } from '../../../../types';
import { api } from '../../../../api';

import { TypeButton } from '../../../../components/Button';
import { TypeImage } from '../../../../components/Image';
import TaskCard, { CreateTask } from '../../../../components/Task';
import { notificationConfig } from '../../../../components/Alert';

import styles from '../../../../styles/pages/Objectives.module.scss'
import stylesProfile from '../../../../styles/pages/Profile.module.scss'

function Objectives({ profile, user, theme }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [state, useState] = React.useState<TaskType[] | []>(profile.tasks);
  const [showDelete, setShowDelete] = React.useState(false);
  const [create, setCreate] = React.useState({
    value: '',
    isOpen: false
  });
  const owner = user ? (user.name === profile.name) : false;
  const isActivated = user ? user.isActivated : false;

  if (user === null) {
    router.push('/login')
  } else if (!owner) {
    router.push(`/profile/objectives/${user.name}`)
  }

  const handleChangeComplete = (id: string) => {
    api(`objectives/complete`, { name: user.name, id })
      .then(async d => {
        const data = await d.json();
        if (d.ok) {
          enqueueSnackbar('Success', { ...notificationConfig, variant: 'success' })
          useState(data);
        } else {
          enqueueSnackbar('Unexpected error', { ...notificationConfig, variant: 'error' })
        }
      })
  }

  const handleDelete = (id) => {
    api('objectives/delete', { name: user.name, _id: id })
      .then(async d => {
        const data = await d.json();
        if (d.ok) {
          enqueueSnackbar('Success', { ...notificationConfig, variant: 'success' });
          useState(data);
        } else {
          enqueueSnackbar('Unexpected error', { ...notificationConfig, variant: 'error' })
        }
      })
  }

  const handleCreate = () => {
    api('objectives/create', { name: user.name, title: create.value })
      .then(async d => {
        const data = await d.json();
        if (d.ok) {
          enqueueSnackbar('Success', { ...notificationConfig, variant: 'success' })
          setCreate({ isOpen: false, value: '' });
          useState(data);
        } else {
          enqueueSnackbar('Unexpected error', { ...notificationConfig, variant: 'error' })
        }
      })
  }

  return (owner && isActivated) && (
    <div className="container">
      <Head><title>Objectives</title></Head>
      <div className={styles.statistic}>
        {TypeButton('Create task', theme, null, () => setCreate({ ...create, isOpen: !create.isOpen }), 'small')}
        <div className={styles.image_container}>
          {TypeImage(profile.imageUrl || '/user.svg', 'image', true, 100)}
        </div>
        {TypeButton(`Show Delete`, theme, null, () => setShowDelete(!showDelete), 'small')}
      </div>

      <div className={stylesProfile.tasks}>
        <div className={stylesProfile.text_header}>Objectives:</div>
        {create.isOpen && CreateTask(create.value, (e) => setCreate({ ...create, value: e }), handleCreate, theme)}
        {
          state.map((el: TaskType) => <TaskCard {...el}
            changeComplete={(id) => handleChangeComplete(id)}
            key={el._id}
            theme={theme}
            owner={owner}
            showDelete={showDelete ? (id) => handleDelete(id) : false}
          />)
        }
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const name = context.query.name;
  const data = await api('profile', { name }).then(d => d.json()).then(d => d)
  return {
    props: {
      profile: data
    },
  }
}

export default Objectives
