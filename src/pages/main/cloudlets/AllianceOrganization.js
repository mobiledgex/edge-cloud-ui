import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
//Mex
import MexForms, { INPUT, MAIN_HEADER, TEXT_AREA } from '../../../hoc/forms/MexForms';
//model
import { service } from '../../../services';
import { addClouldletAllianceOrgs, removeClouldletAllianceOrgs } from '../../../services/modules/cloudlet/cloudlet'
import { perpetual } from '../../../helper/constant';
import { _sort } from '../../../helper/constant/operators';
import { localFields } from '../../../services/fields';

class AllianceOrganization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: []
        }
        this._isMounted = false
        //To avoid refeching data from server
        this.cloudletData = undefined;
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
        const { forms } = this.state
        return (
            <div className="round_panel">
                <MexForms forms={forms} reloadForms={this.reloadForms} />
            </div>
        )
    }

    onCancel = () => {
        this.props.onClose(false)
    }

    updateFormData = (forms, data) => {
        for (let form of forms) {
            if (form.field === localFields.allianceOrganization) {
                let allianceOrgs = data[localFields.allianceOrganization]
                if (allianceOrgs) {
                    let value = ''
                    let length = allianceOrgs.length - 1
                    allianceOrgs.forEach((org, i) => {
                        value = value + org + (i < length ? '\n' : '')
                    })
                    form.value = value
                }
            }
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
        let allianceOrgs = data[localFields.allianceOrganization]
        if (allianceOrgs) {
            let oldOrgList = this.props.data[localFields.allianceOrganization]
            let orgList = allianceOrgs.split('\n')
            if (orgList?.length > 0) {
                if (this.isAllianceCloudletAdd && oldOrgList?.length > 0) {
                    orgList = orgList.filter(item => {
                        return Boolean(item) && !oldOrgList.includes(item.trim())
                    })
                }
                if (orgList?.length > 0) {
                    let requestList = []
                    let requestCall = this.isAllianceCloudletAdd ? addClouldletAllianceOrgs : removeClouldletAllianceOrgs
                    orgList.forEach(org => {
                        if (Boolean(org)) {
                            let requestData = { ...data }
                            requestData[localFields.allianceOrganization] = org
                            requestList.push(requestCall(requestData))
                        }
                    })
                    if (requestList?.length > 0) {
                        this.props.handleLoadingSpinner(true)
                        service.multiAuthRequest(this, requestList, this.onCreateResponse)
                    }
                }
            }
        }
    }

    getFormData = async (data) => {
        let allianceList = data[localFields.allianceOrganization]
        if (this.isAllianceCloudletAdd  || allianceList?.length > 0) {
            let action = this.props.action === perpetual.ACTION_REMOVE_ALLIANCE_ORG ? 'Remove' : 'Add'
            let forms = [
                { label: `${action} Alliance Organization`, formType: MAIN_HEADER, visible: true },
                { field: localFields.region, label: 'Region', formType: INPUT, rules: { disabled: true }, visible: true, value: data[localFields.region] },
                { field: localFields.cloudletName, label: 'Cloudlet Name', formType: INPUT, rules: { disabled: true }, visible: true, value: data[localFields.cloudletName] },
                { field: localFields.operatorName, label: 'Operator', formType: INPUT, rules: { disabled: true }, visible: true, value: data[localFields.operatorName] },
                { field: localFields.allianceOrganization, label: 'Alliance Organization', rules: { rows: 10 }, formType: TEXT_AREA, visible: true },
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