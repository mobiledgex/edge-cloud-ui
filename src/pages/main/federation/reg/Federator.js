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
        { field: fields.mnc, label: 'MNC', formType: INPUT, placeholder: 'Enter MNC code', rules: { required: true, type: 'number' }, width: 7, visible: true, update: { edit: true } },
        { icon: 'delete', formType: ICON_BUTTON, visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removeMultiForm }
    ])

    getMNC = (form) => {
        return ({ uuid: uniqueId(), field: fields.mncmulti, formType: MULTI_FORM, forms: form ? form : this.mncElements(), width: 3, visible: true })
    }

    elements = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Enter'} Operator Details`, formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, update: { key: true } },
            { field: fields.operatorName, label: 'Operator', formType: this.isUpdate || redux_org.nonAdminOrg(this) ? INPUT : SELECT, placeholder: 'Select Operator', rules: { required: true, disabled: !redux_org.isAdmin(this) }, visible: true, value: redux_org.nonAdminOrg(this), tip: 'Organization of the federation site', update: { key: true } },
            { field: fields.countryCode, label: ' Country Code', formType: INPUT, placeholder: 'Enter Country Code', rules: { required: true }, visible: true, tip: 'ISO 3166-1 Alpha-2 code for the country where operator platform is located' },
            { field: fields.federationId, label: 'Federation ID', formType: INPUT, placeholder: 'Enter Federation ID', visible: true, tip: 'Globally unique string used to indentify a federation with partner federation' },
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
            let keyData = {
                ...data,
                federationId: responseData.federationid,
                federationAPIKey: responseData.apikey,
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
                forms.splice(8 + multiFormCount, 0, this.getMNC(mncForms))
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