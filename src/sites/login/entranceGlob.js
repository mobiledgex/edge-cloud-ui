import React, { Component } from 'react';
import Login from './login';
import { LOCAL_STRAGE_KEY } from '../../constant';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { PAGE_ORGANIZATIONS } from '../../constant';
import { GridLoader } from "react-spinners";
import MexAlert from '../../hoc/alert/AlertDialog';
let self = null;
class EntranceGlobe extends Component {

    constructor(props) {
        super(props);

        this.state = {
            signup: false,
            loginFlag:undefined,
            mexAlertMessage: undefined
        }
        self = this;
    }

    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT).userToken : null
        if (this.props.match.path === '/logout') {
            localStorage.removeItem(LOCAL_STRAGE_KEY);
        }
        else if (this.props.match.path === '/passwordreset') {
            this.props.handleChangeLoginMode('resetPass')
        }
    }

    static getDerivedStateFromProps(props, state) {

        if (props.alertInfo.mode && props.alertInfo.msg) {
            let alertInfo = { msg: props.alertInfo.msg, severity: props.alertInfo.mode }
            props.handleAlertInfo(undefined, undefined);
            return { mexAlertMessage: alertInfo }
        }

        if (props.match.path === '/passwordreset') {
            return null
        }
        else if (localStorage.getItem(LOCAL_STRAGE_KEY)) {
            props.history.push(`/site4/pg=${PAGE_ORGANIZATIONS}`)
        }
        else if (props.loginMode === 'login' && props.user.userToken) {
            props.history.push(`/site4/pg=${PAGE_ORGANIZATIONS}`)
        }
        return null
    }

    handleClickLogin(mode) {
        self.setState({ signup: mode === 'signup', loginFlag: mode})
        setTimeout(() => {
            this.setState({loginFlag:undefined})
        }, 10);
        setTimeout(() => {
            self.props.handleChangeLoginMode(mode)
        }, 500);
    }

    onSignUp = ()=>
    {
        this.setState({signup:false})
        self.props.handleChangeLoginMode('signuped')
    }

    render() {
        return (
            <div class="login_main">
                <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 1 }}>
                    <div style={{ cursor: 'pointer', color: 'white', display: 'inline', marginRight: 20 }} onClick={() => this.handleClickLogin('login')}>Login</div>
                    <div style={{ cursor: 'pointer', color: 'white', display: 'inline' }} onClick={() => this.handleClickLogin('signup')}>Register</div>
                </div>
                <div style={{ position: 'absolute', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <div className='login_head' >
                        <div className='intro_login'>
                            <img src='/assets/brand/MobiledgeX_Logo_tm_white.svg' width={200}></img>
                            <Login location={this.props.location} history={this.props.history} signup={this.state.signup} loginFlag={this.state.loginFlag} onSignUp={this.onSignUp}></Login>
                        </div>
                    </div>
                </div>
                {this.state.mexAlertMessage ?
                    <MexAlert data={this.state.mexAlertMessage} onClose={() => this.setState({ mexAlertMessage: undefined })} /> : null}
                {(self.props.loadingSpinner == true) ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <GridLoader
                            sizeUnit={"px"}
                            size={25}
                            color={'#70b2bc'}
                            loading={self.props.loadingSpinner}
                        />
                    </div> : null}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        user: state.user,
        userInfo: state.userInfo ? state.userInfo : null,
        loginMode: state.loginMode ? state.loginMode.mode : null,
        alertInfo: { mode: state.alertInfo.mode, msg: state.alertInfo.msg },
        loadingSpinner: state.loadingSpinner.loading ? state.loadingSpinner.loading : null,
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) },
        handleChangeTab: (data) => { dispatch(actions.changeTab(data)) },
        handleChangeLoginMode: (data) => { dispatch(actions.changeLoginMode(data)) },
        handleUserInfo: (data) => { dispatch(actions.userInfo(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(EntranceGlobe);
