import React from "react";
import Link from "next/link";

import styles from "./Button.module.scss";

export const TypeButton = (
  body: string | JSX.Element,
  style: string | null,
  link?: string | null,
  onClick?: () => void | null
) => {
  const classNames = styles.type_button;
  return link ? (
    <Link href={link}>
      <button onClick={onClick} className={classNames}>
        {body}
      </button>
    </Link>
  ) : (
    <button onClick={onClick} className={classNames}>
      {body}
    </button>
  );
};
