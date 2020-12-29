import React from 'react'
import { Divider, Drawer, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/CloseRounded';

const MexNew = (props) => {

    const close = ()=>{
        props.close()
    }

    return (
        <Drawer anchor={'right'} open={props.open}>
            <div className='whats_new_container'>
                <div style={{float:'left', marginTop:10, marginLeft:10}}>
                    <h3>What's New</h3>
                </div>
                <div style={{float:'right'}}>
                    <IconButton onClick={close}>
                        <CloseIcon/>
                    </IconButton>
                </div>
                <object type="text/html"  data='https://developers.mobiledgex.com/release-notes/version2-4' width='100%' style={{height:'calc(96vh - 5px)'}}></object>
            </div>
        </Drawer>
    )

}

export default MexNew