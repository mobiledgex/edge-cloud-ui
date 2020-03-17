import React from 'react';
import { withRouter } from 'react-router-dom';
import { Item, Grid } from 'semantic-ui-react';
//Mex
import MexForms from '../../../hoc/forms/MexForms';
import MexTab from '../../../hoc/forms/MexTab';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields } from '../../../services/model/format';
//model
import * as serverData from '../../../services/model/serverData';
import { formKeys } from '../../../services/model/clusterInstance';
import { showOrganizations } from '../../../services/model/organization';
//Map
import ClustersMap from '../../../libs/simpleMaps/with-react-motion/index_clusters';

class ClusterInstReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            mapData: []
        }
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
        this.organizationList = []
        this.cloudletList = []
    }

    onValueChange = (form) => {

    }

    getOptions = (dataList, form) => {
        if (dataList && dataList.length > 0) {
            if (dataList[0].isDefault) {
                form.value = dataList[0][form.field];
                let rules = form.rules ? form.rules : {}
                rules.disabled = true;
                form.rules = rules;
            }
            return dataList.map(data => {
                let info = form ? data[form.field] : data
                return { key: info, value: info, text: info }
            })
        }
    }

    /***
     * Map values from form to field
     * ***/
    formattedData = () => {
        let data = {};
        let forms = this.state.forms;
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field) {
                if (form.forms) {
                    data[form.uuid] = {};
                    let subForms = form.forms
                    for (let j = 0; j < subForms.length; j++) {
                        let subForm = subForms[j];
                        data[form.uuid][subForm.field] = subForm.value;
                    }

                }
                else {
                    data[form.field] = form.value;
                }
            }
        }
        return data
    }

    onCreate = async () => {
        let data = this.formattedData()
        if (data) {

        }
    }

    /**
     * Tab block
     */
    getMap = () =>
        (
            <div className='panel_worldmap' style={{ width: '100%', height: '100%' }}>
                <ClustersMap parentProps={{ locData: this.state.mapData, reg: 'cloudletAndClusterMap', zoomIn: () => console.log('zoomin'), zoomOut: () => console.log('zoomout'), resetMap: () => console.log('resetmap') }} icon={'cloudlet'} zoomControl={{ center: [0, 0], zoom: 1.5 }}></ClustersMap>
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


    render() {
        return (
            <div className="round_panel">
                <div className="grid_table" style={{ height: '100%', overflow: 'auto' }}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} />
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <MexTab form={{ panes: this.getPanes() }} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        )
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }



    disableFields = (form) => {
        let rules = form.rules ? form.rules : {}
        let field = form.field
        if (field === fields.organizationName || field === fields.region) {
            rules.disabled = true;
        }
    }

    loadData(forms, data) {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field) {
                if (form.formType === 'Select') {
                    switch (form.field) {
                        case fields.organizationName:
                            form.options = this.getOptions(this.organizationList, form)
                            break;
                        case fields.region:
                            form.options = this.getOptions(this.regions);
                            break;
                        default:
                            form.options = undefined;
                    }
                }
                if (data) {
                    form.value = data[form.field]
                    this.disableFields(form)
                }
            }
            else if (form.label) {
                if (data) {
                }
            }
        }

    }

    getFormData = async (data) => {
        let forms = Object.assign([], formKeys);
        forms.push(
            { label: `${this.props.action ? this.props.action : 'Create'} Policy`, formType: 'Button', onClick: this.onCreate, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })

        if (data) {

        }
        else {
            this.organizationList = await serverData.showDataFromServer(this, showOrganizations())
            this.loadData(forms)
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
