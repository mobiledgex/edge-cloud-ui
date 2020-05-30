import React, { Component, Fragment } from 'react';
import { Container, Button, Label, Grid, Input } from 'semantic-ui-react'
import { Redirect } from 'react-router';
import * as moment from 'moment';
import UAParser from 'ua-parser-js';
//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import * as serverData from '../../services/model/serverData';
import RegistryUserForm from '../reduxForm/RegistryUserForm';
import RegistryResetForm from '../reduxForm/registryResetForm';
import PublicIP from 'public-ip';


const host = window.location.host;
let self = null;

const FormContainer = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>User Login</span>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Input style={{ width: '100%' }} placeholder='Username or Email' name='username' ref={ipt => { props.self.uid = ipt }} onChange={props.self.onChangeInput} onKeyPress={event => { if (event.key === 'Enter') { props.self.onSubmit() } }}></Input>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column >
                <Input style={{ width: '100%' }} placeholder='Password' name='password' type='password' ref={ipt => { props.self.pwd = ipt }} onChange={props.self.onChangeInput} onKeyPress={event => { if (event.key === 'Enter') { props.self.onSubmit() } }}></Input>
            </Grid.Column>
        </Grid.Row>
        <div className="loginValidation">
            {props.login_danger}
        </div>
        <Grid.Row>
            <Grid.Column>
                <Button onFocus={() => props.self.onFocusHandle(true)} onBlur={() => props.self.onFocusHandle(false)} onClick={() => props.self.onSubmit()}>Log In</Button>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <div style={{ fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', display: 'inline-block' }} onClick={() => props.self.handleClickLogin('forgot')}>Forgot Password?</div>
        </Grid.Row>
    </Grid>

)
const FormForgotPass = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>Reset your password</span>
        </Grid.Row>
        <Grid.Row>
            <span className="login-text">Enter your email address and we will send you a link to reset your password.</span>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Input style={{ width: '100%' }} placeholder='Enter your email address' name='email' ref={ipt => { props.self.email = ipt }} onChange={props.self.onChangeInput} onKeyPress={event => { if (event.key === 'Enter') { props.self.onSendEmail() } }}></Input>
            </Grid.Column>
        </Grid.Row>
        <div className="loginValidation">
            {props.login_danger}
        </div>
        <Grid.Row>
            <Grid.Column>
                <Button onFocus={() => props.self.onFocusHandle(true)} onBlur={() => props.self.onFocusHandle(false)} onClick={() => props.self.onSendEmail()}>Send Password Reset Email</Button>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Button onClick={() => props.self.onSendEmail('back')}>Return to Log In</Button>
            </Grid.Column>
        </Grid.Row>
    </Grid>
)
const ForgotMessage = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>Reset your password</span>
        </Grid.Row>
        <Grid.Row>
            <span className="login-text">Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.</span>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Button onFocus={() => props.self && props.self.onFocusHandle(true)} onfocusout={() => props.self && props.self.onFocusHandle(false)} onClick={() => props.self.returnSignin()}>Return to Sign In</Button>
            </Grid.Column>
        </Grid.Row>

    </Grid>
)
const ResetPassword = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>Reset your password</span>
        </Grid.Row>
        <RegistryResetForm onSubmit={() => console.log('ProfileForm was submitted')} />
        <Grid.Row>
            <span>
                By clicking SignUp, you agree to our <a href="https://mobiledgex.com/terms-of-use" target="_blank" className="login-text" style={{ fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', color: "rgba(255,255,255,.5)", padding: '0' }}>Terms of Use</a> and <a href="https://www.mobiledgex.com/privacy-policy" target="_blank" className="login-text" style={{ fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', color: "rgba(255,255,255,.5)", padding: '0', }}>Privacy Policy</a>.
            </span>
        </Grid.Row>
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
                <Button onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() => props.self.onSendEmail('verify')}>Send verify email</Button>
            </Grid.Column>
        </Grid.Row>

    </Grid>
)
const FormSignUpContainer = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>Create New Account</span>
        </Grid.Row>
        <RegistryUserForm onSubmit={(a, b) => console.log('20190906 ProfileForm was submitted', a, b)} userInfo={{ username: props.self.state.username, email: props.self.state.email, commitDone: props.self.state.commitDone }} />
        <Grid.Row>
            <span>
                By clicking SignUp, you agree to our <a href="https://mobiledgex.com/terms-of-use" target="_blank" className="login-text" style={{ fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', color: "rgba(255,255,255,.5)", padding: '0' }}>Terms of Use</a> and <a href="https://www.mobiledgex.com/privacy-policy" target="_blank" className="login-text" style={{ fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', color: "rgba(255,255,255,.5)", padding: '0', }}>Privacy Policy</a>.
            </span>
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
                        <Button onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() => props.self.handleClickLogin('signup')}><span>Sign Up</span></Button>
                    </Grid.Column>
                </Grid.Row>
            </Fragment>
        }
        <Grid.Row>
            <Grid.Column>
                <Button onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() => props.self.handleClickLogin('login')}><span>Log In</span></Button>
            </Grid.Column>
        </Grid.Row>
    </Grid>
)

