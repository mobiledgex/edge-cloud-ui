import React, { Component, Fragment } from 'react';
import { Container, Button, Input, Icon, Grid } from 'semantic-ui-react'
import UAParser from 'ua-parser-js';
//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { LOCAL_STRAGE_KEY, LS_USER_META_DATA } from '../../constant'
import { PAGE_ORGANIZATIONS } from '../../constant'
import * as serverData from '../../services/model/serverData';
import * as serviceMC from '../../services/model/serviceMC';
import RegistryUserForm from './signup';
import MexOTPRegistration from './otp/MexOTPRegistration';
import MexOTPValidation from './MexOTPValidation';
import ResetPasswordForm from '../siteFour/userSetting/updatePassword';
import PublicIP from 'public-ip';
import { fields } from '../../services/model/format';
import ReCAPTCHA from "react-google-recaptcha";
import { CURRENT_USER } from '../../services/model/endpoints';
import LoginForm from './LoginForm'
import { Checkbox, FormControlLabel } from '@material-ui/core';

const host = window.location.host;
let self = null;

const FormForgotPass = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>Recover your password</span>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Input icon='envelope outline' style={{ width: '100%', color: 'white' }} placeholder='Email Address' name='email' ref={ipt => { props.self.email = ipt }} onChange={props.self.onChangeInput} onKeyPress={event => { if (event.key === 'Enter') { props.self.onSendEmail() } }}></Input>
            </Grid.Column>
        </Grid.Row>
        <div className="loginValidation">
            {props.login_danger}
        </div>
        <Grid.Row>
            <Grid.Column>
                <Button onClick={() => props.self.onSendEmail()}>Send Me Email</Button>
            </Grid.Column>
        </Grid.Row>
    </Grid>
)
const ForgotMessage = (props) => {
    return (
        <Grid className="signUpBD">
            <Grid.Row>
                <span className='title'>Reset your password</span>
            </Grid.Row>
            <Grid.Row>
                <span className="login-text">Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.</span>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Button onClick={() => props.self.returnSignin()}>Log In</Button>
                </Grid.Column>
            </Grid.Row>

        </Grid>
    )
}
const ResetPassword = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>Reset your password</span>
        </Grid.Row>
        <ResetPasswordForm onReset={props.onReset} location={props.location} />
        <br />
    </Grid>

)
const FormResendVerify = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>Request a new verification email</span>
        </Grid.Row>
        <Grid.Row>
            <span className="login-text">Enter your email address and we will send you a link to verify your email.</span>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Input style={{ width: '100%' }} placeholder='Enter your email address' name='email' ref={ipt => { props.self.email = ipt }} onChange={props.self.onChangeInput} onKeyPress={event => { if (event.key === 'Enter') { props.self.onSendEmail('verify') } }}></Input>
            </Grid.Column>
        </Grid.Row>
        <div className="loginValidation">
            {props.login_danger}
        </div>
        <Grid.Row>
            <Grid.Column>
                <Button onClick={() => props.self.onSendEmail('verify')}>Send verify email</Button>
            </Grid.Column>
        </Grid.Row>

    </Grid>
)


