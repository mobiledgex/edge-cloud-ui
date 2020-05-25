import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Alert from 'react-s-alert';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'semantic-ui-css/semantic.min.css';
import { GridLoader } from "react-spinners";
//redux
import { connect } from 'react-redux';
import * as actions from './actions';
import * as serverData from './services/model/serverData';
import { LOCAL_STRAGE_KEY } from './components/utils/Settings'
//insert pages
import EntranceGlob from './sites/siteOne/entranceGlob';
import './app.css';
import CreateAccount from './components/login/CreateAccont';
import history from './history';
import VerifyContent from './container/verifyContent';
import './css/index.css';
import SiteFour from './sites/siteFour/siteFour'
import './css/pages/audit.css';
import './css/pages/cloudletPool.css';
import './css/pages/monitoring.css';
import './css/components/timelineH.css';
import { ThemeProvider } from "@material-ui/styles";
import { getDarkTheme, getLightTheme, THEME_TYPE } from "./themeStyle";

let self = null;

const validateToken = async () => {
    let mcRequest = await serverData.currentUser(self)
    if (mcRequest) {
        if (mcRequest.error) {
            if (mcRequest.error.message.indexOf('Expired') > -1) {
                setTimeout(() => self.goToNext('/logout', ''), 4000);
                Alert.error('Login timeout expired.<br/>Please login again', {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 20000,
                    html: true,

                });
            }
            setTimeout(() => loaded = false)
        }
    }
}

