import React from "react";
import { withRouter } from 'react-router-dom';
import DataView from '../../../../hoc/datagrid/DataView';
//Mex
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
//model
import { HELP_OUTBOUND_LIST } from "../../../../tutorial";
import { perpetual } from "../../../../helper/constant";
import { codeHighLighter } from '../../../../hoc/highLighter/highLighter';
import { localFields } from "../../../../services/fields";
import { showFederator, showFederation, keys, iconKeys, deleteFederator, generateApiKey, multiDataRequest } from "../../../../services/modules/federation"
import { showFederationZones } from "../../../../services/modules/zones";
import { uiFormatter } from '../../../../helper/formatter';
import Reg from "./reg/Reg"
import RegisterOperator from "../reg/Federator";
import RegisterPartner from "../reg/Fedaration";
import ShareZones from "./reg/ShareZones";
import { InfoDialog } from "../../../../hoc/mexui";
import { responseValid } from "../../../../services/config";

class Host extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            currentView: null,
            open: false,
        },
        this.keys = keys(true)
        this.apiKey = undefined
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    resetView = () => {
        if (this._isMounted) {
            this.updateState({ currentView: null })
        }
    }

    onRegClose = (isEdited) => {
        this.resetView()
    }

    onAdd = (type) => {
        this.updateState({ currentView: <Reg onClose={this.onRegClose} /> });
    }

    onUpdate = (action, data) => {
        this.updateState({ currentView: <div className="round_panel"><RegisterOperator data={data} isUpdate={true} onClose={this.onRegClose} /></div> });
    }

    onAddPartnerData = (action, data) => {
        this.updateState({ currentView: <div className="round_panel"><RegisterPartner data={data} action={action.id} onClose={this.onRegClose} /></div> });
    }

    onCreateFederation = (action, data) => {
        this.updateState({ currentView: <Reg data={data} onClose={this.onRegClose} /> })
    }

    onShareZones = (action, data) => {
        this.updateState({ currentView: <div className="round_panel"><ShareZones id={action.id} data={data} onClose={this.onRegClose} /></div> })
    }

    createVisible = (data) => {
        return data[localFields.partnerFederationId] === undefined
    }

    federationNameVisible = (type, action, data) => {
        return true//data[localFields.partnerFederationId] !== undefined
    }

    onDialogClose = () => {
        this.updateState({
            open: false
        })
        this.apiKey = undefined
    }

    onGenerateApiKey = async (action, data) => {
        let mcRequest = await generateApiKey(this, data)
        if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
            this.props.handleAlertInfo('success', 'API Key generated successfully!')
            this.apiKey = mcRequest.response.data.apikey
            this.updateState({
                open: true
            })
        }
    }

    onDeleteHost = async (action, data, callback) => {
        let mc = await deleteFederator(this, data)
        if (responseValid(mc)) {
            this.props.handleAlertInfo('success', 'Federation host deleted successfully')
            callback()
        }
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onUpdate },
            { id: perpetual.ACTION_SHARE_ZONES, label: 'Share Zones', onClick: this.onShareZones, visibility: this.federationNameVisible, type: 'edit' },
            { id: perpetual.ACTION_UNSHARE_ZONES, label: 'Unshare Zones', onClick: this.onShareZones, visibility: this.federationNameVisible, type: 'edit' },
            { id: perpetual.ACTION_UPDATE_PARTNER, label: 'Enter Partner Details', visible: this.createVisible, onClick: this.onAddPartnerData },
            { id: perpetual.ACTION_GENERATE_API_KEY, label: 'Generate API Key', onClick: this.onGenerateApiKey, type: 'Generate API Key' },
            { id: perpetual.ACTION_HOST_DELETE, label: 'Delete', onClick: this.onDeleteHost, warning: 'delete' }
        ]
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === localFields.partnerRoleShareZoneWithSelf) {
            return uiFormatter.renderYesNo(key, data[key.field], isDetail)
        }
        if (key.field === localFields.partnerRoleAccessToSelfZones) {
            return uiFormatter.renderYesNo(key, data[key.field], isDetail)
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_OUTBOUND_FEDERATION,
            headerLabel: 'Host - Federation',
            requestType: [showFederation, showFederator, showFederationZones],
            sortBy: [localFields.region],
            // isRegion: true,
            keys: this.keys,
            onAdd: this.onAdd,
            nameField: localFields.partnerFederationName,
            viewMode: HELP_OUTBOUND_LIST,
            iconKeys: iconKeys(true),
            formatData: this.dataFormatter
        })
    }

    render() {
        const { tableHeight, currentView, open } = this.state
        return (
            <React.Fragment>
                <DataView id={perpetual.PAGE_FEDERATION} multiDataRequest={multiDataRequest} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} onClick={this.onListViewClick} tableHeight={tableHeight} handleListViewClick={this.handleListViewClick} />
                <InfoDialog open={open} onClose={this.onDialogClose} title={'Federation API Key'} note={'Make sure to copy API key now. You won\'t be able to see it again!'}>
                    <p>One-time generated key used for authenticating federation requests from partner operator</p>
                    {codeHighLighter(this.apiKey)}
                </InfoDialog>
            </React.Fragment>

        )
    }

    componentDidMount() {
        this._isMounted = true
        this.props.handleViewMode(HELP_OUTBOUND_LIST)
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
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(Host));