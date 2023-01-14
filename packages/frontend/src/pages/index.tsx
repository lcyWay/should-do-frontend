import React from "react";
import Head from "next/head";
import Link from "next/link";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import { FormattedMessage } from "react-intl";
import styled, { keyframes } from "styled-components";

import { TypeImage } from "components/Image";

import Button from "primitives/Button";

import { initialize } from "utils/initialize";

import styles from "styles/pages/Home.module.scss";

import { PageProps } from "./_app";

function Home({ theme }: PageProps) {
  return (
    <>
      <Head>
        <title>Tasks Manager</title>
      </Head>

      <div className={styles.welcome}>
        <div className={styles.welcomeLayout} style={{ filter: theme === "dark" ? "brightness(0.28)" : "none" }} />
        <MainImageShadow />
        <div className={styles.animation}>
          <h3>What should I do ?</h3>
          <p>Next.JS/TypeScript task management progressive web application!</p>
          <Button href="/registration">
            <FormattedMessage id="home.sign_in" />
          </Button>
        </div>
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
      </div>

      <div className="container">
        <div className={styles.divider}></div>

        <div className={styles.grid}>
          <div className={clsx(styles.grid_block)}>
            <div>{TypeImage("/registration.svg", "registration", false, 60)}</div>
            <div>
              <FormattedMessage id="home.blocks.free_registration" />
            </div>
          </div>
          <div className={clsx(styles.grid_block)}>
            <div>{TypeImage("/book.svg", "learn", false, 60)}</div>
            <div>
              <FormattedMessage id="home.blocks.easy_learn" />
            </div>
          </div>
          <div className={clsx(styles.grid_block)}>
            <div>{TypeImage("/report.svg", "profile", false, 60)}</div>
            <div>
              <FormattedMessage id="home.blocks.profile_page" />
            </div>
          </div>
          <div className={clsx(styles.grid_block)}>
            <div>{TypeImage("/watch.svg", "watch", false, 60)}</div>
            <div>
              <FormattedMessage id="home.blocks.watch_other" />
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.footer}>
          <div className={styles.footer_block}>
            <FormattedMessage id="home.made_in" />
          </div>
          <Link href="/about">
            <b>
              <FormattedMessage id="home.visit_about_page" />
            </b>
          </Link>
        </div>
      </div>
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

const MainImageShadow = styled("div")`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 50%,
    ${({ theme }) => theme.layout.secondary} 100%
  );
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
