
//TODO:
//tab 클릭 이벤트 받기 redux 구조
//tab 클릭 이벤트 발생하면 페이지 넘기, 페이지 넘김 애니메이션 적용

import React from 'react/lib/React';
//
import BrowserRouter from 'react-router-dom/es/BrowserRouter';
import HashRouter from 'react-router-dom/es/HashRouter';
import { withRouter } from 'react-router-dom';
//

import Accounts from '../container/accounts';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

//service
import * as service from '../services/service_hipass';
//
// HTML5 History API 지원여부 파악
const isBrowserHistory = window.history.pushState;
const Router = isBrowserHistory ? BrowserRouter : HashRouter;



class Intro extends React.Component  {
    constructor(props){
        super(props)
        this.state = {
            receivedData:null,
            url:''
        }
    }
    clearData() {


        //TODO : 각 페이지에 데이터 전달하기 위해 redux 엑션 발생
        this.props.handleInjectData(null);

    }
    /*********************
    * Call Data from Server as REST
    **********************/
    componentWillMount() {
        //http://192.168.232.132:8080/station/mlogin.do?method=logout

    }
    componentDidMount() {
        //로그인 여부 체크
        let sessionData = localStorage.getItem('sessionData');
        if(sessionData && JSON.parse(sessionData).session === 'open') {
            console.log('login session state == open')
        } else {
            service.getLoginStatus('mlogin.do?method=login', this.receiveAccountResult)
        }

    }
    componentWillReceiveProps(nextProps) {
        console.log('receive props ----- '+JSON.stringify(nextProps))


    }
    shouldComponentUpdate(nextProps, nextState) {
        //console.log("업데이트 할지 말지: " + JSON.stringify(nextProps) + " " + JSON.stringify(nextState));
        return true;
    }
    receiveAccountResult(result) {
        console.log('login state == '+JSON.stringify(result))
        if(result.result){
            //로그인 됨
            localStorage.setItem('sessionData', JSON.stringify({"session":"open"}));
        } else {
            // setter
            localStorage.setItem('sessionData', JSON.stringify({"session":"close"}));
        }
    }
    render() {
        console.log('url=='+this.props.url)
        return (
            <Accounts></Accounts>
        );
    }
};

const mapStateToProps = (state) => {
    console.log('tab -- '+state.tabChanger.tab)
    let tab = state.tabChanger.tab;
    return {
        tabName: tab
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleInjectData: (data) => { dispatch(actions.injectData(data))}
    };
};
Intro.defaultProps = {
    tabName : 0,
    onReceive: {data:null}
}
export default withRouter(connect(mapStateToProps, mapDispatchProps)(Intro));
