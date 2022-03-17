import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
//redux
import * as actions from '../../../actions';
//model
import * as shared from '../../../services/model/shared';
import { localFields } from '../../../services/fields';
import { keys, showClusterInsts, deleteClusterInst, streamClusterInst, multiDataRequest } from '../../../services/modules/clusterInst';
import { showCloudlets } from '../../../services/modules/cloudlet';
import { showCloudletInfoData } from '../../../services/modules/cloudletInfo';
//list
import DataView from '../../../container/DataView';
//reg
import ClusterInstReg from './Reg';
import { HELP_CLUSTER_INST_LIST } from "../../../tutorial";
import { perpetual, role } from '../../../helper/constant';
import { labelFormatter, serverFields, uiFormatter } from '../../../helper/formatter';
import { redux_org } from '../../../helper/reduxData';
import { developerRoles } from '../../../constant';

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
        this.multiStepperHeader = [{ label: 'Cluster', field: localFields.clusterName }, { label: 'Cloudlet', field: localFields.cloudletName }, { label: 'Operator', field: localFields.operatorName }]

    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    resetView = () => {
        this.updateState({ currentView: null })
    }

    onRegClose = (isEdited) => {
        this.resetView()
    }

    onAdd = (action, data) => {
        this.updateState({ currentView: <ClusterInstReg data={data} isUpdate={action ? true : false} onClose={this.onRegClose} /> })
    }

    getDeleteActionMessage = (action, data) => {
        if (data[localFields.cloudletStatus] !== serverFields.READY && redux_org.isAdmin(this)) {
            return `Cloudlet status is not online, do you still want to proceed with ${data[localFields.clusterName]} Cluster Instance deletion?`
        }
    }

    updateVisible = (data) => {
        return data[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onAdd, visible: this.updateVisible, type: 'Edit' },
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteClusterInst, dialogMessage: this.getDeleteActionMessage, ws: true, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteClusterInst, icon: 'delete', ws: true, warning: 'delete all the selected cluster instances', multiStepperHeader: this.multiStepperHeader, type: 'Edit' },
        ]
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === localFields.state) {
            return uiFormatter.showProgress(data, isDetail)
        }
        else if (key.field === localFields.reservable) {
            return labelFormatter.showYesNo(data[key.field])
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_CLUSTER_INSTANCES,
            headerLabel: 'Cluster Instances',
            nameField: localFields.clusterName,
            requestType: [showClusterInsts, showCloudlets, showCloudletInfoData],
            streamType: streamClusterInst,
            isRegion: true,
            isMap: true,
            selection: !redux_org.isOperator(this),
            sortBy: [localFields.region, localFields.cloudletName],
            keys: this.keys,
            onAdd:  role.validateRole(developerRoles, this.props.organizationInfo) ? this.onAdd : undefined,
            viewMode: HELP_CLUSTER_INST_LIST,
            grouping: true,
            formatData: this.dataFormatter
        })
    }

    render() {
        const { currentView } = this.state
        return (
            <DataView id={perpetual.PAGE_CLUSTER_INSTANCES} currentView={currentView} resetView={this.resetView} actionMenu={this.actionMenu} actionRoles={developerRoles} requestInfo={this.requestInfo} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu} />
        )
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ClusterInstView));