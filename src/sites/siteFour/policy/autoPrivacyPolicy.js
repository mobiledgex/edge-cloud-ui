import _ from 'lodash'
import React from 'react';
import sizeMe from 'react-sizeme';
import MexListView from '../../../container/MexListView';
import MexDetailViewer from '../../../hoc/dataViewer/DetailViewer';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import * as serviceMC from '../../../services/serviceMC';
import {layouts} from '../../../services/formatter/formatPrivacyPolicy';
import PrivacyPolicyReg from './autoPrivacyPolicyReg'

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
        this.requestCount = 0;
        this.multiRequestData = [];
        this.data={}

        this.headerInfo = [
            { field: 'Region', label: 'Region', sortable: true, visible: true },
            { field: 'OrganizationName', label: 'Organization Name', sortable: true, visible: true },
            { field: 'PrivacyPolicyName', label: 'Privacy Policy Name', sortable: true, visible: true },
            { field: 'OutboundSecurityRulesCount', label: 'Rules Count', sortable: true, visible: true },
            { field: 'Actions', label: 'Actions', sortable: false, visible: true }
        ]

        this.actionMenu = [
            { label: 'View', onClick: this.onView },
            { label: 'Update', onClick: this.onAddPolicy },
            { label: 'Delete', onClick: this.onDelete }
        ]
    }

    getToken = () => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        return store.userToken
    }

    onAddPolicy = (data) => {
        this.data = data;
        this.action = 'Update'
        this.props.childPage(<PrivacyPolicyReg data={this.data} action={this.action} childPage={this.props.childPage}></PrivacyPolicyReg>)
    }

   
    onDelete = async (data) => {
        let privacypolicy = {
            key: { developer: data.OrganizationName, name: data.PrivacyPolicyName },
            outbound_security_rules : data.OutboundSecurityRules
        }

        let requestData = {
            Region: data.Region,
            privacypolicy: privacypolicy
        }
        let mcRequest = await serviceMC.sendSyncRequest(this, { token: this.getToken(), method: serviceMC.getEP().DELETE_PRIVACY_POLICY, data: requestData })
        if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
            this.props.handleAlertInfo('success', `Privacy Policy ${data.PrivacyPolicyName} deleted successfully`)
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

    componentWillMount() {
    }
   
    componentDidMount() {
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        if (!this.state.regions) this.setState({ regions: savedRegion })
        this.getDataDeveloper(this.props.changeRegion, this.state.regions || savedRegion);
    }

    

    componentWillReceiveProps(nextProps) {
        if(nextProps.viewMode !== this.props.viewMode)
        {
            if(this.props.viewMode === LIST_VIEW)
            {
                this.setState({
                    viewMode:LIST_VIEW,
                    detailData:{}
                })
            }
        }
        else if (nextProps.computeRefresh && nextProps.computeRefresh.compute) {
            this.getDataDeveloper(nextProps.changeRegion);
            this.props.handleComputeRefresh(false);
        }
        else if (this.props.changeRegion !== nextProps.changeRegion) {
            this.getDataDeveloper(nextProps.changeRegion);
        }
    }

    receiveResult = (mcRequest) => {
        this.requestCount -= 1;
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                if (response.data && response.data.length > 0) {
                    this.multiRequestData = [...this.multiRequestData, ...response.data]
                }
            }
        }

        if (this.requestCount === 0) {
            if (this.multiRequestData.length > 0) {
                let sortedData = _.orderBy(this.multiRequestData, ['Region', 'PrivacyPolicyName'])
                this.setState({
                    devData: sortedData
                })
                this.multiRequestData = [];
            } else {
                this.props.handleComputeRefresh(false);
                this.props.handleAlertInfo('error', 'Requested data is empty')
            }
        }
    }

    onDetailViewClose = ()=>
    {

    }

    onView = (data)=>
    {
        this.props.handleDetail({ data: null, viewMode: 'MexDetailView' })
        this.setState({
            viewMode : DETAIL_VIEW,
            detailData:data
        })
    }

    getDataDeveloper = (region, regionArr) => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let rgn = [];
        this.setState({ devData: [] })
        this.multiRequestData = [];
        this.requestCount = 0;
        if (region !== 'All') {
            rgn = [region]
        } else {
            rgn = (regionArr) ? regionArr : this.props.regionInfo.region;
        }

        if (rgn && rgn.length > 0) {
            this.requestCount = rgn.length;
            rgn.map((item) => {
                let requestData = { token: store ? store.userToken : 'null', method: serviceMC.getEP().SHOW_PRIVACY_POLICY, data: { region: item } };
                serviceMC.sendRequest(this, requestData, this.receiveResult)
            })
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
        handleInjectData: (data) => { dispatch(actions.injectData(data)) },
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data)) },
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageFlavor)));