const SuccessMsg = (props) => (
    <Grid className="signUpBD">
        {!(props.msg.indexOf('created') > -1) &&
            <Grid.Row>
                <span className='title' onClick={() => console.log(props.msg)}>{String(props.msg)}</span>
            </Grid.Row>
        }
        {(props.msg.indexOf('created') !== -1) ?
            <Fragment>
                <Grid.Row>
                    <div className="login-text">{props.self.state.resultMsg}</div>
                </Grid.Row>
                <Grid.Row>
                    <div className="login-text">If you have not received the email after a few minutes, check your spam folder or click <span style={{ fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', display: 'inline-block' }} onClick={() => props.self.onSendEmail('verify')}>here</span> to resend verification email.</div>
                </Grid.Row>
            </Fragment>
            :
            <Fragment>
                <Grid.Row>
                    <div className="login-text">Fail to create your account. Please try Again.</div>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Button onClick={() => props.self.handleClickLogin('signup')}><span>Sign Up</span></Button>
                    </Grid.Column>
                </Grid.Row>
            </Fragment>
        }
        <Grid.Row>
            <Grid.Column>
                <Button onClick={() => props.self.handleClickLogin('login')}><span>Log In</span></Button>
            </Grid.Column>
        </Grid.Row>
    </Grid>
)

class Login extends Component {
    constructor(props) {
        super(props);
        self = this;
        this.state = {
            session: 'close',
            uid: '',
            name: '',
            submit: true,
            redirect: false,
            directLink: '/site1',
            loginBtnStyle: 'loginBtn',
            email: '',
            password: '',
            username: '',
            successCreate: false,
            errorCreate: false,
            loginMode: 'login',
            successMsg: 'Success create new account',
            created: false,
            resultMsg: '',
            captchaValidated: false,
            totp: undefined,
            loginOTP: undefined
        };

        this.onConfirm = this.onConfirm.bind(this);
        this.onSignOut = this.onSignOut.bind(this);
        this.params = null;
        this.clientSysInfo = {};
    }

    componentDidMount() {
        /**********************
        * Get info of client system : OS, browser
        * @type {UAParser}
        */
        var parser = new UAParser();

        // by default it takes ua string from current browser's window.navigator.userAgent
        let resultPs = parser.getResult();
        this.clientSysInfo = { os: resultPs.os, browser: resultPs.browser };
        this.receiveClientIp();

    }

    static getDerivedStateFromProps(props, state) {
        if (props.loginMode !== state.loginMode) {
            if (props.loginMode === 'login') {
                if (state.errorCreate) {
                    return { successCreate: false, errorCreate: false, loginOTP: undefined, totp: undefined };
                } else {
                    return { successCreate: false, loginMode: 'login', loginOTP: undefined, totp: undefined };
                }

            } else if (props.loginMode === 'signup') {
                return { successCreate: false, loginMode: 'signup', errorCreate: false, captchaValidated: false, loginOTP: undefined, totp: undefined };
            } else if (props.loginMode === 'forgot') {
                return { successCreate: false, loginMode: 'forgot', loginOTP: undefined, totp: undefined };
            } else if (props.loginMode === 'forgotMessage') {
                return { successCreate: false, loginMode: 'forgotMessage', loginOTP: undefined, totp: undefined };
            } else if (props.loginMode === 'verify') {
                return { successCreate: false, loginMode: 'verify', loginOTP: undefined, totp: undefined };
            } else if (props.loginMode === 'resetPass') {
                return { successCreate: false, loginMode: 'resetPass', loginOTP: undefined, totp: undefined };
            }
            else {
                return null
            }
        }
        else if (props.loginMode === 'signuped' && props.createSuccess) {
            let email = props.userInfo && props.userInfo.email;
            let msgTxt = `Welcome to the Edge! Thank you for signing up.
                        To login to your account, you must first validate your email address.
                        A verification email has been sent to ${email}. Click on the verification link in the email to verify your account. 
                        All the new accounts are locked by default. Please contact support@mobiledgex.com to unlock it`
            return { successCreate: true, loginMode: 'signuped', successMsg: 'Account created', resultMsg: msgTxt }
        }
        else {
            return null
        }
    }

    receiveClientIp = async () => {
        try {
            let IPAddress = await PublicIP.v4()
            self.clientSysInfo['clientIP'] = IPAddress ? IPAddress : '127.0.0.1';
        }
        catch (e) {

        }
    }

    createUser = async (data) => {
        let mcRequest = await serverData.createUser(self, {
            name: data[fields.username],
            passhash: data[fields.password],
            email: data[fields.email],
            verify: {
                email: data[fields.email],
                operatingsystem: self.clientSysInfo.os.name,
                browser: self.clientSysInfo.browser.name,
                callbackurl: `https://${host}/#/verify`,
                clientip: self.clientSysInfo.clientIP,
            },
            EnableTOTP: data[fields.otp],
        })
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                let request = mcRequest.request;
                if (request.data.EnableTOTP) {
                    this.setState({ totp: { requestData: request.data, responseData: response.data } })
                }
                else {
                    if (typeof response.data === 'string' && response.data.indexOf("}{") > 0) {
                        response.data.replace("}{", "},{")
                        response.data = JSON.parse(response.data)
                    }
                    let message = (response.data.Message) ? response.data.Message : null;
                    self.onProgress(false)

                    if (message && message.indexOf('created') > -1) {
                        this.props.onSignUp()
                        let msg = `User ${request.data.name} created successfully`
                        self.setState({ successCreate: true, loginMode: 'signuped', signup: false })
                        self.props.handleAlertInfo('success', msg)
                        self.props.handleCreateAccount({ success: true, info: request.data })
                    } else {
                        self.setState({ successCreate: false, errorCreate: false, signup: false })
                        self.forceUpdate();
                        self.props.handleCreateAccount({ success: false, info: request.data })
                        self.props.handleAlertInfo('error', message)

                    }
                    self.setState({ successMsg: message ? message : self.state.successMsg, signup: false, email: data[fields.email] });
                    setTimeout(() => self.props.handleChangeLoginMode('signuped'), 600);
                }
            }
        }
    }

    onSignOut = () => {
        this.props.requestLogout();
    }
    onConfirm = () => {
        this.props.requestLogin(this.props.target, { uid: this.uid.value, pwd: this.pwd.value }); // ajax 요청

    }
    onChangeInput = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    onProgress = (value) => {
        this.props.handleLoadingSpinner(value)
    }

    returnSignin = () => {
        this.props.handleChangeLoginMode('login')
    }

    getControllers = async (token) => {
        let mcRequest = await serverData.controllers(self, token)
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            let data = mcRequest.response.data
            let regions = []
            data.map((data) => {
                regions.push(data.Region)
            })
            localStorage.setItem('regions', regions)
        }
    }

    validateUserName = (username) => {
        if (username !== localStorage.getItem('userInfo')) {
            localStorage.setItem('userInfo', self.state.username)
            localStorage.removeItem('selectOrg')
            localStorage.removeItem('selectRole')
        }
    }

    fetchInitDataBeforeLogin = async (username, data) => {
        if (data.token) {
            let mc = await serviceMC.sendSyncRequest(this, { method: CURRENT_USER, token: data.token })
            if (mc && mc.response && mc.response.status === 200) {
                localStorage.setItem(LS_USER_META_DATA, mc.response.data.Metadata)
                this.params['userToken'] = data.token
                localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(this.params))
                this.getControllers(data.token)
                this.validateUserName(username)
                this.props.history.push({ pathname: `/site4/pg=${PAGE_ORGANIZATIONS}` })
            }
        }
    }

    onLogin = async (username, password) => {
        this.params = {
            email: username,
            password: password,
        }

        let mcRequest = await serverData.login(self, { username, password })
        if (mcRequest && mcRequest.response) {
            let response = mcRequest.response;
            if (response.data) {
                this.fetchInitDataBeforeLogin(username, response.data)
            }
        }
        else if (mcRequest && mcRequest.error) {
            let response = mcRequest.error.response
            if (response.status === 511) {
                this.setState({ loginOTP: mcRequest.request.data })
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

    handleClickLogin = (mode) => {
        this.props.handleChangeLoginMode(mode)
    }

    onSendEmail = async (mode) => {
        if (mode === 'verify') {
            let valid = await serverData.sendVerify(self, { email: self.state.email, callbackurl: `https://${host}/#/verify` })
            if (valid) {
                self.props.handleAlertInfo('success', 'We have e-mailed your verification link')
                this.handleClickLogin('forgotMessage')

            }
        } else if (mode === 'back') {

            self.setState({ loginMode: 'login' })
        }
        else {
            let data = {
                email: self.state.email,
                operatingsystem: self.clientSysInfo.os.name,
                browser: self.clientSysInfo.browser.name,
                callbackurl: `https://${host}/#/passwordreset`,
                clientip: self.clientSysInfo.clientIP
            }
            let valid = await serverData.resetPasswordRequest(self, data)
            if (valid) {
                self.props.handleAlertInfo('success', 'We have e-mailed your password reset link!')
                this.handleClickLogin('forgotMessage')
            }
        }
    }

    onCaptchaChange = (value) => {
        if (value) {
            this.setState({ captchaValidated: true })
        }
    }

    signUpForm = () => (
        <Grid>
            <Grid.Row>
                <span className='title'>Create New Account</span>
            </Grid.Row>
            <RegistryUserForm createUser={this.createUser} captchaValidated={this.state.captchaValidated} />
            <Grid.Row style={{ marginTop: 40, marginLeft: 25 }}>
                <ReCAPTCHA
                    sitekey={process.env.REACT_APP_CAPTCHA_V2_KEY}
                    onChange={this.onCaptchaChange}
                />
            </Grid.Row>
            <Grid.Row>
                <span>
                    By clicking Sign Up, you agree to our <a href="https://mobiledgex.com/terms-of-use" target="_blank" className="login-text" style={{ fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', color: "rgba(255,255,255,.5)", padding: '0' }}>Terms of Use</a> and <a href="https://www.mobiledgex.com/privacy-policy" target="_blank" className="login-text" style={{ fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', color: "rgba(255,255,255,.5)", padding: '0', }}>Trust Policy</a>.
                </span>
            </Grid.Row>
        </Grid>
    )

    onOTPValidation = async (otp) => {
        let data = this.state.loginOTP
        let username = data.username
        let mcRequest = await serverData.login(self, { username: username, password: data.password, totp: otp })
        if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
            let response = mcRequest.response;
            if (response.data.token) {
                self.params['userToken'] = response.data.token
                this.getControllers(response.data.token)
                localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(self.params))
                this.validateUserName(username)
                this.props.history.push({ pathname: `/site4/pg=${PAGE_ORGANIZATIONS}` })
                this.setState({ loginOTP: undefined })
            }
        }
        else if (mcRequest && mcRequest.error) {
            let response = mcRequest.error.response
            if (response.status === 511) {
                this.setState({ loginOTP: mcRequest.request.data })
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

    onOTPComplete = (data) => {
        let requestData = this.state.totp.requestData
        this.props.onSignUp()
        let msg = `User ${requestData.name} created successfully`
        self.setState({ successCreate: true, loginMode: 'signuped', signup: false, totp: undefined })
        self.props.handleAlertInfo('success', msg)
        self.props.handleCreateAccount({ success: true, info: requestData })
    }

    otpRegistration = () => (
        <MexOTPRegistration onComplete={this.onOTPComplete} data={this.state.totp} showDone={true} />
    )


    onReset = () => {
        this.props.history.push({ pathname: '/logout' })
        this.props.handleChangeLoginMode('login');
    }

    render() {
        return (
            <Container style={{ width: this.props.signup ? 500 : 400 }}>
                {
                    this.state.loginOTP ? this.renderOTPForm() :
                        this.state.totp ? this.otpRegistration() :
                            this.props.signup ? this.signUpForm() :
                                (this.state.loginMode === 'forgot') ?
                                    <FormForgotPass self={this} />
                                    : (this.state.loginMode === 'resetPass') ?
                                        <ResetPassword self={this} onReset={this.onReset} location={this.props.location} />
                                        : (this.state.loginMode === 'forgotMessage') ?
                                            <ForgotMessage self={this} />
                                            : (this.state.loginMode === 'verify') ?
                                                <FormResendVerify self={this} />
                                                : (this.state.loginMode === 'signup') ?
                                                    (this.state.successCreate || this.state.errorCreate) ?
                                                        <SuccessMsg self={this} msg={this.state.successMsg}></SuccessMsg>
                                                        :
                                                        <LoginForm onSubmit={this.onLogin} handleClickLogin={this.handleClickLogin} />

                                                    : (this.state.loginMode === 'signuped') ?
                                                        (this.state.successCreate || this.state.errorCreate) ?
                                                            <SuccessMsg self={this} msg={this.state.successMsg}></SuccessMsg>
                                                            : <div></div>
                                                        : (this.state.loginMode === 'login') ?
                                                            <LoginForm onSubmit={this.onLogin} handleClickLogin={this.handleClickLogin} />
                                                            :
                                                            null
                }
            </Container>

        );
    }
}

const mapStateToProps = state => {
    let profile = state.form.profile ? state.form.profile : null;
    let loginmode = state.loginMode ? state.loginMode : null;
    let createSuccess = state.createAccount ? state.createAccount.created.success : null;
    let userInfo = state.createAccount ? state.createAccount.created.info : null;
    return {
        values: profile ? profile.values : null,
        submitSucceeded: profile ? profile.submitSucceeded : null,
        loginMode: loginmode ? loginmode.mode : null,
        createSuccess: createSuccess,
        userInfo: userInfo
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleChangeTab: (data) => { dispatch(actions.changeTab(data)) },
        handleChangeLoginMode: (data) => { dispatch(actions.changeLoginMode(data)) },
        handleCreateAccount: (data) => { dispatch(actions.createAccount(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(Login);
