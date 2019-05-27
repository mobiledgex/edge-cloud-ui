import React, {Component, Fragment} from 'react';
import { Container, Button, Checkbox, Form, Label, Grid, Input } from 'semantic-ui-react'
import { Redirect } from 'react-router';
//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';
// alert
import Alert from 'react-s-alert';
// API
import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import * as serviceLogin from '../../services/service_login_api';
import RegistryUserForm from '../reduxForm/RegistryUserForm';
import RegistryResetForm from '../reduxForm/registryResetForm';
import * as service from "../../services/service_compute_service";
/*

 */

const host = window.location.host;
let self = null;

const FormContainer = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>User Login</span>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Input style={{width:'100%'}} placeholder='Username or Email' name='username' width ref={ipt=>{props.self.uid = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column >
                <Input style={{width:'100%'}} placeholder='Password' name='password' type='password' ref={ipt=>{props.self.pwd = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
        </Grid.Row>
        <div className="loginValidation">
            {props.login_danger}
        </div>
        <Grid.Row>
            <Button onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() => props.self.onSubmit()}>Log In</Button>
        </Grid.Row>
        <Grid.Row>
            <div style={{fontStyle:'italic', textDecoration:'underline', cursor:'pointer', display:'inline-block'}} onClick={() => props.self.handleClickLogin('forgot')}>Forgot Password?</div>
            <div style={{fontStyle:'italic', display:'inline-block', margin:'0 10px'}}>or</div>
            <div style={{fontStyle:'italic', textDecoration:'underline', cursor:'pointer', display:'inline-block'}} onClick={() => props.self.handleClickLogin('verify')}>Verify Email?</div>
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
                <Input style={{width:'100%'}} placeholder='Enter your email address' name='email' width ref={ipt=>{props.self.email = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
        </Grid.Row>
        <div className="loginValidation">
            {props.login_danger}
        </div>
        <Grid.Row>
            <Button onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() => props.self.onSendEmail()}>Send Password reset email</Button>
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
            <Button onFocus={() => props.self && props.self.onFocusHandle(true)} onfocusout={() => props.self && props.self.onFocusHandle(false)} onClick={() => props.self.returnSignin()}>Return to sign in</Button>
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
            <div className="login-text" style={{fontStyle:'italic', textDecoration:'underline'}}>By clicking SignUp, you agree to our <a href="https://www.mobiledgex.com/privacy-policy" target="_blank">Terms</a>, <a href="https://www.mobiledgex.com/privacy-policy" target="_blank">Data Policy</a>, and <a href="https://www.mobiledgex.com/privacy-policy" target="_blank">Cookies Policy</a>.</div>
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
                <Input style={{width:'100%'}} placeholder='Enter your email address' name='email' width ref={ipt=>{props.self.email = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
        </Grid.Row>
        <div className="loginValidation">
            {props.login_danger}
        </div>
        <Grid.Row>
            <Button onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() => props.self.onSendEmail('verify')}>Send verify email</Button>
        </Grid.Row>

    </Grid>
)
const FormSignUpContainer = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>Create New Account</span>
        </Grid.Row>
        <RegistryUserForm onSubmit={() => console.log('ProfileForm was submitted')}/>
        <Grid.Row>
            <div className="login-text" style={{fontStyle:'italic', textDecoration:'underline', cursor:'pointer'}}>By clicking SignUp, you agree to our <a href="https://www.mobiledgex.com/privacy-policy" target="_blank">Terms</a>, <a href="https://www.mobiledgex.com/privacy-policy" target="_blank">Data Policy</a>, and <a href="https://www.mobiledgex.com/privacy-policy" target="_blank">Cookies Policy</a>.</div>
        </Grid.Row>
    </Grid>

)
const SuccessMsg = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            {(props.msg.indexOf('created') > -1) ?
                <span className='title'>User created</span>
            :
            <span className='title' onClick={()=>console.log(props.msg)}>{String(props.msg)}</span>
            }
        </Grid.Row>

        <Grid.Row>
            {(props.msg.indexOf('created') !== -1) ?
                <div>
                    <div className="login-text">Thanks for creating a MobiledgeX account! Please verify your account by clicking on the link in your email. Then you'll be able to login and get started.</div>
                    <div className="login-text" style={{fontStyle:'italic', textDecoration:'underline'}}>Sign in with your account</div>
                </div>
                :
                <Fragment>
                    <div className="login-text">Fail to create your account. Please try Again.</div>
                    {/*<Button onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() => console.log(props.self.handleClickLogin)}><span>Sign Up</span></Button> // onClick 동작 안됨*/}
                </Fragment>
            }

        </Grid.Row>
        <Grid.Row>
            <Button onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() =>  props.self.handleClickLogin('login')}><span>Log In</span></Button>
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
            forgotMessage:false
        };

        this.onFocusHandle = this.onFocusHandle.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onSignOut = this.onSignOut.bind(this);
        this.params = null;
    }
    componentDidMount() {
        //로컬 스토리지의 저장공간에서 로그인 유지 상태 확인

        //브라우져 주소창에 주소를 입력할 경우

    }
    componentWillReceiveProps (nextProps) {
        console.log('submit props ---- ', nextProps)
        if(nextProps.values) {
            if(nextProps.submitSucceeded) {
                let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
                if(store && store.userToken) {

                }
                if(nextProps.loginMode === 'resetPass'){
                    service.getMCService('newpass',{ email:nextProps.values.email}, self.resultNewPass, self)
                } else {
                    serviceLogin.createUser('createUser',{name:nextProps.values.username, password:nextProps.values.password, email:nextProps.values.email}, self.resultCreateUser, self)
                }
            }

        }

        if(nextProps.loginMode === 'login') {
            if(this.state.errorCreate){
                setTimeout(() => self.setState({successCreate:false, errorCreate:false, forgotMessage:false, forgotPass:false}), 3000);
            } else {
                this.setState({successCreate:false, loginMode:'login', forgotMessage:false, forgotPass:false});
            }

        } else if(nextProps.loginMode === 'signup'){
            this.setState({successCreate:false, loginMode:'signup', forgotMessage:false, forgotPass:false});
        } else if(nextProps.loginMode === 'forgot'){
            this.setState({successCreate:false, loginMode:'forgot', forgotMessage:false, forgotPass:false});
        } else if(nextProps.loginMode === 'verify'){
            this.setState({successCreate:false, loginMode:'verify', forgotMessage:false, forgotPass:false});
        } else if(nextProps.loginMode === 'resetPass'){
            this.setState({successCreate:false, loginMode:'resetPass', forgotMessage:false, forgotPass:false});
        }

    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return (
    //         nextProps.data != this.props.data ||
    //         nextState.loginSuccess != this.state.loginSuccess
    //     )
    // }

    resultCreateUser(result) {
        console.log('success create......', result.data, JSON.stringify(result.data), typeof result.data)
        let message = (result.data.message)? result.data.message : null;
        console.log('msg-',message)
        if(message.indexOf('duplicate') > -1){
            message = 'Already exist ID!'
        }
        if(message.indexOf('Email' && 'already') > -1){
            message = 'Email already in use'
        }
        //TODO 20190416 - redux
        self.setState({successMsg:message ? message:self.state.successMsg, errorCreate: true, signup:true});
    }
    resultNewPass(result) {
        console.log('success update as new pass......', result.data, JSON.stringify(result.data), typeof result.data)
        let message = (result.data.message)? result.data.message : null;
        console.log('msg-',message)

        //TODO 20190416 - redux
        self.setState({successMsg:message ? message:self.state.successMsg, errorCreate: true, signup:true});
    }

    onFocusHandle(value) {
        console.log('on focus button', value)
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
    receiveToken(result) {

        console.log('receive token..', result.data)
        if(result.data.token) {
            console.log('success....receive token.....', result.data.token, 'self params == ', self.params)

            self.params['userToken'] = result.data.token
            localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(self.params))
            self.props.mapDispatchToLoginWithPassword(self.params)
        } else {
            //display error message
            if(Alert){
                Alert.error(result.data.message, {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 5000
                });
            } else {
                alert(result.data.message)
            }

        }
    }
    receiveForgoten(result) {
        Alert.success('Success ', {
            position: 'top-right',
            effect: 'slide',
            timeout: 5000
        });
        self.setState({loginMode:'forgotMessage', forgotMessage: true})
    }
    receiveResendVerify(result) {
        Alert.success('Success ', {
            position: 'top-right',
            effect: 'slide',
            timeout: 5000
        });
        self.setState({loginMode:'signup', forgotMessage: true})
    }
    returnSignin() {
        setTimeout(()=>self.setState({forgotPass:false, forgotMessage:false, loginMode:'login'}), 1000)
    }
    requestToken(self) {
        serviceLogin.getMethodCall('requestToken', {username:self.state.username, password:self.state.password}, self.receiveToken)

        //self.receiveToken({data:{token:'my test token'}})
    }
    handleClickLogin(mode) {
        this.props.handleChangeLoginMode(mode)
    }
    onSendEmail(mode) {
        if(mode === 'verify') {
            serviceLogin.resendVerify('resendverify',
                {
                    email:self.state.email,
                    callbackurl : 'https://'+host+'/verify'
                }, self.receiveResendVerify)
        } else if(mode === 'resetPass') {
            let pass = '';
            let strArr = self.props.params.subPath.split('=')
            let token = strArr[1];
            service.getMCService('ResetPassword',{service:'passwordreset',token:token, password:pass}, this.receiveData, this)

        }
        else {
            serviceLogin.resetPassword('passwordresetrequest',
                {email:self.state.email,
                    callbackurl : "https://"+host+"/passwordreset"
                }, self.receiveForgoten)
        }

    }
    onSubmit() {
        const { username, password } = this.state
        if(!username && !password) {
            self.setState({loginDanger:'Insert Username and password'});
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
        self.requestToken(self);

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
        console.log(this.state.session, this.state.redirect)
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
                                    <FormSignUpContainer self={this} focused={this.state.focused} loginBtnStyle={this.state.loginBtnStyle}/>
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
    return {
            values: profile ? profile.values : null,
            submitSucceeded: profile ? profile.submitSucceeded : null,
            loginMode: loginmode ? loginmode.mode : null
        }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleChangeTab: (data) => { dispatch(actions.changeTab(data))},
        mapDispatchToLoginWithPassword: (data) => dispatch(actions.loginWithEmailRedux({ params: data})),
        handleChangeLoginMode: (data) => { dispatch(actions.changeLoginMode(data))}
    };
};

export default connect(mapStateToProps, mapDispatchProps)(Login);
