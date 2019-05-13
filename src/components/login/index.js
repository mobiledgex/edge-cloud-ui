import React, { Component } from 'react';
import { Container, Button, Checkbox, Form, Label, Grid, Input } from 'semantic-ui-react'
import { Redirect } from 'react-router';
//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';
// alert
import Alert from 'react-s-alert';
// API
import * as MyAPI from '../utils/MyAPI'
import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import * as serviceLogin from '../../services/service_login_api';
import RegistryUserForm from '../reduxForm/RegistryUserForm';
import * as computeService from "../../services/service_compute_service";
/*

 */
let self = null;

const FormContainer = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>User Login</span>
        </Grid.Row>
        <Grid.Row columns={2}>
            <Grid.Column>
                <Input placeholder='Username' name='username' width ref={ipt=>{props.self.uid = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
            <Grid.Column >
                <Input  placeholder='Password' name='password' type='password' ref={ipt=>{props.self.pwd = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
        </Grid.Row>
        <div className="loginValidation">
            {props.login_danger}
        </div>
        <Grid.Row>
            <Button  onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() => props.self.onSubmit()}>Log In</Button>
        </Grid.Row>
        <Grid.Row>
            <div style={{fontStyle:'italic', textDecoration:'underline', cursor:'pointer'}} onClick={() => props.self.setState({forgotPass:true})}>Forgot Password?</div>
        </Grid.Row>
    </Grid>

)
const FormForgotPass = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>Reset your password</span>
        </Grid.Row>
        <Grid.Row>
            <span>Enter your email address and we will <br/> send you a link to reset your password.</span>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Input placeholder='Enter your email address' name='email' width ref={ipt=>{props.self.email = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
        </Grid.Row>
        <div className="loginValidation">
            {props.login_danger}
        </div>
        <Grid.Row>
            <Button  onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() => props.self.onSendEmail()}>Send Password reset email</Button>
        </Grid.Row>

    </Grid>
)
const ForgotMessage = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>Reset your password</span>
        </Grid.Row>
        <Grid.Row>
            <span>Check your email for a link to reset your password. <br/>
                If it doesn’t appear within a few minutes, <br/>
                check your spam folder.</span>
        </Grid.Row>
        <Grid.Row>
            <Button  onFocus={() => props.self && props.self.onFocusHandle(true)} onfocusout={() => props.self && props.self.onFocusHandle(false)} onClick={() => props.self.returnSignin()}>Return to sign in</Button>
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
            <div style={{fontStyle:'italic', textDecoration:'underline'}}>By clicking SignUp, you agree to our <a href="https://www.mobiledgex.com/privacy-policy" target="_blank">Terms</a>, <a href="https://www.mobiledgex.com/privacy-policy" target="_blank">Data Policy</a>, and <a href="https://www.mobiledgex.com/privacy-policy" target="_blank">Cookies Policy</a>.</div>
        </Grid.Row>
    </Grid>

)
const SuccessMsg = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>{String(props.msg)}</span>
        </Grid.Row>

        <Grid.Row>
            <div style={{fontStyle:'italic', textDecoration:'underline'}}>Sign in with your account</div>
        </Grid.Row>
        <Grid.Row>
            <Button><span>Login</span></Button>
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
            signup: false,
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
                serviceLogin.createUser('createUser',{name:nextProps.values.username, password:nextProps.values.password, email:nextProps.values.email}, self.resultCreateUser, self)
            }

        }

        if(nextProps.loginMode === 'login') {
            if(this.state.errorCreate){
                setTimeout(() => self.setState({successCreate:false, signup:true, errorCreate:false, forgotMessage:false, forgotPass:false}), 3000);
            } else {
                this.setState({successCreate:false, signup:false, forgotMessage:false, forgotPass:false});
            }

        } else if(nextProps.loginMode === 'signup'){
            this.setState({successCreate:false, signup:true, forgotMessage:false, forgotPass:false});
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
        //TODO 20190416 - redux
        self.setState({successMsg:message ? message:self.state.successMsg, errorCreate: true, signup:true});
    }

    onFocusHandle(value) {
        console.log('on focust button', value)
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
            Alert.error(result.data.message, {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
        }
    }
    receiveForgoten(result) {
        Alert.success('Success ', {
            position: 'top-right',
            effect: 'slide',
            timeout: 5000
        });
        self.setState({forgotPass: false, forgotMessage: true})
    }
    returnSignin() {
        setTimeout(()=>self.setState({forgotPass:false, forgotMessage:false, signup:false}), 1000)
    }
    requestToken(self) {
        serviceLogin.getMethodCall('requestToken', {username:self.state.username, password:self.state.password}, self.receiveToken)

        //self.receiveToken({data:{token:'my test token'}})
    }
    onSendEmail() {
        serviceLogin.resetPassword('passwordresetrequest',
            {email:self.state.email,
                callbackurl : "https://console.mobiledgex.net/passwordreset"
            }, self.receiveForgoten)
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
                            (this.state.forgotPass) ?
                                <FormForgotPass self={this} message={this.state.forgotMessage}/>
                            :(this.state.forgotMessage)?
                                <ForgotMessage self={this}/>
                            :(this.state.signup)?
                                (this.state.successCreate || this.state.errorCreate)?
                                    <SuccessMsg self={this} msg={this.state.successMsg}></SuccessMsg>
                                    :
                                    <FormSignUpContainer self={this} focused={this.state.focused} loginBtnStyle={this.state.loginBtnStyle}/>
                            :
                                <FormContainer self={this} focused={this.state.focused} loginBtnStyle={this.state.loginBtnStyle} login_danger={this.state.loginDanger}/>

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
                                let profile = state.form.profile;
                                let loginmode = state.loginMode;
    return {
            values: profile ? profile.values : null,
            submitSucceeded: profile ? profile.submitSucceeded : null,
            loginMode: loginmode ? loginmode.mode : {}
        }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleChangeTab: (data) => { dispatch(actions.changeTab(data))},
        mapDispatchToLoginWithPassword: (data) => dispatch(actions.loginWithEmailRedux({ params: data}))
    };
};

export default connect(mapStateToProps, mapDispatchProps)(Login);
