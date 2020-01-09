import React, {Component, Fragment} from 'react';
import { Container, Button, Label, Grid, Input } from 'semantic-ui-react'
import { Redirect } from 'react-router';
import * as moment from 'moment';
import UAParser from 'ua-parser-js';
//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';
// alert
import Alert from 'react-s-alert';
// API
import { LOCAL_STRAGE_KEY } from '../utils/Settings'
 import * as serviceMC from '../../services/serviceMC';
import RegistryUserForm from '../reduxForm/RegistryUserForm';
import RegistryResetForm from '../reduxForm/registryResetForm';
import CustomContentAlert from './CustomContentAlert';
import PublicIP from 'public-ip';
/*

 */

const host = window.location.host;
let self = null;
let email = 'yourEmail@email.net'

const FormContainer = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>User Login</span>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Input style={{width:'100%'}} placeholder='Username or Email' name='username' ref={ipt=>{props.self.uid = ipt}} onChange={props.self.onChangeInput} onKeyPress={event => { if (event.key === 'Enter') {props.self.onSubmit()} }}></Input>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column >
                <Input style={{width:'100%'}} placeholder='Password' name='password' type='password' ref={ipt=>{props.self.pwd = ipt}} onChange={props.self.onChangeInput} onKeyPress={event => { if (event.key === 'Enter') {props.self.onSubmit()} }}></Input>
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
            <div style={{fontStyle:'italic', textDecoration:'underline', cursor:'pointer', display:'inline-block'}} onClick={() => props.self.handleClickLogin('forgot')}>Forgot Password?</div>
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
                <Input style={{width:'100%'}} placeholder='Enter your email address' name='email' width ref={ipt=>{props.self.email = ipt}} onChange={props.self.onChangeInput} onKeyPress={event => { if (event.key === 'Enter') {props.self.onSendEmail()} }}></Input>
            </Grid.Column>
        </Grid.Row>
        <div className="loginValidation">
            {props.login_danger}
        </div>
        <Grid.Row>
            <Grid.Column>
                <Button onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() => props.self.onSendEmail()}>Send Password Reset Email</Button>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Button onClick={() => props.self.onSendEmail('back')}>Return to Log In</Button>
            </Grid.Column>
        </Grid.Row>
        {/*<Grid.Row columns={2}>*/}
        {/*    <Grid.Column>*/}
        {/*        <Button style={{width:'50%'}} onClick={() => props.self.onSendEmail('back')}>Return to Log In</Button>*/}
        {/*    </Grid.Column>*/}
        {/*    <Grid.Column>*/}
        {/*        <Button onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() => props.self.onSendEmail()}>Send Password reset email</Button>*/}
        {/*    </Grid.Column>*/}
        {/*</Grid.Row>*/}

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
        <RegistryResetForm onSubmit={() => console.log('ProfileForm was submitted')}/>
        <Grid.Row>
            <span>
                By clicking SignUp, you agree to our <a href="https://mobiledgex.com/terms-of-use" target="_blank" className="login-text" style={{fontStyle:'italic', textDecoration:'underline', cursor:'pointer', color:"rgba(255,255,255,.5)", padding:'0'}}>Terms of Use</a> and <a href="https://www.mobiledgex.com/privacy-policy" target="_blank" className="login-text" style={{fontStyle:'italic', textDecoration:'underline', cursor:'pointer', color:"rgba(255,255,255,.5)", padding:'0',}}>Privacy Policy</a>.
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
                <Input style={{width:'100%'}} placeholder='Enter your email address' name='email' width ref={ipt=>{props.self.email = ipt}} onChange={props.self.onChangeInput} onKeyPress={event => { if (event.key === 'Enter') {props.self.onSendEmail('verify')} }}></Input>
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
        <RegistryUserForm onSubmit={(a,b) => console.log('20190906 ProfileForm was submitted', a, b)} userInfo={{username:props.self.state.username, email:props.self.state.email, commitDone:props.self.state.commitDone}}/>
        <Grid.Row>
            <span>
            By clicking SignUp, you agree to our <a href="https://mobiledgex.com/terms-of-use" target="_blank" className="login-text" style={{fontStyle:'italic', textDecoration:'underline', cursor:'pointer', color:"rgba(255,255,255,.5)", padding:'0'}}>Terms of Use</a> and <a href="https://www.mobiledgex.com/privacy-policy" target="_blank" className="login-text" style={{fontStyle:'italic', textDecoration:'underline', cursor:'pointer', color:"rgba(255,255,255,.5)", padding:'0',}}>Privacy Policy</a>.
            </span>
        </Grid.Row>
    </Grid>
)
const customerName = '';
let flag = true;

