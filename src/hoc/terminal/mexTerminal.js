
import React from 'react';
import { Terminal } from 'xterm'
import '../../../node_modules/xterm/css/xterm.css'
import * as actions from "../../actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import './style.css'
import * as date_util from '../../utils/date_util';
import { RUN_COMMAND, SHOW_LOGS } from '../../constant';
import { FitAddon } from 'xterm-addon-fit';

class MexTerminal extends React.Component {

    constructor(props) {
        super(props)
        this.terminal = new Terminal();
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
        if (this.props.request === SHOW_LOGS) {
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
            <div className={`${this.props.request === RUN_COMMAND ? 'term_run' : 'term_log'}`}>
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