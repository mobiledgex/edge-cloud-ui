
import React, { useState, createRef } from 'react';
import { Terminal } from 'xterm'
import '../../../node_modules/xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit';
import * as actions from "../../actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class MexTerminal extends React.Component {

    constructor(props) {
        super(props)
        this.terminal = new Terminal();
    }

    initTerminal = () => {
        //let fitAddon = new FitAddon();
        //this.terminal.loadAddon(fitAddon);
        this.terminal.open(document.getElementById('terminal'));
        this.terminal.onData(e => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN)
            {
                this.ws.send(e)
            }
        });
        //fitAddon.fit()
    }

    sendWSRequest = (url, data) =>{
        this.props.handleLoadingSpinner(true)
        this.ws = new WebSocket(url)
        this.ws.onopen = () => {
            this.props.handleLoadingSpinner(false)
            this.initTerminal()
            this.props.status(true, this.ws)
            
        }
        this.ws.onmessage = evt => {
            this.terminal.write(evt.data)
        }
    
        this.ws.onclose = evt => {
            this.props.handleLoadingSpinner(false)
            this.ws = undefined
            this.props.status(false)
        }
    }

    render() {
        return (
            <div id="terminal" style={{ height: 'calc(100vh - 100px)'}}></div>
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