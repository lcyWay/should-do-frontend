import React from "react";
import dayjs from "dayjs";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { FormattedMessage, useIntl } from "react-intl";

import { api } from "../../api";

import Button from "primitives/Button";
import Checkbox from "primitives/Checkbox";

import { TypeImage } from "../../components/Image";
import { TypeText } from "../../components/Text";

import styles from "../../styles/pages/Options.module.scss";
import { initialize } from "utils/initialize";
import { PageProps } from "pages/_app";
import { UserType } from "types";

interface OptionsInteface extends PageProps {
  user: UserType;
}

function Options({ user }: OptionsInteface) {
  const intl = useIntl();

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
        api("options/avatar", { name: userData.name, imageUrl }).then(
          async (d) => {
            const data = await d.json();
            if (d.ok) {
              // enqueueSnackbar(text[15][lang], { ...notificationConfig, variant: 'success' })
              setUserData(data);
            } else {
              // errorNotification()
            }
            setLoading(false);
          }
        );
      };
    },
    [userData]
  );

  const deleteImage = () => {
    if (userData.imageUrl !== null) {
      setLoading(true);
      api("options/avatar", { name: userData.name, imageUrl: null }).then(
        async (d) => {
          const data = await d.json();
          if (d.ok) {
            // successNotification()
            setUserData(data);
          } else {
            // errorNotification()
          }
          setLoading(false);
        }
      );
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
        <title>{intl.formatMessage({ id: "options.title" })}</title>
      </Head>
      <div className={styles.center_container}>
        <div className={styles.image_container}>
          {TypeImage(userData.imageUrl || "/user.svg", "image", true, 150)}
          <Button
            onClick={() =>
              !loading && document.getElementById("fileInput")!.click()
            }
          >
            <FormattedMessage id="options.change_image" />
          </Button>
          <Button onClick={() => !loading && deleteImage()}>
            <FormattedMessage id="options.delete_image" />
          </Button>
        </div>

        <div className={styles.divider}></div>

        {TypeText(userData.name, <FormattedMessage id="options.username" />)}
        {TypeText(userData.email, <FormattedMessage id="options.email" />)}
        {TypeText(
          dayjs(userData.createdAt).format("MM.DD.YYYY hh:mm"),
          <FormattedMessage id="options.registration_date" />
        )}

        <div className={styles.divider}></div>

        {TypeText(
          <Checkbox
            value={!userData.showTasks}
            asyncOnChange={handleChangeShowTasks}
          />,
          <FormattedMessage id="options.visibility" />
        )}

        <div className={styles.divider}></div>

        {TypeText(
          <Checkbox
            value={userData.activity.length === 0}
            asyncOnChange={handleSetActivity}
          />,
          <FormattedMessage id="options.clear_activity" />
        )}

        <div className={styles.divider}></div>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={onInputFile}
          hidden
        />
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
