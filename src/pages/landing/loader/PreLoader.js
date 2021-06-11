import React from 'react'
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { getToken, sendMultiRequest } from '../../main/monitoring/services/service';
import RoleWorker from '../../../services/worker/role.worker.js'
import { showOrganizations } from '../../../services/model/organization';
import { PAGE_ORGANIZATIONS, validatePrivateAccess } from '../../../constant';
import { LS_ORGANIZATION_INFO, LS_USER_META_DATA, LS_REGIONS, organizationInfo } from '../../../helper/ls';
import './style.css'
import { withRouter } from 'react-router-dom';
import { redux_org } from '../../../helper/reduxData';
import { endpoint } from '../../../helper/constant';

class LogoLoader extends React.Component {

    constructor(props) {
        super(props)
        this.worker = new RoleWorker();
        this.count = 0
    }

    loadMainPage = () => {
        if (this.count === 3) {
            this.props.handleLoadMain(true)
            let currentPage = this.props.location.state ? this.props.location.state.currentPage : undefined
            this.props.history.push(currentPage ? currentPage : `/main/${PAGE_ORGANIZATIONS.toLowerCase()}`)
        }
    }

    cacheOrgInfo = (data) => {
        this.props.handleOrganizationInfo(data)
        localStorage.setItem(LS_ORGANIZATION_INFO, JSON.stringify(data))
    }

    validateAdmin = (dataList) => {
        this.worker.postMessage({ data: dataList, request: showOrganizations(), token: getToken(this) })
        this.worker.addEventListener('message', async (event) => {
            let roles = event.data.roles
            this.props.handleRoleInfo(roles)
            if (event.data.isAdmin) {
                this.cacheOrgInfo(roles[0])
            }
            else {
                let orgInfo = organizationInfo()
                if (redux_org.isAdmin(orgInfo)) {
                    localStorage.removeItem(LS_ORGANIZATION_INFO)
                }
                else if (redux_org.isOperator(orgInfo)) {
                    let privateAccess = await validatePrivateAccess(this, orgInfo)
                    this.props.handlePrivateAccess(privateAccess)
                }
                this.props.handleOrganizationInfo(organizationInfo())
            }
            this.count += 1
            this.loadMainPage()
        });
    }

    loadDefault = async () => {
        let requestList = []
        requestList.push({ method: endpoint.SHOW_CONTROLLER })
        requestList.push({ method: endpoint.SHOW_ROLE })
        requestList.push({ method: endpoint.CURRENT_USER })
        let mcList = await sendMultiRequest(this, requestList)
        if (mcList && mcList.length > 0) {
            mcList.map(mc => {
                if (mc.response && mc.response.status === 200) {
                    let request = mc.request
                    let data = mc.response.data
                    if (request.method === endpoint.SHOW_ROLE) {
                        this.validateAdmin(data)
                    }
                    else if (request.method === endpoint.SHOW_CONTROLLER) {
                        let regions = data.map(item => { return item.Region })
                        localStorage.setItem(LS_REGIONS, regions)
                        this.props.handleRegionInfo(regions)
                        this.count += 1
                    }
                    else if (request.method === endpoint.CURRENT_USER) {
                        localStorage.setItem(LS_USER_META_DATA, data.Metadata)
                        this.props.handleUserInfo(data)
                        this.count += 1
                    }
                }

            })
        }
        this.loadMainPage()

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
        this.loadDefault()
    }


    componentWillUnmount() {
        this.worker.terminate()
    }
}

const mapStateToProps = (state) => {
    return {
        loadMain: state.loadMain.data
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