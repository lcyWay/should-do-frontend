export type UserType = {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string | Date;
  imageUrl: string | null;
  showTasks: boolean;
  online: null | Date;
  isActivated: boolean;
  activity: ActivityType[];
  tasks: TaskType[];
  dailyTasks: DailyTaskType[];
  graphData: Record<string, number>;
  todayCompleteTasks: number;
  daysInRow: number;
  daysInRowDate: Date | string;
  lastCompleteDate: string | Date;
};

export type DailyTaskType = {
  _id: string;
  title: string;
  createdAt: Date | string;
  isComplete: boolean;
  lastCompleteDate: Date | string;
};

export type TaskType = {
  _id: string;
  title: string;
  isComplete: boolean;
  createdAt: Date | string;
};

export type ActivityType = {
  _id: string;
  title: string | { code: string };
  createdAt: Date | string;
};
