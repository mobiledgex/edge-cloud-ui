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

// @flow
import * as React from 'react';
import { Component } from 'react';
import * as date_util from '../../../../utils/date_util'
import AccessTimeOutlined from '@material-ui/icons/AccessTimeOutlined'
import { IconButton } from '@material-ui/core';
export default class MiniClockComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'time': this.getCurrentTime(),
        }
        this.clockInterval = undefined
    }

    componentDidMount() {
        this.clockInterval = setInterval(() => {
            this.setState({ time: this.getCurrentTime() });
        }, 1000);
    }

    getCurrentTime = () => {
        return date_util.currentTime(date_util.FORMAT_WD_TIME_HH_mm)
    }

    componentWillUnmount() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
        }
    }

    render() {
        return (
            <p style={{
                color: '#FFF',
                fontSize: 13,
                marginTop:6,
                width: 120
            }}>
                <IconButton style={{backgroundColor:'transparent', color:'white'}} disabled={true}>
                    <AccessTimeOutlined />
                    <span style={{ fontSize: 13, marginLeft:5 }}>{this.state.time}</span>
                </IconButton>
            </p>
        );
    }
}
