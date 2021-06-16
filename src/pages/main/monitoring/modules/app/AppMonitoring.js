import React from 'react'
import AppMexMap from './AppMexMap'
import { Card, GridList, GridListTile } from '@material-ui/core'
import { fields } from '../../../../../services/model/format'
import AppClient from './AppClient'
import AppEvent from './AppEvent'
import MexMetric from '../../common/MexMetric'
import { mapGridHeight } from '../../helper/Constant';
import { perpetual } from '../../../../../helper/constant';

const healthDataStructure = () => {
    let healthData = {}
    healthData[perpetual.ONLINE] = { value: 0, color: '#66BB6A' }
    healthData[perpetual.OFFLINE] = { value: 0, color: '#EF5350' }
    return healthData
}

const processData = (avgData) => {
    let mapData = {selected:0}
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
        const { avgData, filter, range, rowSelected, minimize, selectedOrg, updateAvgData, onListToolbarClear, listAction, isPrivate } = this.props
        let selected = mapData.selected
        return (
            filter.parent.id === 'appinst' ?
                <div className={'grid-charts'} style={{height : mapGridHeight(minimize, selected)}}>
                    <GridList cols={4} cellHeight={300}>
                        {filter.metricType.includes('client') ?
                            <GridListTile cols={1}>
                                <Card style={{ height: 300, width: '100%' }}>
                                    <AppClient regions={this.regions} filter={filter} range={range} org={selectedOrg} isPrivate={isPrivate}/>
                                </Card>
                            </GridListTile> : null}
                        {filter.metricType.includes('map') ?
                            <GridListTile cols={2}>
                                <AppMexMap data={mapData} region={filter.region} listAction={listAction} avgData={avgData} onListToolbarClear={onListToolbarClear}/>
                            </GridListTile> : null}
                        {filter.metricType.includes('event') ?
                            <GridListTile cols={1}>
                                <Card style={{ height: 300 }}>
                                    <AppEvent regions={this.regions} filter={filter} range={range} org={selectedOrg} avgData={avgData}/>
                                </Card>
                            </GridListTile> : null}
                        <MexMetric avgData={avgData} updateAvgData={updateAvgData} filter={filter} regions={this.regions} rowSelected={rowSelected} range={range} org={selectedOrg} isPrivate={isPrivate}/>
                    </GridList> 
                </div> : null
        )
    }
}
export default AppMonitoring