const DashboardContainer = (props, props2) => {

    if (props.mainPath === '/') props.mainPath = '/site1';
    if (props2.location.search) props2.location.search = props2.location.search.replace('?', '')
    let _params = {
        mainPath: props.mainPath,
        subPath: (props2.match.params.page) ? props2.match.params.page : (props2.location.search) ? props2.location.search : 'pg=0'
    };
    global.areaCode = _params;

    /////////////////////////////////////////
    // Login check
    /////////////////////////////////////////
    const storage_data = localStorage.getItem(LOCAL_STRAGE_KEY)

    let storeData = localStorage.getItem('PROJECT_INIT')

    // TODO : 'undefined' catch
    if (storeData && !loaded) {
        loaded = true;
        let userInfo = JSON.parse(storeData);
        if (userInfo.userToken) {
            validateToken()
        }
    }


    let allRegions = localStorage.getItem('regions')
    if (!allRegions) {
        self.getControllers();
    }

    if (!self.routed) {
        self.props.handleChangeSite({ mainPath: _params.mainPath, subPath: _params.subPath })
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


    if (props.mainPath === '/logout') {
        localStorage.removeItem(LOCAL_STRAGE_KEY);
        localStorage.setItem('userInfo', null)
        localStorage.setItem('sessionData', null)
        localStorage.removeItem('selectOrg')
        localStorage.setItem('selectRole', null)
        localStorage.setItem('selectMenu', null)
        self.props.mapDispatchToLoginWithPassword({})

    }
    if (props.mainPath === '/passwordreset') {
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
        history.push({
            pathname: _params.mainPath,
            search: _params.subPath,
            state: { some: 'state' }
        });
        history.location.search = _params.subPath;
    }

    return (
        (self.routeCnt === 1) ?

            <div style={{ height: '100%', width: '100%', backgroundColor: 'transparent' }}>
                {props.mainPath === '/logout' &&
                    <EntranceGlob params={_params} history={(props2.history) ? props2.history : null} />}
                {props.mainPath === '/' &&
                    <EntranceGlob params={_params} history={(props2.history) ? props2.history : null} />}
                {props.mainPath === '/site1' &&
                    <EntranceGlob params={_params} history={(props2.history) ? props2.history : null} />}
                {props.mainPath === '/site4' &&
                    <SiteFour params={_params} history={(props2.history) ? props2.history : null} />}
                {props.mainPath === '/createAccount' &&
                    <CreateAccount params={_params} history={(props2.history) ? props2.history : null} />}
                {props.mainPath === '/passwordreset' &&
                    <EntranceGlob params={_params} history={(props2.history) ? props2.history : null} reset={true} />}
                {props.mainPath === '/verify' &&
                    <VerifyContent params={_params} history={(props2.history) ? props2.history : null} />}
                <Alert stack={{ limit: 3 }} />
                {(self.props.loadingSpinner == true) ?
                    <div className="loadingBox" style={{ zIndex: 99999 }}>
                        <GridLoader
                            sizeUnit={"px"}
                            size={25}
                            color={'#70b2bc'}
                            loading={self.props.loadingSpinner}
                        //loading={true}
                        />
                        <span className={self.props.loadingSpinner ? '' : 'loading'}
                            style={{ fontSize: '22px', color: '#70b2bc' }}>Creating...</span>
                    </div> : null}

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

    state = { animation: 'ani', duration: 500, user: {}, selectedCloudlet: '', tokenState: '' }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    goToNext(main, sub) {
        if (main == '/logout') {
            localStorage.removeItem('selectOrg');
            localStorage.removeItem('selectRole')
            localStorage.removeItem('selectMenu')
            localStorage.removeItem(LOCAL_STRAGE_KEY);
        }
        let mainPath = main;
        let subPath = sub;
        history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' },
            userInfo: { info: null }
        });
        history.location.pathName = main;
        history.location.search = subPath;
        self.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })
        self.props.handleChangeLoginMode('logout');
    }

    getControllers = async () => {
        if (localStorage && localStorage.PROJECT_INIT) {
            let store = JSON.parse(localStorage.PROJECT_INIT);
            if (store.userToken) {
                let mcRequest = await serverData.controllers(self)
                if (mcRequest && mcRequest.response) {
                    let response = mcRequest.response;
                    let regions = [];
                    if (response) {
                        if (response.data) {
                            response.data.map((data) => {
                                regions.push(data.Region)
                            })
                        }
                        localStorage.setItem('regions', regions)
                        self.props.handleRegionInfo(regions)
                    }
                }
            }
        }
    }

    componentDidMount() {
        const storage_data = localStorage.getItem(LOCAL_STRAGE_KEY)
        if (!storage_data) {
            return;
        }
        const storage_json = JSON.parse(storage_data)
        if (storage_json) {
            self.props.mapDispatchToLoginWithPassword(storage_json)
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.siteName !== this.props.siteName) {
            this.getControllers()
        }
    }

    render() {
        return (
            <ThemeProvider theme={this.props.themeType === THEME_TYPE.DARK ? getDarkTheme() : getLightTheme()}>
                <Router history={history} ref={router => this.router = router}>
                    <div style={{ width: '100%', height: '100%' }}>
                        <Route exact path='/logout' component={DashboardContainer.bind(this, { mainPath: '/logout' })} />
                        <Route exact path='/' component={DashboardContainer.bind(this, { mainPath: '/site1' })} />
                        <Route exact path='/site1/:page' component={DashboardContainer.bind(this, { mainPath: '/site1' })} />
                        <Route exact path='/site1' component={DashboardContainer.bind(this, { mainPath: '/site1' })} />
                        <Route exact path='/site2/:page' component={DashboardContainer.bind(this, { mainPath: '/site2' })} />
                        <Route exact path='/site2' component={DashboardContainer.bind(this, { mainPath: '/site2' })} />
                        <Route exact path='/site3/:page' component={DashboardContainer.bind(this, { mainPath: '/site3' })} />
                        <Route exact path='/site3' component={DashboardContainer.bind(this, { mainPath: '/site3' })} />
                        <Route exact path='/site4' component={DashboardContainer.bind(this, { mainPath: '/site4' })} />
                        <Route exact path='/site4/:page' component={DashboardContainer.bind(this, { mainPath: '/site4', ...history.location.search })} />
                        <Route exact path='/site5' component={DashboardContainer.bind(this, { mainPath: '/site5' })} />
                        <Route exact path='/createAccount' component={DashboardContainer.bind(this, { mainPath: '/createAccount' })} />
                        <Route exact path='/passwordreset' component={DashboardContainer.bind(this, { mainPath: '/passwordreset' })} />
                        <Route exact path='/verify' component={DashboardContainer.bind(this, { mainPath: '/verify' })} />
                    </div>
                </Router>
            </ThemeProvider>

        );
    }
}

const mapStateToProps = (state) => {

    return {
        siteName: (state.siteChanger) ? state.siteChanger.site : null,
        tab: (state.tabChanger.tab) ? state.tabChanger.tab : null,
        clickTab: (state.tabClick.clickTab) ? state.tabClick.clickTab : null,
        loadingSpinner: state.loadingSpinner.creating ? state.loadingSpinner.creating : null,
        themeType: state.ThemeReducer.themeType,

    };
};

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => {
            dispatch(actions.changeSite(data))
        },
        handleChangeTab: (data) => {
            dispatch(actions.changeTab(data))
        },
        mapDispatchToLoginWithPassword: (data) => dispatch(actions.loginWithEmailRedux({ params: data })),
        handleRegionInfo: (data) => {
            dispatch(actions.regionInfo(data))
        },
        handleUserInfo: (data) => {
            dispatch(actions.userInfo(data))
        },
        handleChangeLoginMode: (data) => {
            dispatch(actions.changeLoginMode(data))
        },
        handleAlertInfo: (mode, msg) => {
            dispatch(actions.alertInfo(mode, msg))
        },
        toggleTheme: (data) => {
            dispatch(actions.toggleTheme(data))
        }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(App);
