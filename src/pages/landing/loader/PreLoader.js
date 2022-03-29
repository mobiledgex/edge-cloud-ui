import React from 'react'
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import RoleWorker from '../../../services/worker/role.worker.js'
import { showOrganizations } from '../../../services/modules/organization';
import { validatePrivateAccess } from '../../../constant';
import './style.css'
import { withRouter } from 'react-router-dom';
import { redux_org } from '../../../helper/reduxData';
import { perpetual } from '../../../helper/constant';
import { multiAuthSyncRequest } from '../../../services/service';
import { endpoint } from '../../../services';
import { fetchToken } from '../../../services/config';

class LogoLoader extends React.Component {

    constructor(props) {
        super(props)
        this.worker = new RoleWorker();
    }

    loadMainPage = () => {
        this.props.handleLoadMain(true)
        let currentPage = this.props.location.state ? this.props.location.state.currentPage : undefined
        let page = redux_org.isAdmin(this) ? perpetual.PAGE_DASHBOARD : perpetual.PAGE_ORGANIZATIONS
        this.props.history.push(currentPage ? currentPage : `/main/${page.toLowerCase()}`)
    }

    fetchOrgInfo = (userInfo) => {
        let data = userInfo && userInfo.Metadata
        try {
            data = JSON.parse(data)
        }
        catch (e) {
            data = undefined
        }
        return data && data.organizationInfo
    }

    validateAdmin = (dataList, userInfo) => {
        this.worker.postMessage({ data: dataList, request: showOrganizations(), token: fetchToken(this) })
        this.worker.addEventListener('message', async (event) => {
            let roles = event.data.roles
            this.props.handleRoleInfo(roles)
            if (event.data.isAdmin) {
                this.props.handleOrganizationInfo(roles[0])
            }
            else {
                let orgInfo = this.fetchOrgInfo(userInfo)
                if (orgInfo) {
                    if (redux_org.isOperator(orgInfo)) {
                        let privateAccess = await validatePrivateAccess(this, orgInfo)
                        this.props.handlePrivateAccess(privateAccess)
                    }
                    this.props.handleOrganizationInfo(orgInfo)
                } else {
                    this.props.handleOrganizationInfo(undefined)
                }
            }
            this.loadMainPage()
        });
    }

    loadDefault = async () => {
        let requestList = []
        requestList.push({ method: endpoint.SHOW_CONTROLLER })
        requestList.push({ method: endpoint.SHOW_ROLE })
        requestList.push({ method: endpoint.CURRENT_USER })
        let mcList = await multiAuthSyncRequest(this, requestList)

        let roles = undefined
        let userInfo = undefined
        if (mcList && mcList.length > 0) {
            mcList.map(mc => {
                if (mc.response && mc.response.status === 200) {
                    let request = mc.request
                    let data = mc.response.data
                    if (request.method === endpoint.SHOW_ROLE) {
                        roles = data
                    }
                    else if (request.method === endpoint.SHOW_CONTROLLER) {
                        let regions = data.map(item => { return item.Region })
                        this.props.handleRegionInfo(regions)
                    }
                    else if (request.method === endpoint.CURRENT_USER) {
                        userInfo = data
                        localStorage.setItem(perpetual.LS_USER_META_DATA, data.Metadata)
                        this.props.handleUserInfo(data)
                    }
                }
            })
            this.validateAdmin(roles, userInfo)
        }
    }


    render() {
        return (
            <div style={{ alignItems: 'center', height: '100vh', display: 'flex' }}>
                <img id="slidecaption" src='/assets/brand/logo_small_x.png' alt='Mobiledgex' style={{
                    marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '5%', alignItems: 'center'
                }} />
            </div>
        )
    }

    componentDidMount() {
        if (localStorage.getItem(perpetual.LS_THASH)) {
            this.loadDefault()
        }
        else
        {
            this.props.history.push('/logout');
        }
    }


    componentWillUnmount() {
        this.worker.terminate()
    }
}

const mapStateToProps = (state) => {
    return {
        loadMain: state.loadMain.data,
        organizationInfo: state.organizationInfo.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handlePrivateAccess: (data) => { dispatch(actions.privateAccess(data)) },
        handleOrganizationInfo: (data) => { dispatch(actions.organizationInfo(data)) },
        handleUserInfo: (data) => { dispatch(actions.userInfo(data)) },
        handleRegionInfo: (data) => { dispatch(actions.regionInfo(data)) },
        handleLoadMain: (data) => { dispatch(actions.loadMain(data)) },
        handleRoleInfo: (data) => { dispatch(actions.roleInfo(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(LogoLoader))