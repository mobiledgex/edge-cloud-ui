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