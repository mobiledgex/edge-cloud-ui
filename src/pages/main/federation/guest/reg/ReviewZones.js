/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import { connect } from 'react-redux';
import * as actions from '../../../../../actions';
import { Button, Typography } from '@material-ui/core'
import MexTable from '../../../../../hoc/datagrid/MexTable'
import { registerPartnerZone, showPartnerFederatorZone } from '../../../../../services/modules/partnerZones/partnerZones'
import { authSyncRequest, showAuthSyncRequest } from '../../../../../services/service'
import { withRouter } from 'react-router-dom';
import { localFields } from '../../../../../services/fields';
import { NoData } from '../../../../../helper/formatter/ui'
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../../federation-styling';

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
        const { onClose, loading, classes } = this.props
        return (
            <React.Fragment>
                <br />
                <Typography variant='h5'>Partner Zones</Typography>
                <br />
                {zones?.length > 0 ?
                    <React.Fragment>
                        <MexTable dataList={zones} keys={zoneKeys()} setSelected={(selected) => this.updateState({ selected })} selected={selected} selection={true} style={{ height: zones.length * 100, maxHeight: 400 }} borderless />
                        <div className={classes.btnDiv}>
                            <Button className={classes.greenBtn} onClick={this.onRegisterZone}>Register Zones</Button>
                            <Button className={classes.greenBtn} onClick={onClose}>Close</Button>
                        </div>
                    </React.Fragment> :
                    <NoData loading={loading} />
                }
            </React.Fragment>
        )
    }

    fetchPartnerZones = async () => {
        const { data, onClose } = this.props
        let zones = []
        if (data) {
            zones = await showAuthSyncRequest(this, showPartnerFederatorZone(this, data, true))

        }
        if (zones?.length > 0) {
            this.updateState({ zones })
        }
        else {
            this.props.handleAlertInfo('error', 'No zones to review')
            onClose()
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

export default withRouter(connect(null, mapDispatchProps)(withStyles(styles)(ReviewZones)))