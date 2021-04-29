import React from 'react';
import styles from './Input.module.scss';

export const TypeInput = (
  value: string,
  setter: (e: string) => void,
  theme: string,
  title?: string | null,
  isPassowrd?: boolean | null,
) => <div className={styles.block}>
    {title && <span>{title}:</span>}
    <input
      className={styles[theme]}
      value={value}
      type={isPassowrd ? 'password' : ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value)}
    />
  </div>
