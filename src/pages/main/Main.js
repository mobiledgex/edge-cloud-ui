import React from 'react';
//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';
import MexAlert from '../../hoc/alert/AlertDialog';
import Menu from './Menu'
import { pages } from '../../constant';
import { role } from '../../helper/constant';
import { withRouter } from 'react-router-dom';
import { perpetual, operators } from '../../helper/constant';
import { fields } from '../../services/model/format';
import { updateUserMetaData } from '../../services/modules/users';
import { getUserMetaData } from '../../helper/ls';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mexAlertMessage: undefined
        };
    }

    static getDerivedStateFromProps(props, state) {
        let alertInfo = props.alertInfo
        if (alertInfo !== state.mexAlertMessage && props.alertInfo.mode && alertInfo.msg) {
            props.handleAlertInfo(undefined, undefined);
            return { mexAlertMessage: alertInfo }
        }
        return null
    }

    render() {
        const { loadMain } = this.props
        return (
            loadMain ? <div >
                <Menu />
                {this.state.mexAlertMessage ? <MexAlert data={this.state.mexAlertMessage} onClose={() => this.setState({ mexAlertMessage: undefined })} /> : null}
            </div> : null
        );
    }

    loadInitData = async () => {
        if (!this.props.loadMain) {
            this.props.history.push({
                pathname: '/preloader',
                state: { currentPage: this.props.location.pathname }
            });
        }
    }

    validatePath = (pages, orgInfo, pathname) => {
        for (let page of pages) {
            if (page.sub) {
                if (this.validatePath(page.options, orgInfo, pathname)) {
                    return true
                }
            }
            else {
                if (pathname.includes(page.path)) {
                    let roles = page.roles
                    if (roles) {
                        if (role.validateRole(page.roles, orgInfo)) {
                            return true
                        }
                    }
                    else {
                        return true
                    }
                }
            }
        }
    }

    redirectInvalidPath = () => {
        const orgInfo = this.props.organizationInfo
        const pathname = this.props.history.location.pathname
        if ((orgInfo === undefined && !pathname.includes('/organizations')) || !(pathname.includes('/logout') || this.validatePath(pages, orgInfo, pathname))) {
            this.props.history.push(`/main/${perpetual.PAGE_ORGANIZATIONS.toLowerCase()}`)
        }
    }

    updateUserPref = (orgInfo) => {
        let data = getUserMetaData()
        data[fields.organizationInfo] = orgInfo
        updateUserMetaData(this, data)
    }

    componentDidUpdate(preProps, preState) {
        const { organizationInfo } = this.props
        if (!operators.equal(preProps.organizationInfo, organizationInfo)) {
            this.updateUserPref(organizationInfo)
        }
        this.redirectInvalidPath()
    }

    componentDidMount() {
        this.loadInitData()
    }
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo ? state.userInfo.data : null,
        alertInfo: { mode: state.alertInfo.mode, msg: state.alertInfo.msg },
        viewMode: state.ViewMode ? state.ViewMode.mode : null,
        roles: state.roleInfo ? state.roleInfo.role : null,
        organizationInfo: state.organizationInfo.data,
        loadMain: state.loadMain.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(Main))
