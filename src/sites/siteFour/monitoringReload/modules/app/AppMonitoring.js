import React from 'react'
import MexMap from './AppMexMap'
import MexChart from '../../charts/MexChart'
import { Card, Grid } from '@material-ui/core'
import { fields } from '../../../../../services/model/format'
import { OFFLINE, ONLINE } from '../../../../../constant';
import isEqual from 'lodash/isEqual'
import * as dateUtil from '../../../../../utils/date_util'
import AppClient from './AppClient'
import AppEvent from './AppEvent'

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
            if (keyData.location) {
                let location = keyData.location
                let key = `${location.latitude}_${location.longitude}`
                let cloudletKey = keyData.cloudlet
                let data = { location, keyData: keyData }
                selected += (keyData.selected ? 1 : 0)
                let mapDataLocation = mapData[key]
                mapDataLocation = mapDataLocation ? mapDataLocation : { location }
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
        const { chartData, avgData, filter, range, rowSelected, minimize, selectedOrg} = this.props
        return (
            filter.parent.id === 'appinst' ?
                <div className={minimize ? 'grid-charts-minimize' : 'grid-charts'}>
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <Card style={{ height: '100%', width: '100%' }}>
                                <AppClient regions={this.regions} filter={filter} range={range} org={selectedOrg}/>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <MexMap data={mapData} />
                        </Grid>
                        <Grid item xs={3}>
                            <Card style={{ height: '100%', width: '100%' }}>
                                <AppEvent regions={this.regions}  filter={filter} range={range} org={selectedOrg}/>
                            </Card> 
                        </Grid>
                    </Grid>
                    <div style={{ marginBottom: 5 }}></div>
                    <MexChart chartData={chartData} avgData={avgData} filter={filter} regions={this.regions} rowSelected={rowSelected}/>
                </div> : null
        )
    }
}
export default AppMonitoring