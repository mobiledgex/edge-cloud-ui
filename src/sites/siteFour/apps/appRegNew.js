import React from 'react';
import uuid from 'uuid';
import { withRouter } from 'react-router-dom';
//Mex
import MexForms, { SELECT, MULTI_SELECT, BUTTON, INPUT, CHECKBOX, TEXT_AREA } from '../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields } from '../../../services/model/format';
//model
import { getOrganizationList } from '../../../services/model/organization';
import { } from '../../../services/model/app';

class ClusterInstReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
        }
        this.isUpdate = this.props.isUpdate
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        //To avoid refecthing data from server
    }

    portForm = () => ([
        { field: fields.portRangeMin, label: 'Port Range Min', formType: INPUT, rules: { required: true, type: 'number' }, width: 9, visible: true },
        { field: fields.protocol, label: 'Protocol', formType: SELECT, rules: { required: true, allCaps: true }, width: 4, visible: true, options: ['tcp', 'udp', 'icmp'] },
        { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 3, onClick: this.removePortForms }
    ])

    multiPortForm = () => ([
        { field: fields.portRangeMin, label: 'Port Range Min', formType: INPUT, rules: { required: true, type: 'number' }, width: 4, visible: true },
        { icon: '~', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1 },
        { field: fields.portRangeMin, label: 'Port Range Min', formType: INPUT, rules: { required: true, type: 'number' }, width: 4, visible: true },
        { field: fields.protocol, label: 'Protocol', formType: SELECT, rules: { required: true, allCaps: true }, width: 4, visible: true, options: ['tcp', 'udp', 'icmp'] },
        { icon: 'delete', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 3, onClick: this.removePortForms }
    ])

    deploymentManifestForm = () => ([
        { field: fields.portRangeMin, formType: TEXT_AREA, rules: { required: false }, width: 14, visible: true },
        { icon: 'browse', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removePortForms },
        { icon: 'clear', formType: 'IconButton', visible: true, color: 'white', style: { color: 'white', top: 15 }, width: 1, onClick: this.removePortForms }
    ])

    getPortForm = (form) => (
        { uuid: uuid(), field: fields.outboundSecurityRules, formType: 'MultiForm', forms: form, width: 3, visible: true }
    )

    getMultiPortForm = (form) => (
        { uuid: uuid(), field: fields.outboundSecurityRules, formType: 'MultiForm', forms: form, width: 3, visible: true }
    )


    removePortForms = (form) => {
        if (form.parent) {
            let updateForms = Object.assign([], this.state.forms)
            updateForms.splice(form.parent.id, 1);
            this.setState({
                forms: updateForms
            })
        }

    }

    addPortForms = () => {
        this.setState(prevState => ({ forms: [...prevState.forms, this.getPortForm(this.portForm())] }))
    }

    addMultiPortForms = () => {
        this.setState(prevState => ({ forms: [...prevState.forms, this.getMultiPortForm(this.multiPortForm())] }))
    }

    formKeys = () => {
        return [
            { label: 'Apps', formType: 'Header', visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, tip: 'Allows developer to upload app info to different controllers' },
            { field: fields.organizationName, label: 'Organization', formType: SELECT, placeholder: 'Select Organization', rules: { required: true, disabled: false }, visible: true,tip: 'Organization or Company Name that a Developer is part of' },
            { field: fields.appName, label: 'App Name', formType: INPUT, placeholder: 'Enter App Name', rules: { required: true }, visible: true },
            { field: fields.version, label: 'App Version', formType: INPUT, placeholder: 'Enter App Version', rules: { required: true }, visible: true },
            { field: fields.deployment, label: 'Deployment Type', formType: SELECT, placeholder: 'Select Deployment Type', rules: { required: true }, visible: true, update: true },
            { field: fields.imageType, label: 'Image Type', formType: INPUT, placeholder: 'Enter Image Type', rules: { required: false }, visible: false, },
            { field: fields.imagePath, label: 'Image Path', formType: INPUT, placeholder: 'Enter Image Path', rules: { required: true }, visible: true, },
            { field: fields.authPublicKey, label: 'Auth Public Key', formType: TEXT_AREA, placeholder: 'Enter Auth Public Key', rules: { required: false }, visible: true, },
            { field: fields.defaultFlavorName, label: 'Default Flavor', formType: SELECT, placeholder: 'Select Flavor', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }] },
            { field: fields.defaultPrivacyPolicy, label: 'Default Privacy Policy', formType: SELECT, placeholder: 'Select Privacy Policy', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }] },
            { field: fields.autoPolicyName, label: 'Auto Provisioning Policy', formType: SELECT, placeholder: 'Select Auto Provisioning Policy', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }] },
            { field: fields.officialFQDN, label: 'Official FQDN', formType: INPUT, placeholder: 'Enter Official FQDN', rules: { required: false }, visible: true },
            { field: fields.androidPackageName, label: 'Android Package Name', formType: INPUT, placeholder: 'Enter Package Name', rules: { required: false }, visible: true },
            { field: fields.scaleWithCluster, label: 'Scale With Cluster', formType: CHECKBOX, visible: true, value: false },
            { field: fields.command, label: 'Command', formType: INPUT, placeholder: 'Enter Command', rules: { required: false }, visible: true },
            { field: fields.deploymentManifest, label: 'Deployment Manifest', formType: TEXT_AREA, visible: true, forms: this.deploymentManifestForm() },
            { label: 'Ports', formType: 'Header', forms: [{ formType: BUTTON, label: 'Add Port Mapping', visible: true, onClick: this.addPortForms }, { formType: BUTTON, label: 'Add Multiport Mapping', visible: true, onClick: this.addMultiPortForms }], visible: true },
        ]
    }

    checkForms = (form, forms, isInit) => {

    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    onCreate = async (data) => {
        if (data) {
            let cloudlets = data[fields.cloudletName];
            if (this.props.isUpdate) {
                //update cluster data
            }
            else {
                if (cloudlets && cloudlets.length > 0) {
                    for (let i = 0; i < cloudlets.length; i++) {
                        let cloudlet = cloudlets[i];
                        data[fields.cloudletName] = cloudlet;
                    }

                }
            }
        }
    }


    /*Required*/
    reloadForms = () => {
        this.setState({
            forms: this.state.forms
        })
    }

    stepperClose = () => {
        this.setState({
            stepsArray: []
        })
        this.props.onClose(true)
    }

    onAddCancel = () => {
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
                if (form.formType === SELECT || form.formType === MULTI_SELECT) {
                    switch (form.field) {
                        case fields.region:
                            form.options = this.regions;
                            break;
                        case fields.organizationName:
                            form.options = this.organizationList
                            break;
                        case fields.deployment:
                            form.options = [constant.DEPLOYMENT_TYPE_DOCKER, constant.DEPLOYMENT_TYPE_KUBERNETES, constant.DEPLOYMENT_TYPE_VM]
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    loadDefaultData = async (data) => {
        if (data) {
            let organization = {}
            organization[fields.organizationName] = data[fields.organizationName];
            this.organizationList = [organization]
        }
    }

    getFormData = async (data) => {
        if (data) {
            await this.loadDefaultData(data)
        }
        else {
            this.organizationList = await getOrganizationList()
        }

        let forms = this.formKeys()
        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: BUTTON, onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: BUTTON, onClick: this.onAddCancel })


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

    render() {
        return (
            <div className="round_panel">
                <div className="grid_table" style={{ height: '100%', overflow: 'auto', padding: 10 }}>
                    <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.getFormData(this.props.data)
    }
};

const mapStateToProps = (state) => {

    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    let _changedRegion = (state.form && state.form.createAppFormDefault && state.form.createAppFormDefault.values) ? state.form.createAppFormDefault.values.Region : null;
    return {
        getRegion: (state.getRegion) ? state.getRegion.region : null,
        regionInfo: regionInfo,
        region: region,
        changeRegion: state.changeRegion ? state.changeRegion.region : null,
        changedRegion: _changedRegion
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ClusterInstReg));