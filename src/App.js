import React, { Component, Suspense, lazy } from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
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
import Spinner from './hoc/loader/Spinner';

const Main = lazy(() => import('./sites/main/Main'));
const EntranceGlob = lazy(() => import('./sites/login/entranceGlob'));
const VerifyContent = lazy(() => import('./sites/login/verifyContent'));
class App extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <ThemeProvider theme={this.props.themeType === THEME_TYPE.DARK ? getDarkTheme() : getLightTheme()}>
                <Router>
                    <Suspense fallback={<Spinner loading={true} />}>
                        <Switch>
                            <Route exact path='/' component={EntranceGlob} />
                            <Route path='/main' component={Main} />
                            <Route exact path='/logout' component={EntranceGlob} />
                            <Route exact path='/passwordreset' component={EntranceGlob} />
                            <Route exact path='/verify' component={VerifyContent} />
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
