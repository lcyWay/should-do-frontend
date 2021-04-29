import React from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router'

import { TaskType, UserType } from '../../../../types';
import { notificationConfig } from '../../../../components/Alert';
import { api } from '../../../../api';

import TaskCard, { CreateTask } from '../../../../components/Task';
import { TypeButton } from '../../../../components/Button';
import { TypeImage } from '../../../../components/Image';
import { TypeText } from '../../../../components/Text';

import styles from '../../../../styles/pages/Options.module.scss'
import stylesObjectives from '../../../../styles/pages/Objectives.module.scss'
import stylesProfile from '../../../../styles/pages/Profile.module.scss'

function Daily({ profile, user, theme }) {
  const router = useRouter();
  const [state, useState] = React.useState<UserType>(profile);
  const [showDelete, setShowDelete] = React.useState(false);
  const [create, setCreate] = React.useState({
    value: '',
    isOpen: false
  });

  const { enqueueSnackbar } = useSnackbar();
  const owner = user ? (user.name === profile.name) : false;
  const isActivated = user ? user.isActivated : false;

  if (user === null) {
    router.push('/login')
  } else if (!owner) {
    router.push(`/profile/daily/${user.name}`)
  }

  const handleCreate = () => {
    api('daily/create', { name: user.name, title: create.value })
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
  const handleDelete = (id) => {
    api('daily/delete', { name: user.name, _id: id })
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
  const handleChangeComplete = (id: number) => {
    api('daily/complete', { name: user.name, id })
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

  return (owner && isActivated) && (
    <div className="container">
      <div className={stylesObjectives.statistic}>
        {TypeButton('Create task', theme, null, () => setCreate({ ...create, isOpen: !create.isOpen }), 'small')}
        <div className={stylesObjectives.image_container}>
          {TypeImage(state.imageUrl || '/user.svg', 'image', true, 100)}
        </div>
        {TypeButton(`Show Delete`, theme, null, () => setShowDelete(!showDelete), 'small')}
      </div>

      <div className={styles.divider}></div>

      <div>
        {TypeText(`${state.todayCompleteTasks} / ${state.dailyTasks.length}`, 'Today complete')}
        {TypeText(`${state.daysInRow}`, 'Days in a row')}
      </div>

      <div className={styles.divider}></div>

      <div className={stylesProfile.tasks}>
        <div className={stylesProfile.text_header}>Daily tasks:</div>
        {create.isOpen && CreateTask(create.value, (e) => setCreate({ ...create, value: e }), handleCreate, theme)}
        {
          state.dailyTasks.map((el: TaskType) => <TaskCard {...el}
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
  const { name } = context.query;
  const data = await api('daily/tasks', { name }).then(d => d.json()).then(d => d);
  return {
    props: {
      profile: data
    },
  }
}


export default Daily;
