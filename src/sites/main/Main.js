import React from 'react';
//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Spinner from '../../hoc/loader/Spinner'
import RoleWorker from '../../services/worker/role.worker.js'
import MexAlert from '../../hoc/alert/AlertDialog';
import { CURRENT_USER, SHOW_ROLE, SHOW_CONTROLLER } from '../../services/model/endpoints';
import Menu from './Menu'
import '../../css/introjs.css';
import '../../css/introjs-dark.css';
import { LS_REGIONS, OPERATOR, validatePrivateAccess } from '../../constant';
import { getUserRole, isAdmin } from '../../services/model/format';
import * as ls from '../../helper/ls';
import { sendMultiRequest } from './monitoring/services/service'
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mexAlertMessage: undefined,
            tokenValid:false
        };
        this.worker = new RoleWorker();
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
        const { orgInfo } = this.props
        const {tokenValid } = this.state
        return (
            <div className='view_body'>
                <Spinner />
                { tokenValid && (orgInfo || isAdmin() || ls.organizationInfo() === null || ls.organizationInfo() === undefined) ? <Menu /> : null}
                {this.state.mexAlertMessage ? <MexAlert data={this.state.mexAlertMessage} onClose={() => this.setState({ mexAlertMessage: undefined })} /> : null}
            </div>
        );
    }

    validateAdmin = (dataList) => {
        this.worker.postMessage({ data: dataList })
        this.worker.addEventListener('message', async (event) => {
            if (event.data.isAdmin) {
                let role = event.data.role
                localStorage.removeItem('selectOrg')
                localStorage.removeItem(ls.LS_ORGANIZATION_INFO)
                localStorage.setItem('selectRole', role)
                this.props.handleOrganizationInfo(undefined)
                this.props.handleUserRole(role)
            }
            else {
                if (getUserRole().includes(OPERATOR)) {
                    let privateAccess = await validatePrivateAccess(this, getUserRole())
                    this.props.handlePrivateAccess(privateAccess)
                }
                this.props.handleOrganizationInfo(ls.organizationInfo())
                this.props.handleUserRole(getUserRole())
            }
        });
    }

    loadInitData = async () => {
        this.props.handleLoadingSpinner(true)
        let requestList = []
        requestList.push({ method: CURRENT_USER })
        requestList.push({ method: SHOW_CONTROLLER })
        requestList.push({ method: SHOW_ROLE })

        let mcList = await sendMultiRequest(this, requestList)

        if (mcList && mcList.length > 0) {
            mcList.map(mc => {
                if (mc.response && mc.response.status === 200) {
                    let request = mc.request
                    let data = mc.response.data
                    if (request.method === CURRENT_USER) {
                        localStorage.setItem(ls.LS_USER_META_DATA, data.Metadata)
                        this.props.handleUserInfo(data)
                    }
                    else if (request.method === SHOW_ROLE) {
                        this.props.handleRoleInfo(data)
                        this.validateAdmin(data)
                    }
                    else if (request.method === SHOW_CONTROLLER) {
                        let regions = data.map(item => { return item.Region })
                        localStorage.setItem(LS_REGIONS, regions)
                        this.props.handleRegionInfo(regions)
                    }
                }
            })
        }
        this.setState({tokenValid:true})
        this.props.handleLoadingSpinner(false)
    }

    componentDidMount() {
        this.props.handleUserRole(undefined)
        this.loadInitData()
    }

    componentWillUnmount() {
        this.worker.terminate()
    }
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo ? state.userInfo.data : null,
        alertInfo: { mode: state.alertInfo.mode, msg: state.alertInfo.msg },
        viewMode: state.ViewMode ? state.ViewMode.mode : null,
        orgInfo: state.organizationInfo.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleUserRole: (data) => { dispatch(actions.showUserRole(data)) },
        handlePrivateAccess: (data) => { dispatch(actions.privateAccess(data)) },
        handleOrganizationInfo: (data) => { dispatch(actions.organizationInfo(data)) },
        handleUserInfo: (data) => { dispatch(actions.userInfo(data)) },
        handleRegionInfo: (data) => { dispatch(actions.regionInfo(data)) },
        handleRoleInfo: (data) => { dispatch(actions.roleInfo(data)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(Main);
