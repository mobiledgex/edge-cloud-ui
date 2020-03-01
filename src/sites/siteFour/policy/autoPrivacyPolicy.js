import _ from 'lodash'
import React from 'react';
import sizeMe from 'react-sizeme';
import MexListView from '../../../container/MexListView';
import MexDetailViewer from '../../../hoc/dataViewer/DetailViewer';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import * as serverData from '../../../services/model/serverData';
import {keys, actionMenu} from '../../../services/model/privacyPolicy';
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
        let mcRequest = await serverData.deletePrivacyPolicy(this, requestData )
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

    getDataDeveloper = async (region, regionArr) => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let rgn = [];
        this.setState({ devData: [] })
        let multiRequestData = [];
        if (region !== 'All') {
            rgn = [region]
        } else {
            rgn = (regionArr) ? regionArr : this.props.regionInfo.region;
        }

        if (rgn && rgn.length > 0) {
            for (let i = 0; i < rgn.length; i++) {
                let dataList = await serverData.getPrivacyPolicy(this, { region: rgn[i] })
                if (dataList && dataList.length > 0) {
                    multiRequestData = [...multiRequestData, ...dataList]
                }
            }
            if (multiRequestData.length > 0) {
                let sortedData = _.orderBy(multiRequestData, ['region', 'privacyPolicyName'])
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
                <MexListView devData={this.state.devData} headerInfo={keys(this)} actionMenu={actionMenu(this)} onSelect = {this.onView}/> :
                <MexDetailViewer detailData={this.state.detailData} keys={keys(this)}/>
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
