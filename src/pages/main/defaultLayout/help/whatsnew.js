import React, { useEffect } from 'react'
import { Drawer, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/CloseRounded';

const MexNew = (props) => {

    const close = () => {
        props.close()
    }

    return (
        <Drawer anchor={'right'} open={props.open} keepMounted={true}>
            <div className='whats_new_container'>
                <div style={{ float: 'left', marginTop: 10, marginLeft: 10, fontSize: 15 }}>
                    <h3><b>What's New</b></h3>
                </div>
                <div style={{ float: 'right' }}>
                    <IconButton onClick={close}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <iframe frameBorder="0" type="text/html" sandbox="allow-same-origin" src='https://developers.mobiledgex.com/release-notes/sdk' width='100%' style={{ height: 'calc(96vh - 15px)' }}></iframe>
            </div>
        </Drawer>
    )

}

export default MexNew