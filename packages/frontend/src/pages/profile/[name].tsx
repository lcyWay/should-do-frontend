import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { GetServerSideProps } from "next";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from "next/head";
import { FormattedMessage, useIntl } from "react-intl";

import { TaskType, UserType } from "types";
import { apiBeba } from "api";

import { TypeImage } from "components/Image";
import TaskCard from "components/Task";
import Graphic from "components/Graphic";
import { NotificationContext } from "components/Notifications";

import Button from "primitives/Button";

import { initialize } from "utils/initialize";

import { PageProps } from "pages/_app";

dayjs.extend(relativeTime);

// const api_activity_codes = (user: any, value: any) => ({
//   "001": {
//     en: `${user.name} registered successfully. Welcome!`,
//     ru: `${user.name} успешно зарегистрировал(ась)ся. Приветствуем!`,
//   },
//   "002": {
//     en: `${user.name} ${value ? "deleted" : "changed"} avatar.`,
//     ru: `${user.name} ${value ? "удалил(а)" : "сменил(а)"} аватар.`,
//   },
//   "003": {
//     en: `${user.name} ${value ? "opened" : "hidden"} objectives.`,
//     ru: `${user.name} ${value ? "открыл(а)" : "скрыл(а)"} свои цели ${
//       value ? "для" : "от"
//     } пользователей.`,
//   },
//   "004": {
//     en: `${user.name} complete one objective.`,
//     ru: `${user.name} выполнил(а) одну цель.`,
//   },
//   "005": {
//     en: `${user.name} created new objective.`,
//     ru: `${user.name} добавил(а) новую цель.`,
//   },
//   "006": {
//     en: `${user.name} completed daily tasks. Well done!`,
//     ru: `${user.name} выполнил(а) все ежедневные задания. Поздравляем!`,
//   },
//   "007": {
//     en: `${user.name} created new daily task.`,
//     ru: `${user.name} добавил(а) новую ежедневную задачу.`,
//   },
// });

interface ProfileInterface extends PageProps {
  user: UserType;
  profile: UserType;
}

function Profile({ theme, profile, user }: ProfileInterface) {
  const intl = useIntl();
  const { createNotification } = React.useContext(NotificationContext);

  const [profileUser, setProfileUser] = React.useState(profile);
  const [state, setTasks] = React.useState<TaskType[] | []>(profile.tasks);
  const [dailyTasks, setDailyTasks] = React.useState<TaskType[] | []>(
    profile.dailyTasks
  );

  console.log(profile);

  React.useEffect(() => {
    if (profileUser.name === profile.name) return;
    setTasks(profile.tasks);
    setDailyTasks(profile.dailyTasks);
    setProfileUser(profile);
  }, [profile, profileUser]);

  const handleDailyComplete = async (id: string) => {
    const data = await apiBeba("daily/complete", { name: user.name, id });
    if (!data) return;
    setDailyTasks(data);
    createNotification(
      intl.formatMessage({ id: "notification.daily_complete" })
    );
  };

  const handleChangeComplete = async (id: string) => {
    const data = await apiBeba(`objectives/complete`, { name: user.name, id });
    if (!data) return;
    setTasks(data);
    createNotification(
      intl.formatMessage({ id: "notification.objective_complete" })
    );
  };

  const owner = user ? user.name === profile.name : false;
  const isOnline = profile.online !== null && !owner;

  return profile.isActivated ? (
    <>
      <Head>
        <title>{intl.formatMessage({ id: "profile.title" })}</title>
      </Head>

      <Container>
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
          {owner && (
            <Button href={`/profile/daily/${user.name}`}>
              <FormattedMessage id="profile.create_task" />
            </Button>
          )}
        </ProfileContainer>

        <div>
          <div>
            <Title>
              <FormattedMessage id="profile.progress" />
            </Title>
            <GraphicContainer>
              <Graphic graphData={profile.graphData} theme={theme} />
            </GraphicContainer>
          </div>
          <div>
            <Title>
              <FormattedMessage id="profile.activity" />
            </Title>
            <ActivityContainer>
              {profile.activity.map((el, i) => (
                <div key={i}>
                  <div>
                    {TypeImage(
                      profile.imageUrl || "/user.svg",
                      "image",
                      true,
                      25
                    )}
                  </div>
                  <div>
                    {/* {typeof el.title !== "string" &&
                      api_activity_codes(profile, el.title.value)[
                        el.title.code
                      ][locale]} */}
                  </div>
                  <div>{dayjs(el.createdAt).fromNow()}</div>
                </div>
              ))}
            </ActivityContainer>
          </div>
        </div>

        {dailyTasks.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <Title>
              <FormattedMessage id="profile.daily_tasks" />
            </Title>
            <TasksContainer>
              {dailyTasks.map((task: TaskType) => (
                <TaskCard
                  task={task}
                  onComplete={handleDailyComplete}
                  key={task._id}
                  owner={owner}
                />
              ))}
            </TasksContainer>
          </div>
        )}

        {profile.showTasks && state.length > 0 && (
          <div style={{ marginTop: 20, marginBottom: 10 }}>
            <Title>
              <FormattedMessage id="profile.objectives" />
            </Title>
            <TasksContainer>
              {state.map((task: TaskType, i) => (
                <TaskCard
                  task={task}
                  onComplete={handleChangeComplete}
                  key={i}
                  owner={owner}
                />
              ))}
            </TasksContainer>
          </div>
        )}
      </Container>
    </>
  ) : (
    <div>
      <FormattedMessage id="profile.not_activated" /> &#128577;{" "}
      {/* user for testing: /das */}
    </div>
  );
}

const Container = styled("div")`
  margin: auto;
  max-width: 1000px;
  width: calc(100% - 20px);
  padding: 0 10px;
  display: flex;
  flex-direction: column;
`;

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
  object-fit: cover;

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
  background: ${({ theme, online }) =>
    online ? theme.colors.primary : "#969696"};

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
