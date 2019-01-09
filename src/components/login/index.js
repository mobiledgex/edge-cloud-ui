import React, { Component } from 'react';
import { Container, Button, Checkbox, Form, Label } from 'semantic-ui-react'
import { Redirect } from 'react-router';
//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';

let self = null;
const FormExampleForm = (props) => (
    <Form className="loginWrap">
        <Form.Field>
            <label style={{color:'#ffffff', fontSize:15}}>UserName</label>
            <input placeholder='UserName' ref={ipt=>{props.self.uid = ipt}} />
        </Form.Field>
        <Form.Field>
            <label style={{color:'#ffffff', fontSize:15}}>PASSWORD</label>
            <input placeholder='PASSWORD' ref={ipt=>{props.self.upw = ipt}}/>
        </Form.Field>
        <Form.Field className="rememberAccount" >
            <Checkbox label='저장'/>
        </Form.Field>
        <Button type='submit' className="loginBtn" onClick={props.self.onConfirm.bind(props.self)}>LOGIN</Button>
    </Form>
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
            mainPath:'/', subPath:'pg=0'
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
        console.log('receive props in login === '+nextProps.loginState)
        let pathName = window.location.pathname+window.location.search;
        let paths = (pathName.indexOf('?') > -1) ? pathName.split('?') : [pathName, ''];
        let mainPath = paths[0];
        let subPath = paths[1];
        let trmF = window.location.search.indexOf('=');
        let trmB = window.location.search.substring(trmF + 1, trmF + 2)

        //success loginState ===========>>>>>>>>>>>>>>>>>
        //브라우져 주소 값을 받아서 다이렉트링크 처리
        if(nextProps.loginState) {
            //주소 값 리덕스로 처리
            this.props.handleChangeSite({
                mainPath:(pathName === '/') ? this.state.directLink : mainPath,
                subPath:subPath
            })
            this.props.handleChangeTab(parseInt((trmB !== '') ? trmB : 0));

            self.setState({redirect: true, session: 'open', directLink: pathName});
            self.forceUpdate();
        }

        //localStorage.setItem(key, JSON.stringify(result.hits));
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.data != this.props.data ||
            nextState.loginSuccess != this.state.loginSuccess
        )
    }



    onFocusHandle(event) {
        this.setState({focused: true})
    }
    onSignOut() {
        this.props.requestLogout();
    }
    onConfirm() {
        this.props.requestLogin(this.props.target, {uid:this.uid.value, pwd: this.upw.value}); // ajax 요청

    }
    /* http://docs.nativebase.io/docs/examples/ReduxFormExample.html */
    render() {
        const { reset, data, loginState } = this.props;
        console.log(this.state.session, this.state.redirect)
        return (

                (this.state.session !== 'open') ?

                <FormExampleForm self={this} />

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


const mapStateToProps = (state, ownProps) => {
    return {
        data: state.user
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleChangeTab: (data) => { dispatch(actions.changeTab(data))}
    };
};

export default connect(mapStateToProps, mapDispatchProps)(Login);
