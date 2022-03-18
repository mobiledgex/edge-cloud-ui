import React from 'react';
import DataView from '../../../hoc/datagrid/DataView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';
import { redux_org } from '../../../helper/reduxData'

import { localFields } from '../../../services/fields';
import { keys, showCloudlets, deleteCloudlet, streamCloudlet, multiDataRequest, iconKeys } from '../../../services/modules/cloudlet';
import { showCloudletInfoData } from '../../../services/modules/cloudletInfo';
import CloudletReg from './Reg';
import { operatorRoles } from '../../../constant'
import { Icon, Popup } from 'semantic-ui-react';
import { HELP_CLOUDLET_LIST } from "../../../tutorial";
import { getCloudletManifest, revokeAccessKey, fetchShowNode } from '../../../services/modules/cloudlet';
import MexMessageDialog from '../../../hoc/dialog/mexWarningDialog';
import { serverFields, uiFormatter } from '../../../helper/formatter';
import { perpetual, role } from '../../../helper/constant';
import ShowNode from './ShowNode'
import AllianceOrganization from './AllianceOrganization';
import { ICON_COLOR } from '../../../helper/constant/colors';
import { responseValid } from '../../../services/config';

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
        this.multiStepperHeader = [{ label: 'Cloudlet', field: localFields.cloudletName }, { label: 'Operator', field: localFields.operatorName }]
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
        this.updateState({ currentView: <CloudletReg data={data} isUpdate={action ? true : false} onClose={this.onRegClose} /> });
    }

    onCloudletManifest = async (action, data) => {
        let cloudletManifest = await getCloudletManifest(this, data)
        if (cloudletManifest) {
            if (cloudletManifest.response && cloudletManifest.response.data) {
                if (this._isMounted) {
                    this.updateState({ currentView: <CloudletReg data={data} manifestData={cloudletManifest.response.data} onClose={this.onRegClose} /> });
                }
            }
            else if (cloudletManifest.error && cloudletManifest.error.response) {
                let response = cloudletManifest.error.response
                if (response.data && response.data.message) {
                    let message = response.data.message
                    if (message === 'Cloudlet has access key registered, please revoke the current access key first so a new one can be generated for the manifest') {
                        let message = 'Cloudlet has access key registered, click on yes if you would like to revoke the current access key, so a new one can be generated for the manifest'
                        this.updateState({ dialogMessageInfo: { message, data: data } })
                    }
                }

            }
        }

    }

    onCloudletManifestVisible = (data) => {
        return data[localFields.infraApiAccess] === perpetual.INFRA_API_ACCESS_RESTRICTED
    }

    onPreAction = (type, action, data) => {
        if (type === perpetual.ACTION_DISABLE) {
            let disable = redux_org.isAdmin(this) || data[localFields.operatorName] === redux_org.orgName(this)
            return !disable
        }
    }

    onShowNode = async (action, data)=>{
        let mc = await fetchShowNode(this, data)
        if(responseValid(mc))
        {
            const data = mc.response.data
            if (data && data.length > 0) {
                this.setState({ currentView: <ShowNode data={data} onClose={this.onRegClose} /> })
            }
            else
            {
                this.props.handleAlertInfo('error', 'Nodes not available')
            }
        }
    }

    onPreNodeAction = (type, action, data) => {
        return redux_org.isAdmin(this)
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', disable: this.onPreAction, onClick: this.onAdd, type: 'Edit' },
            { id: perpetual.ACTION_DELETE, label: 'Delete', disable: this.onPreAction, onClick: deleteCloudlet, ws: true, type: 'Edit' },
            { id: perpetual.ACTION_MANIFEST, label: 'Show Manifest', disable: this.onPreAction, visible: this.onCloudletManifestVisible, onClick: this.onCloudletManifest },
            { id: perpetual.ACTION_SHOW_NODE, label: 'Show Nodes', visibility: this.onPreNodeAction, onClick: this.onShowNode },
            { id: perpetual.ACTION_ADD_ALLIANCE_ORG, label: 'Add Alliance Organization', onClick: this.onActionAllianceOrg, type: 'Edit' },
            { id: perpetual.ACTION_REMOVE_ALLIANCE_ORG, label: 'Remove Alliance Organization', onClick: this.onActionAllianceOrg, type: 'Edit' }
        ]
    }

    onActionAllianceOrg = (action, data) => {
        data[localFields.allianceOrganization] || action.id === perpetual.ACTION_ADD_ALLIANCE_ORG ? this.updateState({ currentView: <AllianceOrganization data={data} org={true} action={action.id} onClose={() => this.resetView()} /> }) : this.props.handleAlertInfo('error', 'No Alliance Organization to Remove')
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteCloudlet, icon: 'delete', ws: true, warning: 'delete all the selected cloudlets', multiStepperHeader: this.multiStepperHeader, type: 'Edit' },
        ]
    }

    customStream = (data) => {
        return data[localFields.infraApiAccess] === serverFields.RESTRICTED_ACCESS && data[localFields.cloudletStatus] !== serverFields.READY
    }

    canAdd = () => {
        if (role.validateRole(operatorRoles, this.props.organizationInfo) && !(redux_org.isOperator(this) && redux_org.edgeboxOnly(this))) {
            return this.onAdd
        }
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === localFields.cloudletStatus) {
            return uiFormatter.cloudletInfoState(key, data, isDetail)
        }
        else if (key.field === localFields.state) {
            return this.showProgress(data, isDetail)
        }
        else if (key.field === localFields.trusted || key.field === localFields.gpuExist || key.field === localFields.platformHighAvailability) {
            return uiFormatter.renderYesNo(key, data[key.field], isDetail)
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_CLOUDLETS,
            headerLabel: 'Cloudlets',
            nameField: localFields.cloudletName,
            requestType: [showCloudlets, showCloudletInfoData],
            streamType: !redux_org.isDeveloper(this) && streamCloudlet,
            customStream: this.customStream,
            isRegion: true,
            isMap: true,
            selection: !redux_org.isDeveloper(this),
            sortBy: [localFields.region, localFields.cloudletName],
            keys: this.keys,
            onAdd: this.canAdd(),
            viewMode: HELP_CLOUDLET_LIST,
            grouping: true,
            iconKeys: iconKeys(),
            formatData: this.dataFormatter
        })
    }



    showProgress = (data, isDetailView) => {
        let progressRender = null
        if (!isDetailView && this.customStream(data)) {
            progressRender = <Popup content='View Progress' trigger={<Icon className={'progressIndicator'} loading color={ICON_COLOR} name='circle notch' />} />
        }
        else {
            progressRender = uiFormatter.showProgress(data, isDetailView, redux_org.isDeveloper(this))
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
        this.updateState({ dialogMessageInfo: {} })
        if (valid) {
            let mc = await revokeAccessKey(this, data)
            if (mc && mc.response && mc.response.status === 200) {
                this.onCloudletManifest(undefined, data)
            }
        }
    }

    render() {
        const { currentView } = this.state
        return (
            <React.Fragment>
                <DataView currentView={currentView} resetView={this.resetView} actionMenu={this.actionMenu} actionRoles={operatorRoles} requestInfo={this.requestInfo} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu} />
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
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(CloudletList));
