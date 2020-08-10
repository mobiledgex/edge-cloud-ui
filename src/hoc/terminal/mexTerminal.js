
import React from 'react';
import { Terminal } from 'xterm'
import '../../../node_modules/xterm/css/xterm.css'
import * as actions from "../../actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import './style.css'
import * as date_util from '../../utils/date_util';

class MexTerminal extends React.Component {

    constructor(props) {
        super(props)
        this.terminal = new Terminal();
        this.startTime = date_util.currentTimeInMilli()
    }

    initTerminal = () => {
        this.terminal.open(document.getElementById('terminal'));
        this.terminal.onData(e => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN)
            {
                this.ws.send(e)
            }
        });
    }

    sendWSRequest = (url, data) =>{
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
            <div class="term_head">
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