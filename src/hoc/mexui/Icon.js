import { Icon as MIcon } from '@material-ui/core'
import { Container, createStyles, makeStyles } from "@material-ui/core";
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
    const { outlined, className, animation } = props
    return (
        <React.Fragment>
            <MIcon className={clsx(`material-icons${outlined ? '-outlined' : ''}`, className, animation ? classes.rotateIcon : '')} style={props.style}>{props.children}</MIcon>
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