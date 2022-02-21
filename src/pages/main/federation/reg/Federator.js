import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { redux_org } from '../../../../helper/reduxData'
import MexForms, { BUTTON, HEADER, ICON_BUTTON, INPUT, MAIN_HEADER, MULTI_FORM, SELECT } from '../../../../hoc/forms/MexForms'
import { fields } from '../../../../services'
import { _sort } from '../../../../helper/constant/operators';
import { getOrganizationList } from '../../../../services/modules/organization';
import { perpetual } from '../../../../helper/constant';
import { responseValid } from '../../../../services/service';
import { createFederator, updateFederator } from '../../../../services/modules/federation';
import { uniqueId } from '../../../../helper/constant/shared';
import FederationKey from './FederatorKey';

const countryCodes = require('../../../../assets/data/countrycode-iso31661a2.json')

class RegisterOperator extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            forms: [],
            keyData: undefined
        }
        this._isMounted = false
        this.isUpdate = this.props.isUpdate
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

    mncElements = () => ([
        { field: fields.mnc, label: 'MNC', formType: INPUT, placeholder: 'Enter MNC Code', rules: { required: true, type: 'number' }, width: 7, visible: true, update: { edit: true } },
        { icon: 'delete', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeMultiForm }
    ])

    getMNC = (form) => {
        return ({ uuid: uniqueId(), field: fields.mncmulti, formType: MULTI_FORM, forms: form ? form : this.mncElements(), width: 3, visible: true })
    }

    generateFederationId = (e, currentForm)=>{
        const {forms} = this.state
        for(const form of forms)
        {
            if(form.field === fields.federationId)
            {
                let childForms = form.forms
                for(const childForm of childForms)
                {
                    if(childForm.field === fields.federationId)
                    {
                        childForm.value = uniqueId()
                        break;
                    }
                }
                break;
            }
        }
        this.updateState({forms})
    }

    federationIdElements = () => ([
        { field: fields.federationId, formType: INPUT, placeholder: 'Enter/Generate Federation ID', rules: { required: true }, width: 15, visible: true },
        { icon: 'vpn_key', tooltip:'Generate Federation Key', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: -10 }, width: 1, onClick: this.generateFederationId }
    ])

    elements = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Enter'} Operator Details`, formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, update: { key: true } },
            { field: fields.operatorName, label: 'Operator', formType: this.isUpdate || redux_org.nonAdminOrg(this) ? INPUT : SELECT, placeholder: 'Select Operator', rules: { required: true, disabled: !redux_org.isAdmin(this) }, visible: true, value: redux_org.nonAdminOrg(this), tip: 'Organization of the federation site', update: { key: true } },
            { field: fields.countryCode, label: 'Country Code', formType: SELECT, placeholder: 'Select Country Code', rules: { required: true }, visible: true, update: { key: true }, tip: 'ISO 3166-1 Alpha-2 code for the country where operator platform is located' },
            this.isUpdate ? { field: fields.federationId, label: 'Federation ID', formType: INPUT, visible: true, tip: 'Self federation ID' } :
                { uuid: uniqueId(), field: fields.federationId, label: 'Federation ID', formType: INPUT, visible: true, forms: this.federationIdElements(), tip: 'Self federation ID' },
            { field: fields.locatorendpoint, label: 'Locator End Point', formType: INPUT, placeholder: 'Enter Locator Endpoint', visible: true, update: { edit: true }, tip: 'IP and Port of discovery service URL of operator platform' },
            { field: fields.mcc, label: 'MCC', formType: INPUT, placeholder: 'Enter MCC Code', rules: { required: true, type: 'number' }, visible: true, update: { edit: true }, tip: 'Mobile country code of operator sending the request' },
            { field: fields.mncs, label: 'List of MNC', formType: HEADER, forms: [{ formType: ICON_BUTTON, label: 'List of mobile network codes of operator sending the request', icon: 'add', visible: true, onClick: this.addMultiForm, multiForm: this.getMNC }], visible: true, tip: 'List of mobile network codes of operator sending the request' },
        ]
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    checkForms = (form, forms, isInit, data) => {

    }

    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    reloadForms = () => {

    }

    onFederationKeyDialogClose = () => {
        this.props.onClose(this.state.keyData)
        this.updateState({ keyData: undefined })
    }

    render() {
        const { forms, keyData } = this.state
        return (
            < React.Fragment >
                <MexForms forms={forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                <FederationKey data={keyData} onClose={this.onFederationKeyDialogClose} />
            </React.Fragment >
        )
    }

    onCreate = async (data) => {
        let mncList = []
        let forms = this.state.forms
        for (const form of forms) {
            if (form.uuid) {
                let uuid = form.uuid;
                let multiFormData = data[uuid]
                if (multiFormData) {
                    if (form.field === fields.mncmulti) {
                        mncList.push(multiFormData[fields.mnc])
                    }
                    else if(form.field === fields.federationId){
                        data[fields.federationId] = multiFormData[fields.federationId]
                    }
                }
                data[uuid] = undefined
            }
        }
        if (mncList.length > 0) {
            data[fields.mnc] = mncList
        }

        let mc = this.isUpdate ? await updateFederator(this, data) : await createFederator(this, data)
        if (responseValid(mc)) {
            const responseData = mc.response.data
            this.props.handleAlertInfo('success', `Federation ${this.isUpdate ? 'updated' : 'created'} successfully !`)
            let keyData = {...data}
            keyData[fields.federationId] =  responseData.federationid
            keyData[fields.apiKey] =  responseData.apikey

            let fedAddrs = responseData.federationaddr.split(':')
            if (fedAddrs && fedAddrs.length === 2) {
                keyData[fields.federationAddr] = `${window.location.protocol}//${window.location.hostname}:${fedAddrs[1]}`
            }
            this.updateState({ keyData })
        }
    }

    onCancel = async () => {
        this.props.onClose(false)
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
                        case fields.countryCode:
                            form.options = countryCodes;
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    updateFormData = (forms, data) => {
        for (let form of forms) {
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

    loadDefaultData = (forms, data) => {
        if (data[fields.mnc]) {
            let multiFormCount = 0;
            let mncList = data[fields.mnc]
            for (let mnc of mncList) {
                let mncForms = this.mncElements()
                for (let mncForm of mncForms) {
                    if (mncForm.field === fields.mnc) {
                        mncForm.value = mnc
                    }
                }
                forms.splice(9 + multiFormCount, 0, this.getMNC(mncForms))
                multiFormCount = +1
            }
        }
    }

    getFormData = async () => {
        const { data } = this.props
        let forms = this.elements()
        if (data) {
            this.loadDefaultData(forms, data)
        }
        else {
            this.operatorList = await getOrganizationList(this, { type: perpetual.OPERATOR })
            this.operatorList = _sort(this.operatorList.map(item => {
                return item[fields.organizationName]
            }))
        }

        forms.push(
            { label: `${this.isUpdate ? 'Update' : 'Create'}`, formType: BUTTON, onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: BUTTON, onClick: this.onCancel }
        )

        this.updateFormData(forms, data)
        this.updateState({
            forms
        })
    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData()
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(RegisterOperator));