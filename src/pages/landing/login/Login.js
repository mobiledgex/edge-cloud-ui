import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loadingSpinner, alertInfo } from '../../../actions';
import { LS_THASH } from '../../../helper/constant/perpetual';
import { isLocal } from '../../../utils/location_utils';
import { login } from '../../../services/modules/landing';
import LoginForm from './LoginForm';
import MexOTPValidation from './MexOTPValidation';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: '',
            name: '',
            password: '',
            username: '',
            totp: undefined,
            loginOTP: undefined
        };
        this.params = null;
    }

    loadMainPage = (data) => {
        if (data && data.token) {
            if (isLocal()) {
                localStorage.setItem(LS_THASH, data.token)
            }
            else {
                localStorage.setItem(LS_THASH, true)
            }
            this.props.history.push('preloader')
        }
    }

    onLogin = async (username, password) => {
        this.params = {
            email: username,
            password: password,
        }
        let mc = await login(this, { username, password })
        if (mc && mc.response && mc.response.status === 200) {
            this.loadMainPage(mc.response.data)
        }
        else if (mc && mc.error) {
            let response = mc.error.response
            if (response?.status === 511) {
                this.setState({ loginOTP: mc.request.data })
            }
            else {
                let errorMessage = 'Invalid username/password'
                if (response && response.data && response.data.message) {
                    errorMessage = response.data.message
                    if (errorMessage === 'Account is locked, please contact MobiledgeX support') {
                        errorMessage = 'Your account is locked, please contact support@mobiledgex.com to unlock it'
                    }
                }
                this.props.handleAlertInfo('error', errorMessage)
            }
        }
    }

    onOTPValidation = async (totp) => {
        let data = this.state.loginOTP
        let username = data.username
        let mc = await login(this, { username: username, password: data.password, totp })
        if (mc && mc.response && mc.response.status === 200) {
            let data = mc.response.data;
            if (data.token) {
                this.loadMainPage(data)
                this.setState({ loginOTP: undefined })
            }
        }
        else if (mc?.error) {
            let response = mc.error.response
            if (response?.status === 511) {
                this.setState({ loginOTP: mc.request.data })
            }
            else {
                let errorMessage = 'Invalid username/password'
                if (response && response.data && response.data.message) {
                    errorMessage = response.data.message
                    if (errorMessage === 'Account is locked, please contact MobiledgeX support') {
                        errorMessage = 'Your account is locked, please contact support@mobiledgex.com to unlock it'
                    }
                }
                this.props.handleAlertInfo('error', errorMessage)
            }
        }
    }

    renderOTPForm = () => (
        <MexOTPValidation onComplete={this.onOTPValidation} data={this.state.loginOTP} />
    )

    render() {
        return (
            this.state.loginOTP ? this.renderOTPForm() :
                < LoginForm onSubmit={this.onLogin} />
        );
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(Login));
