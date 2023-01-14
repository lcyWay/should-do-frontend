import React from "react";
import dayjs from "dayjs";

import Head from "next/head";

import { api } from "../../api";

import { TypeImage } from "../../components/Image";
import { TypeText } from "../../components/Text";

import styles from "../../styles/pages/Options.module.scss";
import { initialize } from "utils/initialize";
import { GetServerSideProps } from "next";
import Button from "primitives/Button";
import { PageProps } from "pages/_app";
import { UserType } from "types";
import Checkbox from "primitives/Checkbox";

const text = [
  {
    en: "Change image",
    ru: "Изменить аватар",
  },
  {
    en: "Delete image",
    ru: "Удалить аватар",
  },
  {
    en: "User name",
    ru: "Имя пользователя",
  },
  {
    en: "Email",
    ru: "Почта",
  },
  {
    en: "Registration date",
    ru: "Дата регистрации",
  },
  {
    en: "Hide objectives from other users",
    ru: "Скрыть цели от других пользователей",
  },
  {
    en: "Clear profile activity",
    ru: "Отчистить активность",
  },
  {
    en: "Switch to Russian language",
    ru: "Сменить на Русский язык",
  },
  {
    en: "Clear",
    ru: "Отчистить",
  },
  {
    en: "Options",
    ru: "Настройки",
  },
  {
    en: "Success",
    ru: "Выполнено",
  },
  {
    en: "Unexpected error",
    ru: "Неожиданная ошибка",
  },
  {
    en: "Only PNG and JPEG image types are allowed",
    ru: "Можно загрузить только файлы формата PNG и JPEG",
  },
  {
    en: "The image size more than 1 mb",
    ru: "Размер изображения не должен быть больше 1-го мегабайта",
  },
  {
    en: "Image uploaded successfully",
    ru: "Изображение успешно загружено",
  },
];

interface OptionsInteface extends PageProps {
  user: UserType;
}

function Options({ user, locale }: OptionsInteface) {
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState(user);

  const onInputFile = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 800000) return;

      const reader = new FileReader();
      reader.readAsDataURL(new Blob([file]));

      reader.onload = () => {
        setLoading(true);
        const imageUrl = reader.result;
        api("options/avatar", { name: userData.name, imageUrl }).then(async (d) => {
          const data = await d.json();
          if (d.ok) {
            // enqueueSnackbar(text[15][lang], { ...notificationConfig, variant: 'success' })
            setUserData(data);
          } else {
            // errorNotification()
          }
          setLoading(false);
        });
      };
    },
    [userData],
  );

  const deleteImage = () => {
    if (userData.imageUrl !== null) {
      setLoading(true);
      api("options/avatar", { name: userData.name, imageUrl: null }).then(async (d) => {
        const data = await d.json();
        if (d.ok) {
          // successNotification()
          setUserData(data);
        } else {
          // errorNotification()
        }
        setLoading(false);
      });
    }
  };

  const handleSetActivity = async () => {
    if (loading) return;
    setLoading(true);
    const d = await api("options/clear_activity", { name: userData.name });
    const data = await d.json();
    if (d.ok) {
      // successNotification()
      setUserData(data);
    } else {
      // errorNotification()
    }
    setLoading(false);
  };

  const handleChangeShowTasks = async () => {
    if (loading) return;
    setLoading(true);
    const d = await api("options/show_tasks", { name: userData.name });
    const data = await d.json();
    if (d.ok) {
      // successNotification()
      setUserData(data);
    } else {
      // errorNotification()
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <Head>
        <title>{text[10][locale]}</title>
      </Head>
      <div className={styles.center_container}>
        <div className={styles.image_container}>
          {TypeImage(userData.imageUrl || "/user.svg", "image", true, 150)}
          <Button onClick={() => !loading && document.getElementById("fileInput").click()}>{text[0][locale]}</Button>
          <Button onClick={() => !loading && deleteImage()}>{text[1][locale]}</Button>
        </div>

        <div className={styles.divider}></div>

        {TypeText(userData.name, text[2][locale])}
        {TypeText(userData.email, text[3][locale])}
        {TypeText(dayjs(userData.createdAt).format("MM.DD.YYYY hh:mm"), text[4][locale])}

        <div className={styles.divider}></div>

        {TypeText(<Checkbox value={!userData.showTasks} asyncOnChange={handleChangeShowTasks} />, text[6][locale])}

        <div className={styles.divider}></div>

        {TypeText(
          <Checkbox value={userData.activity.length === 0} asyncOnChange={handleSetActivity} />,
          text[7][locale],
        )}

        <div className={styles.divider}></div>

        <input id="fileInput" type="file" accept="image/*" onChange={onInputFile} hidden />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await initialize(context);

  if (!user)
    return {
      redirect: {
        destination: "/login",
      },
      props: {},
    };

  return {
    props: {
      user,
    },
  };
};

export default React.memo(Options);
