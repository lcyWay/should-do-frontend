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

const text = [
  {
    eng: 'Change image',
    rus: 'Изменить аватар'
  },
  {
    eng: 'Delete image',
    rus: 'Удалить аватар'
  },
  {
    eng: 'User name',
    rus: 'Имя пользователя'
  },
  {
    eng: 'Email',
    rus: 'Почта'
  },
  {
    eng: 'Registration date',
    rus: 'Дата регистрации'
  },
  {
    eng: {
      primary: 'Switch to theme "Dark Colors"',
      dark: 'Switch to theme "Light Colors"'
    },
    rus: {
      primary: 'Сменить тему на "Темные цвета"',
      dark: 'Сменить тему на "Светлые цвета"'
    }
  },
  {
    eng: 'Hide objectives from other users',
    rus: 'Скрыть цели от других пользователей'
  },
  {
    eng: 'Clear profile activity',
    rus: 'Отчистить активность'
  },
  {
    eng: 'Switch to Russian language',
    rus: 'Сменить на Русский язык'
  },
  {
    eng: 'Clear',
    rus: 'Отчистить'
  },
  {
    eng: 'Options',
    rus: 'Настройки'
  },
]

function Options({ user, setUser, theme, setTheme, lang, setLang }) {
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  if (user === null) { router.push('/login') }

  const switchThemeImage = TypeImage(theme !== 'dark' ? '/moon.svg' : '/sun.svg', 'sun', false, 25);
  const switchLangImage = TypeImage(lang !== 'eng' ? '/check-box.svg' : '/blank-check-box.svg', 'check', false, 25);

  const handleChangeTheme = () => setTheme(theme === 'dark' ? 'primary' : 'dark');
  const handleChangeLang = () => setLang(lang === 'eng' ? 'rus' : 'eng');

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
            setLoading(true);
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
                setLoading(false);
              })
          }
        }
      }
    }
  }

  const deleteImage = () => {
    setLoading(true);
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
          setLoading(false);
        })
    }
  }

  const handleSetActivity = () => {
    setLoading(true);
    api('options/clear_activity', { name: user.name })
      .then(async d => {
        const data = await d.json();
        if (d.ok) {
          enqueueSnackbar('Success', { ...notificationConfig, variant: 'success' })
          setUser(data)
        } else {
          enqueueSnackbar('Unexpected error', { ...notificationConfig, variant: 'error' })
        }
        setLoading(false);
      })
  }

  const handleChangeShowTasks = () => {
    setLoading(true);
    api('options/show_tasks', { name: user.name })
      .then(async d => {
        const data = await d.json();
        if (d.ok) {
          enqueueSnackbar('Success', { ...notificationConfig, variant: 'success' })
          setUser(data)
        } else {
          enqueueSnackbar('Unexpected error', { ...notificationConfig, variant: 'error' })
        }
        setLoading(false);
      })
  }

  return (user ? user.isActivated : false) && (
    <div className="container">
      <Head><title>{text[10][lang]}</title></Head>
      <div className={styles.center_container}>
        <div className={styles.image_container}>
          {TypeImage(user.imageUrl || '/user.svg', 'image', true, 150)}
          {TypeButton(text[0][lang], theme, null, () => !loading && document.getElementById('fileInput').click(), 'small')}
          {TypeButton(text[1][lang], theme, null, () => !loading && deleteImage(), 'small')}
        </div>

        <div className={styles.divider}></div>

        {TypeText(user.name, text[2][lang])}
        {TypeText(user.email, text[3][lang])}
        {TypeText(dayjs(user.createdAt).format('MM.DD.YYYY hh:mm'), text[4][lang])}

        <div className={styles.divider}></div>

        {TypeText(TypeButton(switchThemeImage, theme, null, handleChangeTheme, 'small'), text[5][lang][theme])}

        <div className={styles.divider}></div>

        {TypeText(TypeButton(
          TypeImage(user.showTasks ? '/blank-check-box.svg' : '/check-box.svg', user.showTasks ? 'hide' : 'show', false, 25),
          theme, null, () => !loading && handleChangeShowTasks(), 'small'), text[6][lang]
        )}

        <div className={styles.divider}></div>

        {TypeText(TypeButton(text[9][lang], theme, null, () => !loading && handleSetActivity(), 'small'), text[7][lang])}

        <div className={styles.divider}></div>

        {TypeText(TypeButton(switchLangImage, theme, null, handleChangeLang, 'small'), text[8][lang])}

        <input id="fileInput" type="file" onChange={onInputFile} hidden />
      </div>
    </div>
  )
}

export default Options
