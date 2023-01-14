import React from 'react'
import Image from 'next/image'

import styles from './Image.module.scss'

export const TypeImage = (
  src: string,
  alt: string,
  isRounden: boolean,
  width: number,
  height?: number | null
) => {
  return <Image
    className={isRounden ? styles.image : undefined}
    src={src}
    alt={alt}
    width={width}
    height={height || width}
  />
}