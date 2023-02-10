import React from "react";
import styled from "styled-components";
import { FormattedMessage, useIntl } from "react-intl";

import Button from "primitives/Button";
import Checkbox from "primitives/Checkbox";
import Input from "primitives/Input";

import TaskCard from "components/Task";
import { NotificationContext } from "components/Notifications";

import { apiNextServer } from "api";

import { TaskType, UserType } from "types";

import { PageProps } from "pages/_app";

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
    const data = await apiNextServer(page + "/create", {
      name: user.name,
      title: createInputValue,
    });
    if (!data) return;
    createNotification(intl.formatMessage({ id: `notification.${page}_create` }));
    setCreateInputValue("");
    setTasks(data);
  }, [createInputValue, createNotification, intl, user, page]);

  const handleDelete = React.useCallback(
    async (id: string) => {
      const data = await apiNextServer(page + "/delete", {
        name: user.name,
        _id: id,
      });
      if (!data) return;
      createNotification(intl.formatMessage({ id: `notification.${page}_delete` }));
      setTasks(data);
    },
    [createNotification, intl, user, page]
  );

  const handleChangeComplete = React.useCallback(
    async (id: string) => {
      const data = await apiNextServer(page + "/complete", { name: user.name, id });
      if (!data) return;
      createNotification(intl.formatMessage({ id: `notification.${page}_complete` }));
      setTasks(data);
    },
    [createNotification, intl, user, page]
  );

  if (!user.isActivated) return null;

  return (
    <Container>
      <HeaderContainer>
        <img src={profile.imageUrl || "/icons/user.svg"} alt="" />
        <Button onClick={() => setShowDelete(!showDelete)}>
          <FormattedMessage id="tasks.delete_button" />
        </Button>
      </HeaderContainer>

      <div>
        <Title>
          <FormattedMessage id={`tasks.${page}_title`} />
        </Title>
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
    </Container>
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

const HeaderContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
`;

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
