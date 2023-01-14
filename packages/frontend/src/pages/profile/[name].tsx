import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { GetServerSideProps } from "next";
import relativeTime from "dayjs/plugin/relativeTime";
import clsx from "clsx";
import Head from "next/head";
import { useIntl } from "react-intl";

import { TaskType, UserType } from "types";
import { api, apiBeba } from "api";

import { TypeImage } from "components/Image";
import TaskCard from "components/Task";
import Graphic from "components/Graphic";
import { NotificationContext } from "components/Notifications";

import Button from "primitives/Button";

import styles from "styles/pages/Profile.module.scss";
import { initialize } from "utils/initialize";

import { PageProps } from "pages/_app";

dayjs.extend(relativeTime);

const text = [
  {
    en: "Success",
    ru: "Выполнено",
  },
  {
    en: "Unexpected error",
    ru: "Неожиданная ошибка",
  },
  {
    en: "Profile",
    ru: "Профиль",
  },
  {
    en: "User is not activated!",
    ru: "Пользователь не активирован",
  },
  {
    en: "Create task",
    ru: "Добавить задачу",
  },
  {
    en: "Progress:",
    ru: "Прогресс:",
  },
  {
    en: "Last seen:",
    ru: "Последний визит:",
  },
  {
    en: "online",
    ru: "в сети",
  },
  {
    en: "Recent Activity:",
    ru: "Активность:",
  },
  {
    en: "Objectives:",
    ru: "Цели:",
  },
  {
    en: "Weekly progress: complited objectives",
    ru: "Еженедельный прогресс: выполнено целей",
  },
  {
    en: "Daily Tasks:",
    ru: "Едеждевные задачи:",
  },
];

const api_activity_codes = (user, value) => ({
  "001": {
    en: `${user.name} registered successfully. Welcome!`,
    ru: `${user.name} успешно зарегистрировал(ась)ся. Приветствуем!`,
  },
  "002": {
    en: `${user.name} ${value ? "deleted" : "changed"} avatar.`,
    ru: `${user.name} ${value ? "удалил(а)" : "сменил(а)"} аватар.`,
  },
  "003": {
    en: `${user.name} ${value ? "opened" : "hidden"} objectives.`,
    ru: `${user.name} ${value ? "открыл(а)" : "скрыл(а)"} свои цели ${value ? "для" : "от"} пользователей.`,
  },
  "004": {
    en: `${user.name} complete one objective.`,
    ru: `${user.name} выполнил(а) одну цель.`,
  },
  "005": {
    en: `${user.name} created new objective.`,
    ru: `${user.name} добавил(а) новую цель.`,
  },
  "006": {
    en: `${user.name} completed daily tasks. Well done!`,
    ru: `${user.name} выполнил(а) все ежедневные задания. Поздравляем!`,
  },
  "007": {
    en: `${user.name} created new daily task.`,
    ru: `${user.name} добавил(а) новую ежедневную задачу.`,
  },
});

interface ProfileInterface extends PageProps {
  user: UserType;
  profile: UserType;
}

