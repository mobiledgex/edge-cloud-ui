import React from 'react';
import uuid from 'uuid';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
//Mex
import MexForms, { SELECT, MULTI_SELECT, INPUT } from '../../../hoc/forms/MexForms';
import MexTab from '../../../hoc/forms/MexTab';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields } from '../../../services/model/format';
//model
import { getOrganizationList } from '../../../services/model/organization';
import { createCloudlet} from '../../../services/model/cloudlet';
//Map
import Map from '../../../libs/simpleMaps/with-react-motion/index_clusters';
import MexMultiStepper, { updateStepper } from '../../../hoc/stepper/mexMessageMultiStream'

class ClusterInstReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            mapData: [],
            stepsArray: [],
        }
        this.isUpdate = this.props.isUpdate
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        //To avoid refecthing data from server
        this.requestedRegionList = [];
        this.operatorList = []
    }

    checkForms = (form, forms, isInit) => {

    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    onCreateResponse = (mcRequest) => {
        if (mcRequest) {
            let data = undefined;
            let request = mcRequest.request;
            let cloudletName = request.data.cloudlet.name;
            if (mcRequest.response && mcRequest.response.data) {
                data = mcRequest.response.data;
            }
            this.setState({ stepsArray: updateStepper(this.state.stepsArray, cloudletName, data) })
        }
    }

    onCreate = async (data) => {
        let forms = this.state.forms
        if (data) {
            if (this.props.isUpdate) {
                //update cluster data
            }
            else {
                for (let i = 0; i < forms.length; i++) {
                    let form = forms[i];
                    if (form.uuid) {
                        let uuid = form.uuid;
                        let multiFormData = data[uuid]
                        if (multiFormData) {
                            if (form.field === fields.cloudletLocation) {
                                multiFormData.timestamp = {}
                                data[fields.cloudletLocation] = multiFormData
                            }
                        }
                        data[fields.ipSupport] = constant.IPSupport(data[fields.ipSupport])
                        data[fields.platformType] = constant.PlatformType(data[fields.platformType])
                        data[uuid] = undefined
                    }
                }
                createCloudlet(data, this.onCreateResponse)
            }
        }
    }

    onMapClick = (location) => {
        let forms = this.state.forms
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.cloudletLocation) {
                let childForms = form.forms;
                for (let j = 0; j < childForms.length; j++) {
                    let childForm = childForms[j]
                    if (childForm.field === fields.latitude) {
                        childForm.value = location.lat
                    }
                    else if (childForm.field === fields.longitude) {
                        childForm.value = location.long
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
                <Map locData={this.state.mapData} id={'Cloudlets'} reg='cloudletAndClusterMap' zoomControl={{ center: [0, 0], zoom: 1.5 }} onMapClick={this.onMapClick}></Map>
            </div>
        )

    getPanes = () => ([
        { label: 'Cloudlets', tab: this.getMap() }
    ])
    /**
     * Tab block
     */

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



    render() {
        return (
            <div className="round_panel">
                <div className="grid_table" style={{ height: constant.getHeight(), overflow: 'auto' }}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <MexTab form={{ panes: this.getPanes() }} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <MexMultiStepper multiStepsArray={this.state.stepsArray} onClose={this.stepperClose} />
            </div>
        )
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }



    getOptions = (dataList, form) => {
        if (dataList && dataList.length > 0) {
            return dataList.map(data => {
                let info = form ? data[form.field] : data
                return { key: info, value: info, text: info }
            })
        }
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
                            form.options = this.operatorList
                            break;
                        case fields.region:
                            form.options = this.regions;
                            break;
                        case fields.ipSupport:
                            form.options = ['Dynamic'];
                            break;
                        case fields.platformType:
                            form.options = ['Openstack'];
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
            let operator = {}
            operator[fields.operatorName] = data[fields.operatorName];
            this.operatorList = [operator]
        }
    }

    locationForm = () => ([
        { field: fields.latitude, label: 'Latitude', formType: INPUT, placeholder: '-90 ~ 90', rules: { required: true }, width: 8, visible: true },
        { field: fields.longitude, label: 'Longitude', formType: INPUT, placeholder: '-180 ~ 180', rules: { required: true }, width: 8, visible: true }
    ])

    formKeys = () => {
        return [
            { label: 'Cloudlet', formType: 'Header', visible: true },
            { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true },
            { field: fields.cloudletName, label: 'Cloudlet Name', formType: 'Input', placeholder: 'Enter cloudlet Name', rules: { required: true }, visible: true, },
            { field: fields.operatorName, label: 'Operator', formType: 'Select', placeholder: 'Select Operator', rules: { required: true }, visible: true },
            { uuid: uuid(), field: fields.cloudletLocation, label: 'Cloudlet Location', formType: INPUT, rules: { required: true }, visible: true, forms: this.locationForm() },
            { field: fields.ipSupport, label: 'IP Support', formType: 'Select', placeholder: 'Select IP Support', rules: { required: true }, visible: true },
            { field: fields.numDynamicIPs, label: 'Number of Dynamic IPs', formType: 'Input', placeholder: 'Enter Number of Dynamic IPs', rules: { required: true, type: 'number' }, visible: true, },
            { field: fields.physicalName, label: 'Physical Name', formType: 'Input', placeholder: 'Enter Physical Name', rules: { required: true }, visible: true, },
            { field: fields.platformType, label: 'Platform Type', formType: 'Select', placeholder: 'Select Platform Type', rules: { required: true }, visible: true },

        ]
    }

    getFormData = async (data) => {
        if (data) {
            await this.loadDefaultData(data)
        }
        else {
            let organizationList = await getOrganizationList()
            this.operatorList = []
            for (let i = 0; i < organizationList.length; i++) {
                let organization = organizationList[i]
                if (organization[fields.type] === 'operator') {
                    this.operatorList.push(organization[fields.organizationName])
                }
            }
        }
        let forms = this.formKeys()
        forms.push(
            { label: this.isUpdate ? 'Update' : 'Create', formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })


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