const SuccessMsg = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            {(props.msg.indexOf('created') > -1) ?
                <span className='title'>User created</span>
            :
            <span className='title' onClick={()=>console.log(props.msg)}>{String(props.msg)}</span>
            }
        </Grid.Row>
        {(props.msg.indexOf('created') !== -1) ?
            <Fragment>
                <Grid.Row>
                    <div className="login-text">{props.self.state.resultMsg}</div>
                </Grid.Row>
                <Grid.Row>
                    <div className="login-text" style={{fontStyle:'italic'}}>If you verify your account, Sign in with your account</div>
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
                 <Button onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() =>  props.self.handleClickLogin('login')}><span>Log In</span></Button>
            </Grid.Column>
        </Grid.Row>
    </Grid>
)
const validate = values => {
    const error= {};
    error.email= '';
    error.name= '';
    var ema = values.email;
    var nm = values.name;
    if(values.email === undefined){
        ema = '';
    }
    if(values.name === undefined){
        nm = '';
    }
    if(ema.length < 4 && ema !== ''){
        error.email= 'too short';
    }
    // if(!ema.includes('@') && ema !== ''){
    //     error.email= '@ not included';
    // }
    if(nm.length > 4){
        //error.name= 'max 8 characters';
    }

    return error;
}

class Login extends Component {
    constructor(props){
        super(props);
        self = this;
        this.state={
            isReady : false,
            focused : false,
            loginSuccess: false,
            session:'close',
            uid:'',
            name:'',
            confirmed: false,
            submit: true,
            disabled: false,
            redirect:false,
            directLink:'/site1',
            mainPath:'/', subPath:'pg=0',
            loginBtnStyle:'loginBtn',
            email:'',
            password:'',
            username:'',
            successCreate:false,
            errorCreate:false,
            loginMode:'login',
            successMsg:'Success create new account',
            loginDanger:'',
            forgotPass:false,
            forgotMessage:false,
            created:false,
            store:null,
            resultMsg:'',
            submitDone: false
        };

        this.onFocusHandle = this.onFocusHandle.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onSignOut = this.onSignOut.bind(this);
        this.params = null;
        this.clientSysInfo = {};
    }
    componentDidMount() {
        //로컬 스토리지의 저장공간에서 로그인 유지 상태 확인

        //브라우져 주소창에 주소를 입력할 경우

        /***
         * TEST success created new account
         ***/
        //this.setState({successCreate:true, loginMode:'signuped', successMsg:'test created'})
        //this.onProgress();

        //this.setState({email:'myemail@test.com', username:'my name'})
        //setTimeout(() =>self.resultCreateUser({data:{message:'good created'}}, {}, self), 2000);
        //inkikim1234


        //remove new user info data from localStorage
            let getUserInfo = localStorage.getItem('userInfo')
        let oldUserInfo = getUserInfo ? JSON.parse(getUserInfo) : null;
        if(oldUserInfo) {
            if(oldUserInfo.date && moment().diff(oldUserInfo.date,'minute') >= 60) {
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

    componentWillReceiveProps (nextProps) {

        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if(nextProps.values) {
            if(nextProps.submitSucceeded) {
                this.setState({email:nextProps.values.email, username:nextProps.values.username})

                //in case user press the button as a submit no matter send params
                localStorage.setItem('userInfo', JSON.stringify({email:nextProps.values.email, username:nextProps.values.username, date:new Date()}))
                if(nextProps.loginMode === 'resetPass'){
                    serviceMC.sendRequest(self, {token: store ? store.resetToken : 'null', method:serviceMC.getEP().RESET_PASSWORD, data : {password:nextProps.values.password}}, self.resultNewPass)
                } else {
                    let requestBody ={
                        method:serviceMC.getEP().CREATE_USER, 
                        data : {
                            name:nextProps.values.username, 
                            password:nextProps.values.password, 
                            email:nextProps.values.email, 
                            clientSysInfo:self.clientSysInfo, 
                            callbackurl : 'https://'+host+'/verify'
                        }
                    }
                    serviceMC.sendRequest(self, requestBody, self.resultCreateUser)
                }
                this.onProgress(true);
            }

        }

        if(nextProps.loginMode === 'login') {
            if(this.state.errorCreate){
                setTimeout(() => self.setState({successCreate:false, errorCreate:false, forgotMessage:false, forgotPass:false}), 3000);
            } else {
                this.setState({successCreate:false, loginMode:'login', forgotMessage:false, forgotPass:false});
            }

        } else if(nextProps.loginMode === 'signup'){
            this.setState({successCreate:false, loginMode:'signup', forgotMessage:false, forgotPass:false, errorCreate:false});
        } else if(nextProps.loginMode === 'forgot'){
            this.setState({successCreate:false, loginMode:'forgot', forgotMessage:false, forgotPass:false});
        } else if(nextProps.loginMode === 'verify'){
            this.setState({successCreate:false, loginMode:'verify', forgotMessage:false, forgotPass:false});
        } else if(nextProps.loginMode === 'resetPass'){
            this.setState({successCreate:false, loginMode:'resetPass', forgotMessage:false, forgotPass:false});
        } else if(nextProps.loginMode === 'signuped' && nextProps.createSuccess){
            localStorage.setItem('userInfo', null)
            let email = nextProps.userInfo && nextProps.userInfo.email;
            let msgTxt = `Thank you for signing up. Please verify your account.
                            In order to login to your account, you must verify your account. 
                            An email has been sent to ${email} with a link to verify your account. 
                            If you have not received the email after a few minutes check your spam folder or resend the verification email.`
            this.setState({successCreate:true, loginMode:'signuped', successMsg:'Account created', resultMsg:msgTxt})
        }

    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return (
    //         nextProps.data != this.props.data ||
    //         nextState.loginSuccess != this.state.loginSuccess
    //     )
    // }


    /****
     * 커스텀 얼럿 : 지우지 말것
     * @param resource
     */
    showAlert = (resource) => {
        let verifyMessage = `Thank you for signing up. Please verify your account. In order to login to your account, you must verify your account. An email has been sent to ${resource.email} with a link to verify your account. If you have not received the email after a few minutes check your spam folder or resend the verification email.`

        Alert.info(<CustomContentAlert position='bottom' customFields={{customerName: resource && resource.name || 'your name'}} email={resource && resource.email || 'yourEmail@@'} message={verifyMessage}/>, {
            position: 'top-right', timeout: 15000, limit:1
        })

    }

    receiveClientIp(IPAddress) {
        if(IPAddress) {
            self.clientSysInfo['clientIP'] = IPAddress;
        } else {
            self.clientSysInfo['clientIP'] = '127.0.0.1';
        }

    }

    resultCreateUser(mcRequest) {
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

    resultNewPass(mcRequest) {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                self.props.handleAlertInfo('success', response.data.message)
                setTimeout(() => self.props.handleChangeLoginMode('login'), 600);
                self.onProgress(false);
            }
        }
    }

    onFocusHandle(value) {
        self.setState({focused: value})
    }
    onSignOut() {
        this.props.requestLogout();
    }
    onConfirm() {
        this.props.requestLogin(this.props.target, {uid:this.uid.value, pwd: this.pwd.value}); // ajax 요청

    }
    onChangeInput = (e, { name, value }) => {
        this.setState({ [name]: value })
    }
    onProgress(value) {
        this.props.handleLoadingSpinner(value)
    }

    /**
     * success login
     * 로그인이 성공했을 때 토큰을 저장한다.
     * @param result
     */
    receiveToken(mcRequest) {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                if (response.data.token) {
                    self.params['userToken'] = response.data.token
                    localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(self.params))
                    self.props.mapDispatchToLoginWithPassword(self.params)

                    self.props.handleChangeLoginMode('login')
                } else {
                    //display error message
                    if (Alert) {
                        self.props.handleAlertInfo('error', response.data.message)
                        //goto reqeuset verify email ....
                        if (response.data.message.indexOf('not verified') > -1) {
                            self.setState({ loginMode: 'verify' })
                        }
                    }
                }
            }
        }
    }

    receiveForgoten(mcRequest) {
        self.props.handleAlertInfo('success', 'Success')
        self.setState({loginMode:'forgotMessage', forgotMessage: true})
    }
    receiveResendVerify(mcRequest) {
        self.props.handleAlertInfo('success', 'Success')
        self.setState({loginMode:'signup', forgotMessage: true})
    }
    returnSignin() {

        setTimeout(()=>self.setState({forgotPass:false, forgotMessage:false, loginMode:'login'}), 1000)
    }
    requestToken(self) {
        serviceMC.sendRequest(self,{ method: serviceMC.getEP().LOGIN, data: { username: self.state.username, password: self.state.password } }, self.receiveToken)
    }
    handleClickLogin(mode) {
        self.setState({loginMode:mode})
    }
   
    onSendEmail(mode) {
        if (mode === 'verify') {
            let requestBody = {method:serviceMC.getEP().RESEND_VERIFY, data:{email: self.state.email, callbackurl: `https://${host}/verify`}}
            serviceMC.sendRequest(self, requestBody, self.receiveResendVerify)
        } else if (mode === 'resetPass') 
        {
            let pass = '';
            let strArr = self.props.params.subPath.split('=')
            let token = strArr[1];
            serviceMC.sendRequest(self, { token: token, method: serviceMC.getEP().RESET_PASSWORD, data: { password: pass } }, this.receiveData, this)

        } else if (mode === 'back') {

            self.setState({ loginMode: 'login' })
        }
        else 
        {
            serviceMC.sendRequest(self, {method: serviceMC.getEP().RESET_PASSWORD, data: { email: self.state.email } }, this.receiveForgoten, this)
        }
    }

    onSubmit() {
        const { username, password } = this.state
        if(!username && !password) {
            self.setState({loginDanger:'Insert Username and Password'});
        } else if(!username) {
            self.setState({loginDanger:'Insert Username'});
        } else if(!password) {
            self.setState({loginDanger:'Insert Password'});
        }
        const params = {
            email: username,
            password: password,
        }
        self.params = params;
        if(username && password) {
            self.setState({loginDanger:''});
            self.requestToken(self)
        };

        // create account
        // MyAPI.signinWithPassword(params)
        //     .then((data) => {
        //
        //         return new Promise((resolve, reject) => {
        //
        //             if (data.status !== 'success'){
        //                 let error_text = 'Error';
        //                 if (data.detail){
        //                     error_text = data.detail
        //                 }
        //                 reject(error_text)
        //
        //             } else {
        //                 // success
        //                 const params = {
        //                     user: data.user,
        //                     login_token: data.login_token
        //                 }
        //
        //                 global.userInfo = {
        //                     username: username,
        //                     password: password
        //                 }
        //
        //                 self.params = params;
        //
        //                 localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(params))
        //                 self.props.mapDispatchToLoginWithPassword(params)
        //
        //                 self.requestToken(self);
        //                 resolve()
        //             }
        //         })
        //     })
        //     .then(() => {
        //         // redirect
        //         //this.props.history.push("/dashboard")
        //     })
        //     .catch((err) => {
        //         console.log("err:", err)
        //
        //         Alert.error(err, {
        //             position: 'top-right',
        //             effect: 'slide',
        //             timeout: 5000
        //         });
        //     })
    }
    /* http://docs.nativebase.io/docs/examples/ReduxFormExample.html */
    //

    render() {
        const { reset, data, loginState } = this.props;
        return (

                (this.state.session !== 'open') ?
                    <Container>
                        {
                            (this.state.loginMode === 'forgot') ?
                                <FormForgotPass self={this} message={this.state.forgotMessage}/>
                            :(this.state.loginMode === 'resetPass')?
                                <ResetPassword self={this}/>
                            :(this.state.loginMode === 'forgotMessage')?
                                <ForgotMessage self={this}/>
                            :(this.state.loginMode === 'verify')?
                                <FormResendVerify self={this}/>
                            :(this.state.loginMode === 'signup')?
                                (this.state.successCreate || this.state.errorCreate)?
                                    <SuccessMsg self={this} msg={this.state.successMsg}></SuccessMsg>
                                    :
                                    <FormSignUpContainer self={this} focused={this.state.focused} loginBtnStyle={this.state.loginBtnStyle} lastFormValue={this.state.lastFromValue}/>
                            :(this.state.loginMode === 'signuped')?
                                (this.state.successCreate || this.state.errorCreate)?
                                    <SuccessMsg self={this} msg={this.state.successMsg}></SuccessMsg>
                                    :<div></div>
                            :(this.state.loginMode === 'login')?
                                <FormContainer self={this} focused={this.state.focused} loginBtnStyle={this.state.loginBtnStyle} login_danger={this.state.loginDanger}/>
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
            createSuccess : createSuccess,
            userInfo: userInfo
        }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleChangeTab: (data) => { dispatch(actions.changeTab(data))},
        mapDispatchToLoginWithPassword: (data) => dispatch(actions.loginWithEmailRedux({ params: data})),
        handleChangeLoginMode: (data) => { dispatch(actions.changeLoginMode(data))},
        handleCreateAccount: (data) => { dispatch(actions.createAccount(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};

export default connect(mapStateToProps, mapDispatchProps)(Login);
