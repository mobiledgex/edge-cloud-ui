import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { redux_org } from '../../../../helper/reduxData'
import MexForms, { BUTTON, INPUT, MAIN_HEADER, SELECT } from '../../../../hoc/forms/MexForms'
import { localFields } from "../../../../services/fields";
import { createFederation } from '../../../../services/modules/federation';
import { readJsonFile } from '../../../../utils/file_util';
import { responseValid } from '../../../../services/config';
import MexMessageDialog from '../../../../hoc/dialog/mexWarningDialog';
class RegisterPartner extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            forms: [],
            dialogMessageInfo: {}
        }
        this._isMounted = false
    }

    elements = () => {
        return [
            { label: 'Enter Partner Details', formType: MAIN_HEADER, visible: true },
            { field: localFields.region, label: 'Region', formType: INPUT, placeholder: 'Select Region', rules: { disabled: true }, visible: true, update: { key: true } },
            { field: localFields.operatorName, label: 'Operator', formType: INPUT, placeholder: 'Select Operator', rules: { disabled: true }, visible: true, value: redux_org.nonAdminOrg(this), tip: 'Organization of the federation site', update: { key: true } },
            { field: localFields.countryCode, label: ' Country Code', formType: INPUT, placeholder: 'Enter Country Code', rules: { disabled: true, type: 'search' }, visible: true, tip: 'Country where operator platform is located' },
            { field: localFields.federationId, label: 'Federation ID', formType: INPUT, placeholder: 'Enter Federation ID', visible: true, rules: { disabled: true }, tip: 'Self federation ID' },
            { field: localFields.partnerOperatorName, label: 'Partner Operator', formType: INPUT, placeholder: 'Enter Partner Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: localFields.region }], tip: 'Globally unique string to identify an operator platform' },
            { field: localFields.partnerCountryCode, selectField: localFields.countryCode, label: 'Partner Country Code', formType: SELECT, placeholder: 'Select Partner Country Code', rules: { required: true }, visible: true, update: { key: true }, tip: 'Country where operator platform is located' },
            { field: localFields.partnerFederationId, label: 'Partner Federation ID', formType: INPUT, placeholder: 'Enter Partner Federation ID', visible: true, rules: { required: true }, tip: 'Globally unique string used to indentify a federation with partner federation' },
            { field: localFields.partnerFederationAddr, label: 'Partner Federation Addr', formType: INPUT, placeholder: 'Enter Partner Federation Addr', rules: { required: true }, visible: true, tip: 'Globally unique string used to indentify a federation with partner federation' },
            { field: localFields.partnerAPIKey, label: 'Partner API Key', formType: INPUT, placeholder: 'Enter Partner API Key', rules: { required: true, type:'password' }, visible: true, tip: 'API Key used for authentication (stored in secure storage)' },
            { field: localFields.partnerFederationName, label: 'Federation Name', formType: INPUT, placeholder: 'Enter Partner Federation Name', rules: { required: true }, visible: true, tip: 'Name to uniquely identify a federation' }
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
    onDialogClose = (valid) => {
        valid ? this.props.onClose(false) : this.updateState({ dialogMessageInfo: {} })
    }
    render() {
        const { forms } = this.state
        return (
            <React.Fragment>
                <MexForms forms={forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                <MexMessageDialog messageInfo={dialogMessageInfo} onClick={this.onDialogClose} />
            </React.Fragment>
        )
    }

    onCreate = async (data) => {
        const {onDialogOpen, onClose, handleAlertInfo} = this.props
        let mc = await createFederation(this, data)
        if (responseValid(mc)) {
            handleAlertInfo('success', `Partner federation ${data[localFields.partnerFederationName]} created successfully !`)
            onDialogOpen ? onDialogOpen(data) : onClose(data)
        }
    }

    onCancel = () => {
        this.updateState({
            dialogMessageInfo: {
                message: perpetual.EXIT_MESSAGE
            }
        })
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
                        case localFields.partnerCountryCode:
                            form.options = this.countryCodes;
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

    getFormData = async () => {
        const { data } = this.props
        this.countryCodes = await readJsonFile('countrycode-iso31661a2.json')
        let forms = this.elements()

        forms.push(
            { label: 'Create', formType: BUTTON, onClick: this.onCreate, validate: true },
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(RegisterPartner));