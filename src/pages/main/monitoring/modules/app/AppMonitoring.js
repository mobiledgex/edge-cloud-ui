import React from 'react'
import { connect } from 'react-redux';
import * as actions from '../../../../../actions';
import { Card, GridList, GridListTile } from '@material-ui/core'
import { fields } from '../../../../../services/model/format'
import AppClient from './AppClient'
import AppEvent from './AppEvent'
import MexMetric from '../../common/MexMetric'
import { ACTION_LATENCY_METRICS, ACTION_REQUEST_LATENCY } from '../../../../../helper/constant/perpetual'
import { perpetual } from '../../../../../helper/constant';
import DMEMetrics from '../../dme/DMEMetrics'
import AppMexMap from './AppMexMap'
import { equal } from '../../../../../helper/constant/operators'
import { requestAppInstLatency } from '../../../../../services/modules/appInst'
import { responseValid } from '../../../../../services/service'

const temp = [
    { region: 'EU', organizationName: "MobiledgeX", appName: "automation-sdk-porttest", version: "1.0", operatorName: "TDG", cloudletName: "automationHamburgCloudlet", clusterName: "porttestcluster", clusterdeveloper: "MobiledgeX", cloudletLocation: { latitude: 60.110922, longitude: 10.682127 } },
    { region: 'EU', organizationName: "MobiledgeX", appName: "automation-sdk-porttest", version: "1.0", operatorName: "TDG", cloudletName: "automationBonnCloudlet", clusterName: "porttestcluster", clusterdeveloper: "MobiledgeX", cloudletLocation: { latitude: 44, longitude: -2 } },
    { region: 'EU', organizationName: "MobiledgeX", appName: "automation-sdk-porttest", version: "1.0", operatorName: "TDG", cloudletName: "automationFrankfurtCloudlet", clusterName: "porttestcluster", clusterdeveloper: "MobiledgeX", cloudletLocation: { latitude: 50.73438, longitude: 7.09549 } }
]

const healthDataStructure = () => {
    let healthData = {}
    healthData[perpetual.ONLINE] = { value: 0, color: '#66BB6A' }
    healthData[perpetual.OFFLINE] = { value: 0, color: '#EF5350' }
    return healthData
}

const processData = (avgData) => {
    let mapData = { selected: 0 }
    let healthData = healthDataStructure()
    Object.keys(avgData).map(region => {
        let avgDataRegion = avgData[region]
        Object.keys(avgDataRegion).map(key => {
            let keyData = avgDataRegion[key]
            let health = keyData[fields.healthCheck]
            if (health === 3) {
                healthData[perpetual.ONLINE]['value'] = parseInt(healthData[perpetual.ONLINE]['value']) + 1
            }
            else {
                healthData[perpetual.OFFLINE]['value'] = parseInt(healthData[perpetual.OFFLINE]['value']) + 1
            }
            if (keyData[fields.cloudletLocation]) {
                let cloudletLocation = keyData[fields.cloudletLocation]
                let key = `${cloudletLocation.latitude}_${cloudletLocation.longitude}`
                let cloudletKey = keyData[fields.cloudletName]
                let data = { cloudletLocation, keyData: keyData }
                let mapDataLocation = mapData[key]
                mapDataLocation = mapDataLocation ? mapDataLocation : { cloudletLocation }
                mapDataLocation.selected = mapDataLocation.selected ? mapDataLocation.selected : 0
                mapDataLocation.selected += (keyData.selected ? 1 : 0)
                if (mapDataLocation[cloudletKey]) {
                    mapDataLocation[cloudletKey].push(data)
                }
                else {
                    mapDataLocation[cloudletKey] = [data]
                }
                mapDataLocation[cloudletKey].selected = mapDataLocation[cloudletKey].selected ? mapDataLocation[cloudletKey].selected : 0
                mapDataLocation[cloudletKey].selected += (keyData.selected ? 1 : 0)
                mapData.selected += keyData.selected
                mapData[key] = mapDataLocation
            }
        })
    })
    return { mapData, healthData }
}

class AppMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
            mapData: {},
            healthData: {}
        }
        this.regions = props.regions
    }

    static getDerivedStateFromProps(props, state) {
        return processData(props.avgData)
    }

    render() {
        const { mapData } = this.state
        const { avgData, filter, range, rowSelected, selectedOrg, updateAvgData, onActionClose, listAction } = this.props
        return (
            <React.Fragment>
                <GridList cols={4} cellHeight={300}>
                    {filter.metricType.includes('client') ?
                        <GridListTile cols={1}>
                            <Card style={{ height: 300, width: '100%' }}>
                                <AppClient regions={this.regions} filter={filter} range={range} org={selectedOrg} />
                            </Card>
                        </GridListTile> : null}
                    {filter.metricType.includes('map') ?
                        <GridListTile cols={2}>
                            <AppMexMap data={mapData} region={filter.region} listAction={listAction} avgData={avgData} onActionClose={onActionClose} />
                        </GridListTile> : null}
                    {filter.metricType.includes('event') ?
                        <GridListTile cols={1}>
                            <Card style={{ height: 300 }}>
                                <AppEvent regions={this.regions} filter={filter} range={range} org={selectedOrg} avgData={avgData} />
                            </Card>
                        </GridListTile> : null}
                    <MexMetric avgData={avgData} updateAvgData={updateAvgData} filter={filter} regions={this.regions} rowSelected={rowSelected} range={range} org={selectedOrg} />
                </GridList>
                {listAction && listAction.id === ACTION_LATENCY_METRICS ? <DMEMetrics id={filter.parent.id} onClose={onActionClose} data={temp} /> : null}
            </React.Fragment>
        )
    }

    requestLantency = async (listAction) => {
        const { data } = listAction
        if (data && data.length > 0) {
            let mc = await requestAppInstLatency(this, data[0])
            responseValid(mc) && this.props.handleAlertInfo('success', mc.response.data.message)
        }
        this.props.onActionClose()
    }

    componentDidUpdate(preProps, preState) {
        const { listAction } = this.props
        if (listAction && !equal(listAction, preProps.listAction)) {
            if (listAction.id === ACTION_REQUEST_LATENCY) {
                this.requestLantency(listAction)
            }
        }
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default connect(null, mapDispatchProps)(AppMonitoring);