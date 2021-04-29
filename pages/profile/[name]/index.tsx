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

function Profile({ theme, profile, user }) {
  const [state, useState] = React.useState<TaskType[] | []>(profile.tasks);

  if (state.length !== profile.tasks.length) { useState(profile.tasks) }
  const owner = user ? (user.name === profile.name) : false;
  const isOnline = (profile.online !== null) && !owner;

  const { enqueueSnackbar } = useSnackbar();
  dayjs.extend(relativeTime)


  const onlineText = () => <div className={styles.online_container}>
    <div className={clsx(styles.online_icon, isOnline ? styles.offline : styles[`online_${theme}`])}></div>
    {isOnline ? dayjs(profile.online).fromNow() : 'online'}
  </div>


  const handleChangeComplete = (id: number) => {
    api(`objectives/complete`, { name: user.name, id })
      .then(async d => {
        const data = await d.json();
        if (d.ok) {
          enqueueSnackbar('Success', { ...notificationConfig, variant: 'success' })
          useState(data)
        } else {
          enqueueSnackbar('Unexpected error', { ...notificationConfig, variant: 'error' })
        }
      })
  }

  return profile.isActivated ? <>
    <Head><title>Profile</title></Head>

    <div className='container'>
      <div className={styles.profile}>
        <div className={styles.name}>
          {TypeImage(profile.imageUrl || '/user.svg', 'image', true, 80)}
          <b>{profile.name}</b>
        </div>
        {owner && <div className={styles.create_task}>
          <Link href={`/profile/daily/${user.name}`}>
            <a>{TypeButton('Create task', theme)}</a>
          </Link>
        </div>}
      </div>

      <div className={styles.flex}>
        <div className={styles.flex_block}>
          <div className={styles.text_header}>Progress:</div>
          {TypeText(onlineText(), 'Last seen')}
          {Graphic(profile.graphData, theme)}
        </div>
        <div className={styles.flex_block}>
          <div className={styles.text_header}>Recent Activity:</div>
          <div className={styles.activity}>
            {
              profile.activity.map((el, i) => <div className={styles.activ_container} key={i}>
                <div>{TypeImage(profile.imageUrl || '/user.svg', 'image', true, 25)}</div>
                <div className={styles.title}>{el.title}</div>
                <div className={styles.date}>{dayjs(el.createdAt).fromNow()}</div>
              </div>)
            }
          </div>
        </div>
      </div>

      {profile.showTasks &&
        <div className={styles.tasks}>
          <div className={styles.text_header}>Objectives:</div>
          {
            state.map((el: TaskType, i) => <TaskCard {...el}
              changeComplete={(id) => handleChangeComplete(id)}
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
    Account is not activated! &#128577;
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
