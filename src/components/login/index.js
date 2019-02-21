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
/*

 */
let self = null;

const FormContainer = (props) => (
    <Grid>
        <Grid.Row>
            <span className='title'>User Login</span>
        </Grid.Row>
        <Grid.Row columns={2}>
            <Grid.Column>
                <Input placeholder='ID' name='email' width ref={ipt=>{props.self.uid = ipt}} onChange={props.self.onChangeInput}></Input>
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
            password:''
        };

        this.onFocusHandle = this.onFocusHandle.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onSignOut = this.onSignOut.bind(this);
    }
    componentDidMount() {
        //로컬 스토리지의 저장공간에서 로그인 유지 상태 확인

        //브라우져 주소창에 주소를 입력할 경우

    }
    componentWillReceiveProps (nextProps) {

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
                            login_token: data.login_token,
                            email:email
                        }

                        localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(params))
                        this.props.mapDispatchToLoginWithPassword(params)
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

                <FormContainer self={this} focused={this.state.focused} loginBtnStyle={this.state.loginBtnStyle}/>

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
