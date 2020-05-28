import React from 'react';
import {Button, Icon, Popup} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';
import * as serverData from '../services/model/serverData';
import PopProfileViewer from '../container/popProfileViewer';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import {IconButton} from '@material-ui/core';

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
        if (path === '/logout') {
            localStorage.removeItem('selectOrg');
            localStorage.removeItem('selectRole')
            localStorage.removeItem('selectMenu')
        }
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
    makeProfileButton = () => (
        <Button.Group vertical className="table_actions_popup_group">
            <Button className="table_actions_popup_group_button">
                <strong>{this.state.userInfo['Name']}</strong>
            </Button>
            <Button onClick={() => this.profileView()} className="table_actions_popup_group_button">
                <Icon name='user circle outline' size='large' />
                <strong>Profile</strong>
            </Button>
            <Button onClick={() => this.logout('/logout')} className="table_actions_popup_group_button">
                <Icon name='sign-out' size='large'/>
                <strong>Logout</strong>
            </Button>
        </Button.Group>
    )

    render() {
        return (

            <div>
                <Popup
                    inverted
                    trigger={
                        <IconButton color='inherit' onClick={(e) => { this.setState({ anchorEl: e.currentTarget }) }}>
                            <AccountCircleOutlinedIcon fontSize='default'/>
                        </IconButton>
                    }
                    content={this.makeProfileButton()}
                    on='click'
                    position='bottom right'
                    className="table_actions_popup gnb_profile"
                    basic
                />
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
