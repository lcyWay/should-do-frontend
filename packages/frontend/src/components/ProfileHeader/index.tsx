import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";

import { Locale } from "pages/_app";

import { UserType } from "types";
import HomeSvg from "svg/HomeSvg";

const text = [
  {
    en: "Daily tasks",
    ru: "Задачи",
  },
  {
    en: "Objectives",
    ru: "Цели",
  },
  {
    en: "Options",
    ru: "Настройки",
  },
];

interface ProfileHeaderInterface {
  locale: Locale;
  user?: UserType;
}

function ProfileHeader({ locale, user }: ProfileHeaderInterface) {
  const router = useRouter();

  if (
    !user ||
    !user.isActivated ||
    router.pathname === "/" ||
    router.pathname === "/about" ||
    router.pathname === "/users" ||
    router.pathname === "login"
  )
    return null;

  return (
    <Container>
      <LinkComponent href={`/profile/${user.name}`}>
        <HomeSvg />
      </LinkComponent>
      <LinkComponent href={`/profile/daily/${user.name}`}>
        {text[0][locale]}
      </LinkComponent>
      <LinkComponent href={`/profile/objectives/${user.name}`}>
        {text[1][locale]}
      </LinkComponent>
      <LinkComponent href="/profile/options">{text[2][locale]}</LinkComponent>
    </Container>
  );
}

const Container = styled("div")`
  display: flex;
  margin: auto;
  max-width: 1000px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  border: 1px solid ${({ theme }) => theme.layout.gray};
  border-top: 0;
  border-radius: 0 0 4px 4px;
  background: ${({ theme }) => theme.layout.primary};
`;

const LinkComponent = styled(Link)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  margin: 0;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  gap: 8px;
  font-size: 14px;
  padding: 10px 10px 9px;

  svg {
    width: 15px;
    height: 15px;
    fill: ${({ theme }) => theme.text.primary};
  }

  &:hover {
    transition: 0.15s border ease-in-out;
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

export default React.memo(ProfileHeader);
