import React, { Component } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import Login from './login';
import { LOCAL_STRAGE_KEY } from '../../components/utils/Settings';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import HeaderGlobalMini from '../../container/headerGlobalMini';
import {PAGE_ORGANIZATIONS} from '../../constant';
import GridLoader from "react-spinners/GridLoader";
import MexAlert from '../../hoc/alert/AlertDialog';
let self = null;
class EntranceGlobe extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            clickedMarker: null,
            hoveredMarker: null,
            mouseEvent: null,
            modalOpen: true,
            loading: false,
            signup: false,
            logined: false,
            mexAlertMessage:undefined
        }
        self = this;
    }

    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT).userToken : null
        if (store) {
            this.setState({ modalOpen: false, logined: true })
        }
        if (this.props.match.path === '/logout') {
            localStorage.removeItem(LOCAL_STRAGE_KEY);
            localStorage.setItem('userInfo', null)
            localStorage.setItem('sessionData', null)
            localStorage.removeItem('selectOrg')
            localStorage.setItem('selectRole', null)
            localStorage.setItem('selectMenu', null)
            this.setState({ modalOpen: true, logined: false })
        }
        else if (this.props.match.path === '/passwordreset') {
            this.setState({ modalOpen: true })
            this.props.handleChangeLoginMode('resetPass')
        }
    }

    static getDerivedStateFromProps(props, state) {

        if (props.alertInfo.mode && props.alertInfo.msg) {
            let alertInfo = { msg: props.alertInfo.msg, severity: props.alertInfo.mode }
            props.handleAlertInfo(undefined, undefined);
            return {mexAlertMessage: alertInfo}
        }

        if (props.loginMode && props.loginMode === 'resetPass') {
        }
        else if (localStorage.getItem(LOCAL_STRAGE_KEY)) {
            props.history.push(`/site4/pg=${PAGE_ORGANIZATIONS}`)
        }
        else if (props.loginMode && props.loginMode === 'verify') {
            return { modalOpen: true, logined: true }
        }
        else if (props.loginMode && props.loginMode === 'forgot') {
            return { modalOpen: true, logined: false }
        }
        else if (props.loginMode === 'logout') {
            return { modalOpen: true, logined: false }
        }
        else if (props.loginMode === 'login' && props.user.userToken) {
            props.history.push(`/site4/pg=${PAGE_ORGANIZATIONS}`)
        }
        return null
    }

    handleClickLogin(mode) {
        self.setState({ modalOpen: true })
        setTimeout(() => self.props.handleChangeLoginMode(mode), 500);
    }

    render() {
        return (
            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} className="intro_globe">
                {(this.state.modalOpen && !this.state.logined) ?
                    <Grid style={{ backgroundColor: 'transparent', height: 100, position: 'absolute', top: 20, right: (this.state.modalOpen) ? 50 : 185, alignSelf: 'center' }}>
                        <Grid.Row columns={2}>
                            <Grid.Column className="login_btn"><Button onClick={() => this.handleClickLogin('login')}><span>Login</span></Button></Grid.Column>
                            <Grid.Column className="signup_btn"><Button onClick={() => this.handleClickLogin('signup')}><span>Create an account</span></Button></Grid.Column>
                        </Grid.Row>
                    </Grid>
                    : <div></div>}

                {this.state.logined &&

                    <div className='intro_gnb_header'>
                        <div className='navbar_right'>
                            <HeaderGlobalMini handleClickLogin={this.handleClickLogin} email={this.state.email} dimmer={false}></HeaderGlobalMini>
                        </div>
                    </div>
                }

                {this.state.modalOpen &&
                    <div className='intro_login'>
                        <Login location={this.props.location} history={this.props.history}></Login>
                    </div>
                }

                <div className="loadingBox">
                    <GridLoader
                        sizeUnit={"px"}
                        size={20}
                        color={'#70b2bc'}
                        loading={this.state.loading}
                    />
                </div>
                {this.state.mexAlertMessage ?
                    <MexAlert data={this.state.mexAlertMessage} onClose={()=>this.setState({ mexAlertMessage: undefined })} /> : null}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        user: state.user,
        userInfo: state.userInfo ? state.userInfo : null,
        loginMode: state.loginMode ? state.loginMode.mode : null,
        alertInfo: { mode: state.alertInfo.mode, msg: state.alertInfo.msg }
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
