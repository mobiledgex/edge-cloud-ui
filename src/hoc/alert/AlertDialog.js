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
import { Snackbar} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { toFirstUpperCase } from '../../utils/string_utils';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MexAlert = (props) => {

    const handleClose = (event, reason) => {
        props.onClose()
    }
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            onClose={handleClose}
            open={props.data !== undefined}
            autoHideDuration={20000}
        >
            <Alert onClose={handleClose} severity={props.data.mode}>
                {toFirstUpperCase(props.data.msg)}
            </Alert>
        </Snackbar>
    )
}

export default MexAlert;

