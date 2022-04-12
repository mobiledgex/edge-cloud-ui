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

import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarContent } from '@material-ui/core';
import { perpetual } from '../../helper/constant';

export default function ActionAlert(props) {
    let alertInfo = props.alertInfo
    const color = (type) => {
        switch (type) {
            case perpetual.SUCCESS:
                return '#FF9800'
            case perpetual.ERROR:
                return '#212121'
            case perpetual.WARNING:
                return '#FF9800'
            case perpetual.INFO:
                return '#2196F3'
        }
    }

    return (
        alertInfo ? <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={alertInfo !== undefined}
                autoHideDuration={6000}
            >
                <SnackbarContent
                    style={{ backgroundColor: color(alertInfo.severity), color: '#FFF' }}
                    message={alertInfo.msg}
                    action={
                        <React.Fragment>
                            <Button style={{ color: '#FFF' }} size="small" onClick={() => { props.action(true) }}>
                                YES
                            </Button>
                            <Button style={{ color: '#FFF' }} size="small" onClick={() => { props.action(false) }}>
                                NO
                          </Button>
                        </React.Fragment>
                    } />
            </Snackbar>
        </div> : null
    );
}