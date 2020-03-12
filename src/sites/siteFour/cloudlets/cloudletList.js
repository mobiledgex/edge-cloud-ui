import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';

import { fields } from '../../../services/model/format';
import { keys, showCloudlets, deleteCloudlet, streamCloudlet, SHOW_CLOUDLET, SHOW_ORG_CLOUDLET } from '../../../services/model/cloudlet';
import { showCloudletInfos, SHOW_CLOUDLET_INFO } from '../../../services/model/cloudletInfo';
import ClouldletReg from './siteFour_page_cloudletReg';

import * as constant from '../../../services/model/shared';
import { Button } from 'semantic-ui-react';

class PrivacyPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.action = '';
        this.data = {};
        this.keys = Object.assign([], keys);
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
                for (let i = 0; i < this.keys.length > 0; i++) {
                    let key = this.keys[i];
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
            keys: this.keys,
            onAdd: this.onAdd
        })
    }

    /**
   * Customized data block
   **/

    getCloudletInfoState = (data, isDetailView) => {
        let id = data[fields.cloudletStatus]
        let state = 'Not Present';
        let color = 'red'
        switch (id) {
            case 0:
                state = 'Unknown'
                break;
            case 1:
                state = 'Error'
                break;
            case 2:
                state = 'Online'
                color = 'green'
                break;
            case 3:
                state = 'Offline'
                break;
            case 4:
                state = 'Not Present'
                break;
            case 5:
                state = 'Init'
                break;
            case 6:
                state = 'Upgrade'
                break;
            default:
                state = 'Not Present'
                break;
        }

        return (
            isDetailView ? state :
                <Button basic size='mini' color={color} compact style={{ width: 100 }}>
                    <label>{state}</label>
                </Button>
        )
    }

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.cloudletStatus) {
                key.customizedData = this.getCloudletInfoState
            }
            else if (key.field === fields.state) {
                key.customizedData = constant.showProgress
            }
            else if (key.field === fields.ipSupport) {
                key.customizedData = constant.getIPSupport
            }
        }
    }

    /**
    * Customized data block
    * ** */

    componentWillMount() {
        this.customizedData()
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