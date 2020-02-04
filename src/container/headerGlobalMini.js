import React from 'react';
import { Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as serviceMC from '../services/serviceMC';
import PopProfileViewer from '../container/popProfileViewer';
import { withStyles } from '@material-ui/core/styles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { IconButton, Menu, MenuItem, ListItemIcon, Divider, ListItemText } from '@material-ui/core';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})(props => (
    <Menu
        PaperProps={{ style: { backgroundColor: '#424242', color: 'white' } }}
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));


let _self = null;
class headerGlobalMini extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.state = {
            email: store ? store.email : 'Administrator',
            openProfile: false,
            anchorEl: null,
            userInfo: { info: [] }
        }
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

    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null;
        let token = store ? store.userToken : 'null';
        serviceMC.sendRequest(_self, { token: token, method: serviceMC.getEP().CURRENT_USER }, this.receiveCurrentUser);
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
        this.onMenuClose();
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null;
        let token = store ? store.userToken : 'null';
        serviceMC.sendRequest(_self, { token: token, method: serviceMC.getEP().CURRENT_USER }, this.receiveCurrentUser);
        this.setState({ openProfile: true })
    }

    closeProfile = (mode) => {
        if (mode === 'verify') {
            _self.props.handleClickLogin(mode)
        } else {

        }
        this.setState({ openProfile: false })
    }
    resetPassword() {
        this.props.handleClickLogin('forgot')
    }



    onMenuClose = () => {
        this.setState({
            anchorEl: null
        })
    }

    render() {
        return (

            <div>
                <div style={{ cursor: 'pointer',marginTop:10  }} onClick={(e) => { this.setState({ anchorEl: e.currentTarget }) }}><AccountCircleOutlinedIcon fontSize='large'/></div>
                <StyledMenu
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.onMenuClose}
                >
                    <div align="center" style={{ textTransform: 'uppercase', margin: 5 }}><ListItemText primary={this.state.userInfo['Name']} /></div>
                    <Divider />
                    <MenuItem onClick={() => this.profileView()}>
                        <ListItemIcon style={{ color: 'white' }}>
                            <AccountBoxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </MenuItem>
                    <MenuItem onClick={() => this.gotoPreview('/logout')}>
                        <ListItemIcon style={{ color: 'white' }}>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </MenuItem>
                </StyledMenu>
                <PopProfileViewer data={this.state.userInfo} dimmer={false} open={this.state.openProfile} close={this.closeProfile} ></PopProfileViewer>
            </div >

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
