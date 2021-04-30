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
    eng: 'Objectives',
    rus: 'Цели'
  },
  {
    eng: 'Create task',
    rus: 'Добавить цель'
  },
  {
    eng: 'Show Delete',
    rus: 'Удалить'
  },
  {
    eng: 'Objectives:',
    rus: 'Цели:'
  },
]

function Objectives({ profile, user, theme, lang }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [state, useState] = React.useState<TaskType[] | []>(profile.tasks);
  const [showDelete, setShowDelete] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
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

  const successNotification = () => enqueueSnackbar(text[0][lang], { ...notificationConfig, variant: 'success' })
  const errorNotification = () => enqueueSnackbar(text[1][lang], { ...notificationConfig, variant: 'error' })

  const handleChangeComplete = (id: string) => {
    setLoading(true);
    api(`objectives/complete`, { name: user.name, id })
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

  const handleDelete = (id) => {
    setLoading(true);
    api('objectives/delete', { name: user.name, _id: id })
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

  const handleCreate = () => {
    setLoading(true);
    api('objectives/create', { name: user.name, title: create.value })
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

  return (owner && isActivated) && (
    <div className="container">
      <Head><title>{text[2][lang]}</title></Head>
      <div className={styles.statistic}>
        {TypeButton(text[3][lang], theme, null, () => setCreate({ ...create, isOpen: !create.isOpen }), 'small')}
        <div className={styles.image_container}>
          {TypeImage(profile.imageUrl || '/user.svg', 'image', true, 100)}
        </div>
        {TypeButton(text[4][lang], theme, null, () => setShowDelete(!showDelete), 'small')}
      </div>

      <div className={stylesProfile.tasks}>
        <div className={stylesProfile.text_header}>{text[5][lang]}</div>
        {create.isOpen && CreateTask(create.value, (e) => setCreate({ ...create, value: e }), () => !loading && handleCreate(), theme)}
        {
          state.map((el: TaskType) => <TaskCard {...el}
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
  const name = context.query.name;
  const data = await api('profile', { name }).then(d => d.json()).then(d => d)
  return {
    props: {
      profile: data
    },
  }
}

export default Objectives
