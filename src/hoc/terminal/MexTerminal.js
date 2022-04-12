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
import { Terminal } from 'xterm'
import * as actions from "../../actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as date_util from '../../utils/date_util';
import { FitAddon } from 'xterm-addon-fit';
import { perpetual } from '../../helper/constant';
import '../../../node_modules/xterm/css/xterm.css'
import './style.css'

class MexTerminal extends React.Component {

    constructor(props) {
        super(props)
        this.terminal = new Terminal({ fontFamily: 'Inconsolata, monospace' });
        this.startTime = date_util.currentTimeInMilli()
    }

    initTerminal = () => {
        let fitAddon = new FitAddon();
        this.terminal.loadAddon(fitAddon);
        this.terminal.open(document.getElementById('terminal'));
        this.terminal.onData(e => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(e)
            }
        });
        if (this.props.request === perpetual.SHOW_LOGS) {
            fitAddon.fit()
        }
    }

    sendWSRequest = (url, data) => {
        this.props.handleLoadingSpinner(true)
        this.ws = new WebSocket(url)
        this.ws.onopen = () => {
            this.startTime = date_util.currentTimeInMilli()
            this.props.handleLoadingSpinner(false)
            this.initTerminal()
            this.props.status(true, 0, this.ws)

        }
        this.ws.onmessage = evt => {
            this.terminal.write(evt.data)
        }

        this.ws.onclose = evt => {
            let diff = date_util.currentTimeInMilli() - this.startTime
            this.props.handleLoadingSpinner(false)
            this.ws = undefined
            this.props.status(false, diff)
        }
    }

    render() {
        return (
            <div className={`${this.props.request === perpetual.RUN_COMMAND ? 'term_run' : 'term_log'}`}>
                <div id="terminal"></div>
            </div>
        )
    }

    componentDidMount() {
        this.sendWSRequest(this.props.url)
    }
}

const mapStateToProps = (state) => {
    return {}
};
const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MexTerminal));