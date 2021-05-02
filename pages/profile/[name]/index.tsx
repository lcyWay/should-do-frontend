import React from 'react'
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import relativeTime from 'dayjs/plugin/relativeTime';
import clsx from 'clsx';

import Link from 'next/link';
import Head from 'next/head'

import { TaskType } from '../../../types'
import { api } from '../../../api';

import { notificationConfig } from '../../../components/Alert';
import { TypeButton } from '../../../components/Button'
import { TypeImage } from '../../../components/Image'
import { TypeText } from '../../../components/Text';
import TaskCard from '../../../components/Task'
import Graphic from '../../../components/Graphic';

import styles from '../../../styles/pages/Profile.module.scss'

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
    eng: 'Profile',
    rus: 'Профиль'
  },
  {
    eng: 'User is not activated!',
    rus: 'Пользователь не активирован'
  },
  {
    eng: 'Create task',
    rus: 'Создать задачу'
  },
  {
    eng: 'Progress:',
    rus: 'Прогресс:'
  },
  {
    eng: 'Last seen:',
    rus: 'Последний визит:'
  },
  {
    eng: 'online',
    rus: 'в сети'
  },
  {
    eng: 'Recent Activity:',
    rus: 'Активность:'
  },
  {
    eng: 'Objectives:',
    rus: 'Цели:'
  },
  {
    eng: 'Weekly progress: complited objectives',
    rus: 'Еженедельный прогресс: выполнено целей'
  },
]

const api_activity_codes = (user, value) => ({
  "001": {
    eng: `${user.name} registered successfully. Welcome!`,
    rus: `${user.name} успешно зарегистрировал(ась)ся. Приветствуем!`
  },
  "002": {
    eng: `${user.name} ${value ? 'deleted' : 'changed'} avatar.`,
    rus: `${user.name} ${value ? 'удалил(а)' : 'сменил(а)'} аватар.`
  },
  "003": {
    eng: `${user.name} ${value ? 'opened' : 'hidden'} objectives.`,
    rus: `${user.name} ${value ? 'открыл(а)' : 'скрыл(а)'} свои цели ${value ? 'для' : 'от'} пользователей.`
  },
  "004": {
    eng: `${user.name} complete one objective.`,
    rus: `${user.name} выполнил(а) одну цель.`
  },
  "005": {
    eng: `${user.name} created new objective.`,
    rus: `${user.name} добавил(а) новую цель.`
  },
  "006": {
    eng: `${user.name} completed daily tasks. Well done!`,
    rus: `${user.name} выполнил(а) все ежедневные задания. Поздравляем!`
  },
  "007": {
    eng: `${user.name} created new daily task.`,
    rus: `${user.name} добавил(а) новую ежедневную задачу.`
  }
})



function Profile({ theme, profile, user, lang }) {
  const [profileUser, setProfileUser] = React.useState(profile);
  const [state, useState] = React.useState<TaskType[] | []>(profile.tasks);
  const [loading, setLoading] = React.useState(false);

  if (profileUser.name !== profile.name) {
    useState(profile.tasks);
    setProfileUser(profile);
  }
  const owner = user ? (user.name === profile.name) : false;
  const isOnline = (profile.online !== null) && !owner;

  const { enqueueSnackbar } = useSnackbar();
  dayjs.extend(relativeTime)


  const onlineText = () => <div className={styles.online_container}>
    <div className={clsx(styles.online_icon, isOnline ? styles.offline : styles[`online_${theme}`])}></div>
    {isOnline ? dayjs(profile.online).fromNow() : text[7][lang]}
  </div>


  const handleChangeComplete = (id: number) => {
    setLoading(true);
    api(`objectives/complete`, { name: user.name, id })
      .then(async d => {
        const data = await d.json();
        if (d.ok) {
          enqueueSnackbar(text[0][lang], { ...notificationConfig, variant: 'success' })
          useState(data)
        } else {
          enqueueSnackbar(text[1][lang], { ...notificationConfig, variant: 'error' })
        }
        setLoading(false);
      })
  }

  return profile.isActivated ? <>
    <Head><title>{text[2][lang]}</title></Head>

    <div className='container'>
      <div className={styles.profile}>
        <div className={styles.name}>
          {TypeImage(profile.imageUrl || '/user.svg', 'image', true, 80)}
          <b>{profile.name}</b>
        </div>
        {owner && <div className={styles.create_task}>
          <Link href={`/profile/daily/${user.name}`}>
            <a>{TypeButton(text[4][lang], theme)}</a>
          </Link>
        </div>}
      </div>

      <div className={styles.flex}>
        <div className={styles.flex_block}>
          <div className={styles.text_header}>{text[5][lang]}</div>
          <div className={styles.last_seen}>
            {text[6][lang]} {onlineText()}
          </div>
          <div className={styles.graph}>{text[10][lang]}</div>
          {Graphic(profile.graphData, theme, lang)}
        </div>
        <div className={styles.flex_block}>
          <div className={styles.text_header}>{text[8][lang]}</div>
          <div className={styles.activity}>
            {
              profile.activity.map((el, i) => <div className={styles.activ_container} key={i}>
                <div>{TypeImage(profile.imageUrl || '/user.svg', 'image', true, 25)}</div>
                <div className={styles.title}>{api_activity_codes(profile, el.title.value)[el.title.code][lang]}</div>
                <div className={styles.date}>{dayjs(el.createdAt).fromNow()}</div>
              </div>)
            }
          </div>
        </div>
      </div>

      {profile.showTasks &&
        <div className={styles.tasks}>
          <div className={styles.text_header}>{text[9][lang]}</div>
          {
            state.map((el: TaskType, i) => <TaskCard {...el}
              changeComplete={(id) => !loading && handleChangeComplete(id)}
              key={i}
              theme={theme}
              owner={owner}
              showDelete={false}
            />)
          }
        </div>
      }
    </div>
  </> : <div className={clsx('container', styles.not_activated)}>
    {text[3][lang]} &#128577;
  </div>
}

export async function getServerSideProps(context) {
  const name = context.query.name;
  const data = await api('profile', { name }).then(d => d.json()).then(d => d);
  return {
    props: {
      profile: data
    },
  }
}

export default Profile;
