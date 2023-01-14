import clsx from "clsx"

import styles from './Text.module.scss'

export const TypeText = (
  text: string | JSX.Element,
  title?: string,
) => {
  return title
    ?
    <div className={styles.container}>
      <div className={styles.title}>{title}:</div>
      <div className={styles.text}>{text}</div>
    </div>
    :
    <div className={clsx(styles.container, styles.text)}>
      {text}
    </div>
}
