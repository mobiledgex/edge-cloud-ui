import React, { Component } from 'react';
import * as serverData from "../../../services/model/serverData";
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

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
        let mc = await serverData.verifyEmail(this, { token: token });
        let success = false
        if (mc && (mc.response || mc.error)) {
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
            <div style={{ height: '22vh', padding: 10 }} >
                <br />
                <h2 style={{ color: '#C4D3DC', fontWeight:400 }}>Verifying Your Account</h2>
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
