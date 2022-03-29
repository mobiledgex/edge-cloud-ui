import React from 'react'
import { Typography } from "@material-ui/core"

export const Header1 = (props) => {
    const { children, size } = props
    return (
        <Typography variant="overline" style={{ fontSize: size ? size : 16, fontWeight: 900, color: '#CECECE' }}>{children}</Typography>
    )
}