class Login extends Component {
    constructor(props) {
        super(props);
        self = this;
        this.state = {
            focused: false,
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
            loginDanger: '',
            forgotPass: false,
            forgotMessage: false,
            created: false,
            resultMsg: ''
        };

        this.onFocusHandle = this.onFocusHandle.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onSignOut = this.onSignOut.bind(this);
        this.params = null;
        this.clientSysInfo = {};
    }

    componentDidMount() {

        let getUserInfo = localStorage.getItem('userInfo')
        let oldUserInfo = getUserInfo ? JSON.parse(getUserInfo) : null;
        if (oldUserInfo) {
            if (oldUserInfo.date && moment().diff(oldUserInfo.date, 'minute') >= 60) {
                localStorage.setItem('userInfo', null)
            }
        }

        /**********************
         * Get info of client system : OS, browser
         * @type {UAParser}
         */
        var parser = new UAParser();

        // by default it takes ua string from current browser's window.navigator.userAgent
        let resultPs = parser.getResult();
        this.clientSysInfo = { os: resultPs.os, browser: resultPs.browser };
        (async () => {
            this.receiveClientIp(await PublicIP.v4());
        })();

    }

    resetPassword = async (password) => {
        let token = this.props.location.search
        token = token.substring(token.indexOf('token=')+6)
        let mcRequest = await serverData.resetPassword(self, { token: token, password: password })
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            this.props.history.push({pathname:'/'})
            this.props.handleAlertInfo('success', mcRequest.response.data.message)
            self.props.handleChangeLoginMode('forgotMessage')
            setTimeout(() => self.props.handleChangeLoginMode('login'), 600);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.values) {
            if (nextProps.submitSucceeded) {
                this.setState({ email: nextProps.values.email, username: nextProps.values.username })

                localStorage.setItem('userInfo', JSON.stringify({ email: nextProps.values.email, username: nextProps.values.username, date: new Date() }))
                if (nextProps.loginMode === 'resetPass') {
                    this.resetPassword(nextProps.values.password)
                } else {
                    this.createUser(nextProps)
                }
            }

        }

