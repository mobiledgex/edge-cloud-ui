import React from 'react'
import { connect } from 'react-redux';
import * as actions from '../../../../../actions';
import { Button, Typography } from '@material-ui/core'
import MexTable from '../../../../../hoc/datagrid/MexTable'
import { localFields } from '../../../../../services'
import { registerPartnerZone, showPartnerFederatorZone } from '../../../../../services/modules/partnerZones/partnerZones'
import { authSyncRequest, showAuthSyncRequest } from '../../../../../services/service'
import { withRouter } from 'react-router-dom';

export const zoneKeys = () => ([
    { field: localFields.partnerFederationName, label: 'Federation Name', visible: true },
    { field: localFields.operatorName, label: 'Operator', visible: true },
    { field: localFields.partnerOperatorName, label: 'Partner Operator', serverField: 'operatorid', sortable: true, visible: true, filter: true, key: true },
    { field: localFields.zoneId, label: 'Zone', serverField: 'zoneid', visible: true },
    { field: localFields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true, key: true }
])

class ReviewZones extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            zones: [],
            selected: []
        }
        this._isMounted = false
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    onRegisterZone = async () => {
        let { zones, selected } = this.state
        let { data } = this.props

        if (selected.length > 0) {
            let selections = []
            zones.forEach(item => {
                if (selected.includes(item.uuid)) {
                    selections.push(item[localFields.zoneId])
                }
            })

            let requestData = {
                zoneid: selections,
                operatorName: data[localFields.operatorName],
                partnerFederationName: data[localFields.partnerFederationName]
            }
            let mc = await authSyncRequest(this, registerPartnerZone(requestData))
            if (mc && mc.response && mc.response.status === 200) {
                this.props.handleAlertInfo('success', 'Partner zones registered successfully')
                this.props.onClose()
            }
        }
        else {
            this.props.handleAlertInfo('error', 'Please select partner zones to register')
        }

    }

    render() {
        const { selected, zones } = this.state
        const { onClose } = this.props
        return (
            <React.Fragment>
                <br />
                <Typography variant='h5'>Partner Zones</Typography>
                <br />
                {zones.length > 0 ? <MexTable dataList={zones} keys={zoneKeys()} setSelected={(selected) => this.updateState({ selected })} selected={selected} selection={true} style={{ height: zones.length * 100, maxHeight: 400 }} borderless /> : null}
                <div style={{ width: '100%', display: 'flex', gap: 20, marginTop: 20, justifyContent: 'right' }}>
                    <Button style={{ backgroundColor: '#447700' }} onClick={this.onRegisterZone}>Register Zones</Button>
                    <Button style={{ backgroundColor: '#447700' }} onClick={onClose}>Close</Button>
                </div>
            </React.Fragment>
        )
    }

    fetchPartnerZones = async () => {
        const { data } = this.props
        if (data) {
            let zones = await showAuthSyncRequest(this, showPartnerFederatorZone(this, data, true))
            if (zones && zones.length > 0) {
                this.updateState({ zones })
            }
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchPartnerZones()
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(ReviewZones));