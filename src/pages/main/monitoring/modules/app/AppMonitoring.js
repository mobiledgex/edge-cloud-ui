import React from 'react'
import { Card, ImageList, ImageListItem } from '@material-ui/core'
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
    }

    static getDerivedStateFromProps(props, state) {
        return processData(props.avgData)
    }

    render() {
        const { mapData } = this.state
        const { avgData, filter, range, rowSelected, selectedOrg, updateAvgData, onActionClose, listAction, regions, privateAccess, orgInfo } = this.props
        return (
            <React.Fragment>
                <ImageList cols={4} rowHeight={300}>
                    {filter.metricType.includes('client') ?
                        <ImageListItem cols={1}>
                            <Card style={{ height: 300, width: '100%' }}>
                                <AppClient regions={regions} filter={filter} range={range} org={selectedOrg} privateAccess={privateAccess}  orgInfo={orgInfo}/>
                            </Card>
                        </ImageListItem> : null}
                    {filter.metricType.includes('map') ?
                        <ImageListItem cols={2}>
                            <AppMexMap data={mapData} region={filter.region} listAction={listAction} avgData={avgData} onActionClose={onActionClose} />
                        </ImageListItem> : null}
                    {filter.metricType.includes('event') ?
                        <ImageListItem cols={1}>
                            <Card style={{ height: 300 }}>
                                <AppEvent regions={regions} filter={filter} range={range} org={selectedOrg} avgData={avgData} orgInfo={orgInfo}/>
                            </Card>
                        </ImageListItem> : null}
                    <MexMetric avgData={avgData} updateAvgData={updateAvgData} filter={filter} regions={regions} rowSelected={rowSelected} range={range} org={selectedOrg} />
                </ImageList>
                {listAction && listAction.id === ACTION_LATENCY_METRICS ? <DMEMetrics group={listAction.group} id={filter.parent.id} onClose={onActionClose} data={listAction.data} /> : null}
            </React.Fragment>
        )
    }

    requestLantency = async (listAction) => {
        const { data } = listAction
        if (data && data.length > 0) {
            let mc = await requestAppInstLatency(this, data[0])
            if (responseValid(mc)) {
                responseValid(mc) && this.props.showAlert('success', mc.response.data.message)
            }
            else {
                if (mc.error && mc.error.response && mc.error.response.data && mc.error.response.data.message)
                    this.props.showAlert('error', mc.error.response.data.message)
            }
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

export default AppMonitoring;