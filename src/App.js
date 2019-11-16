import React, { Component } from 'react';
import { Grid, Button, Container } from 'semantic-ui-react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Alert from 'react-s-alert';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'semantic-ui-css/semantic.min.css';
import {GridLoader, PulseLoader, ClipLoader} from "react-spinners";
//redux
import { connect } from 'react-redux';
import * as actions from './actions';
import * as Service from './services/service_login_api';
import * as computeService from './services/service_compute_service';
// API

import { LOCAL_STRAGE_KEY } from './components/utils/Settings'
//insert pages
import EntranceGlob from './sites/entranceGlob';
import SiteTwo from "./sites/siteTwo";
import SiteThree from "./sites/siteThree";
import SiteFour from "./sites/siteFour";
import CreateAccount from './components/login/CreateAccont';
import history from './history';
import VerifyContent from './container/verifyContent';
import './css/index.css';

import './css/pages/audit.css';
import './css/components/timelineH.css';

let self = null;

const asyncComponent = getComponent => (
    class AsyncComponent extends Component {
        constructor() {
            super();
            this.state = {Component: AsyncComponent.Component};
            this.routed = false;
        }
        componentWillMount() {
            if (!this.state.Component) {
                getComponent().then(Component => {
                    AsyncComponent.Component = Component;
                    this.setState({Component});
                });
            }
        }
        render() {
            const {Component} = this.state;
            if(Component) {
                return <Component {...this.props} />;
            }
            return null;
        }
    }
);


/**
 *
 * @param props : 커스텀
 * @param props2 : 라우터에서 주어진 값
 * @returns {*}
 * @constructor
 */
const DashboardContainer = ( props, props2) => {

    if(props.mainPath === '/') props.mainPath = '/site1';
    if(props2.location.search) props2.location.search = props2.location.search.replace('?', '')
    let _params = {mainPath:props.mainPath, subPath:(props2.match.params.page) ? props2.match.params.page : (props2.location.search) ? props2.location.search : 'pg=0'};
    global.areaCode = _params;

    /////////////////////////////////////////
    // Login check
    /////////////////////////////////////////
    const storage_data = localStorage.getItem(LOCAL_STRAGE_KEY)
    if(self.routed){
        self.profileView();
    } else {
        //if(storage_data) Service.getCurrentUserInfo('currentUser', {}, self.receiveCurrentUser, self)
    }
    let storeData= localStorage.getItem('PROJECT_INIT')


    if(storeData && !loaded) {
        loaded = true;
        let userInfo = JSON.parse(storeData);
        if(userInfo.userToken) {
            Service.getCurrentUserInfo('currentUser', {token:userInfo.userToken}, self.receiveCurrentUser, self)
        }


    } else {

    }





    //단 한번만 라우터 정보 기록 - 랜더링 타이밍 무한루프 피함
    if(!self.routed){
        self.props.handleChangeSite({mainPath:_params.mainPath, subPath:_params.subPath})
        self.props.handleChangeTab(
                (_params.subPath === 'pg=0') ? 0 :
                (_params.subPath === 'pg=1') ? 1 :
                (_params.subPath === 'pg=2') ? 2 :
                (_params.subPath === 'pg=3') ? 3 :
                (_params.subPath === 'pg=4') ? 4 :
                (_params.subPath === 'pg=5') ? 5 :
                0
        )

        self.routed = true;
    } else {
        self.routeCnt = 1;
    }


    if(props.mainPath === '/logout') {
        localStorage.removeItem(LOCAL_STRAGE_KEY);
        localStorage.setItem('userInfo', null)
        localStorage.setItem('sessionData', null)
        localStorage.removeItem('selectOrg')
        localStorage.setItem('selectRole', null)
        localStorage.setItem('selectMenu', null)
        self.props.mapDispatchToLoginWithPassword({})

    }
    if(props.mainPath === '/passwordreset') {
        let token = props2.location.search.replace('token=', '')
        let params = {};
        params['resetToken'] = token
        localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(params))
    }




    if (!storage_data && props.mainPath !== '/createAccount' && props.mainPath !== '/verify' && props.mainPath !== '/passwordreset') {
        let mainPath = '/site1';
        let subPath = 'pg=1';
        history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        history.location.search = subPath;
        props.mainPath = '/site1'

    } else {
        // history.push({
        //     pathname: _params.mainPath,
        //     search: _params.subPath,
        //     state: { some: 'state' }
        // });
        // history.location.search = _params.subPath;
    }

    localStorage.setItem('siteMain', props.mainPath)

    return(
        (self.routeCnt === 1) ?

        <div style={{height:'100%', width:'100%', backgroundColor:'transparent'}}>
                {props.mainPath === '/logout' && <EntranceGlob params={_params} history={(props2.history)?props2.history:null} />}
                {props.mainPath === '/' && <EntranceGlob params={_params} history={(props2.history)?props2.history:null} />}
                {props.mainPath === '/site1' && <EntranceGlob params={_params} history={(props2.history)?props2.history:null}/>}
                {props.mainPath === '/site2' && <SiteTwo params={_params} history={(props2.history)?props2.history:null}/>}
                {props.mainPath === '/site3' && <SiteThree params={_params} history={(props2.history)?props2.history:null} selectedCloudlet={self.state.selectedCloudlet}/>}
                {props.mainPath === '/site4' && <SiteFour params={_params} history={(props2.history)?props2.history:null}/>}
                {props.mainPath === '/createAccount' && <CreateAccount params={_params} history={(props2.history)?props2.history:null}/>}
                {props.mainPath === '/passwordreset' && <EntranceGlob params={_params} history={(props2.history)?props2.history:null} reset={true}/>}
                {props.mainPath === '/verify' && <VerifyContent params={_params} history={(props2.history)?props2.history:null}/>}
            <Alert stack={{limit: 3}} />
            {(self.props.creatingSpinner==true)?
            <div className="loadingBox" style={{zIndex:99999}}>
                <GridLoader
                    sizeUnit={"px"}
                    size={25}
                    color={'#70b2bc'}
                    loading={self.props.creatingSpinner}
                    //loading={true}
                />
                <span className={self.props.creatingSpinner ? '' : 'loading'} style={{fontSize:'22px', color:'#70b2bc'}}>Creating...</span>
            </div>:null}

        </div>
        :
        <div></div>
    )

}


