import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';
import { edgeboxOnly, getOrganization, isOperator } from '../../../reducers/organizationInfo'

import { fields, isAdmin } from '../../../services/model/format';
import { keys, showCloudlets, deleteCloudlet, streamCloudlet, multiDataRequest } from '../../../services/model/cloudlet';
import { showCloudletInfos } from '../../../services/model/cloudletInfo';
import ClouldletReg from './cloudletReg';
import { validateRole, operatorRoles, INFRA_API_ACCESS_RESTRICTED, PAGE_CLOUDLETS, OPERATOR } from '../../../constant'
import * as shared from '../../../services/model/shared';
import { Icon, Popup } from 'semantic-ui-react';
import { HELP_CLOUDLET_LIST } from "../../../tutorial";
import { getCloudletManifest, revokeAccessKey } from '../../../services/model/cloudlet';
import MexMessageDialog from '../../../hoc/dialog/mexWarningDialog';
import { ACTION_DISABLE, ACTION_DELETE, ACTION_UPDATE, ACTION_MANIFEST } from '../../../container/Actions';
import { labelFormatter, uiFormatter } from '../../../helper/formatter';
class CloudletList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null,
            dialogMessageInfo: {}
        }
        this._isMounted = false;
        this.action = '';
        this.data = {};
        this.keys = keys();
        this.multiStepperHeader = [{ label: 'Cloudlet', field: fields.cloudletName }, { label: 'Operator', field: fields.operatorName }]
    }

    onRegClose = (isEdited) => {
        if (this._isMounted) {
            this.setState({ currentView: null })
        }
    }

    onAdd = (action, data) => {
        if (this._isMounted) {
            this.setState({ currentView: <ClouldletReg data={data} isUpdate={action ? true : false} onClose={this.onRegClose} /> });
        }
    }

    onCloudletManifest = async (action, data) => {
        let cloudletManifest = await getCloudletManifest(this, data)
        if (cloudletManifest) {
            if (cloudletManifest.response && cloudletManifest.response.data) {
                if (this._isMounted) {
                    this.setState({ currentView: <ClouldletReg data={data} manifestData={cloudletManifest.response.data} onClose={this.onRegClose} /> });
                }
            }
            else if (cloudletManifest.error && cloudletManifest.error.response) {
                let response = cloudletManifest.error.response
                if (response.data && response.data.message) {
                    let message = response.data.message
                    if (message === 'Cloudlet has access key registered, please revoke the current access key first so a new one can be generated for the manifest') {
                        let message = 'Cloudlet has access key registered, click on yes if you would like to revoke the current access key, so a new one can be generated for the manifest'
                        this.setState({ dialogMessageInfo: { message, data: data } })
                    }
                }

            }
        }

    }

    onCloudletManifestVisible = (data) => {
        return data[fields.infraApiAccess] === INFRA_API_ACCESS_RESTRICTED
    }

    onPreAction = (type, action, data) => {
        if (type === ACTION_DISABLE) {
            let disable = isAdmin() || data[fields.operatorName] === getOrganization(this)
            return !disable
        }
    }

    actionMenu = () => {
        return [
            { id: ACTION_UPDATE, label: 'Update', disable: this.onPreAction, onClick: this.onAdd, type: 'Edit' },
            { id: ACTION_DELETE, label: 'Delete', disable: this.onPreAction, onClick: deleteCloudlet, ws: true, type: 'Edit' },
            { id: ACTION_MANIFEST, label: 'Show Manifest', disable: this.onPreAction, visible: this.onCloudletManifestVisible, onClick: this.onCloudletManifest }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteCloudlet, icon: 'delete', ws: true, warning: 'delete all the selected cloudlets', multiStepperHeader: this.multiStepperHeader, type: 'Edit' },
        ]
    }

    customStream = (data) => {
        return data[fields.infraApiAccess] === 'Restricted' && data[fields.cloudletStatus] !== 2
    }

    canAdd = () => {
        if (validateRole(operatorRoles) && !(isOperator(this) && edgeboxOnly(this))) {
            return this.onAdd
        }
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.cloudletStatus) {
            return uiFormatter.cloudletInfoState(key, data, isDetail)
        }
        else if (key.field === fields.state) {
            return this.showProgress(data, isDetail)
        }
        else if (key.field === fields.trusted) {
            return uiFormatter.trusted(key, data, isDetail)
        }
        else if (key.field === fields.infraApiAccess) {
            return labelFormatter.infraApiAccess(data[key.field])
        }
        else if (key.field === fields.platformType) {
            return labelFormatter.platformType(data[key.field])
        }
        else if (key.field === fields.ipSupport) {
            return labelFormatter.ipSupport(data[key.field])
        }
    }

    requestInfo = () => {
        return ({
            id: PAGE_CLOUDLETS,
            headerLabel: 'Cloudlets',
            nameField: fields.cloudletName,
            requestType: [showCloudlets, showCloudletInfos],
            streamType: streamCloudlet,
            customStream: this.customStream,
            isRegion: true,
            isMap: true,
            selection: true,
            sortBy: [fields.region, fields.cloudletName],
            keys: this.keys,
            onAdd: this.canAdd(),
            viewMode: HELP_CLOUDLET_LIST,
            grouping: true,
            formatData:this.dataFormatter
        })
    }

    

    showProgress = (data, isDetailView) => {
        let progressRender = null
        if (!isDetailView && this.customStream(data)) {
            progressRender = <Popup content='View Progress' trigger={<Icon className={'progressIndicator'} loading color='green' name='circle notch' />} />
        }
        else {
            progressRender = shared.showProgress(data, isDetailView)
        }
        return progressRender
    }

    /**
    * Customized data block
    * ** */

    componentDidMount() {
        this._isMounted = true
    }

    onDialogClose = async (valid, data) => {
        this.setState({ dialogMessageInfo: {} })
        if (valid) {
            let mc = await revokeAccessKey(this, data)
            if (mc && mc.response && mc.response.status === 200) {
                this.onCloudletManifest(undefined, data)
            }
        }
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <React.Fragment>
                    <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu} />
                    <MexMessageDialog messageInfo={this.state.dialogMessageInfo} onClick={this.onDialogClose} />
                </React.Fragment>
        )
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
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(CloudletList));
