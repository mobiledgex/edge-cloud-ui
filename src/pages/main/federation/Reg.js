import React, { useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
//Mex
import MexForms, { SELECT, MULTI_SELECT, INPUT, MAIN_HEADER, HEADER, MULTI_FORM, ICON_BUTTON } from '../../../hoc/forms/MexForms';
import { redux_org } from '../../../helper/reduxData'
//model
import { service, fields, updateFieldData } from '../../../services';
import { HELP_FEDERATION_REG_1, HELP_FEDERATION_REG_2 } from "../../../tutorial";
import { Item, Step, Card, Form, Button } from 'semantic-ui-react';
import { createFederator, updateFederator } from "../../../services/modules/federator"
import { createFederation } from '../../../services/modules/federation'
import { Grid, Dialog, DialogTitle, List, DialogActions } from '@material-ui/core';
import { perpetual } from '../../../helper/constant';
import { showCloudlets } from '../../../services/modules/cloudlet';
import uuid from 'uuid';
import { validateRemoteCIDR, validateRemoteIP } from '../../../helper/constant/shared';
import { Icon } from 'semantic-ui-react';

class FederationReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            open: false
        }
        this._isMounted = false
        this.isUpdate = this.props.isUpdate
        //To avoid refeching data from server
        this.requestedRegionList = []
        this.cloudletList = []
        this.routesList = [];
        this.federationId = undefined
        this.federatorData = undefined
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    getCloudletInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.cloudletList = [...this.cloudletList, ...await service.showAuthSyncRequest(this, showCloudlets(this, { region }))]
        }
        this.updateUI(form)
        if (redux_org.isOperator(this)) {
            for (let form of forms) {
                if (form.field === fields.cloudletName) {
                    this.updateUI(form)
                    break;
                }
            }
        }
        this.updateState({ forms })
    }

    operatorValueChange = (currentForm, forms, isInit) => {
        for (let form of forms) {
            if (form.field === fields.cloudletName) {
                this.updateUI(form)
                if (!isInit) {
                    this.updateState({ forms })
                }
                break;
            }
        }
    }

    regionValueChange = (currentForm, forms, isInit) => {
        let region = currentForm.value;
        if (region) {
            for (let form of forms) {
                if (form.field === fields.operatorName) {
                    if (!isInit) {
                        this.getCloudletInfo(region, form, forms)
                    }
                    break;
                }
            }
            this.requestedRegionList.includes(region) ? this.requestedRegionList : this.requestedRegionList.push(region)
        }
    }

    checkForms = (form, forms, isInit = false) => {
        if (form.field === fields.region) {
            this.regionValueChange(form, forms, isInit)
        }
        else if (form.field === fields.operatorName) {
            this.operatorValueChange(form, forms, isInit)
        }
    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    /*Required*/
    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
    }
    handleClose = () => {
        this.updateState({
            open: false
        })
    }

    // copyToClipboard = (text) => {
    //     var text = document.getElementById("federationID");
    //     text.select();
    //     document.execCommand("copy");
    // };

    render() {
        const { open } = this.state
        console.log(this.state.forms, "forms", this.federationId, this.cloudletList, this.isUpdate)
        return (
            <div className="round_panel">
                <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                    {this.props.action || this.isUpdate ? null :
                        <div>
                            {/* <Step.Group stackable='tablet' style={{ width: '100%' }}>
                                {
                                    // stepData.map((item, i) => (
                                    <Step  >
                                        <Step.Content>
                                            <Step.Title>adc</Step.Title>
                                            <Step.Description>wdaw</Step.Description>
                                        </Step.Content>
                                    </Step>
                                    // ))
                                }
                            </Step.Group> */}
                            <br />
                        </div>}

                    {this.state.step === 2 ?
                        this.getStep3() :
                        <Grid container>
                            <Grid item xs={this.state.step === 1 ? 9 : 12}>
                                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} actionMenu={this.actionMenu} />
                            </Grid>
                            {/* {this.state.step === 1 ?
                                <Grid item xs={3}>
                                    {Object.keys(this.roles).map((key, i) => (
                                        key.includes(this.type) ? this.makeCardContent(i, key, this.roles[key]) : null
                                    ))}
                                </Grid> : null} */}
                        </Grid>}
                </Item>
                <Dialog open={open} onClose={this.onClose} aria-labelledby="profile" disableEscapeKeyDown={true}>
                    {/* {loading ? <LinearProgress /> : null} */}
                    <DialogTitle id="profile">
                        <div style={{ float: "left", display: 'inline-block' }}>
                            <h3 style={{ fontWeight: 700 }}>Self Federation ID</h3>
                        </div>

                    </DialogTitle>
                    <List style={{ marginLeft: 10 }}>
                        <Grid item xs={12}>
                            Federation ID : <div id="federationID">{this.federationId}1212121</div> <Icon name="copy outline"></Icon>
                        </Grid>
                    </List>
                    <DialogActions>
                        <Button onClick={this.handleClose} style={{ backgroundColor: 'rgba(118, 255, 3, 0.7)' }} size='small'>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    resetFormValue = (form) => {
        let rules = form.rules
        if (rules) {
            let disabled = rules.disabled ? rules.disabled : false
            if (!disabled) {
                form.value = undefined;
            }
        }
    }

    updateUI(form) {
        if (form) {
            this.resetFormValue(form)
            if (form.field) {
                if (form.formType === SELECT || form.formType === MULTI_SELECT) {
                    switch (form.field) {
                        case fields.operatorName:
                            form.options = this.cloudletList
                            break;
                        case fields.region:
                            form.options = this.props.regions;
                            break;
                        case fields.cloudletName:
                            form.options = this.cloudletList
                            break;
                        case fields.connectionType:
                            form.options = [perpetual.CONNECT_TO_ALL, perpetual.CONNECT_TO_CLUSTER_NODES, perpetual.CONNECT_TO_LOAD_BALANCER];
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    formKeys = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Create'} Network`, formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, tip: 'Select region where you want to Network.', update: { key: true } },
            { field: fields.operatorName, label: 'Operator', formType: this.isUpdate || redux_org.nonAdminOrg(this) ? INPUT : SELECT, placeholder: 'Select Operator', rules: { required: true, disabled: !redux_org.isAdmin(this) }, visible: true, value: redux_org.nonAdminOrg(this), dependentData: [{ index: 1, field: fields.region }], tip: 'Organization of the cloudlet site', update: { key: true } },
            { field: fields.cloudletName, label: 'Cloudlet Name', formType: this.isUpdate ? INPUT : SELECT, placeholder: 'Select Cloudlet Name', rules: { required: true }, visible: true, tip: 'Name of the cloudlet.', update: { key: true }, dependentData: [{ index: 1, field: fields.region }, { index: 2, field: fields.operatorName }] },
            { field: fields.networkName, label: 'Network Name', formType: INPUT, placeholder: 'Enter Network Name', rules: { required: true }, visible: true, update: { key: true } },
            { field: fields.connectionType, label: 'Connection Type', formType: SELECT, placeholder: 'Enter Connection Type', rules: { required: true }, update: { id: ['4'] }, visible: true },
            { field: fields.accessRoutes, label: 'Routes', formType: HEADER, update: { id: ['3', '3.1', '3.2'] }, forms: [{ formType: ICON_BUTTON, label: 'Add Connections', icon: 'add', visible: true, onClick: this.addForm, Form: this.getRoutesForm }], visible: true }
        ]
    }

    addForm = (e, form) => {
        let parent = form.parent;
        let forms = this.state.forms;
        forms.splice(parent.id + 1, 0, form.Form());
        this.updateState({ forms })
    }

    // dialogField = () => {
    //     return [
    //         { field: fields.federationId, label: 'Federation ID', formType: INPUT, rules: { disabled: true, copy: true }, visible: true, tip: 'Copy federation ID', value: this.federationId }
    //     ]
    // }

    removeForm = (e, form) => {
        if (form.parent) {
            let updateForms = Object.assign([], this.state.forms)
            updateForms.splice(form.parent.id, 1);
            this.updateState({
                forms: updateForms
            })
        }
    }

    step2 = (data) => {
        return [
            { label: 'Define Partner', formType: MAIN_HEADER, visible: true },
            { field: fields.partnerOperatorName, label: 'Operator', formType: INPUT, placeholder: 'Enter Partner Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }], tip: 'Globally unique string to identify an operator platform' },
            { field: fields.partnerCountryCode, label: 'Country Code', formType: INPUT, placeholder: 'Enter Partner Country Code', rules: { required: true }, visible: true, tip: 'ISO 3166-1 Alpha-2 code for the country where operator platform is located' },
            { field: fields.partnerFederationid, label: 'Federation ID', formType: INPUT, placeholder: 'Enter Partner Federation ID', visible: true, rules: { required: true }, tip: 'Globally unique string used to indentify a federation with partner federation' },
            { field: fields.federationAddr, label: 'Federation Addr', formType: INPUT, placeholder: 'Enter Partner Federation Addr', rules: { required: true }, visible: true, tip: 'Federation access point address' },
            { field: fields.apiKey, label: 'Api Key', formType: INPUT, placeholder: 'Enter Partner Api Key', rules: { required: true }, visible: true, tip: 'API Key used for authentication (stored in secure storage)' },
            { field: fields.federationName, label: 'Federation Name', formType: INPUT, placeholder: 'Enter Partner Fderation Name', rules: { required: true }, visible: true, tip: 'Name to uniquely identify a federation' }
        ]
    }

    step1 = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Define'} Self`, formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, update: { key: true } },
            { field: fields.operatorName, label: 'Operator', formType: this.isUpdate || redux_org.nonAdminOrg(this) ? INPUT : SELECT, placeholder: 'Select Operator', rules: { required: true, disabled: !redux_org.isAdmin(this) }, visible: true, value: redux_org.nonAdminOrg(this), dependentData: [{ index: 1, field: fields.region }], tip: 'Organization of the federation site', update: { key: true } },
            { field: fields.countryCode, label: 'Country Code', formType: INPUT, placeholder: 'Enter Country Code', rules: { required: true }, visible: true, update: { edit: true }, tip: 'ISO 3166-1 Alpha-2 code for the country where operator platform is located' },
            { field: fields.federationId, label: 'Federation ID', formType: INPUT, placeholder: 'Enter Federation ID', visible: true, update: { key: true } },
            { field: fields.locatorendpoint, label: 'Locator End point', formType: INPUT, placeholder: 'Enter Locator Endpoint', visible: true, update: { key: true }, tip: 'IP and Port of discovery service URL of operator platform' },
            { field: fields.mcc, label: 'MCC', formType: INPUT, placeholder: 'Enter MCC Code', rules: { required: true }, visible: true, update: { key: true }, tip: 'Mobile country code of operator sending the request' },
            { field: fields.mnc, label: 'MNC', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'List of mobile network codes of operator sending the request', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.getMnc }], visible: true, update: { id: ['39', '39.1', '39.2', '39.3'] }, tip: 'List of mobile network codes of operator sending the request' },
        ]
    }

    updateFormData = (forms, data) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                if (form.forms && form.formType !== HEADER && form.formType !== MULTI_FORM) {
                    this.updateFormData(form.forms, data)
                }
                else {
                    form.value = data[form.field]
                    this.checkForms(form, forms, true)
                }
            }
        }
    }

    getMncForm = () => ([
        { field: fields.mnc, label: '', formType: INPUT, placeholder: 'Enter Mnc code', rules: { required: true }, width: 7, visible: true },
        { icon: 'delete', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeMultiForm }
    ])

    getMnc = (form) => {
        return ({ uuid: uuid(), field: fields.mnc, formType: MULTI_FORM, forms: form ? form : this.getMncForm(), width: 3, visible: true })
    }

    removeMultiForm = (e, form) => {
        if (form.parent) {
            let updateForms = Object.assign([], this.state.forms)
            updateForms.splice(form.parent.id, 1);
            this.updateState({
                forms: updateForms
            })
        }
    }
    addMultiForm = (e, form) => {
        let parent = form.parent;
        let forms = this.state.forms;
        forms.splice(parent.id + 1, 0, form.multiForm());
        this.updateState({ forms })
    }
    onCreateFederator = async (data) => {
        console.log(data, "data")
        // this.addUserForm(data)
        let mncList = []
        let forms = this.state.forms
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];

            if (form.uuid) {
                let uuid = form.uuid;
                let multiFormData = data[uuid]
                console.log(multiFormData)
                if (multiFormData) {
                    if (form.field === fields.mnc) {
                        mncList.push(multiFormData[fields.mnc])
                    }
                }
                data[uuid] = undefined
            }
        }
        if (mncList.length > 0) {
            data[fields.mnc] = mncList
        }
        // if (this.props.isUpdate) {
        //     let updateData = updateFieldData(this, forms, data, this.props.data)
        //     if (updateData[fields.gpuConfig]) {
        //         updateData[fields.gpuDriverName] = data[fields.gpuDriverName]
        //         updateData[fields.gpuORG] = data[fields.gpuORG]
        //     }
        //     if ((updateData[fields.kafkaUser] || updateData[fields.kafkaPassword]) && !updateData[fields.kafkaCluster]) {
        //         updateData[fields.kafkaCluster] = data[fields.kafkaCluster]
        //         updateData.fields.push('42')
        //     }
        //     if (updateData.fields.length > 0) {
        //         this.props.handleLoadingSpinner(true)
        //         updateFederator(this, updateData, this.onCreateResponse)
        //     }
        // }
        // else {
        if (data) {
            console.log(data, "data")
            let mcRequest = this.isUpdate ? await updateFederator(this, data) : await createFederator(this, data)
            console.log(mcRequest, "mcRequest")
            if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
                this.props.handleAlertInfo('success', `Federator ${this.isUpdate ? 'updated' : 'created'} successfully`)
                this.updateState({ open: true })
                this.federationId = mcRequest.response.data.federationid
                this.isUpdate ? this.props.onClose() : this.addUserForm(data)
            }
        }
        // }
    }
    // onCreateResponse = async (mc) => {
    //     if (mc) {
    //         this.props.handleLoadingSpinner(false)
    //         if (mc.close && this.state.stepsArray.length === 0) {
    //             this.props.handleAlertInfo('success', 'Cloudlet updated successfully')
    //             this.props.onClose(true)
    //         }
    //         else {
    //             let responseData = undefined;
    //             let request = mc.request;
    //             if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
    //                 this.props.handleAlertInfo('success', `Organization ${data[fields.organizationName]} ${this.isUpdate ? 'updated' : 'created'} successfully`)
    //                 this.isUpdate ? this.props.onClose() : this.addUserForm(data)
    //             }
    //         }
    //     }
    // }

    onAddCancel = () => {
        this.props.onClose(false)
    }

    addUserForm = (data) => {
        let forms = this.step2(data)
        this.federatorData = data
        console.log(data, "data")
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                form.value = data[form.field]
                this.checkForms(form, forms, true)
            }
        }
        forms.push(
            { label: 'Create', formType: 'Button', onClick: this.onCreateFederation, validate: true },
            { label: 'Register', formType: 'Button', onClick: this.onRegister, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel, validate: true })
        this.setState({
            step: 1,
            forms: forms
        })
        this.props.handleViewMode(HELP_FEDERATION_REG_2);
    }
    onCreateFederation = async (data) => {
        console.log(this.federatorData, "federatorData")
        console.log(data, this.federationId, this.state.forms)
        if (data) {
            let mcRequest = await createFederation(this, data, this.federatorData, this.federationId)
            console.log(mcRequest, "mcRequest")
            if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
                this.props.handleAlertInfo('success', `Federation ${this.isUpdate ? 'updated' : 'created'} successfully`)
                this.federationId = mcRequest.response.data.federationid
                this.isUpdate ? this.props.onClose() : this.addUserForm(data)
            }
        }
    }
    loadDefaultData = (data) => {
        console.log(data, "data")

    }

    getFormData = (data) => {
        if (data) {
            if (this.isUpdate) {
                this.loadDefaultData(data)
            }
            else {
                this.organizationInfo = data
                this.addUserForm(data)
                this.setState({ step: 1 })
                this.props.handleViewMode(HELP_FEDERATION_REG_2);
                return
            }
        }

        let forms = this.step1()
        forms.push(
            { label: `${this.isUpdate ? 'Update' : 'Create'}`, formType: 'Button', onClick: this.onCreateFederator, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onCreateFederator })

        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                form.value = data[form.field]
                this.checkForms(form, forms, true)
            }
        }

        this.setState({
            forms: forms
        })


    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData(this.props.data)
        this.props.handleViewMode(HELP_FEDERATION_REG_1)
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data,
        regions: state.regionInfo.region
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(FederationReg));