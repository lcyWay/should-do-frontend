import React from "react";

import styles from "./Text.module.scss";

export const TypeText = (
  text: string | React.ReactNode,
  title?: string | React.ReactNode
) => {
  return title ? (
    <div className={styles.container}>
      <div className={styles.title}>{title}:</div>
      <div className={styles.text}>{text}</div>
    </div>
  ) : (
    <div className={styles.container}>{text}</div>
  );
};
