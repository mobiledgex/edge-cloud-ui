/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component, Suspense, lazy } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { connect } from 'react-redux';
import { toggleTheme } from './actions';
import { ThemeProvider } from "@material-ui/styles";
import { getDarkTheme, getLightTheme, THEME_TYPE } from "./themeStyle";
import LogoSpinner from './hoc/loader/LogoSpinner';
import { componentLoader } from './hoc/loader/componentLoader';
import Policy from './pages/landing/policy/Policy';
import './semanticcss/semantic.min.css';
import './app.css';
import './css/index.css';

const Main = lazy(() => componentLoader(import('./pages/main/Main')));
const Landing = lazy(() => componentLoader(import('./pages/landing/Landing')));
const PreLoader = lazy(() => componentLoader(import('./pages/landing/loader/PreLoader')));

class App extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <ThemeProvider theme={this.props.themeType === THEME_TYPE.DARK ? getDarkTheme() : getLightTheme()}>
                <Router>
                    <Suspense fallback={<LogoSpinner />}>
                        <Switch>
                            <Route exact path='/terms-of-use' component={Policy} />
                            <Route exact path='/acceptable-use-policy' component={Policy} />
                            <Route exact path='/' component={Landing} />
                            <Route exact path='/register' component={Landing} />
                            <Route exact path='/forgotpassword' component={Landing} />
                            <Route exact path='/passwordreset' component={Landing} />
                            <Route exact path='/logout' component={Landing} />
                            <Route exact path='/verify' component={Landing} />
                            <Route exact path='/preloader' component={PreLoader} />
                            <Route path='/main' component={Main} />
                            <Redirect from='*' to='/' />
                        </Switch>
                    </Suspense>
                </Router>
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
        toggleTheme: (data) => { dispatch(toggleTheme(data)) },
    };
};

export default connect(mapStateToProps, mapDispatchProps)(App);
