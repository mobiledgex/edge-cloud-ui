import React, { Fragment } from 'react';
import { Button, Image, Popup } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as serviceMC from '../services/serviceMC';
import './styles.css';
import PopProfileViewer from '../container/popProfileViewer';


let _self = null;
class headerGlobalMini extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.onHandleClick = this.onHandleClick.bind(this);
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.state = {
            email: store ? store.email : 'Administrator',
            openProfile: false,
            // openSettings:false,
            userInfo: { info: [] }
        }
    }

    onHandleClick = function (e, data) {
        this.props.handleChangeSite(data.children.props.to)
    }
    gotoPreview(value) {
        if (value == '/logout') {
            try {
                localStorage.removeItem('selectOrg');
                localStorage.removeItem('selectRole')
                localStorage.removeItem('selectMenu')
            } catch (error) {

            }

        }
        //브라우져 입력창에 주소 기록
        let mainPath = value;
        let subPath = 'pg=0';
        this.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' },
            userInfo: { info: null }
        });
        this.props.history.location.search = subPath;
        this.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })

    }
    loginState() {
        //this.gotoPreview('/logout')

    }
    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null;
        let token = store ? store.userToken : 'null';
        serviceMC.sendRequest(_self, { token: token, method: serviceMC.getEP().CURRENT_USER }, this.receiveCurrentUser);
    }

    componentWillReceiveProps(nextProps, nextContext) {

        if (nextProps.user) {
            this.setState({ email: nextProps.user.email })
        }
        if (nextProps.userInfo) {
            this.setState({ userInfo: nextProps.userInfo })
        }
    }

    receiveCurrentUser(mcRequest) {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                _self.setState({ tokenState: 'live' })
                _self.setState({ userInfo: response.data })
            }
        }
    }


    profileView() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null;
        let token = store ? store.userToken : 'null';
        serviceMC.sendRequest(_self, { token: token, method: serviceMC.getEP().CURRENT_USER }, this.receiveCurrentUser);
        this.setState({ openProfile: true })
    }
    // settingsView() {
    //     this.setState({openProfile:false, openSettings:true})
    // }
    closeProfile = (mode) => {
        if (mode === 'verify') {
            _self.props.handleClickLogin(mode)
        } else {

        }
        this.setState({ openProfile: false })
    }
    // closeSettings = () => {
    //     this.setState({openSettings:false})
    // }
    // createUser() {
    //     this.setState({})
    // }
    resetPassword() {
        this.props.handleClickLogin('forgot')
    }

    menuAdmin = () => (
        <Button.Group vertical>
            <Button onClick={() => this.profileView()} >Your profile</Button>
            {/*<Button style={{color:'#333333'}} onClick={() => this.settingsView(true)} >Settings</Button>*/}
            <Button style={{}} onClick={() => this.gotoPreview('/logout')}><div>{(this.props.location.pathname === "/site4") ? this.props.email : this.state.email}</div><div>Logout</div></Button>
        </Button.Group>

    )

    render() {
        const imageProps = {
            avatar: true,
            spaced: 'right',
            src: '/assets/avatar/avatar_default.svg',
        }

        return (
            <Fragment>
                <Popup
                    trigger={
                        <div style={{ cursor: 'pointer' }}>
                            <Image src='/assets/avatar/avatar_default.svg' avatar />
                            <span>
                                {(this.props.location.pathname === "/site4") ? this.props.email : this.state.email}
                            </span>
                        </div>}
                    content={
                        this.menuAdmin()
                    }
                    on='click'
                    position='bottom center'
                    className='gnb_logout'
                />
                {/*<PopSettingViewer data={{"Set URL":""}} dimmer={false} open={this.state.openSettings} close={this.closeSettings} onSubmit={()=>console.log('submit user set')} usrUrl={this.props.userURL}></PopSettingViewer>*/}
                <PopProfileViewer data={this.state.userInfo} dimmer={false} open={this.state.openProfile} close={this.closeProfile} ></PopProfileViewer>
            </Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        userInfo: state.userInfo ? state.userInfo : null,
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) },
        handleInjectData: (data) => { dispatch(actions.injectData(data)) },
        handleChangeLoginMode: (data) => { dispatch(actions.changeLoginMode(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(headerGlobalMini));
