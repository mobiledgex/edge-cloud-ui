import React, { useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
//Mex
import MexForms, { SELECT, INPUT, MAIN_HEADER, HEADER, MULTI_FORM, ICON_BUTTON } from '../../../hoc/forms/MexForms';
import { redux_org } from '../../../helper/reduxData'
//model
import { service, updateFieldData, fields } from '../../../services'
import { HELP_FEDERATION_REG_1, HELP_FEDERATION_REG_2 } from "../../../tutorial";
import { Item, Step, Button, ListItem } from 'semantic-ui-react';
import { createFederator, updateFederator } from "../../../services/modules/federator"
import { createFederation } from '../../../services/modules/federation'
import { Grid, Dialog, DialogTitle, List, DialogActions } from '@material-ui/core';
import { perpetual } from '../../../helper/constant';
import uuid from 'uuid';
import { codeHighLighter } from '../../../hoc/highLighter/highLighter';
import { _sort } from '../../../helper/constant/operators';
import { getOrganizationList } from '../../../services/modules/organization';
const stepData = [
    {
        step: "Step 1",
        description: "Create Self Operator"
    },
    {
        step: "Step 2",
        description: "Create Partner Operator"
    }]
// const useStyles = makeStyles((theme) => ({


// }));
class FederationReg extends React.Component {
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
        console.log(this.state.forms, "forms", this.federationId, this.cloudletList, this.isUpdate, step, open)
        return (
            <div className="round_panel">
                <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                    {this.props.action || this.isUpdate || this.props.partnerData ? null :
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

                    {this.state.step === 2 ?
                        this.getStep3() :
                        <Grid container>
                            <Grid item xs={this.state.step === 1 ? 9 : 12}>
                                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} actionMenu={this.actionMenu} />
                            </Grid>
                        </Grid>}
                </Item>
                <Dialog open={open} onClose={this.onClose} aria-labelledby="profile" disableEscapeKeyDown={true}>
                    <DialogTitle id="profile">
                        <div style={{ float: "left", display: 'inline-block' }}>
                            <h3 style={{ fontWeight: 700 }}>One Time Key</h3>
                        </div>
                    </DialogTitle>
                    <List style={{ width: 400, padding: '2rem' }}>
                        <ListItem style={{ padding: '0 0 1rem 0' }}>
                            <h5>Federation ID </h5> <span id="federationID">{codeHighLighter(this.federationId)}</span>
                        </ListItem>
                        <ListItem>
                            <h5>Api Key</h5> <span id="apikey">{codeHighLighter(this.apiKey)}</span>
                        </ListItem>
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
                if (form.formType === SELECT) {
                    switch (form.field) {
                        case fields.operatorName:
                            form.options = this.operatorList
                            break;
                        case fields.region:
                            form.options = this.props.regions;
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

    step2 = () => {
        return [
            { label: 'Self Operator', formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true, disabled: true }, visible: true, update: { key: true } },
            { field: fields.operatorName, label: 'Operator', formType: this.isUpdate || redux_org.nonAdminOrg(this) ? INPUT : SELECT, placeholder: 'Select Operator', rules: { required: true, disabled: true }, visible: true, value: redux_org.nonAdminOrg(this), tip: 'Organization of the federation site', update: { key: true } },
            { field: fields.countryCode, label: 'Country Code', formType: INPUT, placeholder: 'Enter Country Code', rules: { required: true, disabled: true }, visible: true, tip: 'ISO 3166-1 Alpha-2 code for the country where operator platform is located' },
            { field: fields.federationId, label: 'Federation ID', formType: INPUT, placeholder: 'Enter Federation ID', visible: true, rules: { disabled: true } },
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
            { field: fields.operatorName, label: 'Operator', formType: this.isUpdate || redux_org.nonAdminOrg(this) ? INPUT : SELECT, placeholder: 'Select Operator', rules: { required: true, disabled: !redux_org.isAdmin(this) }, visible: true, value: redux_org.nonAdminOrg(this), tip: 'Organization of the federation site', update: { key: true } },
            { field: fields.countryCode, label: 'Country Code', formType: INPUT, placeholder: 'Enter Country Code', rules: { required: true }, visible: true, tip: 'ISO 3166-1 Alpha-2 code for the country where operator platform is located' },
            { field: fields.federationId, label: 'Federation ID', formType: INPUT, placeholder: 'Enter Federation ID', visible: true },
            { field: fields.locatorendpoint, label: 'Locator End point', formType: INPUT, placeholder: 'Enter Locator Endpoint', visible: true, update: { edit: true }, tip: 'IP and Port of discovery service URL of operator platform' },
            { field: fields.mcc, label: 'MCC', formType: INPUT, placeholder: 'Enter MCC Code', rules: { required: true }, visible: true, update: { edit: true }, tip: 'Mobile country code of operator sending the request' },
            { field: fields.mnc, label: 'List of MNC', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'List of mobile network codes of operator sending the request', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.getMnc }], visible: true, tip: 'List of mobile network codes of operator sending the request' },
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
        { field: fields.mnc, label: 'Mnc', formType: INPUT, placeholder: 'Enter Mnc code', rules: { required: true }, width: 7, visible: true, update: { edit: true } },
        { icon: 'delete', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeMultiForm }
    ])

    getMnc = (form) => {
        return ({ uuid: uuid(), field: fields.mnc, formType: MULTI_FORM, forms: form ? form : this.mncForm(), width: 3, visible: true })
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
        console.log(this.props.isUpdate)
        if (this.props.isUpdate) {
            let updateData = updateFieldData(this, forms, data, this.props.data)
            console.log(updateData.fields.length)
            if (updateData.fields.length > 0) {
                mc = await updateFederator(this, updateData)
            }
        }
        else {
            mc = await createFederator(this, data)
        }
        if (service.responseValid(mc)) {
            this.props.handleAlertInfo('success', `Self Data ${this.isUpdate ? 'updated' : 'created'} successfully`)
            this.federationId = mc.response.data.federationid
            this.apiKey = mc.response.data.apikey
            this.updateState({ open: true })
            this.isUpdate ? this.props.onClose(true) : this.addUserForm(data)
        }
    }

    onCancel = async () => {
        this.props.onClose(false)
    }

    addUserForm = (data) => {
        let forms = this.step2(data)
        this.federatorData = data[fields.operatorName]
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
            { label: 'Cancel', formType: 'Button', onClick: this.onCancel })
        this.setState({
            step: 1,
            forms: forms
        })
        this.props.handleViewMode(HELP_FEDERATION_REG_2);
    }

    onCreateFederation = async (data) => {
        if (data) {
            const requestData = { ...data, ...{ [fields.federationId]: this.federationId, [fields.operatorName]: this.federatorData } }
            let mcRequest = await createFederation(this, requestData)
            if (service.responseValid(mcRequest)) {
                this.props.handleAlertInfo('success', `Federation Created successfully`)
                this.props.onClose(true)
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
                        mncForm.value = mncArr[j]
                    }
                }
                forms.splice(8 + multiFormCount, 0, this.getMnc(mncForms))
                multiFormCount = +1
            }
        }

    }

    getFormData = async (data) => {
        let forms = this.props.partnerData ? this.step2() : this.step1()
        if (data) {
            if (this.isUpdate) {
                this.loadDefaultData(forms, data)
            }
            else {
                this.federationId = data.federationId 
                this.organizationInfo = data
                this.addUserForm(data)
                this.setState({ step: 1 })
                this.props.handleViewMode(HELP_FEDERATION_REG_2);
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