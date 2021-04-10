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
import { HELP_CLUSTER_INST_LIST } from "../../../tutorial";
import { ACTION_DELETE, ACTION_UPDATE } from '../../../container/Actions';

class ClusterInstView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.action = '';
        this.data = {};
        this.keys = keys();
        this._isMounted = false
        this.multiStepperHeader = [{ label: 'Cluster', field: fields.clusterName }, { label: 'Cloudlet', field: fields.cloudletName }, { label: 'Operator', field: fields.operatorName }]

    }

    onRegClose = (isEdited) => {
        if (this._isMounted) {
            this.setState({ currentView: null })
        }
    }

    onAdd = (action, data) => {
        if (this._isMounted) {
            this.setState({ currentView: <ClusterInstReg data={data} isUpdate={action ? true : false} onClose={this.onRegClose} /> })
        }
    }

    getDeleteActionMessage = (action, data) => {
        if (data[fields.cloudletStatus] !== constant.CLOUDLET_STATUS_READY && isAdmin()) {
            return `Cloudlet status is not online, do you still want to proceed with ${data[fields.clusterName]} Cluster Instance deletion?`
        }
    }

    updateVisible = (data) => {
        return data[fields.deployment] === constant.DEPLOYMENT_TYPE_KUBERNETES
    }

    actionMenu = () => {
        return [
            { id: ACTION_UPDATE, label: 'Update', onClick: this.onAdd, visible: this.updateVisible, type: 'Edit' },
            { id: ACTION_DELETE, label: 'Delete', onClick: deleteClusterInst, dialogMessage: this.getDeleteActionMessage, ws: true, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteClusterInst, icon: 'delete', ws: true, warning: 'delete all the selected cluster instances', multiStepperHeader: this.multiStepperHeader, type: 'Edit' },
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
            selection: true,
            sortBy: [fields.region, fields.cloudletName],
            keys: this.keys,
            onAdd: this.onAdd,
            viewMode: HELP_CLUSTER_INST_LIST,
            grouping: true
        })
    }

    /**
   * Customized data block
   **/
    showYesNo = (data, isDetailView) => {
        if (isDetailView) {
            return data[fields.reservable] ? YES : NO
        }
    }

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.state) {
                key.customizedData = shared.showProgress
            }
            if (key.field === fields.reservable) {
                key.customizedData = this.showYesNo
            }
        }
    }

    /**
    * Customized data block
    * ** */

    componentDidMount() {
        this._isMounted = true
        this.customizedData()
    }


    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu} />
        )
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(ClusterInstView));