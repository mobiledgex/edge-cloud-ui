import { LinearProgress as MLinearProgress } from '@material-ui/core'
import React from 'react'

const LinearProgress = (props) => {
    const { height } = props
    return (
        <MLinearProgress style={{ height: height ?? 1 }} />
    )
}

export default LinearProgress