import React, { Component, Suspense, lazy } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import { connect } from 'react-redux';
import * as actions from './actions';
import './app.css';
import './css/index.css';
import './css/pages/audit.css';
import './css/pages/cloudletPool.css';
import './css/components/timelineH.css';
import { ThemeProvider } from "@material-ui/styles";
import { getDarkTheme, getLightTheme, THEME_TYPE } from "./themeStyle";
import LogoSpinner from './hoc/loader/LogoSpinner'
import { componentLoader } from './hoc/loader/componentLoader';

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
        toggleTheme: (data) => { dispatch(actions.toggleTheme(data)) },
    };
};

export default connect(mapStateToProps, mapDispatchProps)(App);
