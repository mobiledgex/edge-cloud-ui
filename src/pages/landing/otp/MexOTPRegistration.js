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

import React from 'react'
import { Button } from '@material-ui/core'
import { Grid, Image } from 'semantic-ui-react'

class MexOTP extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            textcode: undefined,
            totp: ''
        }
        let responseData = this.props.data.responseData
        this.TOTPQRImage = responseData.TOTPQRImage
        this.TOTPSharedKey = responseData.TOTPSharedKey
    }

    loadTextCode = () => {
        this.setState({ textcode: this.TOTPSharedKey })
    }

    onDone = () => {
        this.props.onComplete()
    }

    render() {
        const { textcode } = this.state
        const { showDone } = this.props
        return (
            <Grid>
                <Grid.Row>
                    <h4 className='title'>Scan this barcode with your app</h4>
                </Grid.Row>
                <Grid.Row>
                    <span style={{ textAlign: 'left', color: '#FFFFFF', fontSize:14 }}>
                        {textcode ? <div>Enter this code into the app</div> :
                            <div>Scan the image below with the two-factor authentication app on your phone. If you can't use a barcode, <button className='otp-registration-link' onClick={this.loadTextCode}>enter this text code instead.</button></div>}
                    </span>
                </Grid.Row>
                <Grid.Row>
                    <div style={{ width: '100%' }} align="center">
                        {textcode ? <code style={{ backgroundColor: '#9b9b9b', color: '#FFF', padding: 5 }}>{textcode}</code> :
                            <Image src={`data:image/png;base64,${this.TOTPQRImage}`} />}
                    </div>
                </Grid.Row>
                {showDone ? <Grid.Row>
                    <Button size='small' variant="outlined" onClick={this.onDone} style={{ marginLeft: 10, color: '#93E019', borderColor: '#93E019' }}>Done</Button>
                </Grid.Row> : null}
            </Grid>
        )
    }
}

export default MexOTP