let loaded = false;
class App extends Component {
    constructor() {
        super();
        self = this;
        this.clickTab = false;
        this.routeCnt = 0;

    }
    state = { animation: 'ani', duration: 500, user:{}, selectedCloudlet:'',tokenState:'' }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    //go to NEXT
    goToNext(main, sub) {
        if(main == '/logout') {
            localStorage.removeItem('selectOrg');
            localStorage.removeItem('selectRole')
            localStorage.removeItem('selectMenu')
            localStorage.removeItem(LOCAL_STRAGE_KEY);
        }
        //브라우져 입력창에 주소 기록
        let mainPath = main;
        let subPath = sub;
        history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' },
            userInfo:{info:null}
        });
        history.location.pathName = main;
        history.location.search = subPath;
        self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})
        self.props.handleChangeLoginMode('logout');
    }

    receiveCurrentUser(result) {
        if(result.data && result.data.message) {

            if(result.data.message.indexOf('Expired') > -1) {

                setTimeout(() => self.goToNext('/logout',''),4000);
                Alert.error('Login timeout expired. Please login again', {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 50000
                });
            } else {

                // Alert.error(result.data.message, {
                //     position: 'top-right',
                //     effect: 'slide',
                //     timeout: 5000
                // });
            }

            setTimeout(() => loaded = false)
        }
    }
    receiveController = (result) => {
        let regions = [];

        if(result) {
            if(result.data) {
                result.data.map((data) => {
                    regions.push(data.Region)
                })
            } else {

            }

            //localStorage.setItem('regions', regions)
            self.props.handleRegionInfo(regions)
        }
    }

    profileView() {
        //const storage_data = localStorage.getItem(LOCAL_STRAGE_KEY)
        if(!localStorage.PROJECT_INIT) return;
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';


    }

    componentDidMount() {
        
        let pathName = window.location.pathname;

        //this.router.history.push(pathName);
        
        
        const storage_data = localStorage.getItem(LOCAL_STRAGE_KEY)
        if (!storage_data) {
            return;
        }
        const storage_json = JSON.parse(storage_data)
        if ( storage_json ) {
            self.props.mapDispatchToLoginWithPassword(storage_json)
        }
    }
    componentWillReceiveProps(nextProps) {
        // let props = nextProps;
        // if(nextProps.clickTab) {
        //     let params = {params:{page:'pg='+nextProps.clickTab}}
        //     DashboardContainer({mainPath:nextProps.siteName.site.mainPath}, {match:params})
        // }
        if(nextProps.siteName !== this.props.siteName) {
            //this.setState({selectedCloudlet:nextProps.siteName.cloudlet})
            let scope = this;
            // Login check
            this.loaded = false;
            if(localStorage && localStorage.PROJECT_INIT) {
                let store = JSON.parse(localStorage.PROJECT_INIT);
                if(store.userToken) computeService.showController('ShowController', {token:store.userToken}, scope.receiveController);
            }
        }

    }
    render() {
        return (
            <Router history={history} ref={router=> this.router = router}>
                <div style={{width:'100%', height:'100%'}}>
                    <Route exact path='/logout' component={DashboardContainer.bind(this, {mainPath:'/logout'})} />
                    <Route exact path='/' component={DashboardContainer.bind(this, {mainPath:'/site1'})} />
                    <Route exact path='/site1/:page' component={DashboardContainer.bind(this, {mainPath:'/site1'})} />
                    <Route exact path='/site1' component={DashboardContainer.bind(this, {mainPath:'/site1'})} />
                    <Route exact path='/site2/:page' component={DashboardContainer.bind(this, {mainPath:'/site2'})} />
                    <Route exact path='/site2' component={DashboardContainer.bind(this, {mainPath:'/site2'})} />
                    <Route exact path='/site3/:page' component={DashboardContainer.bind(this, {mainPath:'/site3'})} />
                    <Route exact path='/site3' component={DashboardContainer.bind(this, {mainPath:'/site3'})} />
                    <Route exact path='/site4' component={DashboardContainer.bind(this, {mainPath:'/site4'})} />
                    <Route exact path='/site4/:page' component={DashboardContainer.bind(this, {mainPath:'/site4', ...history.location.search})} />
                    <Route exact path='/site5' component={DashboardContainer.bind(this, {mainPath:'/site5'})} />
                    <Route exact path='/createAccount' component={DashboardContainer.bind(this, {mainPath:'/createAccount'})} />
                    <Route exact path='/passwordreset' component={DashboardContainer.bind(this, {mainPath:'/passwordreset'})} />
                    <Route exact path='/verify' component={DashboardContainer.bind(this, {mainPath:'/verify'})} />

                </div>
            </Router>
        );
    }
}

//export default App;

App.defaultProps = {

}

const mapStateToProps = (state) => {

    return {
        siteName: (state.siteChanger)?state.siteChanger.site:null,
        tab: (state.tabChanger.tab)?state.tabChanger.tab:null,
        clickTab: (state.tabClick.clickTab)?state.tabClick.clickTab:null,
        creatingSpinner : state.creatingSpinner.creating?state.creatingSpinner.creating:null,

    };
};

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleChangeTab: (data) => { dispatch(actions.changeTab(data))},
        mapDispatchToLoginWithPassword: (data) => dispatch(actions.loginWithEmailRedux({ params: data})),
        handleRegionInfo: (data) => { dispatch(actions.regionInfo(data))},
        handleUserInfo: (data) => { dispatch(actions.userInfo(data))},
        handleChangeLoginMode: (data) => { dispatch(actions.changeLoginMode(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))},
    };
};

export default connect(mapStateToProps, mapDispatchProps)(App);
