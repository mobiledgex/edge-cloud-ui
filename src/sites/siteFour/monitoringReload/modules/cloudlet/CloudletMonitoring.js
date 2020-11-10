import React from 'react'
import MexChart from '../../charts/MexChart'
import { Card, Grid } from '@material-ui/core'
import MexMap from './CloudletMexMap'
import CloudletEvent from './CloudletEvent'

const processData = (avgData) => {
    let mapData = {}
    let selected = 0
    Object.keys(avgData).map(region => {
        let avgDataRegion = avgData[region]
        Object.keys(avgDataRegion).map(key => {
            let keyData = avgDataRegion[key]   
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
    return { mapData }
}

class CloudletMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
            mapData:{}
        }
    }

    static getDerivedStateFromProps(props, state) {
        return processData(props.avgData)
    }

    render() {
        const {mapData} = this.state
        const { chartData, avgData, filter, rowSelected, range } = this.props
        return (
            filter.parent.id === 'cloudlet' ?
                <div className='grid-charts'>
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <Card style={{ height: '100%', width: '100%' }}>
                                {/* <AppClient regions={this.regions} filter={filter} range={range}/> */}
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <MexMap data={mapData}/>
                        </Grid>
                        <Grid item xs={3}>
                            <Card style={{ height: '100%', width: '100%' }}>
                                <CloudletEvent regions={this.regions}  filter={filter} range={range}/>
                            </Card> 
                        </Grid>
                    </Grid>
                    <div style={{ marginBottom: 5 }}></div>
                    <MexChart chartData={chartData} avgData={avgData} filter={filter} rowSelected={rowSelected}  style={{height:'calc(100vh - 330px)'}}/>
                </div> : null
        )
    }
}
export default CloudletMonitoring