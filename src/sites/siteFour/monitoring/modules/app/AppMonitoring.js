import React from 'react'
import MexMap from './AppMexMap'
import { Card, GridList, GridListTile } from '@material-ui/core'
import { fields } from '../../../../../services/model/format'
import { OFFLINE, ONLINE } from '../../../../../constant';
import AppClient from './AppClient'
import AppEvent from './AppEvent'
import MexMetric from '../../common/MexMetric'

const healthDataStructure = () => {
    let healthData = {}
    healthData[ONLINE] = { value: 0, color: '#66BB6A' }
    healthData[OFFLINE] = { value: 0, color: '#EF5350' }
    return healthData
}

const processData = (avgData) => {
    let mapData = {}
    let selected = 0
    let healthData = healthDataStructure()
    Object.keys(avgData).map(region => {
        let avgDataRegion = avgData[region]
        Object.keys(avgDataRegion).map(key => {
            let keyData = avgDataRegion[key]
            let health = keyData[fields.healthCheck]
            if (health === 3) {
                healthData[ONLINE]['value'] = parseInt(healthData[ONLINE]['value']) + 1
            }
            else {
                healthData[OFFLINE]['value'] = parseInt(healthData[OFFLINE]['value']) + 1
            }
            if (keyData[fields.cloudletLocation]) {
                let cloudletLocation = keyData[fields.cloudletLocation]
                let key = `${cloudletLocation.latitude}_${cloudletLocation.longitude}`
                let cloudletKey = keyData[fields.cloudletName]
                let data = { cloudletLocation, keyData: keyData }
                selected += (keyData.selected ? 1 : 0)
                let mapDataLocation = mapData[key]
                mapDataLocation = mapDataLocation ? mapDataLocation : { cloudletLocation }
                mapDataLocation.selected = selected
                if (mapDataLocation[cloudletKey]) {
                    mapDataLocation[cloudletKey].push(data)
                }
                else {
                    mapDataLocation[cloudletKey] = [data]
                }
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
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }



    static getDerivedStateFromProps(props, state) {
        return processData(props.avgData)
    }

    render() {
        const { mapData } = this.state
        const { avgData, filter, range, rowSelected, minimize, selectedOrg, updateAvgData } = this.props
        return (
            filter.parent.id === 'appinst' ?
                <div className={minimize ? 'grid-charts-minimize' : 'grid-charts'}>
                    <GridList cols={4} cellHeight={300}>
                        {filter.metricType.includes('client') ?
                            <GridListTile cols={1}>
                                <Card style={{ height: 300, width: '100%' }}>
                                    <AppClient regions={this.regions} filter={filter} range={range} org={selectedOrg} />
                                </Card>
                            </GridListTile> : null}
                        {filter.metricType.includes('map') ?
                            <GridListTile cols={2}>
                                <MexMap data={mapData} region={filter.region} />
                            </GridListTile> : null}
                        {filter.metricType.includes('event') ?
                            <GridListTile cols={1}>
                                <Card style={{ height: 300 }}>
                                    <AppEvent regions={this.regions} filter={filter} range={range} org={selectedOrg} />
                                </Card>
                            </GridListTile> : null}
                        <MexMetric avgData={avgData} updateAvgData={updateAvgData} filter={filter} regions={this.regions} rowSelected={rowSelected} range={range} org={selectedOrg} />
                    </GridList> 
                </div> : null
        )
    }
}
export default AppMonitoring