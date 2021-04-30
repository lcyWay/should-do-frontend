import React from 'react';
import { useSnackbar } from 'notistack';

import { useRouter } from 'next/router'
import Head from 'next/head';

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

const text = [
  {
    eng: 'Success',
    rus: 'Выполнено'
  },
  {
    eng: 'Unexpected error',
    rus: 'Неожиданная ошибка'
  },
  {
    eng: 'Daily tasks',
    rus: 'Ежедневные задачи'
  },
  {
    eng: 'Create task',
    rus: 'Создать задачу'
  },
  {
    eng: 'Show Delete',
    rus: 'Удалить'
  },
  {
    eng: 'Today complete',
    rus: 'Сегодня завершено'
  },
  {
    eng: 'Days in a row',
    rus: 'Дней подряд'
  },
  {
    eng: 'Daily tasks:',
    rus: 'Ежедневные задачи'
  }
]

function Daily({ profile, user, theme, lang }) {
  const router = useRouter();
  const [state, useState] = React.useState<UserType>(profile);
  const [showDelete, setShowDelete] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
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

  const successNotification = () => enqueueSnackbar(text[0][lang], { ...notificationConfig, variant: 'success' })
  const errorNotification = () => enqueueSnackbar(text[1][lang], { ...notificationConfig, variant: 'error' })

  const handleCreate = () => {
    setLoading(true);
    api('daily/create', { name: user.name, title: create.value })
      .then(async d => {
        const data = await d.json();
        if (d.ok) {
          successNotification()
          setCreate({ isOpen: false, value: '' });
          useState(data);
        } else {
          errorNotification()
        }
        setLoading(false);
      })
  }
  const handleDelete = (id) => {
    setLoading(true);
    api('daily/delete', { name: user.name, _id: id })
      .then(async d => {
        const data = await d.json();
        if (d.ok) {
          successNotification();
          useState(data);
        } else {
          errorNotification()
        }
        setLoading(false);
      })
  }
  const handleChangeComplete = (id: number) => {
    setLoading(true);
    api('daily/complete', { name: user.name, id })
      .then(async d => {
        const data = await d.json();
        if (d.ok) {
          successNotification()
          useState(data);
        } else {
          errorNotification()
        }
        setLoading(false);
      })
  }

  return (owner && isActivated) && (
    <div className="container">
      <Head><title>{text[2][lang]}</title></Head>
      <div className={stylesObjectives.statistic}>
        {TypeButton(text[3][lang], theme, null, () => setCreate({ ...create, isOpen: !create.isOpen }), 'small')}
        <div className={stylesObjectives.image_container}>
          {TypeImage(state.imageUrl || '/user.svg', 'image', true, 100)}
        </div>
        {TypeButton(text[4][lang], theme, null, () => setShowDelete(!showDelete), 'small')}
      </div>

      <div className={styles.divider}></div>

      <div>
        {TypeText(`${state.todayCompleteTasks} / ${state.dailyTasks.length}`, text[5][lang])}
        {TypeText(`${state.daysInRow}`, text[6][lang])}
      </div>

      <div className={styles.divider}></div>

      <div className={stylesProfile.tasks}>
        <div className={stylesProfile.text_header}>{text[7][lang]}</div>
        {create.isOpen && CreateTask(create.value, (e) => setCreate({ ...create, value: e }), () => !loading && handleCreate(), theme)}
        {
          state.dailyTasks.map((el: TaskType) => <TaskCard {...el}
            changeComplete={(id) => !loading && handleChangeComplete(id)}
            key={el._id}
            theme={theme}
            owner={owner}
            showDelete={showDelete ? (id) => !loading && handleDelete(id) : false}
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
