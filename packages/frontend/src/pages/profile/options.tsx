import React from "react";
import dayjs from "dayjs";
import Head from "next/head";
import styled from "styled-components";
import { GetServerSideProps } from "next";
import { FormattedMessage, useIntl } from "react-intl";

import Button from "primitives/Button";
import Checkbox from "primitives/Checkbox";

import { apiNextServer } from "api";
import { initialize } from "utils/initialize";

import { UserType } from "types";
import { PageProps } from "pages/_app";

interface OptionsInteface extends PageProps {
  user: UserType;
}

function Options({ user }: OptionsInteface) {
  const intl = useIntl();

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState(user);

  const handleFileInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 800000) return;

      const reader = new FileReader();
      reader.readAsDataURL(new Blob([file]));

      reader.onload = async () => {
        setLoading(true);
        const imageUrl = reader.result;
        const data = await apiNextServer("options/avatar", { name: userData.name, imageUrl });
        if (data) setUserData(data);
        setLoading(false);
      };
    },
    [userData]
  );

  const handleImageDelete = React.useCallback(async () => {
    if (loading) return;
    if (userData.imageUrl === null) return;
    setLoading(true);
    const data = await apiNextServer("options/avatar", { name: userData.name, imageUrl: null });
    if (data) setUserData(data);
    setLoading(false);
  }, [loading, userData]);

  const handleActivityClear = React.useCallback(async () => {
    const data = await apiNextServer("options/clear_activity", { name: userData.name });
    if (!data || typeof data !== "object" || data === null) return;
    setUserData(data);
  }, [userData]);

  const handleTasksVisibilityChange = React.useCallback(async () => {
    const data = await apiNextServer("options/show_tasks", { name: userData.name });
    if (!data || typeof data !== "object" || data === null) return;
    setUserData(data);
  }, [userData]);

  const handleImageChangeButtonClick = React.useCallback(() => {
    if (loading || inputRef.current === null) return;
    inputRef.current.click();
  }, [loading]);

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: "options.title" })}</title>
      </Head>
      <Container>
        <AvatarBlockContainer>
          <img src={userData.imageUrl || "/icons/user.svg"} alt="" />
          <AvatarButtonsContainer>
            <Button onClick={handleImageChangeButtonClick}>
              <FormattedMessage id="options.change_image" />
            </Button>
            <Button onClick={handleImageDelete}>
              <FormattedMessage id="options.delete_image" />
            </Button>
          </AvatarButtonsContainer>
        </AvatarBlockContainer>

        <DataContainer>
          <div>
            <TextRow>
              <div>
                <FormattedMessage id="options.username" />
              </div>
              {userData.name}
            </TextRow>
            <TextRow>
              <div>
                <FormattedMessage id="options.email" />
              </div>
              {userData.email}
            </TextRow>
            <TextRow>
              <div>
                <FormattedMessage id="options.registration_date" />
              </div>
              {dayjs(userData.createdAt).format("MM.DD.YYYY hh:mm")}
            </TextRow>
          </div>

          <Divider />

          <TextRow>
            <div>
              <FormattedMessage id="options.visibility" />
            </div>
            <Checkbox value={!userData.showTasks} asyncOnChange={handleTasksVisibilityChange} />
          </TextRow>

          <Divider />

          <TextRow>
            <div>
              <FormattedMessage id="options.clear_activity" />
            </div>
            <Checkbox value={userData.activity.length === 0} asyncOnChange={handleActivityClear} />
          </TextRow>
        </DataContainer>

        <input ref={inputRef} type="file" accept="image/*" onChange={handleFileInputChange} hidden />
      </Container>
    </>
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

const AvatarBlockContainer = styled("div")`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
`;

const AvatarButtonsContainer = styled("div")`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DataContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background: ${({ theme }) => theme.layout.primary};
  border: 1px solid ${({ theme }) => theme.layout.gray};
  border-radius: 4px;
`;

const Divider = styled("div")`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.layout.gray};
`;

const TextRow = styled("div")`
  width: 100%;
  max-width: 300px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;

  div {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    max-width: 440px;
  }
`;

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
