import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as serverData from '../services/model/serverData';
import PopProfileViewer from '../container/popProfileViewer';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { IconButton, ListItemText, Menu, MenuItem } from '@material-ui/core';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
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

    logout(path) {
        this.props.history.push({
            pathname: path,
            userInfo: { info: null }
        });

    }

    getCurrentUser = async () => {
        let mcRequest = await serverData.currentUser(_self);
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            _self.setState({ tokenState: 'live' })
            _self.setState({ userInfo: mcRequest.response.data })
        }
    }

    componentDidMount() {
        this.getCurrentUser()
    }

    profileView() {
        this.onMenuClose();
        this.getCurrentUser()
        this.setState({ openProfile: true })
    }

    closeProfile = (mode) => {
        if (mode === 'verify') {
            _self.props.handleClickLogin(mode)
        } else {

        }
        this.setState({ openProfile: false })
    }

    onMenuClose = () => {
        this.setState({
            anchorEl: null
        })
    }
    
    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    }

    render() {
        const { anchorEl } = this.state
        return (
            <div style={{ marginTop: '0.4em' }}>
                <IconButton aria-controls="event-menu" aria-haspopup="true" onClick={this.handleClick}>
                    <AccountCircleOutlinedIcon />
                </IconButton>
                <Menu
                    id="event-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={() => this.profileView()}>
                        <PersonOutlineOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                        <ListItemText primary="Profile" />
                    </MenuItem>
                    <MenuItem onClick={() => this.logout('/logout')}>
                        <ExitToAppOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                        <ListItemText primary="Logout" />
                    </MenuItem>
                </Menu>
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
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(headerGlobalMini));
