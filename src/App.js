import React, { Component, Suspense, lazy } from 'react';
import {HashRouter, Route } from "react-router-dom";

import 'semantic-ui-css/semantic.min.css';
//redux
import { connect } from 'react-redux';
import * as actions from './actions';
import * as serverData from './services/model/serverData';
import { LOCAL_STRAGE_KEY } from './components/utils/Settings'
//insert pages
import './app.css';
import './css/index.css';
import './css/pages/audit.css';
import './css/pages/cloudletPool.css';
import './css/pages/monitoring.css';
import './css/components/timelineH.css';
import { ThemeProvider } from "@material-ui/styles";
import { getDarkTheme, getLightTheme, THEME_TYPE } from "./themeStyle";
import { GridLoader } from 'react-spinners';

const EntranceGlob = lazy(() => import('./sites/login/entranceGlob'));
const VerifyContent = lazy(() => import('./container/verifyContent'));
const SiteFour = lazy(() => import('./sites/siteFour/siteFour'))

let self = null;
class App extends Component {
    constructor() {
        super();
        self = this;
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

    loader = () => {
        return (
            <div>
                <GridLoader
                    sizeUnit={"px"}
                    size={20}
                    color={'#70b2bc'}
                    loading={true}
                />
            </div>
        )
    }

    render() {
        return (
            <ThemeProvider theme={this.props.themeType === THEME_TYPE.DARK ? getDarkTheme() : getLightTheme()}>
                <HashRouter>
                    <Suspense fallback={this.loader}>
                        <div style={{ width: '100%', height: '100%' }}>
                            <Route exact path='/' component={EntranceGlob} />
                            <Route exact path='/site4' component={SiteFour} />
                            <Route exact path='/site4/:pageId' component={SiteFour} />
                            <Route exact path='/logout' component={EntranceGlob} />
                            <Route exact path='/passwordreset' component={EntranceGlob} />
                            <Route exact path='/verify' component={VerifyContent} />
                        </div>
                    </Suspense>
                </HashRouter>
            </ThemeProvider>

        );
    }
}

const mapStateToProps = (state) => {

    return {
        themeType: state.ThemeReducer.themeType,
    };
};

const mapDispatchProps = (dispatch) => {
    return {
        handleRegionInfo: (data) => {
            dispatch(actions.regionInfo(data))
        },
        toggleTheme: (data) => {
            dispatch(actions.toggleTheme(data))
        }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(App);
