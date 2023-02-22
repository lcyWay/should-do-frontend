import React from "react";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { FormattedMessage } from "react-intl";
import styled, { keyframes } from "styled-components";

import Button from "primitives/Button";

import { initialize } from "utils/initialize";

import BookSvg from "svg/home/BookSvg";
import RegistrationSvg from "svg/home/RegistrationSvg";
import ReportSvg from "svg/home/ReportSvg";
import WatchSvg from "svg/home/WatchSvg";

import { PageProps } from "./_app";

function Home({ theme }: PageProps) {
  return (
    <>
      <Head>
        <title>Tasks Manager</title>
      </Head>

      <PageContainer>
        <WelcomeLayoutContainer>
          <WelcomeLayoutImage isDarkTheme={theme === "dark"} />
          <WelcomeLayoutText>
            <h3>What should I do ?</h3>
            <p>Next.JS/TypeScript task management progressive web application!</p>
            <Button href="/registration">
              <FormattedMessage id="home.sign_in" />
            </Button>
          </WelcomeLayoutText>
          <LinksContainer>
            <LinkButton href="https://github.com/lcyWay" target="_blank">
              <img src="/icons/github.svg" alt="" />
              GitHub
            </LinkButton>
            <LinkButton href="https://hh.ru" target="_blank">
              <img src="/icons/hh.svg" alt="" />
              HeadHunter
            </LinkButton>
          </LinksContainer>
        </WelcomeLayoutContainer>

        <Container>
          <InfoBlockContainter>
            <InfoBlock>
              <RegistrationSvg />
              <FormattedMessage id="home.blocks.free_registration" />
            </InfoBlock>
            <InfoBlock>
              <BookSvg />
              <FormattedMessage id="home.blocks.easy_learn" />
            </InfoBlock>
            <InfoBlock>
              <ReportSvg />
              <FormattedMessage id="home.blocks.profile_page" />
            </InfoBlock>
            <InfoBlock>
              <WatchSvg />
              <FormattedMessage id="home.blocks.watch_other" />
            </InfoBlock>
          </InfoBlockContainter>

          <Divider />

          <FooterContainer>
            <div>
              <FormattedMessage id="home.made_in" />
            </div>
            <Link href="/users">
              <b>
                <FormattedMessage id="home.visit_users_page" />
              </b>
            </Link>
          </FooterContainer>
        </Container>
      </PageContainer>
    </>
  );
}

const showAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const welcomeAnimation = keyframes`
  from {
    opacity: 0;
    top: -100px;
  }
  to {
    opacity: 1;
    top: 0;
  }
`;

const WelcomeLayoutContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  max-width: 1920px;
  height: 400px;
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.layout.gray};

  @media (min-width: 768px) {
    height: 550px;
  }

  @media (min-width: 1200px) {
    height: 700px;
  }
`;

const WelcomeLayoutImage = styled("div")<{ isDarkTheme: boolean }>`
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  filter: ${({ isDarkTheme }) => (isDarkTheme ? "brightness(0.28)" : "none")};
  background-size: cover;
  background-position-x: 50%;
  background-image: url("/images/layout.png"), url("/images/layout_compressed.jpg");
`;

const WelcomeLayoutText = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: ${welcomeAnimation} 1s ease-in-out;
  cursor: default;

  p {
    font-size: 14px;
    text-align: center;
    margin: 0;
    color: ${({ theme }) => theme.text.hint};
    margin: 10px 10px 20px;
  }

  h3 {
    font-size: 28px;
    margin: 0;
  }

  @media (min-width: 768px) {
    h3 {
      font-size: 38px;
    }
    p {
      font-size: 16px;
    }
  }

  @media (min-width: 1200px) {
    h3 {
      font-size: 48px;
    }
    p {
      font-size: 18px;
    }
  }
`;

const PageContainer = styled("div")`
  background: ${({ theme }) => theme.layout.primary};
`;

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

const Divider = styled("div")`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.layout.gray};
`;

const LinksContainer = styled("div")`
  display: flex;
  position: absolute;
  bottom: 10px;
  left: 10px;
  gap: 10px;
  animation: ${showAnimation} 1s ease-in-out;

  @media (min-width: 1000px) {
    left: calc((100vw - 1000px) / 2);
  }
`;

const LinkButton = styled(Link)`
  display: flex;
  background: #3c3c3c;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.layout.gray};
  font-size: 14px;
  color: #e6e6e6;
  gap: 5px;
  cursor: pointer;
`;

const InfoBlockContainter = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 48% 48%;
    column-gap: 4%;
    row-gap: 32px;
  }
`;

const InfoBlock = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;

  svg {
    width: 60px;
    height: auto;
    fill: ${({ theme }) => theme.text.primary};
  }
`;

const FooterContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  padding: 0px 10px;

  b {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (min-width: 768px) {
    font-size: 13px;
  }

  @media (min-width: 1200px) {
    font-size: 14px;
  }
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await initialize(context);

  return {
    props: {
      user,
    },
  };
};

export default React.memo(Home);
