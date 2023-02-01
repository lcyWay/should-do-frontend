import React from "react";
import styled from "styled-components";
import { FormattedMessage, useIntl } from "react-intl";

import { apiBeba } from "api";

import { PageProps } from "pages/_app";

import Button from "primitives/Button";
import Checkbox from "primitives/Checkbox";
import Input from "primitives/Input";

import { TypeImage } from "components/Image";
import TaskCard from "components/Task";
import { NotificationContext } from "components/Notifications";

import { TaskType, UserType } from "types";

import styles from "styles/pages/Objectives.module.scss";
import stylesProfile from "styles/pages/Profile.module.scss";

interface CreatePageInterface extends PageProps {
  user: UserType;
  profile: UserType;
  page: "objectives" | "daily";
}

function CreatePage({ profile, user, page }: CreatePageInterface) {
  const intl = useIntl();
  const { createNotification } = React.useContext(NotificationContext);

  const [showDelete, setShowDelete] = React.useState(false);
  const [createInputValue, setCreateInputValue] = React.useState("");
  const [tasks, setTasks] = React.useState<TaskType[] | []>(page === "daily" ? profile.dailyTasks : profile.tasks);

  const handleCreate = React.useCallback(async () => {
    if (createInputValue === "") return;
    const data = await apiBeba(page + "/create", { name: user.name, title: createInputValue });
    if (!data) return;
    createNotification(intl.formatMessage({ id: `notification.${page}_create` }));
    setCreateInputValue("");
    setTasks(data);
  }, [createInputValue, createNotification, intl, user, page]);

  const handleDelete = React.useCallback(
    async (id: string) => {
      const data = await apiBeba(page + "/delete", { name: user.name, _id: id });
      if (!data) return;
      createNotification(intl.formatMessage({ id: `notification.${page}_delete` }));
      setTasks(data);
    },
    [createNotification, intl, user, page],
  );

  const handleChangeComplete = React.useCallback(
    async (id: string) => {
      const data = await apiBeba(page + "/complete", { name: user.name, id });
      if (!data) return;
      createNotification(intl.formatMessage({ id: `notification.${page}_complete` }));
      setTasks(data);
    },
    [createNotification, intl, user, page],
  );

  if (!user.isActivated) return null;

  return (
    <div className="container">
      <div className={styles.statistic}>
        <div className={styles.image_container}>{TypeImage(profile.imageUrl || "/user.svg", "image", true, 100)}</div>
        <Button onClick={() => setShowDelete(!showDelete)}><FormattedMessage id="tasks.delete_button" /></Button>
      </div>

      <div className={stylesProfile.tasks}>
        <Title><FormattedMessage id={`tasks.${page}_title`} /></Title>
        <TasksContainer>
          <InputContainer>
            <Input value={createInputValue} onChange={setCreateInputValue} />
            <Checkbox value asyncOnChange={handleCreate} icon="plus" />
          </InputContainer>
          {tasks.map((task: TaskType) => (
            <TaskCard
              task={task}
              onComplete={handleChangeComplete}
              key={task._id}
              owner
              onDelete={showDelete ? handleDelete : undefined}
            />
          ))}
        </TasksContainer>
      </div>
    </div>
  );
}

const InputContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.layout.gray};
  padding: 5px 5px 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  gap: 4px;
  cursor: default;
  box-shadow: 0px 0px 4px transparent;
  transition: box-shadow 0.15s ease-in-out;
  background: ${({ theme }) => theme.layout.primary};

  &:hover {
    box-shadow: 0px 0px 4px ${({ theme }) => theme.layout.gray};
  }
`;

const Title = styled("div")`
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.layout.gray};
  margin-bottom: 12px;

  @media (min-width: 768px) {
    font-size: 18px;
  }
  @media (min-width: 1200px) {
    font-size: 20px;
  }
`;

const TasksContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default React.memo(CreatePage);
