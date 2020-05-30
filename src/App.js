import React, { Component } from 'react';
import {HashRouter, Route } from "react-router-dom";

import 'semantic-ui-css/semantic.min.css';
//redux
import { connect } from 'react-redux';
import * as actions from './actions';
import * as serverData from './services/model/serverData';
import { LOCAL_STRAGE_KEY } from './components/utils/Settings'
//insert pages
import './app.css';
import EntranceGlob from './sites/siteOne/entranceGlob';
import VerifyContent from './container/verifyContent';
import SiteFour from './sites/siteFour/siteFour'
import './css/index.css';
import './css/pages/audit.css';
import './css/pages/cloudletPool.css';
import './css/pages/monitoring.css';
import './css/components/timelineH.css';
import { ThemeProvider } from "@material-ui/styles";
import { getDarkTheme, getLightTheme, THEME_TYPE } from "./themeStyle";

let self = null;
class App extends Component {
    constructor() {
        super();
        self = this;
        this.clickTab = false;
        this.routeCnt = 0;
    }

    getControllers = async () => {
        if (localStorage && localStorage.PROJECT_INIT) {
            let store = JSON.parse(localStorage.PROJECT_INIT);
            if (store.userToken) {
                let mcRequest = await serverData.controllers(self, store.userToken)
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
            return
        }
        this.getControllers()
    }

    render() {
        return (
            <ThemeProvider theme={this.props.themeType === THEME_TYPE.DARK ? getDarkTheme() : getLightTheme()}>
                <HashRouter>
                    <div style={{ width: '100%', height: '100%' }}>
                        <Route exact path='/' component={EntranceGlob} />
                        <Route exact path='/site4' component={SiteFour} />
                        <Route exact path='/site4/:pageId' component={SiteFour} />
                        <Route exact path='/logout' component={EntranceGlob}/>
                        <Route exact path='/passwordreset' component={EntranceGlob}/>
                        <Route exact path='/verify' component={VerifyContent}/>
                    </div>
                </HashRouter>
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
        handleRegionInfo: (data) => {
            dispatch(actions.regionInfo(data))
        },
        handleUserInfo: (data) => {
            dispatch(actions.userInfo(data))
        },
        toggleTheme: (data) => {
            dispatch(actions.toggleTheme(data))
        }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(App);
