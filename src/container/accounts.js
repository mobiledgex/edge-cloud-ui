import React, { Component } from 'react';
import { Label, Loader } from 'semantic-ui-react'
import RSAKey from 'react-native-rsa';
import Login from '../components/login';

//ajax test

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
//service
import * as service from '../services';



let self = null;
class Accounts extends Component {
    constructor(props){
        super(props);
        this.state={
            isReady : true,
            isError: false,
            focused : false,
            loginState: false,
            uid:null,
            publicKey:null,
            exponent:null
        };
        this.rsa = null;
        self = this;
        const bits = 1024;
        const exponent = '10001'; // must be a string. This is hex string. decimal = 65537
        self.rsa = new RSAKey();
        self.rsa.generate(bits, exponent);
    }
    componentDidMount() {
        //인증키 가져오기 실패할 경우
        // setTimeout(function(){
        //   if(!self.state.isReady){
        //       service.abortQuery('10001')
        //   }
        // }, 7000)
        // getter
        let sessionData = localStorage.getItem('sessionData');
        let localstore = (typeof sessionData === 'string') ? JSON.parse(sessionData) : null;

        if(!localstore || localstore.session === 'close') {
            this.requestPubKey();
        } else {
            this.setState({loginState: true})
        }



    }
    requestPubKey() {

        setTimeout(function(){
            service.getPublicAccountKey('mlogin.do?method=login_view','10001', self.receiveAccountKey)
        }, 200)

    }

    receiveAccountKey(receive) {
        //console.log('account receive  public key ---->> '+JSON.stringify(receive));
        if(receive === 'error'){
            self.setState({isError:true})

        } else {

            self.setState({publicKey: receive.publicKeyModulus, exponent:receive.publicKeyExponent, isReady: true})
        }
    }

    receiveData(data) {
        //Decrypt
        // var privateKey = this.rsa.getPrivateString(); // return json encoded string
        // this.rsa.setPrivateString(privateKey);
        // var decrypted = rsa.decrypt(encrypted); // decrypted == originText
        console.log('receive data in account --- '+JSON.stringify(data));
        let userDatas = null;
        if(data.result) {
            userDatas = {};
            userDatas = {"session":"open"}
            self.props.handleChangeTab(0); //로그인 성공시 첫번째 탭,페이지
            self.setState({loginState: true})

        } else {
            //alert for error....
            userDatas = {"session":"error", error:data.error || '다시 시도하여주세요'};
            console.log('로그인 실패')
        }

        // setter
        localStorage.setItem('sessionData', JSON.stringify(userDatas));
        self.props.handleInjectData(userDatas);

        if(!data.result) self.requestPubKey(); //인증키 제 요청



    }
    requestLogin = (self, accounts) => {
        //1. Encrypt
        //const publicKey = this.rsa.getPublicString(); // return json encoded string
        const _publicKey = {};
        _publicKey.n = self.state.publicKey;
        _publicKey.e = self.state.exponent;
        self.rsa.setPublicString(JSON.stringify(_publicKey));
        const rsaParams = {};
        let userID = accounts.uid;
        let userPW = accounts.pwd;
        rsaParams.securedUserid = self.rsa.encrypt(userID);
        rsaParams.securedPasswd = self.rsa.encrypt(userPW);
        setTimeout(function() {
            service.postUserAccount('mlogin.do?method=login',rsaParams, self.receiveData.bind(self));
        }, 500)
    }

    requestLogout() {
        let uid = '';
        // load


        service.getHipassMonitor('mlogin.do?method=logout',uid, null, 60);
        //로그인 전 메인 페이지로 이동
        self.setState({loginState: false})

    }
    /* http://docs.nativebase.io/docs/examples/ReduxFormExample.html */
    render() {
        return (




                    (this.state.isReady) ? <Login requestLogin={this.requestLogin} requestLogout={this.requestLogout} target={this} loginState={this.state.loginState}/>
                : (this.state.isError) ? <Label>Network Error!</Label>
            : <Loader />



        );
    }
}

// const mapStateToProps = (state, ownProps) => {
//     return {
//         data: state.receiveDataReduce.data,
//         tabIdx: state.tabChanger
//     };
// };
const mapDispatchProps = (dispatch) => {
    return {
        handleInjectData: (data) => { dispatch(actions.setUser(data)) },
        handleChangeTab: (data) => { dispatch(actions.changeTab(data)) }
    };
};

export default connect(null, mapDispatchProps)(Accounts);
