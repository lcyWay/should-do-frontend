import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';

import Link from 'next/link';
import Head from 'next/head';

import { TypeButton } from '../components/Button';
import { TypeImage } from '../components/Image';

import { notificationConfig } from '../components/Alert';
import { UserType } from '../types';
import { api } from '../api'

import styles from '../styles/pages/Users.module.scss'
import stylesProfile from '../styles/pages/Profile.module.scss'

const text = [
  {
    eng: 'Users uploaded',
    rus: 'Пользователи загружены'
  },
  {
    eng: 'No more users',
    rus: 'Показаны все пользователи'
  },
  {
    eng: 'Users',
    rus: 'Пользователи'
  },
  {
    eng: 'Upload more',
    rus: 'Загрузить ещё'
  },
]

function users({ theme, users, user, lang }) {
  const [state, setState] = React.useState<UserType[] | []>(users);
  const [count, setCount] = React.useState(10);
  const [showButton, setShowButton] = React.useState(true);
  const { enqueueSnackbar } = useSnackbar();
  dayjs.extend(relativeTime);

  const handleUpload = async () => {
    setCount(count + 10);
    api('users', { count: count + 10 })
      .then(async d => {
        const data = await d.json();
        if (d.ok) {
          setState(data);
          enqueueSnackbar(text[0][lang], { ...notificationConfig, variant: 'success' })
        } else {
          setShowButton(false);
          enqueueSnackbar(text[1][lang], { ...notificationConfig, variant: 'error' })
        }
      })
  }

  return (
    <div className="container">
      <Head><title>{text[2][lang]}</title></Head>
      {
        state.map(e => {
          const isOnline = user ? ((user.name !== e.name) && e.online) : e.online;

          return <Link key={e.name} href={`/profile/${e.name}`}><a>
            <div className={styles.user_container}>
              <div>
                {TypeImage(e.imageUrl || '/user.svg', 'avatar', true, 35)}
              </div>
              <div className={styles.name}>
                {e.name}
              </div>
              <div className={stylesProfile.online_container}>
                <div className={clsx(stylesProfile.online_icon, isOnline ? stylesProfile.offline : stylesProfile[`online_${theme}`])}></div>
                {isOnline ? dayjs(e.online).fromNow() : 'online'}
              </div>
            </div>
          </a></Link>
        })
      }
      {showButton && <div className={styles.button_container}>{TypeButton(text[3][lang], theme, null, handleUpload)}</div>}
    </div>
  )
}

export async function getServerSideProps(context) {
  const data = await api('users', { count: 10 }).then(d => d.json()).then(d => d);
  return {
    props: {
      users: data,
    },
  }
}

export default users
