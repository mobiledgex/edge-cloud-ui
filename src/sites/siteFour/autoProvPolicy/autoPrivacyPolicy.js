import _ from 'lodash'
import React from 'react';
import sizeMe from 'react-sizeme';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import * as serviceMC from '../../../services/serviceMC';
import PrivacyPolicyReg from './autoPrivacyPolicyReg'


let _self = null;
let rgn = [];
class SiteFourPageFlavor extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            devData: [],
            regionToggle: false,
            edit:false,
        };
        this.initLoad = false;
        this.action = '';
        this.requestCount = 0;
        this.multiRequestData = [];
        this.headerH = 70;
        this.hgap = 0;
        this.data={}

        this.headerInfo = [
            { field: 'Region', label: 'Region', sortable: true, visible: true },
            { field: 'OrganizationName', label: 'Organization Name', sortable: true, visible: true },
            { field: 'PrivacyPolicyName', label: 'Privacy Policy Name', sortable: true, visible: true },
            { field: 'OutboundSecurityRulesCount', label: 'Rules Count', sortable: true, visible: true },
            { field: 'Actions', label: 'Actions', sortable: false, visible: true }
        ]

        this.actionMenu = [
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
        if (mcRequest.response && mcRequest.response.status === 200) {
            this.props.handleAlertInfo('success', `${data.PrivacyPolicyName} Deleted Successfully`)
        }
        this.props.handleComputeRefresh(true);
    }

    gotoUrl(site, subPath) {
        let mainPath = site;
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })

    }

    componentWillMount() {
    }
   
    componentDidMount() {
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        if (!this.state.regions) this.setState({ regions: savedRegion })
        this.getDataDeveloper(this.props.changeRegion, this.state.regions || savedRegion);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.computeRefresh.compute) {
            this.getDataDeveloper(nextProps.changeRegion);
            this.props.handleComputeRefresh(false);
        }
        else if (this.props.changeRegion !== nextProps.changeRegion) {
            this.getDataDeveloper(nextProps.changeRegion);
        }
    }

    receiveResult = (mcRequest) => {
        _self.requestCount -= 1;
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                if (response.data.length > 0) {
                    _self.multiRequestData = [..._self.multiRequestData, ...response.data]
                }
            }
        }

        if (_self.requestCount === 0) {
            if (_self.multiRequestData.length > 0) {
                let sortedData = _.orderBy(_self.multiRequestData, ['Region', 'PrivacyPolicyName'])
                _self.setState({
                    devData: sortedData
                })
                _self.multiRequestData = [];
            } else {
                _self.props.handleComputeRefresh(false);
                _self.props.handleAlertInfo('error', 'Requested data is empty')
            }
        }
    }

    getDataDeveloper = (region, regionArr) => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
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
                serviceMC.sendRequest(_self, requestData, _self.receiveResult)
            })
        }
    }
    render() {
        return (
            <MexListView devData={this.state.devData} headerInfo={this.headerInfo} actionMenu={this.actionMenu} siteId={'Flavors'} dataRefresh={this.getDataDeveloper}></MexListView>
        );
    }
};

const mapStateToProps = (state) => {
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    return {
        computeRefresh: (state.computeRefresh) ? state.computeRefresh : null,
        changeRegion: state.changeRegion.region ? state.changeRegion.region : null,
        regionInfo: regionInfo
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) },
        handleInjectData: (data) => { dispatch(actions.injectData(data)) },
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data)) },
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageFlavor)));
