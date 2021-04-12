import React, { Component } from 'react';
import Login from './login';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { LOCAL_STRAGE_KEY, LS_REGIONS, LS_USER_META_DATA, PAGE_ORGANIZATIONS } from '../../constant';
import  Spinner from '../../hoc/loader/Spinner';
import MexAlert from '../../hoc/alert/AlertDialog';
import './style.css'
class EntranceGlobe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            signup: false,
            mexAlertMessage: undefined
        }
    }

    componentDidMount() {
        if (this.props.match.path === '/logout') {
            localStorage.removeItem(LOCAL_STRAGE_KEY);
            localStorage.removeItem(LS_USER_META_DATA);
            localStorage.removeItem(LS_REGIONS);
        }
        else if (this.props.match.path === '/passwordreset') {
            this.props.handleChangeLoginMode('resetPass')
        }
        else if(localStorage.getItem(LOCAL_STRAGE_KEY))
        {
            this.props.history.push(`/main/${PAGE_ORGANIZATIONS.toLowerCase()}`)
        }
    }

    static getDerivedStateFromProps(props, state) {

        let alertInfo = props.alertInfo
        if (alertInfo !== state.mexAlertMessage && props.alertInfo.mode && alertInfo.msg) {
            props.handleAlertInfo(undefined, undefined);
            return { mexAlertMessage: alertInfo }
        }
        if (props.match.path === '/passwordreset') {
            return null
        }
        return null
    }

    handleClickLogin = (mode) => {
        this.setState({ signup: mode === 'signup' }, () => {
            this.props.handleChangeLoginMode(mode)
        })
    }

    onSignUp = () => {
        this.setState({ signup: false })
        this.props.handleChangeLoginMode('signuped')
    }

    render() {
        return (
            <div className="login_main">
                <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 1 }}>
                    <div style={{ cursor: 'pointer', color: 'white', display: 'inline', marginRight: 20 }} onClick={() => this.handleClickLogin('login')}>Login</div>
                    <div style={{ cursor: 'pointer', color: 'white', display: 'inline' }} onClick={() => this.handleClickLogin('signup')}>Register</div>
                </div>
                <div style={{ position: 'absolute', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <div className='login_head' >
                        <div className='intro_login'>
                            <img src='/assets/brand/MobiledgeX_Logo_tm_white.svg' width={200} alt="MobiledgeX" />
                            <Login location={this.props.location} history={this.props.history} signup={this.state.signup} onSignUp={this.onSignUp}></Login>
                        </div>
                    </div>
                </div>
                {this.state.mexAlertMessage ?
                    <MexAlert data={this.state.mexAlertMessage} onClose={() => this.setState({ mexAlertMessage: undefined })} /> : null}
                <Spinner/>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        user: state.user,
        loginMode: state.loginMode ? state.loginMode.mode : null,
        alertInfo: { mode: state.alertInfo.mode, msg: state.alertInfo.msg }
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeLoginMode: (data) => { dispatch(actions.changeLoginMode(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(EntranceGlobe);
