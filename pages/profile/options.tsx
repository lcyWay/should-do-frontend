import React from 'react'
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router'

import Head from 'next/head';

import { notificationConfig } from '../../components/Alert';
import { api } from '../../api';

import { TypeButton } from '../../components/Button';
import { TypeImage } from '../../components/Image';
import { TypeText } from '../../components/Text';

import styles from '../../styles/pages/Options.module.scss'

function Options({ user, setUser, theme, setTheme }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  if (user === null) { router.push('/login') }
  const switchThemeImage = TypeImage(theme !== 'dark' ? '/moon.svg' : '/sun.svg', 'sun', false, 25);
  const handleChangeTheme = () => setTheme(theme === 'dark' ? 'primary' : 'dark');

  const onInputFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        enqueueSnackbar('Only PNG and JPEG image types are allowed', { ...notificationConfig, variant: 'error' })
      } else {
        if (file.size > 1000000) {
          enqueueSnackbar('The image size more than 1 mb', { ...notificationConfig, variant: 'error' })
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(new Blob([file]));

          reader.onload = () => {
            const imageUrl = reader.result;
            api('options/avatar', { name: user.name, imageUrl })
              .then(async d => {
                const data = await d.json();
                if (d.ok) {
                  enqueueSnackbar('Image uploaded successfully ', { ...notificationConfig, variant: 'success' })
                  setUser(data)
                } else {
                  enqueueSnackbar('Unexpected error', { ...notificationConfig, variant: 'error' })
                }
              })
          }
        }
      }
    }
  }

  const deleteImage = () => {
    if (user.imageUrl !== null) {
      api('options/avatar', { name: user.name, imageUrl: null })
        .then(async d => {
          const data = await d.json();
          if (d.ok) {
            enqueueSnackbar('Success', { ...notificationConfig, variant: 'success' })
            setUser(data)
          } else {
            enqueueSnackbar('Unexpected error', { ...notificationConfig, variant: 'error' })
          }
        })
    }
  }

  const handleSetActivity = () => {
    api('options/clear_activity', { name: user.name })
      .then(async d => {
        const data = await d.json();
        if (d.ok) {
          enqueueSnackbar('Success', { ...notificationConfig, variant: 'success' })
          setUser(data)
        } else {
          enqueueSnackbar('Unexpected error', { ...notificationConfig, variant: 'error' })
        }
      })
  }

  const handleChangeShowTasks = () => {
    api('options/show_tasks', { name: user.name })
      .then(async d => {
        const data = await d.json();
        if (d.ok) {
          enqueueSnackbar('Success', { ...notificationConfig, variant: 'success' })
          setUser(data)
        } else {
          enqueueSnackbar('Unexpected error', { ...notificationConfig, variant: 'error' })
        }
      })
  }

  return (user ? user.isActivated : false) && (
    <div className="container">
      <Head><title>Options</title></Head>
      <div className={styles.center_container}>
        <div className={styles.image_container}>
          {TypeImage(user.imageUrl || '/user.svg', 'image', true, 150)}
          {TypeButton('Set image', theme, null, () => document.getElementById('fileInput').click())}
          {TypeButton('Delete image', theme, null, deleteImage)}
        </div>

        <div className={styles.divider}></div>

        {TypeText(user.name, 'User name')}
        {TypeText(user.email, 'Email')}
        {TypeText(dayjs(user.createdAt).format('MM.DD.YYYY hh:mm'), 'Creation date')}

        <div className={styles.divider}></div>

        {TypeText(TypeButton(switchThemeImage, theme, null, handleChangeTheme, 'small'), `Switch to theme ${theme !== 'dark' ? 'Dark Colors' : 'Light Colors'}`)}

        <div className={styles.divider}></div>

        {TypeText(TypeButton(
          TypeImage(user.showTasks ? '/blank-check-box.svg' : '/check-box.svg', user.showTasks ? 'hide' : 'show', false, 25),
          theme, null, handleChangeShowTasks, 'small'), `Hide tasks from other users`
        )}

        <div className={styles.divider}></div>

        {TypeText(TypeButton('Clear', theme, null, handleSetActivity, 'small'), `Clear profile activity`)}

        <input id="fileInput" type="file" onChange={onInputFile} hidden />
      </div>
    </div>
  )
}

export default Options
