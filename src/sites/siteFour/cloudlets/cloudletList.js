import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';

import { fields } from '../../../services/model/format';
import { keys, showCloudlets, deleteCloudlet, streamCloudlet, SHOW_CLOUDLET, SHOW_ORG_CLOUDLET, STREAM_CLOUDLET } from '../../../services/model/cloudlet';
import { showCloudletInfos, SHOW_CLOUDLET_INFO } from '../../../services/model/cloudletInfo';
import ClouldletReg from './siteFour_page_cloudletReg';

class PrivacyPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.action = '';
        this.data = {}
    }

    onAdd = () => {
        this.setState({ currentView: <ClouldletReg /> })
    }

    actionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteCloudlet, ws: true }
        ]
    }

    multiDataRequest = (mcRequestList) => {
        let cloudletList = [];
        let cloudletInfoList = [];
        for (let i = 0; i < mcRequestList.length; i++) {
            let mcRequest = mcRequestList[i];
            let request = mcRequest.request;
            if (request.method === SHOW_CLOUDLET || request.method === SHOW_ORG_CLOUDLET) {
                for (let i = 0; i < keys.length > 0; i++) {
                    let key = keys[i];
                    if (key.field === fields.cloudletStatus) {
                        key.visible = request.method === SHOW_ORG_CLOUDLET ? false : true;
                        break;
                    }
                }
                cloudletList = mcRequest.response.data
            }
            else if (request.method === SHOW_CLOUDLET_INFO) {
                cloudletInfoList = mcRequest.response.data
            }
        }

        if (cloudletList && cloudletList.length > 0) {
            for (let i = 0; i < cloudletList.length; i++) {
                let cloudlet = cloudletList[i]
                for (let j = 0; j < cloudletInfoList.length; j++) {
                    let cloudletInfo = cloudletInfoList[j]
                    if (cloudlet[fields.cloudletName] === cloudletInfo[fields.cloudletName]) {
                        cloudlet[fields.cloudletStatus] = cloudletInfo[fields.state]
                        break;
                    }
                }
            }
        }
        return cloudletList;
    }


    requestInfo = () => {
        return ({
            id: 'Cloudlets',
            headerLabel: 'Cloudlets',
            nameField: fields.cloudletName,
            requestType: [showCloudlets, showCloudletInfos],
            streamType: streamCloudlet,
            isRegion: true,
            isMap: true,
            sortBy: [fields.region, fields.cloudletName],
            keys: keys,
            onAdd: this.onAdd
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={this.multiDataRequest} />
        )
    }
};

const mapStateToProps = (state) => {
    return {}
};
const mapDispatchProps = (dispatch) => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(PrivacyPolicy));