        if (nextProps.loginMode === 'login') {
            if (this.state.errorCreate) {
                setTimeout(() => self.setState({ successCreate: false, errorCreate: false, forgotMessage: false, forgotPass: false }), 3000);
            } else {
                this.setState({ successCreate: false, loginMode: 'login', forgotMessage: false, forgotPass: false });
            }

        } else if (nextProps.loginMode === 'signup') {
            this.setState({ successCreate: false, loginMode: 'signup', forgotMessage: false, forgotPass: false, errorCreate: false });
        } else if (nextProps.loginMode === 'forgot') {
            this.setState({ successCreate: false, loginMode: 'forgot', forgotMessage: false, forgotPass: false });
        } else if (nextProps.loginMode === 'verify') {
            this.setState({ successCreate: false, loginMode: 'verify', forgotMessage: false, forgotPass: false });
        } else if (nextProps.loginMode === 'resetPass') {
            this.setState({ successCreate: false, loginMode: 'resetPass', forgotMessage: false, forgotPass: false });
        } else if (nextProps.loginMode === 'signuped' && nextProps.createSuccess) {
            localStorage.setItem('userInfo', null)
            let email = nextProps.userInfo && nextProps.userInfo.email;
            let msgTxt = `Welcome to the Edge! Thank you for signing up.
                            To login to your account, you must first validate your email address.
                            An email has been sent to  ${email} with a link to authenticate your account.`
            this.setState({ successCreate: true, loginMode: 'signuped', successMsg: 'Account created', resultMsg: msgTxt })
        }

    }

    receiveClientIp(IPAddress) {
        if (IPAddress) {
            self.clientSysInfo['clientIP'] = IPAddress;
        } else {
            self.clientSysInfo['clientIP'] = '127.0.0.1';
        }
    }

    createUser = async (nextProps) => {
        let mcRequest = await serverData.createUser(this, {
            name: nextProps.values.username,
            passhash: nextProps.values.password,
            email: nextProps.values.email,
            verify: {
                email: nextProps.values.email,
                operatingsystem: self.clientSysInfo.os.name,
                browser: self.clientSysInfo.browser.name,
                callbackurl: 'https://' + host + '/verify',
                clientip: self.clientSysInfo.clientIP,
            }
        })
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                let request = mcRequest.request;

                if (typeof response.data === 'string' && response.data.indexOf("}{") > 0) {
                    response.data.replace("}{", "},{")
                    response.data = JSON.parse(response.data)
                }
                let message = (response.data.message) ? response.data.message : null;
                self.onProgress(false)

                if (message.indexOf('created') > -1) {
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
                self.setState({ successMsg: message ? message : self.state.successMsg, signup: false });
                setTimeout(() => self.props.handleChangeLoginMode('signuped'), 600);
            }
        }
    }

    onFocusHandle(value) {
        self.setState({ focused: value })
    }

    onSignOut() {
        this.props.requestLogout();
    }
    onConfirm() {
        this.props.requestLogin(this.props.target, { uid: this.uid.value, pwd: this.pwd.value }); // ajax 요청

    }
    onChangeInput = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    onProgress(value) {
        this.props.handleLoadingSpinner(value)
    }

    returnSignin() {
        setTimeout(() => self.setState({ forgotPass: false, forgotMessage: false, loginMode: 'login' }), 1000)
    }

    getControllers = async (token) => {
        let mcRequest = await serverData.controllers(self, token)
        if(mcRequest && mcRequest.response && mcRequest.response.data)
        {
            let data = mcRequest.response.data
            let regions = []
            data.map((data) => {
                regions.push(data.Region)
            })
            localStorage.setItem('regions', regions)
        }
    }


    requestToken = async (self) => {
        let mcRequest = await serverData.login(self, { username: self.state.username, password: self.state.password })
        if (mcRequest && mcRequest.response) {
            let response = mcRequest.response;
            if (response.data.token) {
                self.params['userToken'] = response.data.token
                this.getControllers(response.data.token)
                localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(self.params))
                this.props.mapDispatchToLoginWithPassword(self.params)
                this.props.handleChangeLoginMode('login')
            }
        }
        else
        {
            this.props.handleAlertInfo('error', 'Invalid username/password')
        }
    }

    handleClickLogin(mode) {
        self.setState({ loginMode: mode })
    }

    onSendEmail = async (mode) => {
        if (mode === 'verify') {
            let valid = await serverData.sendVerify(self, { email: self.state.email, callbackurl: `https://${host}/#/verify` })
            if (valid) {
                self.props.handleAlertInfo('success', 'Success')
                self.setState({ loginMode: 'signup', forgotMessage: true })
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
                self.setState({ loginMode: 'forgotMessage', forgotMessage: true })
            }
        }
    }

    onSubmit() {
        const { username, password } = this.state
        if (!username && !password) {
            self.setState({ loginDanger: 'Insert Username and Password' });
        } else if (!username) {
            self.setState({ loginDanger: 'Insert Username' });
        } else if (!password) {
            self.setState({ loginDanger: 'Insert Password' });
        }
        const params = {
            email: username,
            password: password,
        }
        self.params = params;
        if (username && password) {
            self.setState({ loginDanger: '' });
            self.requestToken(self)
        };
    }

    render() {
        return (

            (this.state.session !== 'open') ?
                <Container>
                    {
                        (this.state.loginMode === 'forgot') ?
                            <FormForgotPass self={this} message={this.state.forgotMessage} />
                            : (this.state.loginMode === 'resetPass') ?
                                <ResetPassword self={this} />
                                : (this.state.loginMode === 'forgotMessage') ?
                                    <ForgotMessage self={this} />
                                    : (this.state.loginMode === 'verify') ?
                                        <FormResendVerify self={this} />
                                        : (this.state.loginMode === 'signup') ?
                                            (this.state.successCreate || this.state.errorCreate) ?
                                                <SuccessMsg self={this} msg={this.state.successMsg}></SuccessMsg>
                                                :
                                                <FormSignUpContainer self={this} focused={this.state.focused} loginBtnStyle={this.state.loginBtnStyle} lastFormValue={this.state.lastFromValue} />
                                            : (this.state.loginMode === 'signuped') ?
                                                (this.state.successCreate || this.state.errorCreate) ?
                                                    <SuccessMsg self={this} msg={this.state.successMsg}></SuccessMsg>
                                                    : <div></div>
                                                : (this.state.loginMode === 'login') ?
                                                    <FormContainer self={this} focused={this.state.focused} loginBtnStyle={this.state.loginBtnStyle} login_danger={this.state.loginDanger} />
                                                    :
                                                    <div></div>

                    }
                </Container>
                :
                (this.state.redirect) ?
                    <Redirect push to={this.state.directLink} />
                    :
                    <Container>
                        <Label>{`${this.state.uid}님 로그인 상태입니다`}</Label>
                        <Button onClick={this.onSignOut}>LOGOUT</Button>
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
        mapDispatchToLoginWithPassword: (data) => dispatch(actions.loginWithEmailRedux({ params: data })),
        handleChangeLoginMode: (data) => { dispatch(actions.changeLoginMode(data)) },
        handleCreateAccount: (data) => { dispatch(actions.createAccount(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(Login);
