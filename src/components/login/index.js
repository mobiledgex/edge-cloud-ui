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
                <Input placeholder='Username' name='email' width ref={ipt=>{props.self.uid = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
            <Grid.Column >
                <Input  placeholder='Password' name='password' type='password' ref={ipt=>{props.self.pwd = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Button  onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() => props.self.onSubmit()}>Log In</Button>
        </Grid.Row>
    </Grid>

)
const FormSignUpContainer = (props) => (
    <Grid className="signUpBD">
        <Grid.Row>
            <span className='title'>Create New Account</span>
        </Grid.Row>
        {/* <Grid.Row columns={2}>
            <Grid.Column>
                <Input placeholder='First Name' name='firstname' width ref={ipt=>{props.self.first = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
            <Grid.Column >
                <Input  placeholder='Last Name' name='lastname' ref={ipt=>{props.self.last = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
        </Grid.Row> */}
        <Grid.Row>
            <Grid.Column>
                <Input placeholder='username' name='username' style={{width:'100%'}} ref={ipt=>{props.self.username = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Input style={{width:'100%'}} placeholder='Password' name='password' type='password' ref={ipt=>{props.self.pwd = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Input placeholder='E-mail' name='email' style={{width:'100%'}} ref={ipt=>{props.self.email = ipt}} onChange={props.self.onChangeInput}></Input>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Button  onFocus={() => props.self.onFocusHandle(true)} onfocusout={() => props.self.onFocusHandle(false)} onClick={() => props.self.onSubmit()}>Sign Up</Button>
        </Grid.Row>
        <Grid.Row>
            <div style={{fontStyle:'italic', textDecoration:'underline'}}>By clicking Sign Up, you agree to our <a href="#">Terms</a>, <a href="#">Data Policy</a>, and <a href="#">Cookies Policy</a>.</div>
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
            username:''
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
        console.log('user...', nextProps.user)
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return (
    //         nextProps.data != this.props.data ||
    //         nextState.loginSuccess != this.state.loginSuccess
    //     )
    // }



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
        }
    }
    requestToken(self) {
        serviceLogin.getMethodCall('requestToken', {username:self.state.email, password:self.state.password}, self.receiveToken)

        //self.receiveToken({data:{token:'my test token'}})
    }
    onSubmit() {

        const { email, password } = this.state
        const params = {
            email: email,
            password: password,
        }

        // create account
        MyAPI.signinWithPassword(params)
            .then((data) => {

                return new Promise((resolve, reject) => {

                    if (data.status !== 'success'){
                        let error_text = 'Error';
                        if (data.detail){
                            error_text = data.detail
                        }
                        reject(error_text)

                    } else {
                        // success
                        const params = {
                            user: data.user,
                            login_token: data.login_token
                        }
                        //TODO: 2019-03-23
                        global.userInfo = {
                            username: email,
                            password: password
                        }

                        self.params = params;

                        localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(params))
                        self.props.mapDispatchToLoginWithPassword(params)

                        self.requestToken(self);
                        resolve()
                    }
                })
            })
            .then(() => {
                // redirect
                //this.props.history.push("/dashboard")
            })
            .catch((err) => {
                console.log("err:", err)

                Alert.error(err, {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 5000
                });
            })
    }
    /* http://docs.nativebase.io/docs/examples/ReduxFormExample.html */
    render() {
        const { reset, data, loginState } = this.props;
        console.log(this.state.session, this.state.redirect)
        return (

                (this.state.session !== 'open') ?
                    <Container>
                        <FormContainer self={this} focused={this.state.focused} loginBtnStyle={this.state.loginBtnStyle}/>
                        <FormSignUpContainer self={this} focused={this.state.focused} loginBtnStyle={this.state.loginBtnStyle}/>
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


function mapStateToProps ( {user} ) {
    return {
        user
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleChangeTab: (data) => { dispatch(actions.changeTab(data))},
        mapDispatchToLoginWithPassword: (data) => dispatch(actions.loginWithEmailRedux({ params: data}))
    };
};

export default connect(mapStateToProps, mapDispatchProps)(Login);
