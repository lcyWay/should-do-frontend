import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { GetServerSideProps } from "next";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from "next/head";
import { FormattedMessage, useIntl } from "react-intl";

import { TaskType, UserType } from "types";
import { apiBeba } from "api";

import TaskCard from "components/Task";
import Chart from "components/Chart";
import { NotificationContext } from "components/Notifications";

import Button from "primitives/Button";

import { initialize } from "utils/initialize";

import { PageProps } from "pages/_app";

dayjs.extend(relativeTime);

interface ProfileInterface extends PageProps {
  user: UserType;
  profile: UserType;
}

function Profile({ theme, profile, user }: ProfileInterface) {
  const intl = useIntl();
  const { createNotification } = React.useContext(NotificationContext);

  const [profileUser, setProfileUser] = React.useState(profile);
  const [state, setTasks] = React.useState<TaskType[] | []>(profile.tasks);
  const [dailyTasks, setDailyTasks] = React.useState<TaskType[] | []>(profile.dailyTasks);

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
    createNotification(intl.formatMessage({ id: "notification.daily_complete" }));
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
        <title>{intl.formatMessage({ id: "profile.title" })}</title>
      </Head>

      <Container>
        <ProfileContainer>
          <div style={{ display: "flex" }}>
            <ProfileImage src={profile.imageUrl || "/icons/user.svg"} />
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

        <DataContainer>
          <DataBlock>
            <Title>
              <FormattedMessage id="profile.progress" />
            </Title>
            <ChartContainer>
              <Chart graphData={profile.graphData} theme={theme} />
            </ChartContainer>
          </DataBlock>
          <DataBlock>
            <Title>
              <FormattedMessage id="profile.activity" />
            </Title>
            <ActivityContainer>
              {profile.activity.map((activity, i) => (
                <ActivityMessage key={i}>
                  <ActivityMessageInfo>
                    <img src={profile.imageUrl || "/icons/user.svg"} alt="" />
                    {profile.name}{" "}
                    {typeof activity.title === "string" ? (
                      activity.title
                    ) : (
                      <FormattedMessage id={"profile.activity." + activity.title.code} />
                    )}
                  </ActivityMessageInfo>
                  <ActivityMessageDate>{dayjs(activity.createdAt).fromNow()}</ActivityMessageDate>
                </ActivityMessage>
              ))}
            </ActivityContainer>
          </DataBlock>
        </DataContainer>

        {dailyTasks.length > 0 && (
          <CardsContainer>
            <Title>
              <FormattedMessage id="profile.daily_tasks" />
            </Title>
            <TasksContainer>
              {dailyTasks.map((task: TaskType) => (
                <TaskCard task={task} onComplete={handleDailyComplete} key={task._id} owner={owner} />
              ))}
            </TasksContainer>
          </CardsContainer>
        )}

        {profile.showTasks && state.length > 0 && (
          <CardsContainer>
            <Title>
              <FormattedMessage id="profile.objectives" />
            </Title>
            <TasksContainer>
              {state.map((task: TaskType, i) => (
                <TaskCard task={task} onComplete={handleChangeComplete} key={i} owner={owner} />
              ))}
            </TasksContainer>
          </CardsContainer>
        )}
      </Container>
    </>
  ) : (
    <NotActivatedContainer>
      <FormattedMessage id="profile.not_activated" /> &#128577; {/* user for testing: /das */}
    </NotActivatedContainer>
  );
}

const Container = styled("div")`
  margin: 0 auto;
  max-width: 1000px;
  width: calc(100% - 20px);
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
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

const DataContainer = styled("div")`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DataBlock = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  height: 100%;

  @media (min-width: 769px) {
    flex: 1;
    height: 400px;
  }
`;

const ChartContainer = styled("div")`
  display: flex;
  flex: 1;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.layout.gray};
  border-radius: 4px;
  background: ${({ theme }) => theme.layout.primary};

  @media (max-width: 640px) {
    canvas {
      height: 240px;
    }
  }
`;

const ActivityContainer = styled("div")`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.layout.gray};
  border-radius: 4px;
  background: ${({ theme }) => theme.layout.primary};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (min-width: 769px) {
    &::-webkit-scrollbar {
      width: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgb(150, 150, 150);
    }
  }
`;

const ActivityMessage = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
`;

const ActivityMessageInfo = styled("div")`
  display: flex;
  gap: 10px;
  font-size: 14px;
  align-items: center;
`;

const ActivityMessageDate = styled("div")`
  white-space: nowrap;
  font-size: 12px;
  color: ${({ theme }) => theme.text.hint};
`;

const Title = styled("div")`
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.layout.gray};

  @media (min-width: 768px) {
    font-size: 18px;
  }
  @media (min-width: 1200px) {
    font-size: 20px;
  }
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

const CardsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TasksContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NotActivatedContainer = styled("div")`
  margin: auto;
  text-align: center;
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
