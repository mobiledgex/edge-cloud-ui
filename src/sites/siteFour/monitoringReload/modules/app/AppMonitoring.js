import React from 'react'
import MexMap from '../../mexmap/AppMexMap'
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

class AppMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
            mapData: {},
            healthData: {},
            eventData:[]
        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }

    processData = (avgData) => {
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
        this.setState({ mapData, healthData })
    }

   

    render() {
        const { mapData, eventData } = this.state
        const { chartData, avgData, filter, range } = this.props
        return (
            filter.parent.id === 'appinst' ?
                <div className='grid-charts'>
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <Card style={{ height: '100%', width: '100%' }}>
                                <AppClient regions={this.regions} filter={filter} range={range}/>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <MexMap data={mapData} mapClick={this.mapClick} />
                        </Grid>
                        <Grid item xs={3}>
                            <Card style={{ height: '100%', width: '100%' }}>
                                <AppEvent regions={this.regions}  filter={filter} range={range}/>
                            </Card> 
                        </Grid>
                    </Grid>
                    <div style={{ marginBottom: 5 }}></div>
                    <MexChart chartData={chartData} avgData={avgData} filter={filter} />
                </div> : null
        )
    }

    componentDidUpdate(prevProps, prevState) {
        if (!isEqual(prevProps.avgData, this.props.avgData)) {
            this.processData(this.props.avgData)
        }
    }
}
export default AppMonitoring