import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serverData from '../../../services/model/serverData';
import MexOTPValidation from './MexOTPValidation';
import LoginForm from './LoginForm'
import { withRouter } from 'react-router-dom';
import { perpetual } from '../../../helper/constant';
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
        if (data.token) {
            localStorage.setItem(perpetual.LOCAL_STRAGE_KEY, JSON.stringify({ userToken: data.token }))
            this.props.history.push('preloader')
        }
    }

    onLogin = async (username, password) => {
        this.params = {
            email: username,
            password: password,
        }
        let mc = await serverData.login(this, { username, password })
        if (mc && mc.response && mc.response.status === 200) {
            this.loadMainPage(mc.response.data)
        }
        else if (mc && mc.error) {
            let response = mc.error.response
            if (response.status === 511) {
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
        let mc = await serverData.login(this, { username: username, password: data.password, totp })
        if (mc && mc.response && mc.response.status === 200) {
            let data = mc.response.data;
            if (data.token) {
                this.loadMainPage(data)
                this.setState({ loginOTP: undefined })
            }
        }
        else if (mc && mc.error) {
            let response = mc.error.response
            if (response.status === 511) {
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
            < LoginForm onSubmit={this.onLogin}/>
        );
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(Login));
