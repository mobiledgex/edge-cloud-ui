import React from 'react';
//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';
import MexAlert from '../../hoc/alert/AlertDialog';
import Menu from './Menu'
import '../../css/introjs.css';
import '../../css/introjs-dark.css';
import { pages, PAGE_ORGANIZATIONS, validatePrivateAccess } from '../../constant';
import { validateRole } from '../../constant/role';
import { withRouter } from 'react-router-dom';
import { equal } from '../../constant/compare';
import { redux_org } from '../../helper/reduxData';

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
            loadMain ? <div className='view_body'>
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

    redirectInvalidPath = () => {
        const orgInfo = this.props.organizationInfo
        const pathname = this.props.history.location.pathname
        let pathValid = false
        if (pathname.includes('/logout')) {
            pathValid = true
        }
        else {
            for (let page of pages) {
                if (pathname.includes(page.path)) {
                    let roles = page.roles
                    if (roles) {
                        if (validateRole(page.roles, orgInfo)) {
                            pathValid = true
                        }
                    }
                    else {
                        pathValid = true
                    }
                }
                if (pathValid) {
                    break;
                }
            }
        }
        if (!pathValid) {
            this.props.history.push(`/main/${PAGE_ORGANIZATIONS.toLowerCase()}`)
        }
    }

    onOrgChange = async (orgInfo) => {
        if (redux_org.isOperator(this)) {
            this.props.handlePrivateAccess(undefined)
            let privateAccess = await validatePrivateAccess(this, orgInfo)
            this.props.handlePrivateAccess(privateAccess)
        }
    }

    componentDidUpdate(preProps, preState) {
        if (!equal(preProps.organizationInfo, this.props.organizationInfo)) {
            this.onOrgChange(this.props.organizationInfo)
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
        privateAccess: state.privateAccess.data,
        loadMain: state.loadMain.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handlePrivateAccess: (data) => { dispatch(actions.privateAccess(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(Main))
