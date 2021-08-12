import { Icon as MIcon } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'

const Icon = (props) => {
    const { outlined, className } = props
    return (
        <MIcon className={clsx(`material-icons${outlined ? '-outlined' : ''}`, className)} style={props.style}>{props.children}</MIcon>
    )
}

export default Icon