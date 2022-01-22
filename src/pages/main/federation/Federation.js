import React from "react";
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import DataView from '../../../container/DataView';
//Mex
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields } from '../../../services/model/format';
import { Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
//model
import { HELP_FEDERATION_LIST } from "../../../tutorial";
import { perpetual } from "../../../helper/constant";
import { showFederation, multiDataRequest, keys, deleteFederation } from "../../../services/modules/federation"
import { showFederator, deleteFederator, generateApiKey } from "../../../services/modules/federator"
import FederationReg from "./Reg"
import { codeHighLighter } from '../../../hoc/highLighter/highLighter';

class FederationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            currentView: null,
            open: false,
        },
            this.type = undefined
        this.keys = keys()
        this.apiKey = undefined
    }

    resetView = () => {
        if (this._isMounted) {
            this.updateState({ currentView: null })
        }
    }

    onRegClose = (isEdited) => {
        this.resetView()
    }
    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data }, () => {
                console.log(data)
            })
        }
    }


    checkForms = (form, forms, isInit) => {

    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }


    /*Required*/
    reloadForms = () => {
        this.setState({
            forms: this.state.forms
        })
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_LOCAL_FEDERATION,
            headerLabel: 'Local Federation',
            requestType: [showFederation, showFederator],
            sortBy: [fields.region, fields.federationName],
            keys: this.keys,
            onAdd: this.onAdd,
            nameField: fields.federationName,
            viewMode: HELP_FEDERATION_LIST,
            grouping: true
        })
    }
    onAdd = (type) => {
        this.updateState({ currentView: <FederationReg onClose={this.onRegClose} /> });
    }
    onUpdate = (action, data) => {
        this.updateState({ currentView: <FederationReg data={data} isUpdate={true} onClose={this.onRegClose} /> });
    }

    onAddPartnerData = (action, data) => {
        this.updateState({ currentView: <FederationReg data={data} partnerData={true} onClose={this.onRegClose} /> });
    }
    onCreateFederation = (action, data) => {
        this.updateState({ currentView: <FederationReg data={data} onClose={this.onRegClose} /> })
    }
    createVisible = (data) => {
        return data[fields.federationName] === undefined
    }
    federationNameVisible = (data) => {
        return data[fields.federationName] !== undefined
    }

    handleClose = () => {
        this.updateState({
            open: false
        })
        this.apiKey = undefined // to reset when there is no page reload
    }
    onGenerateApiKey = async (action, data) => {
        let mcRequest = await generateApiKey(this, data)
        if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
            this.props.handleAlertInfo('success', 'Api Key generated successfully !')
            this.apiKey = mcRequest.response.data.apikey
            this.updateState({
                open: true
            })
        }
    }

    getDeleteActionMessage = (action, data) => {
        return `Are you sure you want to remove self Data ?`
    }
    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Add Partner Data', visible: this.createVisible, onClick: this.onAddPartnerData, type: 'Add Partner Data' },
            { id: perpetual.ACTION_GENERATE_API_KEY, label: 'Generate API Key', onClick: this.onGenerateApiKey, type: 'Generate API Key' },
            { id: perpetual.ACTION_UPDATE, label: 'Update Self Data', onClick: this.onUpdate, type: 'Add Partner Data' },
            { id: perpetual.ACTION_DELETE, label: 'Delete Self Data', visible: this.createVisible, onClick: deleteFederator, type: 'Delete', dialogMessage: this.getDeleteActionMessage },
            { id: perpetual.ACTION_DELETE, label: 'Delete Federation', visible: this.federationNameVisible, onClick: deleteFederation, type: 'Delete' },
        ]
    }
    onValueChange = (form) => {

    }


    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
    }

    render() {
        const { tableHeight, currentView, open } = this.state
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <DataView id={perpetual.PAGE_FEDERATION} multiDataRequest={multiDataRequest} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} onClick={this.onListViewClick} tableHeight={tableHeight} handleListViewClick={this.handleListViewClick} />
                <Dialog open={open} onClose={this.onClose} aria-labelledby="profile" disableEscapeKeyDown={true}>
                    <DialogTitle id="profile">
                        <div style={{ float: "left", display: 'inline-block' }}>
                            <h3 style={{ fontWeight: 700 }}>API Key</h3>
                        </div>
                    </DialogTitle>
                    <DialogContent style={{ width: 600 }}>
                        <div style={{ display: 'inline' }}>{codeHighLighter(this.apiKey)}</div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} style={{ backgroundColor: 'rgba(118, 255, 3, 0.7)' }} size='small'>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }





    componentDidMount() {
        this._isMounted = true
        this.props.handleViewMode(HELP_FEDERATION_LIST)
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(FederationList));