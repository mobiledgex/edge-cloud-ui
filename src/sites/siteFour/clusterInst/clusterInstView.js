import _ from 'lodash'
import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import * as serverData from '../../../services/model/serverData';
import { fields } from '../../../services/model/format';
import { keys, showClusterInsts, SHOW_CLUSTER_INST, STREAM_CLUSTER_INST } from '../../../services/model/clusterInstance';
import { showCloudlets, SHOW_CLOUDLET, SHOW_ORG_CLOUDLET } from '../../../services/model/cloudlet';
import ClusterInstReg from './siteFour_page_clusterInstReg';

class ClusterInstView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.action = '';
        this.data = {}
    }

    onAdd = () => {
        this.setState({ currentView: <ClusterInstReg /> })
    }


    onDelete = async (data) => {
        let valid = false;
        let privacypolicy = {
            key: { developer: data[fields.organizationName], name: data[fields.privacyPolicyName] },
            outbound_security_rules: data[fields.outboundSecurityRules]
        }

        let requestData = {
            region: data[fields.region],
            privacypolicy: privacypolicy
        }
        let mcRequest = await serverData.deletePrivacyPolicy(this, requestData)
        if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
            this.props.handleAlertInfo('success', `Privacy Policy ${data[fields.privacyPolicyName]} deleted successfully`)
            valid = true;
        }
        return valid;
    }

    actionMenu = () => {
        return [
            { label: 'Delete', onClick: this.onDelete }
        ]
    }

    

    multiDataRequest = (mcRequestList) => {
        let cloudletDataList = [];
        let clusterDataList = [];
        for (let i = 0; i < mcRequestList.length; i++) {
            let mcRequest = mcRequestList[i];
            if (mcRequest.response) {
                let request = mcRequest.request;
                if (request.method === SHOW_CLOUDLET || request.method === SHOW_ORG_CLOUDLET) {
                    cloudletDataList = mcRequest.response.data;
                }
                if (mcRequest.request.method === SHOW_CLUSTER_INST) {
                    clusterDataList = mcRequest.response.data;
                }
            }
        }

        if (clusterDataList && clusterDataList.length > 0) {
            for (let i = 0; i < clusterDataList.length; i++) {
                let clusterData = clusterDataList[i]
                for (let j = 0; j < cloudletDataList.length; j++) {
                    let cloudletData = cloudletDataList[j]
                    if (clusterData[fields.cloudletName] === cloudletData[fields.cloudletName]) {
                        clusterData[fields.cloudletLocation] = cloudletData[fields.cloudletLocation];
                    }
                }
            }
        }
        return clusterDataList;
    }


    requestInfo = () => {
        return ({
            id:'ClusterInst',
            headerLabel: 'Cluster Instances',
            requestType: [showClusterInsts, showCloudlets],
            streamType: STREAM_CLUSTER_INST,
            isRegion: true,
            isMap:true,
            sortBy: [fields.region, fields.cloudletName],
            keys: keys,
            onAdd: this.onAdd
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={this.multiDataRequest}/>
        )
    }
};

const mapStateToProps = (state) => {
    return {}
};
const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ClusterInstView));