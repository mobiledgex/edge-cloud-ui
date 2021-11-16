import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';

import * as constant from './helper/montconstant'
import { fields } from '../../../services/model/format';
import { redux_org } from '../../../helper/reduxData';

import { HELP_MONITORING } from '../../../tutorial';

import AppSkeleton from './modules/app/AppSkeleton'
import ClusterSkeleton from './modules/cluster/ClusterSkeleton'
import CloudletSkeleton from './modules/cloudlet/CloudletSkeleton'
//services
import { showOrganizations } from '../../../services/modules/organization';

import './common/PageMonitoringStyles.css'
import './style.css'

import sortBy from 'lodash/sortBy'
import { Skeleton } from '@material-ui/lab';
import isEqual from 'lodash/isEqual';
import { authSyncRequest } from '../../../services/service';
import isEmpty from 'lodash/isEmpty';
import { NoData } from '../../../helper/formatter/ui';


class Monitoring extends React.Component {
    constructor(props) {
        super(props)
        this.regions = this.props.regions
        this.state = {
            maxHeight: 0,
            duration: constant.relativeTimeRanges[3],
            organizations: [],
            avgData: {},
            selectedOrg: undefined,
            showLoaded: false,
        }
        this._isMounted = false
        this.tableRef = React.createRef()
        this.selectedRow = undefined

    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

  
   






    onOrgChange = (value) => {
        let selectedOrg = value[fields.organizationName]
        this.orgType = value[fields.type]
        if (this._isMounted) {
            this.setState({ showLoaded: false, selectedOrg, rowSelected: 0 }, () => {
                this.setState({ avgData: this.defaultStructure() }, () => {
                    // this.fetchShowData()
                })
            })
        }
    }




    showAlert = (type, message) => {
        this.props.handleAlertInfo(type, message)
    }

    render() {
        const { filter, avgData, showLoaded } = this.state
        return (
            <div mex-test="component-monitoring" style={{ position: 'relative' }}>
                <React.Fragment>
                    {showLoaded ?
                        <div className="outer" style={{ height: 'calc(100vh - 106px)' }}>
                            {
                                !isEmpty(avgData) ?
                                    <React.Fragment>
                                       
                                    </React.Fragment> :
                                    <NoData />
                            }
                        </div> :
                        <React.Fragment>
                            <div className="outer" style={{ height: 'calc(100vh - 106px)' }}>
                                <Skeleton variant="rect" height={'25%'} style={{ marginBottom: 3 }} />
                                <AppSkeleton filter={filter} />
                                <ClusterSkeleton filter={filter} />
                                <CloudletSkeleton filter={filter} />
                            </div>
                        </React.Fragment>
                    }
                </React.Fragment>
            </div>
        )
    }

    fetchOrgList = async () => {
        let mc = await authSyncRequest(this, showOrganizations())
        if (mc && mc.response && mc.response.status === 200) {
            let organizations = sortBy(mc.response.data, [item => item[fields.organizationName].toLowerCase()], ['asc']);
            this.updateState({ organizations })
        }
    }

    defaultStructure = () => {
        let avgData = {}
        let parent = this.state.filter.parent
        if (constant.validateRole(parent.role, redux_org.roleType(this))) {
            this.regions.map((region) => {
                avgData[region] = {}
            })
        }
        return avgData
    }

    componentDidUpdate(preProps, preState) {
       
       if (this.props.organizationInfo && !isEqual(this.props.organizationInfo, preProps.organizationInfo)) {
            let parent = defaultParent(this)
            this.setState(prevState => {
                let filter = prevState.filter
                filter.parent = parent
                return { avgData: this.defaultStructure(), filter, showLoaded: false }
            }, () => {
                if (redux_org.isAdmin(this)) {
                    this.fetchOrgList()
                }
            })
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.props.handleViewMode(HELP_MONITORING)
        if (this._isMounted) {
            this.setState({ avgData: this.defaultStructure() }, () => {
                if (redux_org.isAdmin(this)) {
                    this.fetchOrgList()
                }
            })
        }
    }
}

const mapStateToProps = (state) => {
    return {
        privateAccess: state.privateAccess.data,
        organizationInfo: state.organizationInfo.data,
        regions: state.regionInfo.region
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(Monitoring));