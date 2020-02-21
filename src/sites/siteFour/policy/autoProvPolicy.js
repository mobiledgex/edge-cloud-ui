import _ from 'lodash'
import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serverData from '../../../services/ServerData';
import SiteFourAutoProvPolicyReg from './autoProvPolicyReg'
import {layouts} from '../../../services/formatter/formatAutoProvPolicy';
import MexDetailViewer from '../../../hoc/dataViewer/DetailViewer';


const LIST_VIEW = 'ListView'
const DETAIL_VIEW = 'DetailView'
class SiteFourPageFlavor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            devData: [],
            viewMode:LIST_VIEW,
            detailData:{}
        };
        this.action = '';
        this.data = {}

        this.headerInfo = [
            { field: 'Region', label: 'Region', sortable: true, visible: true },
            { field: 'OrganizationName', label: 'Organization Name', sortable: true, visible: true },
            { field: 'AutoPolicyName', label: 'Auto Policy Name', sortable: true, visible: true },
            { field: 'DeployClientCount', label: 'Deploy Client Count', sortable: false, visible: true },
            { field: 'DeployIntervalCount', label: 'Deploy Interval Count', sortable: true, visible: true },
            { field: 'CloudletCount', label: 'Cloudlet Count', sortable: false, visible: true },
            { field: 'Actions', label: 'Actions', sortable: false, visible: true }
        ]

        this.actionMenu = [
            { label: 'View', onClick: this.onView },
            { label: 'Add Cloudlet', onClick: this.onAddCloudlet },
            { label: 'Delete Cloudlet', onClick: this.onDeleteCloudlet },
            { label: 'Delete', onClick: this.onDelete }
        ]
    }

    getToken = () => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        return store.userToken
    }

    onView = (data)=>
    {
        this.props.handleDetail({ data: null, viewMode: 'MexDetailView' })
        this.setState({
            viewMode : DETAIL_VIEW,
            detailData:data
        })
    }

    onAddCloudlet = (data) => {
        this.data = data;
        this.action = 'Add'
        this.props.childPage(<SiteFourAutoProvPolicyReg data={this.data} action={this.action} childPage={this.props.childPage}></SiteFourAutoProvPolicyReg>)
    }

    onDeleteCloudlet = (data) => {
        this.data = data;
        this.action = 'Delete'
        this.props.childPage(<SiteFourAutoProvPolicyReg data={this.data} action={this.action} childPage={this.props.childPage}></SiteFourAutoProvPolicyReg>)
    }

    onDelete = async (data) => {
        let AutoProvPolicy = {
            key: { developer: data.OrganizationName, name: data.AutoPolicyName }
        }

        let requestData = {
            Region: data.Region,
            AutoProvPolicy: AutoProvPolicy
        }
        let mcRequest = await serverData.deleteAutoProvPolicy(this, requestData)
        if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
            this.props.handleAlertInfo('success', `Auto Provisioning Policy ${data.AutoPolicyName} deleted successfully`)
        }
        this.props.handleComputeRefresh(true);
    }

    gotoUrl(site, subPath) {
        let mainPath = site;
        this.props.history.push({
            pathname: site,
            search: subPath
        });
        this.props.history.location.search = subPath;
        this.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })

    }


    componentDidMount() {
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        if (!this.state.regions) this.setState({ regions: savedRegion })
        this.getDataDeveloper(this.props.changeRegion, this.state.regions || savedRegion);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.viewMode !== this.props.viewMode) {
            if (this.props.viewMode === LIST_VIEW) {
                this.setState({
                    viewMode: LIST_VIEW,
                    detailData: {}
                })
            }
        }
        else if (nextProps.computeRefresh.compute) {
            this.getDataDeveloper(nextProps.changeRegion);
            this.props.handleComputeRefresh(false);
        }
        else if (this.props.changeRegion !== nextProps.changeRegion) {
            this.getDataDeveloper(nextProps.changeRegion);
        }
    }

    getDataDeveloper = async (region, regionArr) => {
        let rgn = []
        this.setState({ devData: [] })
        let multiRequestData = [];

        if (region !== 'All') {
            rgn = [region]
        } else {
            rgn = (regionArr) ? regionArr : this.props.regionInfo.region;
        }

        if (rgn && rgn.length > 0) {
            for (let i = 0; i < rgn.length; i++) {
                let dataList = await serverData.getAutoProvPolicy(this, { region: rgn[i] })
                if (dataList && dataList.length > 0) {
                    multiRequestData = [...multiRequestData, ...dataList]
                }
            }
            if (multiRequestData.length > 0) {
                let sortedData = _.orderBy(multiRequestData, ['Region', 'AutoPolicyName'])
                this.setState({
                    devData: sortedData
                })
            } else {
                this.props.handleComputeRefresh(false);
                this.props.handleAlertInfo('error', 'Requested data is empty')
            }
        }
    }
    render() {
        return (
            this.state.viewMode === LIST_VIEW ?
                <MexListView devData={this.state.devData} headerInfo={this.headerInfo} actionMenu={this.actionMenu} onSelect = {this.onView}/> :
                <MexDetailViewer detailData={this.state.detailData} layouts={layouts}/>
        )
    }
};

const mapStateToProps = (state) => {
    let viewMode = null;
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    if (state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
    }
    return {
        computeRefresh: (state.computeRefresh) ? state.computeRefresh : null,
        changeRegion: state.changeRegion.region ? state.changeRegion.region : null,
        regionInfo: regionInfo,
        viewMode : viewMode==='listView' ? DETAIL_VIEW : LIST_VIEW
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleDetail: (data) => { dispatch(actions.changeDetail(data)) },
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) },
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteFourPageFlavor));
