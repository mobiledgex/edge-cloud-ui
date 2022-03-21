import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
//Mex
import MexForms, { SELECT, INPUT, MAIN_HEADER, HEADER, MULTI_FORM } from '../../../../hoc/forms/MexForms';
import ListMexMap from '../../../../hoc/datagrid/map/ListMexMap';
import MexTab from '../../../../hoc/forms/tab/MexTab';
import { redux_org } from '../../../../helper/reduxData'
import { perpetual } from '../../../../helper/constant';
//model
import { service } from '../../../../services';
import { createFederatorZone } from '../../../../services/modules/zones';
import { Grid } from '@material-ui/core';
import { showCloudlets } from '../../../../services/modules/cloudlet';
import { HELP_ZONES_REG } from '../../../../tutorial';
import { uniqueId } from '../../../../helper/constant/shared';
import { readJsonFile } from '../../../../utils/file_util';
import { responseValid } from '../../../../services/config';
import { localFields } from '../../../../services/fields';

class ZoneReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            mapData: [],
            activeIndex: 0,
            region: undefined
        }
        this._isMounted = false
        this.isUpdate = this.props.isUpdate
        //To avoid refeching data from server
        this.requestedRegionList = [];
        this.operatorList = [];
        this.cloudletList = [];
        this.locationCloudlet = [];
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    locationChange = (currentForm, forms, isInit) => {
        if (!isInit) {
            let parentForm = currentForm.parent.form
            let childForms = parentForm.forms
            let latitude = undefined
            let longitude = undefined
            for (let i = 0; i < childForms.length; i++) {
                let form = childForms[i]
                if (form.field === localFields.latitude) {
                    latitude = form.value
                }
                else if (form.field === localFields.longitude) {
                    longitude = form.value
                }
            }
        }
    }

    getCloudletInfo = async (region, form, forms) => {
        if (!this.requestedRegionList.includes(region)) {
            this.cloudletList = [...this.cloudletList, ...await service.showAuthSyncRequest(this, showCloudlets(this, { region }))]
        }
        this.updateUI(form)
        if (redux_org.isOperator(this)) {
            let latitude = undefined
            let longitude = undefined
            for (let form of forms) {
                if (form.field === localFields.cloudletName) {
                    if (latitude && longitude) {
                        let zone = {}
                        zone.cloudletLocation = { latitude, longitude }
                        this.updateState({ mapData: [zone] })
                    }
                    else {
                        this.updateState({ mapData: [] })
                    }
                    this.updateUI(form)
                    break;
                }
            }
        }
        this.updateState({ forms })
    }

    operatorValueChange = (currentForm, forms, isInit) => {
        for (let form of forms) {
            if (form.field === localFields.cloudletName) {
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
                if (form.field === localFields.operatorName) {
                    if (!isInit) {
                        this.getCloudletInfo(region, form, forms)
                    }
                    break;
                }
            }
            this.requestedRegionList.includes(region) ? this.requestedRegionList : this.requestedRegionList.push(region)
        }
    }

    cloudletValueChange = (currentForm, forms, isInit) => {
        for (let form of forms) {
            let cloudletName = currentForm.value;
            this.locationCloudlet = this.cloudletList.filter(obj => obj.cloudletName === cloudletName);
            let zone = {}
            if (this.locationCloudlet[0] && (this.locationCloudlet[0].latitude || this.locationCloudlet[0].longitude)) {
                zone.cloudletLocation = { latitude: this.locationCloudlet[0].latitude, longitude: this.locationCloudlet[0].longitude }
                this.locationCloudlet = [zone]
                this.updateState({ mapData: [zone] })
            } else {
                this.updateState({ mapData: [] })
            }
            if (form.field === localFields.cloudletLocation) {
                this.onMapClick(this.locationCloudlet)
            }
        }
    }

    checkForms = (form, forms, isInit = false) => {
        if (form.field === localFields.region) {
            this.regionValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.operatorName) {
            this.operatorValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.cloudletName) {
            this.cloudletValueChange(form, forms, isInit)
        }
        else if (form.field === localFields.latitude || form.field === localFields.longitude) {
            this.locationChange(form, forms, isInit)
        }

    }


    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    onCreateZones = async (data) => {
        if (data) {
            let mc;
            let forms = this.state.forms;
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.uuid) {
                    let uuid = form.uuid;
                    let multiFormData = data[uuid]
                    if (multiFormData) {
                        if (form.field === localFields.cloudletLocation) {
                            data[localFields.cloudletLocation] = multiFormData.latitude + ',' + multiFormData.longitude
                        }
                    }
                    data[uuid] = undefined
                }
            }
            mc = await createFederatorZone(this, data)
            if (responseValid(mc)) {
                this.props.handleAlertInfo('success', `Zone ${data[localFields.zoneId]} created successfully`)
                this.props.onClose(true)
            }
        }
    }


    onMapClick = (location) => {
        let forms = this.state.forms
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === localFields.cloudletLocation && !form.rules.disabled) {
                let zone = {}
                zone.cloudletLocation = { latitude: location[0] ? location[0].cloudletLocation.latitude : location.lat, longitude: location[0] ? location[0].cloudletLocation.longitude : location.long }
                this.updateState({ mapData: [zone] })
                let childForms = form.forms;
                for (let j = 0; j < childForms.length; j++) {
                    let childForm = childForms[j]
                    if (childForm.field === localFields.latitude) {
                        childForm.value = location[0] ? location[0].cloudletLocation.latitude : location.lat
                    }
                    else if (childForm.field === localFields.longitude) {
                        childForm.value = location[0] ? location[0].cloudletLocation.longitude : location.long
                    }
                }
                break;
            }
        }
        this.reloadForms()
    }

    /**
     * Tab block
     */

    getMap = () =>
    (
        <div className='panel_worldmap' style={{ width: '100%', height: '100%' }}>
            <ListMexMap dataList={this.state.mapData} id={perpetual.PAGE_HOST_ZONES} onMapClick={this.onMapClick} region={this.state.region} register={true} />
        </div>
    )

    getPanes = () => ([
        { label: 'Zone Location', tab: this.getMap(), onClick: () => { this.updateState({ activeIndex: 0 }) } }
    ])

    /*Required*/
    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
    }

    render() {
        const { forms, activeIndex } = this.state
        return (
            <div>
                <Grid container>
                    <Grid item xs={7}>
                        <div className="round_panel">
                            <MexForms forms={forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                        </div>
                    </Grid>
                    <Grid item xs={5} style={{ backgroundColor: '#2A2C34', padding: 5 }}>
                        <MexTab form={{ panes: this.getPanes() }} activeIndex={activeIndex} />
                    </Grid>
                </Grid>
            </div>
        )
    }

    onCancel = () => {
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
                        case localFields.operatorName:
                            form.options = this.cloudletList
                            break;
                        case localFields.region:
                            form.options = this.props.regions;
                            break;
                        case localFields.cloudletName:
                            form.options = this.cloudletList
                            break;
                        case localFields.countryCode:
                            form.options = this.countryCodes
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    locationForm = () => ([
        { field: localFields.latitude, label: 'Latitude', formType: INPUT, placeholder: '-90 ~ 90', rules: { required: true, type: 'number', onBlur: true }, width: 8, visible: true, update: { edit: true } },
        { field: localFields.longitude, label: 'Longitude', formType: INPUT, placeholder: '-180 ~ 180', rules: { required: true, type: 'number', onBlur: true }, width: 8, visible: true, update: { edit: true } }
    ])

    formKeys = () => {
        return [
            { label: 'Create Zones', formType: MAIN_HEADER, visible: true },
            { field: localFields.region, label: 'Region', formType: SELECT, placeholder: 'Select Region', rules: { required: true }, visible: true, tip: 'Select region where you want to deploy.', update: { key: true } },
            { field: localFields.operatorName, label: 'Operator', formType: this.isUpdate || redux_org.nonAdminOrg(this) ? INPUT : SELECT, placeholder: 'Select Operator', rules: { required: true, disabled: !redux_org.isAdmin(this) }, visible: true, value: redux_org.nonAdminOrg(this), dependentData: [{ index: 1, field: localFields.region }], tip: 'Organization of the cloudlet site', update: { key: true } },
            { field: localFields.cloudletName, label: 'Cloudlet Name', formType: this.isUpdate ? INPUT : SELECT, placeholder: 'Select Cloudlet Name', rules: { required: true }, visible: true, tip: 'Name of the cloudlet.', update: { key: true }, dependentData: [{ index: 1, field: localFields.region }, { index: 2, field: localFields.operatorName }] },
            { field: localFields.zoneId, label: 'Zone ID', formType: INPUT, placeholder: 'Enter Zone Name', rules: { required: true }, visible: true, tip: ' Globally unique string used to authenticate operations over federation interface', update: { key: true } },
            { field: localFields.countryCode, label: 'Country Code', formType: SELECT, placeholder: 'Select Country Code', rules: { required: true }, visible: true, tip: 'Country where operator platform is located' },
            { uuid: uniqueId(), field: localFields.cloudletLocation, label: 'Zone Location', formType: INPUT, rules: { required: true }, visible: true, forms: this.locationForm(), tip: 'GPS co-ordinates associated with the zone' },
            { field: localFields.locality, label: 'Locality', formType: INPUT, placeholder: 'Enter Locality', visible: true, tip: 'Type of locality eg rural, urban etc.' },
            { field: localFields.state, label: 'State', formType: INPUT, placeholder: 'Enter State Name', width: 5, visible: true, update: { edit: true } },
            { field: localFields.city, label: 'City', formType: INPUT, placeholder: 'Enter City Name', width: 7, visible: true },
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
                    this.checkForms(form, forms, true, data)
                }
            }
        }

    }

    getFormData = async (data) => {
        let forms = this.formKeys()
        this.countryCodes = await readJsonFile('countrycode-iso31661a2.json')
        forms.push(
            { label: 'Create', formType: 'Button', onClick: this.onCreateZones, validate: true },
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
        this.props.handleViewMode(HELP_ZONES_REG)
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ZoneReg));
