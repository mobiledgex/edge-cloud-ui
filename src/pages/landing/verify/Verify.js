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

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { verifyEmail } from "../../../services/modules/landing";
import { Button, CircularProgress } from '@material-ui/core';

class VerifyContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: undefined,
            verified: false,
            success: false
        };

    }

    requestVerify = async () => {
        let token = this.props.location.search
        token = token.substring(token.indexOf('token=') + 6)
        let mc = await verifyEmail(this, { token });
        let success = false
        if (mc?.response || mc?.error) {
            let message = 'Oops, this link is expired'
            if (mc && mc.response && mc.response.data) {
                success = true
                message = 'Email Verfied, Thank You'
            }
            this.setState({ verified: true, success, message })
        }
    }

    onClose = () => {
        this.props.history.push('/')
    }

    render() {
        const { verified, success, message } = this.state
        const color = success ? '#75B927' : '#D32F2F'
        return (
            <div style={{ padding: 10 }} >
                <br />
                <h2 style={{ color: '#C4D3DC', fontWeight: 400 }}>Verifying Your Account</h2>
                <br /><br />
                {
                    verified ?
                        <React.Fragment>
                            <img src={`assets/icons/${success ? 'tick' : 'cross'}.svg`} style={{ width: 100, border: `2px solid ${color}`, borderRadius: 50, strokeWidth: 10 }} tick />
                            <h4 style={{ marginTop: 20, color: '#C4D3DC' }}>{message}</h4>
                            <div align='right'>
                                <Button variant='outlined' style={{ borderColor: '#C4D3DC', color: '#C4D3DC' }} onClick={this.onClose}>OK</Button>
                            </div>
                        </React.Fragment> :
                        <CircularProgress size={100} thickness={1} />
                }
            </div>
        );
    }

    componentDidMount() {
        this.requestVerify();
    }

}

export default withRouter(VerifyContent);
