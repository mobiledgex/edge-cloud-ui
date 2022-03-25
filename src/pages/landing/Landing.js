import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { alertInfo } from '../../actions';

import Login from './login/Login';
import Register from './register/Register'
import ForgotPassword from './password/ForgotPassword'
import ResetPassword from './password/ResetPassword';
import Verify from './verify/Verify'

import MexAlert from '../../hoc/alert/AlertDialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/styles';
import { resetPasswordRequest, sendVerify } from '../../services/modules/landing';
import { LS_THASH, PAGE_ORGANIZATIONS } from '../../helper/constant/perpetual';
import './style.css'

const styles = theme => ({
    colorPrimary: {
        backgroundColor: 'rgba(0,170,255,.10)',
    },
    barColorPrimary: {
        backgroundColor: '#93E019',
    },
    width400: {
        width: 400
    },
    width500: {
        width: 500
    },
    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        color: '#FFF',
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 1,
        gap: 10
    },
    actionBtnLink: {
        color: 'white',
        '&:hover': {
            color: '#93E019'
        }
    },
    container: {
        position: 'absolute',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
    }
});

class Landing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mexAlertMessage: undefined
        }
        this._isMounted = false
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    onPasswordReset = async (email) => {
        let requestData = {
            email
        }
        let valid = await resetPasswordRequest(this, requestData)
        if (valid) {
            this.props.handleAlertInfo('success', 'We have e-mailed your password reset link!')
            return valid
        }
    }

    onVerificationEmail = async (email) => {
        let valid = await sendVerify(this, { email })
        if (valid) {
            this.props.handleAlertInfo('success', 'We have e-mailed your verification link')
        }
        return valid
    }

    static getDerivedStateFromProps(props, state) {

        const { alertInfo } = props
        if (alertInfo !== state.mexAlertMessage && props.alertInfo.mode && alertInfo.msg) {
            props.handleAlertInfo(undefined, undefined);
            return { mexAlertMessage: alertInfo }
        }
        if (props.match.path === '/passwordreset') {
            return null
        }
        return null
    }

    render() {
        const { history, classes, loading } = this.props
        const path = history.location.pathname
        return (
            <div className="login_main">
                <div className={classes.actionBtn}>
                    <Link to="/" replace className={classes.actionBtnLink}>Login</Link>
                    <Link to="/register" replace className={classes.actionBtnLink}>Register</Link>
                </div>
                <div className={classes.container}>
                    <div className='login_head' >
                        {loading ? <LinearProgress classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }} /> : null}
                        <div className='intro_login'>
                            <img src='/assets/brand/MobiledgeX_Logo_tm_white.svg' width={200} alt="MobiledgeX" />
                            <div className={path === '/register' ? classes.width500 : classes.width400}>
                                {
                                    path === '/forgotpassword' ? <ForgotPassword onPasswordReset={this.onPasswordReset} onVerificationEmail={this.onVerificationEmail} /> :
                                        path === '/register' ? <Register onVerificationEmail={this.onVerificationEmail} /> :
                                            path === '/passwordreset' ? <ResetPassword /> :
                                                path === '/verify' ? <Verify /> :
                                                    <Login />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.mexAlertMessage ?
                    <MexAlert data={this.state.mexAlertMessage} onClose={() => this.updateState({ mexAlertMessage: undefined })} /> : null}
            </div>
        )
    }

    componentDidMount() {
        this._isMounted = true
        if (this.props.match.path === '/logout') {
            localStorage.clear();
        }
        else if (localStorage.getItem(LS_THASH)) {
            this.props.history.push(`/main/${PAGE_ORGANIZATIONS.toLowerCase()}`)
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        loginMode: state.loginMode ? state.loginMode.mode : null,
        loading: state.loadingSpinner.loading,
        alertInfo: { mode: state.alertInfo.mode, msg: state.alertInfo.msg }
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(withStyles(styles)(Landing)));
