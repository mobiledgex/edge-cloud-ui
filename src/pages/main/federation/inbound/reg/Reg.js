import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../../actions';
//Mex
import MexForms, { SELECT, INPUT, MAIN_HEADER, HEADER, MULTI_FORM, ICON_BUTTON, DUALLIST } from '../../../../../hoc/forms/MexForms';
import { redux_org } from '../../../../../helper/reduxData'
//model
import { service, fields } from '../../../../../services'
import { HELP_INBOUND_REG, HELP_INBOUND_REG_1, HELP_INBOUND_REG_2 } from "../../../../../tutorial";
import { Item, Step, ListItem } from 'semantic-ui-react';
import { createFederator, updateFederator } from "../../../../../services/modules/federator"
import { createFederation, registerFederation, showRegisterPartnerZone, showDeregisterPartnerZone } from '../../../../../services/modules/federation'
import { Grid, Dialog, DialogTitle, DialogActions, DialogContent, Button, Typography } from '@material-ui/core';
import { perpetual } from '../../../../../helper/constant';
import { codeHighLighter } from '../../../../../hoc/highLighter/highLighter';
import { _sort } from '../../../../../helper/constant/operators';
import { getOrganizationList } from '../../../../../services/modules/organization';
import { ICON_COLOR } from '../../../../../helper/constant/colors';
import { showPartnerFederatorZone } from "../../../../../services/modules/inbound"
import { showAuthSyncRequest } from '../../../../../services/service';
import { uniqueId } from '../../../../../helper/constant/shared';

const stepData = [
    {
        step: "Step 1",
        description: "Create Self Operator"
    },
    {
        step: "Step 2",
        description: "Create Partner Operator"
    },
    {
        step: "Step 3",
        description: "Register Partner Zones"
    }
]
// const useStyles = makeStyles((theme) => ({


