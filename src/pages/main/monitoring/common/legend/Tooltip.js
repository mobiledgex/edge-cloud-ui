import React from 'react'
import { Popover } from '@material-ui/core';

const Tooltip = (props) => {
    const { anchorEl } = props
    return (
        <Popover
            id="mex-monitoring-legend-popover"
            sx={{
                pointerEvents: 'none',
            }}
            style={{ pointerEvents: 'none' }}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            disableRestoreFocus
        >
            <div style={{padding:10, backgroundColor:'#202125'}}>{props.children}</div>
        </Popover>
    )
}

export default Tooltip