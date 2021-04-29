import React from 'react';
import clsx from 'clsx'
import Link from 'next/link'

import styles from './Button.module.scss'

const buttonStyles = {
  primary: styles.primary,
  dark: styles.dark
};
const buttonSizes = {
  medium: styles.medium,
  small: styles.small,
  tiny: styles.tiny
};

export const TypeButton = (
  body: string | JSX.Element,
  style: string,
  link?: string | null,
  onClick?: () => void | null,
  size?: string | null
) => {
  const classNames = clsx(styles.type_button, buttonStyles[style], buttonSizes[size || 'medium'])
  return link ?
    <Link href={link}>
      <a>
        <button onClick={onClick} className={classNames}>
          {body}
        </button>
      </a>
    </Link>
    :
    <button onClick={onClick} className={classNames}>
      {body}
    </button>
}
