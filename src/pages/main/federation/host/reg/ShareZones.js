import React from 'react'
import { connect } from 'react-redux';
import * as actions from '../../../../../actions';
import { Button, Typography } from '@material-ui/core'
import MexTable from '../../../../../hoc/datagrid/MexTable'
import { showFederatorZones } from '../../../../../services/modules/zones';
import { multiAuthSyncRequest, showAuthSyncRequest } from '../../../../../services/service'
import { withRouter } from 'react-router-dom';
import { shareZones } from '../../../../../services/modules/zones/zones';
import { ACTION_UNSHARE_ZONES } from '../../../../../helper/constant/perpetual';
import { responseValid } from '../../../../../services/config';
import { localFields } from '../../../../../services/fields';
import { NoData } from '../../../../../helper/formatter/ui'
import { withStyles } from '@material-ui/core/styles';

export const zoneKeys = () => ([
    { field: localFields.operatorName, label: 'Operator', visible: true },
    { field: localFields.zoneId, label: 'Zone', serverField: 'zoneid', visible: true },
    { field: localFields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true, key: true }
])

export const styleComponent = {
    btnDiv: {
        width: '100%', display: 'flex', gap: 20, marginTop: 20, justifyContent: 'right'
    },
    greenBtn: {
        backgroundColor: '#447700'
    }
};
class ShareZones extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            zones: [],
            selected: [],
            loading: false
        }
        this.isUnshare = props.id === ACTION_UNSHARE_ZONES
        this._isMounted = false
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    shareZones = async () => {
        let { zones, selected } = this.state
        let { data, id } = this.props

        if (selected.length > 0) {
            let selections = []
            zones.forEach(item => {
                if (selected.includes(item.uuid)) {
                    selections.push(item[localFields.zoneId])
                }
            })

            let requestList = []
            selections.forEach(item => {
                let request = data
                request[localFields.zoneId] = item
                requestList.push(shareZones(this, request, this.isUnshare))
            })

            let mcList = await multiAuthSyncRequest(this, requestList)
            if (mcList && mcList.length > 0) {
                let valid = mcList.every(mc => {
                    return responseValid(mc)
                })
                if (valid) {
                    this.props.handleAlertInfo('success', 'Zones shared successfully')
                    this.props.onClose()
                }
            }
        }
        else {
            this.props.handleAlertInfo('error', 'Please select zones to share')
        }
    }

    render() {
        const { selected, zones, loading } = this.state
        const { onClose, classes } = this.props
        return (
            <React.Fragment>
                <br />
                <Typography variant='h5'>Operator Zones</Typography>
                <br />
                {
                    zones.length > 0 ?
                        <React.Fragment>
                            <MexTable dataList={zones} keys={zoneKeys()} setSelected={(selected) => this.updateState({ selected })} selected={selected} selection={true} style={{ height: zones.length * 100, maxHeight: 400 }} borderless />
                            <div className={classes.btnDiv}>
                                <Button className={classes.greenBtn} onClick={this.shareZones}>{`${this.isUnshare ? 'Uns' : 'S'}hare Zones`}</Button>
                                <Button className={classes.greenBtn} onClick={onClose}>Close</Button>
                            </div>
                        </React.Fragment> :
                        <NoData loading={loading} />
                }
            </React.Fragment>
        )
    }

    fetchZones = async () => {
        const { id, data, handleAlertInfo, onClose } = this.props
        let shareZones, zones = []
        if (this.isUnshare && data[localFields.zoneId]) {
            zones = data[localFields.zoneId].map(zone => {
                return { ...data, zoneId: zone }
            })
        }
        else if (data && !this.isUnshare) {
            this.updateState({ loading: true })
            zones = await showAuthSyncRequest(this, showFederatorZones(this, { operatorid: data[localFields.operatorName], countrycode: data[localFields.countryCode] }, true))
            shareZones = zones.filter(obj1 => !data[localFields.zones].some(obj2 => obj1[localFields.zoneId] === obj2[localFields.zoneId]));
            this.updateState({ loading: false })
        }
        zones = this.isUnshare ? data[localFields.zones] : shareZones
        if (zones && zones.length > 0) {
            this.updateState({ zones })
        }
        else {
            handleAlertInfo('error', `No zones to ${this.isUnshare ? 'un' : ''}share`)
            onClose()
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchZones()
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

export default withRouter(connect(null, mapDispatchProps)(withStyles(styleComponent)(ShareZones)))