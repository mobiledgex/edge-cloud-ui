import React from 'react';
import { withRouter } from 'react-router-dom';
//Mex
import MexForms, { SELECT, MULTI_SELECT, BUTTON, INPUT, CHECKBOX, MAIN_HEADER } from '../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields } from '../../../services/model/format';
//model
import { createFlavor} from '../../../services/model/flavor';
import {flavorTutor} from "../../../tutorial";
import { Grid } from 'semantic-ui-react';


const flavorSteps = flavorTutor();

class FlavorReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
        }
        this.isUpdate = this.props.isUpdate
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }



    formKeys = () => {
        return [
            { label: 'Create Flavor', formType: MAIN_HEADER, visible: true },
            { field: fields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, tip: 'Allows developer to upload app info to different controllers' },
            { field: fields.flavorName, label: 'Flavor Name', formType: INPUT, placeholder: 'Enter Flavor Name', rules: { required: true }, visible: true },
            { field: fields.ram, label: 'RAM Size', formType: INPUT, placeholder: 'Enter RAM Size (MB)', unit: 'MB', rules: { required: true, type: 'number' }, visible: true },
            { field: fields.vCPUs, label: 'Number of vCPUs', formType: INPUT, placeholder: 'Enter Number of vCPUs', rules: { required: true, type: 'number' }, visible: true },
            { field: fields.disk, label: 'Disk Space', formType: INPUT, placeholder: 'Enter Disk Space (GB)', unit: 'GB', rules: { required: true, type: 'number' }, visible: true },
            { field: fields.gpu, label: 'GPU', formType: CHECKBOX, visible: true, value: false },
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
            if (this.props.isUpdate) {
                //update flavor data
            }
            else {
                let mcRequest = await createFlavor(this, data)
                if(mcRequest && mcRequest.response && mcRequest.response.status === 200)
                {
                    this.props.handleAlertInfo('success', `Flavor ${data[fields.flavorName]} created successfully`)
                    this.props.onClose(true)
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
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    loadDefaultData = async (data) => {
        if (data) {

        }
    }

    getFormData = async (data) => {
        if (data) {
            await this.loadDefaultData(data)
        }
        else {

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
                <Grid style={{ display: 'flex' }}>
                    <Grid.Row>
                        <Grid.Column width={16} style={{ overflow: 'auto', height: '90vh' }}>
                            <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }

    componentDidMount() {
        this.getFormData(this.props.data);
        this.props.handleViewMode( flavorSteps.stepsCreateFlavor )
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(FlavorReg));