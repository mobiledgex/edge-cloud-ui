import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
//Mex
import MexForms, { DUALLIST, INPUT, MAIN_HEADER } from '../../../hoc/forms/MexForms';
//model
import { service, fields } from '../../../services';
import { showOrganizations } from '../../../services/modules/organization';
import { addClouldletAllianceOrgs, removeClouldletAllianceOrgs } from '../../../services/modules/cloudlet/cloudlet'

import { Grid } from '@material-ui/core';
import { perpetual } from '../../../helper/constant';
import { _sort } from '../../../helper/constant/operators';

class AllianceOrganization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: []
        }
        this._isMounted = false
        //To avoid refeching data from server
        this.cloudletData = undefined;
        this.allianceList = [];
        this.action = props.action ? props.action : perpetual.ACTION_ADD_ALLIANCE_ORG;
        this.isAllianceCloudletAdd = (this.action === perpetual.ACTION_ADD_ALLIANCE_ORG);
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

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
                    <Grid item xs={12}>
                        <div className="round_panel">
                            <MexForms forms={forms} reloadForms={this.reloadForms} />
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }

    onCancel = () => {
        this.props.onClose(false)
    }

    updateUI(form) {
        if (form) {
            if (form.field) {
                if (form.formType === DUALLIST) {
                    switch (form.field) {
                        case fields.allianceOrganization:
                            form.options = this.allianceList.map(data => ({ value: data, label: data }))
                            break;
                        default:
                            form.options = undefined;
                    }
                }
            }
        }
    }

    updateFormData = (forms) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
        }
    }

    onCreateResponse = (mcList) => {
        if (mcList && mcList.length > 0) {
            this.props.handleLoadingSpinner(false)
            mcList.map(mc => {
                if (mc.response) {
                    let data = mc.request.data;
                    let cloudletName = data.cloudletallianceorg.key.name
                    let text = this.isAllianceCloudletAdd ? 'added' : 'removed'
                    this.props.handleAlertInfo('success', `Alliance Organization for ${cloudletName} ${text} successfully`)
                    this.props.onClose(true)
                }
            })
        }
    }

    onCreate = async (data) => {
        let allianceOrgs = data[fields.allianceOrganization]
        if (allianceOrgs && allianceOrgs.length > 0) {
            let requestList = []
            let requestCall = this.isAllianceCloudletAdd ? addClouldletAllianceOrgs : removeClouldletAllianceOrgs
            allianceOrgs.forEach(org => {
                let requestData = {...data}
                requestData[fields.allianceOrganization] = org
                requestList.push(requestCall(requestData))
            })
            if (requestList && requestList.length > 0) {
                this.props.handleLoadingSpinner(true)
                service.multiAuthRequest(this, requestList, this.onCreateResponse)
            }
        }

    }

    filterAllianceCloudlets = () => {
        let removeList = []
        if (this.props.data) {
            let selectedAllianceOrgs = this.props.data[fields.allianceOrganization]
            if (selectedAllianceOrgs && selectedAllianceOrgs.length > 0) {
                for (let i = 0; i < selectedAllianceOrgs.length; i++) {
                    let selectedAllianceOrg = selectedAllianceOrgs[i];
                    for (let j = 0; j < this.allianceList.length; j++) {
                        let allianceOrg = this.allianceList[j]
                        if (selectedAllianceOrg === allianceOrg) {
                            if (this.props.action === perpetual.ACTION_ADD_ALLIANCE_ORG) {
                                this.allianceList.splice(j, 1)
                            }
                            else if (this.props.action === perpetual.ACTION_REMOVE_ALLIANCE_ORG) {
                                removeList.push(allianceOrg)
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.allianceList = removeList.length > 0 ? removeList : this.allianceList
    }

    getFormData = async (data) => {
        let organizationList = await service.showAuthSyncRequest(this, showOrganizations(this, { type: perpetual.OPERATOR }))
        organizationList = _sort(organizationList.map(org => org[fields.organizationName]))
        this.allianceList = organizationList.filter(org => org !== data[fields.operatorName])
        if (this.allianceList && this.allianceList.length > 0) {
            let action = this.props.action === perpetual.ACTION_REMOVE_ALLIANCE_ORG ? 'Remove' : 'Add'
            this.filterAllianceCloudlets();
            let forms = [
                { label: `${action} Alliance Organization`, formType: MAIN_HEADER, visible: true },
                { field: fields.region, label: 'Region', formType: INPUT, rules: { disabled: true }, visible: true, value: data[fields.region] },
                { field: fields.cloudletName, label: 'Cloudlet Name', formType: INPUT, rules: { disabled: true }, visible: true, value: data[fields.cloudletName] },
                { field: fields.operatorName, label: 'Operator', formType: INPUT, rules: { disabled: true }, visible: true, value: data[fields.operatorName] },
                { field: fields.allianceOrganization, label: 'Alliance Organization', formType: DUALLIST, visible: true },
                { label: `${action}`, formType: 'Button', onClick: this.onCreate },
                { label: 'Cancel', formType: 'Button', onClick: this.onCancel }
            ]
            this.updateFormData(forms, data)
            this.updateState({
                forms
            })
        }
        else {
            this.props.handleAlertInfo('error', 'No Alliance Organization present')
            this.props.onClose(true)
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.getFormData(this.props.data)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

};


const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(AllianceOrganization));