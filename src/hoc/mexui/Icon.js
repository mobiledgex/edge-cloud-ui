/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Icon as MIcon } from '@material-ui/core'
import { createStyles, makeStyles } from "@material-ui/core";
import clsx from 'clsx'
import React from 'react'

export const useStyles = makeStyles(() =>
  createStyles({
    rotateIcon: {
      animation: "spin 2s linear infinite"
    }
  })
);

const Icon = (props) => {
  const classes = useStyles();
  const { outlined, className, animation, id, style, color, size } = props
  let customStyle = { color, fontSize: size }
  customStyle = style ? {...customStyle, ...style} : customStyle
  return (
    <React.Fragment>
      <MIcon id={id} className={clsx(`material-icons${outlined ? '-outlined' : ''}`, className, animation ? classes.rotateIcon : '')} style={customStyle}>{props.children}</MIcon>
      <style>
        {
          `@keyframes spin {
                 0% { transform: rotate(0deg); }
                 100% { transform: rotate(360deg); }}`
        }
      </style>
    </React.Fragment>
  )
}

export default Icon