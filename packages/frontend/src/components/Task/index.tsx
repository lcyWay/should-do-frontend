import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";

import Checkbox from "primitives/Checkbox";

import { TaskType } from "types";

interface TaskCardInterface {
  task: TaskType;
  owner?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onComplete?: (id: string) => Promise<void>;
}

function TaskCard({ task, onComplete, onDelete, owner }: TaskCardInterface) {
  const handleComplete = React.useCallback(async () => {
    if (!onComplete) return;
    await onComplete(task._id);
  }, [onComplete, task]);

  const handleDelete = React.useCallback(async () => {
    if (!onDelete) return;
    await onDelete(task._id);
  }, [onDelete, task]);

  return (
    <TaskContainer>
      <div>
        {task.title}
        <DateText>{dayjs(task.createdAt).format("YYYY.MM.DD")}</DateText>
      </div>
      <ButtonsContainer>
        {!!onDelete && <Checkbox value icon="delete" asyncOnChange={handleDelete} />}
        <Checkbox disabled={!owner || task.isComplete} value={task.isComplete} asyncOnChange={handleComplete} />
      </ButtonsContainer>
    </TaskContainer>
  );
}

const TaskContainer = styled("div")`
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
  background: ${({ theme }) => theme.layout.primary};
  transition: box-shadow 0.15s ease-in-out;

  &:hover {
    box-shadow: 0px 0px 4px ${({ theme }) => theme.layout.gray};
  }
`;

const DateText = styled("div")`
  color: ${({ theme }) => theme.text.hint};
  font-size: 11px;
  margin-top: 2px;
`;

const ButtonsContainer = styled("div")`
  display: flex;
`;

export default React.memo(TaskCard);
