import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Login from './login/Login';
import Register from './register/Register'
import ForgotPassword from './password/ForgotPassword'
import ResetPassword from './password/ResetPassword';
import Verify from './verify/Verify'

import { connect } from 'react-redux';
import * as actions from '../../actions';
import * as serverData from '../../services/model/serverData';
import MexAlert from '../../hoc/alert/AlertDialog';
import { Container } from 'semantic-ui-react';
import LinearProgress from '@material-ui/core/LinearProgress';
import './style.css'
import { withStyles } from '@material-ui/styles';
import { perpetual } from '../../helper/constant';

const styles = props => ({
    colorPrimary: {
      backgroundColor: 'rgba(0,170,255,.10)',
    },
    barColorPrimary: {
      backgroundColor: '#93E019',
    }
  });

const HOST = window.location.host;

class Landing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mexAlertMessage: undefined
        }
    }

    onPasswordReset = async (email) => {
        let requestData = {
            email
        }
        let valid = await serverData.resetPasswordRequest(this, requestData)
        if (valid) {
            this.props.handleAlertInfo('success', 'We have e-mailed your password reset link!')
            return valid
        }
    }

    onVerificationEmail = async (email) => {
        let valid = await serverData.sendVerify(this, { email })
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
                <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 1 }}>
                    <Link to="/" replace style={{ marginRight: 20, color: 'white' }}>Login</Link>
                    <Link to="/register" replace style={{ color: 'white' }}>Register</Link>
                </div>
                <div style={{ position: 'absolute', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <div className='login_head' >
                        {loading ? <LinearProgress classes={{colorPrimary:classes.colorPrimary, barColorPrimary:classes.barColorPrimary}}/> : null}
                        <div className='intro_login'>
                            <img src='/assets/brand/MobiledgeX_Logo_tm_white.svg' width={200} alt="MobiledgeX" />
                            <Container style={{ width: path === '/register' ? 500 : 400 }}>
                                {
                                    path === '/forgotpassword' ? <ForgotPassword onPasswordReset={this.onPasswordReset} onVerificationEmail={this.onVerificationEmail}/> :
                                        path === '/register' ? <Register onVerificationEmail={this.onVerificationEmail} /> :
                                            path === '/passwordreset' ? <ResetPassword /> :
                                                path === '/verify' ? <Verify /> :
                                                    <Login />
                                }
                            </Container>
                        </div>
                    </div>
                </div>
                {this.state.mexAlertMessage ?
                    <MexAlert data={this.state.mexAlertMessage} onClose={() => this.setState({ mexAlertMessage: undefined })} /> : null}
            </div>
        )
    }

    componentDidMount() {
        if (this.props.match.path === '/logout') {
            localStorage.clear();
        }
        else if (localStorage.getItem(perpetual.LOCAL_STRAGE_KEY)) {
            this.props.history.push(`/main/${perpetual.PAGE_ORGANIZATIONS.toLowerCase()}`)
        }
    }
}
function mapStateToProps(state) {
    return {
        user: state.user,
        loginMode: state.loginMode ? state.loginMode.mode : null,
        loading:state.loadingSpinner.loading,
        alertInfo: { mode: state.alertInfo.mode, msg: state.alertInfo.msg }
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(withStyles(styles)(Landing)));