function Profile({ theme, profile, user, locale }: ProfileInterface) {
  const intl = useIntl();
  const { createNotification } = React.useContext(NotificationContext);

  const [profileUser, setProfileUser] = React.useState(profile);
  const [state, setTasks] = React.useState<TaskType[] | []>(profile.tasks);
  const [dailyTasks, setDailyTasks] = React.useState<TaskType[] | []>(profile.dailyTasks);

  console.log(profile);

  React.useEffect(() => {
    if (profileUser.name === profile.name) return;
    setTasks(profile.tasks);
    setDailyTasks(profile.dailyTasks);
    setProfileUser(profile);
  }, [profile, profileUser]);

  const handleDailyComplete = async (id: string) => {
    const d = await api("daily/complete", { name: user.name, id });
    const data = await d.json();
    if (!d.ok) return;
    createNotification(intl.formatMessage({ id: "notification.daily_complete" }));
    setDailyTasks(data.dailyTasks);
  };

  const handleChangeComplete = async (id: string) => {
    const data = await apiBeba(`objectives/complete`, { name: user.name, id });
    if (!data) return;
    setTasks(data);
    createNotification(intl.formatMessage({ id: "notification.objective_complete" }));
  };

  const owner = user ? user.name === profile.name : false;
  const isOnline = profile.online !== null && !owner;

  return profile.isActivated ? (
    <>
      <Head>
        <title>{text[2][locale]}</title>
      </Head>

      <div className="container">
        <ProfileContainer>
          <div style={{ display: "flex" }}>
            <ProfileImage src={profile.imageUrl || "/user.svg"} />
            <ProfileNameContainer>
              <ProfileName>
                <b>{profile.name}</b>
                <OnlineStatus online={!isOnline} />
              </ProfileName>
              <ProfileDescription>Description</ProfileDescription>
            </ProfileNameContainer>
          </div>
          {owner && <Button href={`/profile/daily/${user.name}`}>{text[4][locale]}</Button>}
        </ProfileContainer>

        <div className={styles.flex}>
          <div className={styles.flex_block}>
            <Title className={styles.text_header}>{text[5][locale]}</Title>
            <GraphicContainer>
              <Graphic graphData={profile.graphData} theme={theme} />
            </GraphicContainer>
          </div>
          <div className={styles.flex_block}>
            <Title className={styles.text_header}>{text[8][locale]}</Title>
            <ActivityContainer>
              {profile.activity.map((el, i) => (
                <div className={styles.activ_container} key={i}>
                  <div>{TypeImage(profile.imageUrl || "/user.svg", "image", true, 25)}</div>
                  <div className={styles.title}>
                    {api_activity_codes(profile, el.title.value)[el.title.code][locale]}
                  </div>
                  <div className={styles.date}>{dayjs(el.createdAt).fromNow()}</div>
                </div>
              ))}
            </ActivityContainer>
          </div>
        </div>

        {dailyTasks.length > 0 && (
          <div className={styles.tasks} style={{ marginTop: 20 }}>
            <Title className={styles.text_header}>{text[11][locale]}</Title>
            <TasksContainer>
              {dailyTasks.map((task: TaskType) => (
                <TaskCard task={task} onComplete={handleDailyComplete} key={task._id} owner={owner} />
              ))}
            </TasksContainer>
          </div>
        )}

        {profile.showTasks && state.length > 0 && (
          <div className={styles.tasks} style={{ marginTop: 20, marginBottom: 10 }}>
            <Title className={styles.text_header}>{text[9][locale]}</Title>
            <TasksContainer>
              {state.map((task: TaskType, i) => (
                <TaskCard task={task} onComplete={handleChangeComplete} key={i} owner={owner} />
              ))}
            </TasksContainer>
          </div>
        )}
      </div>
    </>
  ) : (
    <div className={clsx("container", styles.not_activated)}>{text[3][locale]} &#128577;</div>
  );
}

const ProfileContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: auto;

  @media (min-width: 1200px) {
    height: 140px;
  }
`;

const ProfileNameContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;

  @media (min-width: 768px) {
    margin-left: 20px;
  }
`;

const ProfileName = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;

  b {
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    display: -moz-box;
    -moz-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    box-orient: vertical;
  }

  @media (min-width: 768px) {
    b {
      font-size: 22px;
    }
  }

  @media (min-width: 1200px) {
    b {
      font-size: 32px;
    }
  }
`;

const ProfileDescription = styled("div")`
  color: ${({ theme }) => theme.text.hint};
  font-size: 14px;
`;

const ProfileImage = styled("img")`
  width: 40px;
  height: 40px;
  border-radius: 50%;

  @media (min-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const GraphicContainer = styled("div")`
  display: flex;
  height: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.layout.gray};
  border-radius: 4px;
  background: ${({ theme }) => theme.layout.primary};
`;

const ActivityContainer = styled("div")`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.layout.gray};
  border-radius: 4px;
  background: ${({ theme }) => theme.layout.primary};
  overflow-y: auto;
  height: calc(100% - 38px);

  @media (min-width: 768px) {
    height: calc(100% - 40px);
  }

  @media (min-width: 1200px) {
    height: calc(100% - 43px);

    &::-webkit-scrollbar {
      width: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgb(150, 150, 150);
    }
  }
`;

const Title = styled("div")`
  border-bottom: 1px solid ${({ theme }) => theme.layout.gray};
`;

const OnlineStatus = styled("div")<{ online: boolean }>`
  display: flex;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 2px;
  background: ${({ theme, online }) => (online ? theme.colors.primary : "#969696")};

  @media (min-width: 768px) {
    margin-top: 4px;
  }
`;

const TasksContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await initialize(context);

  const name = context.query.name;
  const profile = await apiBeba("profile", { name });

  return {
    props: {
      profile,
      user,
    },
  };
};

export default React.memo(Profile);
