import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
//redux
import * as actions from '../../../actions';
//model
import * as constant from '../../../constant';
import * as shared from '../../../services/model/shared';
import { fields, isAdmin } from '../../../services/model/format';
import { keys, showClusterInsts, deleteClusterInst, streamClusterInst, multiDataRequest } from '../../../services/model/clusterInstance';
import { showCloudlets } from '../../../services/model/cloudlet';
import { showCloudletInfos } from '../../../services/model/cloudletInfo';
//list
import MexListView from '../../../container/MexListView';
//reg
import ClusterInstReg from './clusterInstReg';
import {clusterInstTutor} from "../../../tutorial";

const clusterInstSteps = clusterInstTutor();

class ClusterInstView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.action = '';
        this.data = {};
        this.keys = keys();
    }

    onRegClose = (isEdited) => {
        this.setState({ currentView: null })
    }

    onAdd = (action, data) => {
        this.setState({ currentView: <ClusterInstReg data={data} isUpdate={action ? true : false} onClose={this.onRegClose} /> })

    }

    getDeleteActionMessage = (action, data) => {
        if (data[fields.cloudletStatus] !== constant.CLOUDLET_STATUS_READY && isAdmin()) {
            return `Cloudlet status is not online, do you still want to proceed with ${data[fields.clusterName]} Cluster Instance deletion?`
        }
    }

    actionMenu = () => {
        return [
            { label: 'Update', onClick: this.onAdd },
            { label: 'Delete', onClick: deleteClusterInst, dialogMessage: this.getDeleteActionMessage, ws: true }
        ]
    }

    requestInfo = () => {
        return ({
            id: 'ClusterInst',
            headerLabel: 'Cluster Instances',
            nameField: fields.clusterName,
            requestType: [showClusterInsts, showCloudlets, showCloudletInfos],
            streamType: streamClusterInst,
            isRegion: true,
            isMap: true,
            sortBy: [fields.region, fields.cloudletName],
            keys: this.keys,
            onAdd: this.onAdd,
            viewMode : clusterInstSteps.stepsClusterInst
        })
    }

    /**
   * Customized data block
   **/
    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.state) {
                key.customizedData = shared.showProgress
            }
            if (key.field === fields.reservable) {
                key.customizedData = constant.showYesNo
            }
        }
    }

    /**
    * Customized data block
    * ** */

   componentDidMount() {
        this.customizedData()
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} />
        )
    }
};

const mapStateToProps = (state) => {
    return {}
};
const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ClusterInstView));
