import React from 'react';
import clsx from 'clsx'

import { TypeButton } from '../Button';
import { TypeImage } from '../Image';
import { TypeInput } from '../Input';

import styles from './Task.module.scss';

export const CreateTask = (value, setter, onAdd, theme) => {
  return (
    <div className={clsx(styles.card, styles[theme])}>
      <span className={styles.span_without}>{TypeInput(value, setter, theme)}</span>
      {TypeButton(TypeImage('/plus.svg', 'create', false, 25), theme, null, onAdd, 'tiny')}
    </div>
  )
}

function TaskCard({ title, _id, isComplete, theme, changeComplete, showDelete, owner }) {
  const checkboxImage = TypeImage(isComplete ? '/check-box.svg' : '/blank-check-box.svg', 'sun', false, 25);
  const deleteImage = TypeImage('/delete.svg', 'del', false, 25);

  return (
    <div className={clsx(styles.card, styles[theme])}>
      <span className={clsx(isComplete ? styles.complited : undefined, showDelete ? styles.span_margin : styles.span_without)}>{title}</span>
      <div className={styles.margin}>
        {showDelete && TypeButton(deleteImage, theme, null, () => showDelete(_id), 'tiny')}
      </div>
      {owner && TypeButton(checkboxImage, theme, null, isComplete ? null : () => changeComplete(_id), 'tiny')}
    </div>
  )
}

export default TaskCard;
