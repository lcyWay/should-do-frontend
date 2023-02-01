import React from "react";
import styled, { keyframes } from "styled-components";

import Checkbox from "primitives/Checkbox";

interface NotificationsInterface {
  children: React.ReactNode;
}

interface NotificationInterface {
  title: string;
}

export const NotificationContext = React.createContext<{ createNotification: (message: string) => void }>({
  createNotification: () => void null,
});

function Notifications({ children }: NotificationsInterface) {
  const [notificationsQueue, setNotificationsQueue] = React.useState<NotificationInterface[]>([]);

  const removeNotification = React.useCallback((notification: NotificationInterface) => {
    setNotificationsQueue((notifications) =>
      notifications.filter((queueNotification) => queueNotification !== notification),
    );
  }, []);

  const createNotification = React.useCallback(
    (message: string) => {
      const newNotification = { title: message };
      setNotificationsQueue((notificationsQueue) => [...notificationsQueue, newNotification]);
      setTimeout(() => removeNotification(newNotification), 4000);
    },
    [removeNotification],
  );

  return (
    <NotificationContext.Provider value={{ createNotification }}>
      <>
        <NotificationsContainer>
          {notificationsQueue.map((notification, index) => (
            <NotificationContainer key={index}>
              <TitleContainer>{notification.title}</TitleContainer>
              <div style={{ display: "flex" }}>
                <Divider />
                <Checkbox value onChange={() => removeNotification(notification)} icon="delete" />
              </div>
            </NotificationContainer>
          ))}
        </NotificationsContainer>
        {children}
      </>
    </NotificationContext.Provider>
  );
}

const NotificationsContainer = styled("div")`
  position: fixed;
  left: 10px;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;

  @media (max-width: 768px) {
    right: 10px;
    max-width: calc(100vw - 20px);
    align-items: center;
  }
`;

const showAnimation = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const NotificationContainer = styled("div")`
  background: #3c3c3c;
  padding: 4px 4px 4px 10px;
  border-radius: 4px;
  width: 280px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  animation: ${showAnimation} 0.75s;
`;

const TitleContainer = styled("div")`
  color: #e6e6e6;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  word-break: break-word;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`;

const Divider = styled("div")`
  width: 2px;
  background: #4c4c4e;
`;

export default React.memo(Notifications);