// }));
class InboundReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            open: false,
            step: 0,
            region: undefined
        }
        this._isMounted = false
        this.isUpdate = this.props.isUpdate
        //To avoid refeching data from server
        this.requestedRegionList = []
        this.operatorList = []
        this.routesList = [];
        this.federationId = undefined
        this.federatorData = undefined
        this.apiKey = undefined
        this.zoneList = []
        this.isZonesRegister = (this.props.action === perpetual.ACTION_REGISTER_ZONES)
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    checkForms = (form, forms, isInit, data) => {

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

    render() {
        const { open, step } = this.state
        return (
            <div className="round_panel">
                <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                    {this.props.action || this.isUpdate ? null :
                        <div>
                            <Step.Group stackable='tablet' style={{ width: '100%' }}>
                                {
                                    stepData.map((item, i) => (
                                        <Step active={step === i} key={i}>
                                            <Step.Content>
                                                <Step.Title>{item.step}</Step.Title>
                                                <Step.Description>{item.description}</Step.Description>
                                            </Step.Content>
                                        </Step>
                                    ))
                                }
                            </Step.Group>
                            <br />
                        </div>}
                    <Grid container>
                        <Grid item xs={this.state.step === 1 ? 9 : 12}>
                            <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} actionMenu={this.actionMenu} />
                        </Grid>
                    </Grid>
                </Item>
                {this.federationId ? <Dialog open={open} onClose={this.onClose} aria-labelledby="profile" disableEscapeKeyDown={true}>
                    <DialogTitle id="profile">
                        <div style={{ float: "left", display: 'inline-block' }}>
                            <h3 style={{ fontWeight: 700 }}>One time Key</h3>
                        </div>
                    </DialogTitle>
                    <DialogContent style={{ width: 500 }}>
                        <ListItem style={{ padding: '0 0 1rem 0' }}>
                            <h5>Self Federation ID </h5> <span id="federationID">{codeHighLighter(this.federationId)}</span>
                        </ListItem>
                        <ListItem>
                            <h5>Self Api Key</h5> <span id="apikey">{codeHighLighter(this.apiKey)}</span>
                        </ListItem>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} style={{ backgroundColor: 'rgba(118, 255, 3, 0.7)' }} size='small'>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog> : <Dialog open={open} aria-labelledby="profile" disableEscapeKeyDown={true}>
                    <DialogContent style={{ width: 500 }}>
                        <Typography style={{ marginTop: 20, fontSize: 16 }}>
                                You can register Later as well. Do you want to register Federation ?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.onRegisterFederation()} style={{ color: '#D3D3D3' }}>
                            NO
                        </Button>
                        <Button onClick={() => this.onRegisterFederation(true)} style={{ color: ICON_COLOR }}>
                            YES
                        </Button>
                    </DialogActions>
                </Dialog>}
            </div>
        )
    }

    onRegisterFederation = async (nextStep) => {
        this.handleClose()
        if (nextStep) {
            let mc = await registerFederation(this, this.federatorData)
            if (service.responseValid(mc)) {
                this.props.handleAlertInfo('success', `Federation registered successfully !`)
            }
        }
        this.registerZones(this.federatorData)
    }

    registerZones = async (data) => {
        let forms = this.step3(data)
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                form.value = data[form.field]
                this.checkForms(form, forms, true)
            }
        }
        let federationname = data[fields.federationName]
        let selfoperatorid = data[fields.operatorName]
        let operatorid = data[fields.partnerOperatorName]
        let zonesList = await showAuthSyncRequest(this, showPartnerFederatorZone(this, { federationname, selfoperatorid, operatorid }, true))
        this.zoneList = _sort(zonesList.map(zones => zones[fields.zoneId]))
        forms.push(
            { label: 'Register', formType: 'Button', onClick: this.onRegisterZones, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onCancel })
        this.setState({
            step: 2,
            forms: forms
        })
        this.props.handleViewMode(HELP_INBOUND_REG_2);
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
                if (form.formType === SELECT || form.formType === DUALLIST) {
                    switch (form.field) {
                        case fields.operatorName:
                            form.options = this.operatorList
                            break;
                        case fields.region:
                            form.options = this.props.regions;
                            break;
                        case fields.zonesList:
                            form.options = this.zoneList.map(data => ({ value: data, label: data }))
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    addForm = (e, form) => {
        let parent = form.parent;
        let forms = this.state.forms;
        forms.splice(parent.id + 1, 0, form.Form());
        this.updateState({ forms })
    }

    removeForm = (e, form) => {
        if (form.parent) {
            let updateForms = Object.assign([], this.state.forms)
            updateForms.splice(form.parent.id, 1);
            this.updateState({
                forms: updateForms
            })
        }
    }

    step1 = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Define'} Operator Detail`, formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, update: { key: true } },
            { field: fields.operatorName, label: 'Operator', formType: this.isUpdate || redux_org.nonAdminOrg(this) ? INPUT : SELECT, placeholder: 'Enter Partner Operator', rules: { required: true, disabled: !redux_org.isAdmin(this) }, visible: true, value: redux_org.nonAdminOrg(this), tip: 'Organization of the federation site', update: { key: true } },
            { field: fields.countryCode, label: ' Country Code', formType: INPUT, placeholder: 'Enter Partner Country Code', rules: { required: true }, visible: true, tip: 'ISO 3166-1 Alpha-2 code for the country where operator platform is located' },
            { field: fields.federationId, label: 'Federation ID', formType: INPUT, placeholder: 'Enter Federation ID', visible: true, tip: 'Globally unique string used to indentify a federation with partner federation' },
            { field: fields.locatorendpoint, label: 'Locator End point', formType: INPUT, placeholder: 'Enter Partner Locator Endpoint', visible: true, update: { edit: true }, tip: 'IP and Port of discovery service URL of operator platform' },
            { field: fields.mcc, label: 'MCC', formType: INPUT, placeholder: 'Enter MCC Code', rules: { required: true, type: 'number' }, visible: true, update: { edit: true }, tip: 'Mobile country code of operator sending the request' },
            { field: fields.mnc, label: 'List of MNC', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'List of mobile network codes of operator sending the request', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.getMnc }], visible: true, tip: 'List of mobile network codes of operator sending the request' },
        ]
    }

    step2 = () => {
        return [
            { label: 'Enter Partner Detail', formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: ' Self Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true, disabled: true }, visible: true, update: { key: true } },
            { field: fields.operatorName, label: 'Self Operator', formType: INPUT, placeholder: 'Select Operator', rules: { required: true, disabled: true }, visible: true, value: redux_org.nonAdminOrg(this), tip: 'Organization of the federation site', update: { key: true } },
            { field: fields.countryCode, label: ' Self Country Code', formType: INPUT, placeholder: 'Enter Country Code', rules: { required: true, disabled: true }, visible: true, tip: 'ISO 3166-1 Alpha-2 code for the country where operator platform is located' },
            { field: fields.federationId, label: 'Self Federation ID', formType: INPUT, placeholder: 'Enter Federation ID', visible: true, rules: { required: true, disabled: this.isUpdate ? true : false }, tip: 'Self federation ID', value: this.federationId },
            { field: fields.partnerOperatorName, label: 'Partner Operator', formType: INPUT, placeholder: 'Enter Partner Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }], tip: 'Globally unique string to identify an operator platform' },
            { field: fields.partnerCountryCode, label: 'Partner Country Code', formType: INPUT, placeholder: 'Enter Partner Country Code', rules: { required: true }, visible: true, tip: 'ISO 3166-1 Alpha-2 code for the country where operator platform is located' },
            { field: fields.partnerFederationid, label: 'Partner Federation ID', formType: INPUT, placeholder: 'Enter Partner Federation ID', visible: true, rules: { required: true }, tip: 'Globally unique string used to indentify a federation with partner federation' },
            { field: fields.federationAddr, label: 'Partner Federation Addr', formType: INPUT, placeholder: 'Enter Partner Federation Addr', rules: { required: true }, visible: true, tip: 'Globally unique string used to indentify a federation with partner federation' },
            { field: fields.apiKey, label: 'Partner Api Key', formType: INPUT, placeholder: 'Enter Partner Api Key', rules: { required: true }, visible: true, tip: 'API Key used for authentication (stored in secure storage)' },
            { field: fields.federationName, label: 'Federation Name', formType: INPUT, placeholder: 'Enter Partner Fderation Name', rules: { required: true }, visible: true, tip: 'Name to uniquely identify a federation' }
        ]
    }

    step3 = () => {
        return [
            { label: `${this.isZonesRegister ? 'Register' : 'Deregister'} Zones`, formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true, disabled: true }, visible: true, update: { key: true } },
            { field: fields.operatorName, label: 'Operator', formType: INPUT, placeholder: 'Select Operator', rules: { required: true, disabled: true }, visible: true, value: redux_org.nonAdminOrg(this), tip: 'Organization of the federation site', update: { key: true } },
            { field: fields.federationName, label: 'Federation Name', formType: INPUT, placeholder: 'Enter Partner Fderation Name', rules: { required: true, disabled: true }, visible: true, tip: 'Name to uniquely identify a federation' },
            { field: fields.partnerOperatorName, label: 'Partner operator', formType: INPUT, placeholder: 'Enter Partner Operator', rules: { required: true, disabled: true }, visible: true, dependentData: [{ index: 1, field: fields.region }], tip: 'Globally unique string to identify an operator platform' },
            { field: fields.zonesList, label: 'Zones', formType: DUALLIST, visible: true, rules: { required: true } }
        ]
    }

    updateFormData = (forms, data) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                if (form.forms && form.formType !== HEADER) {
                    this.updateFormData(form.forms, data)
                }
                else {
                    form.value = data[form.field]
                    this.checkForms(form, forms, true)
                }
            }
        }
    }

    mncForm = () => ([
        { field: fields.mnc, label: 'Mnc', formType: INPUT, placeholder: 'Enter Mnc code', rules: { required: true, type: 'number' }, width: 7, visible: true, update: { edit: true } },
        { icon: 'delete', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeMultiForm }
    ])

    getMnc = (form) => {
        return ({ uuid: uniqueId(), field: fields.mnc, formType: MULTI_FORM, forms: form ? form : this.mncForm(), width: 3, visible: true })
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
        let mncList = []
        let mc;
        let forms = this.state.forms
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.uuid) {
                let uuid = form.uuid;
                let multiFormData = data[uuid]
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
        if (this.props.isUpdate) {
            mc = await updateFederator(this, data)
        }
        else {
            mc = await createFederator(this, data)
        }
        if (service.responseValid(mc)) {
            this.props.handleAlertInfo('success', `Federation ${this.isUpdate ? 'updated' : 'created'} successfully !`)
            this.federationId = mc.response.data.federationid
            this.apiKey = mc.response.data.apikey
            this.updateState({ open: true })
            this.isUpdate ? this.props.onClose(true) : this.addUserForm(data)
        }
    }

    onCancel = async () => {
        this.props.onClose(false)
    }

    filterZones = () => {
        let removeList = []
        if (this.props.data) {
            let selectedZones = this.props.data[fields.zoneId]
            if (selectedZones && selectedZones.length > 0) {
                for (let i = 0; i < selectedZones.length; i++) {
                    let selectedZone = selectedZones[i];
                    for (let j = 0; j < this.zoneList.length; j++) {
                        let zoneid = this.zoneList[j]
                        if (selectedZone === zoneid) {
                            if (this.props.action === perpetual.ACTION_REGISTER_ZONES) {
                                this.zoneList.splice(j, 1)
                            }
                            else if (this.props.action === perpetual.ACTION_DEREGISTER_ZONES) {
                                removeList.push(zoneid)
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.zoneList = removeList.length > 0 ? removeList : this.zoneList
    }

    onRegisterResponse = (mcList) => {
        if (mcList && mcList.length > 0) {
            this.props.handleLoadingSpinner(false)
            mcList.map(mc => {
                if (mc.response) {
                    let data = mc.request.data;
                    let text = this.isZonesRegister ? 'Registered' : 'Deregister'
                    this.props.handleAlertInfo('success', `Zones ${text}  ${data} successfully !`)
                    this.props.onClose(true)
                }
            })
        }
    }

    onRegisterZones = async (data) => {
        let zonesList = data[fields.zonesList]
        let requestCall = this.isZonesRegister ? showRegisterPartnerZone : showDeregisterPartnerZone

        if (zonesList && zonesList.length > 0) {
            let requestList = []
            zonesList.forEach(zone => {
                let requestData = { ...data }
                requestData[fields.zoneId] = zone
                requestList.push(requestCall(requestData))
            })
            if (requestList && requestList.length > 0) {
                this.props.handleLoadingSpinner(true)
                service.multiAuthRequest(this, requestList, this.onRegisterResponse)
            }
        } else {
            this.props.onClose(true)
            this.props.handleAlertInfo('error', 'No Zones to register!')
        }
    }

    addUserForm = async (data) => {
        const registerAction = this.props.action === perpetual.ACTION_REGISTER_ZONES || this.props.action === perpetual.ACTION_DEREGISTER_ZONES
        let forms = registerAction ? this.step3(data) : this.step2(data)
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                form.value = data[form.field]
                this.checkForms(form, forms, true)
            }
        }

        if (registerAction) {
            let action = this.isZonesRegister ? 'Register' : 'Degister'
            forms.push(
                { label: `${action}`, formType: 'Button', onClick: this.onRegisterZones, validate: true },
                { label: 'Cancel', formType: 'Button', onClick: this.onCancel })

            this.updateState({
                forms,
                step: 2
            })
            this.props.handleViewMode(HELP_INBOUND_REG_2);
        } else {
            forms.push(
                { label: 'Create', formType: 'Button', onClick: this.onCreateFederation, validate: true },
                { label: 'Cancel', formType: 'Button', onClick: this.onCancel })
            this.setState({
                step: 1,
                forms: forms
            })
            this.props.handleViewMode(HELP_INBOUND_REG_1);
        }
    }

    onCreateFederation = async (data) => {
        if (data) {
            let mcRequest = await createFederation(this, data, this.federationId)
            if (service.responseValid(mcRequest)) {
                this.props.handleAlertInfo('success', `Federation ${data[fields.federationName]} Created successfully !`)
                this.federationId = undefined
                this.federatorData = data
                this.updateState({
                    open: true
                })
            }
        }
    }

    loadDefaultData = (forms, data) => {
        if (data[fields.mnc]) {
            let multiFormCount = 0;
            let mncArray = data[fields.mnc]
            for (let i = 0; i < mncArray.length; i++) {
                let mncArr = mncArray
                let mncForms = this.mncForm()
                for (let j = 0; j < mncForms.length; j++) {
                    let mncForm = mncForms[j];
                    if (mncForm.field === fields.mnc) {
                        mncForm.value = mncArr[j][0]
                    }
                }
                forms.splice(8 + multiFormCount, 0, this.getMnc(mncForms))
                multiFormCount = +1
            }
        }

    }
    filterZones = () => {
        let removeList = []
        if (this.props.data) {
            let selectedZones = this.props.data[fields.zoneId]
            if (selectedZones && selectedZones.length > 0) {
                for (let i = 0; i < selectedZones.length; i++) {
                    let selectedZone = selectedZones[i];
                    for (let j = 0; j < this.zoneList.length; j++) {
                        let zoneid = this.zoneList[j]
                        if (selectedZone === zoneid) {
                            if (this.props.action === perpetual.ACTION_REGISTER_ZONES) {
                                this.zoneList.splice(j, 1)
                            }
                            else if (this.props.action === perpetual.ACTION_DEREGISTER_ZONES) {
                                removeList.push(zoneid)
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.zoneList = removeList.length > 0 ? removeList : this.zoneList
    }
    getFormData = async (data) => {
        console.log(data, "data")
        let registerZones = this.props.action === perpetual.ACTION_REGISTER_ZONES || this.props.action === perpetual.ACTION_DEREGISTER_ZONES;
        // setting forms
        let forms;
        if (this.props.action === perpetual.ACTION_UPDATE_PARTNER) {
            forms = this.step2(data)
        }
        else if (registerZones) {
            forms = this.step3(data)

        } else {
            forms = this.step1(data)
        }
        if (data) {
            if (this.isUpdate) {
                this.loadDefaultData(forms, data)
            }
            else {
                if (registerZones) {
                    let federationname = data[fields.federationName]
                    let selfoperatorid = data[fields.operatorName]
                    let operatorid = data[fields.partnerOperatorName]
                    let zonesList = await showAuthSyncRequest(this, showPartnerFederatorZone(this, { federationname, selfoperatorid, operatorid }, true))
                    this.zoneList = _sort(zonesList.map(zones => zones[fields.zoneId]))
                    if (this.zoneList.length > 0) {
                        this.filterZones();
                    }
                    else {
                        this.props.handleAlertInfo('error', `No Zones to available for ${data[fields.federationName]} !`)
                        this.props.onClose(true)
                    }
                }
                this.organizationInfo = data
                this.addUserForm(data)
                this.setState({ step: registerZones ? 3 : 1 })
                this.props.handleViewMode(HELP_INBOUND_REG_2);
                return
            }
        }
        else {
            let orgList = await getOrganizationList(this, { type: perpetual.OPERATOR })
            this.operatorList = _sort(orgList.map(org => {
                return org[fields.organizationName]
            }))
        }
        forms.push(
            { label: `${this.isUpdate ? 'Update' : 'Create'}`, formType: 'Button', onClick: this.onCreateFederator, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onCancel }
        )
        this.updateFormData(forms, data)
        this.updateState({
            forms
        })
    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData(this.props.data)
        this.props.handleViewMode(HELP_INBOUND_REG)
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(InboundReg));