import { Card, Grid } from '@material-ui/core'
import React from 'react'
import MexChart from '../../charts/MexChart'
import MexMap from './ClusterMexMap'
import ClusterEvent from './ClusterEvent'
import ClusterUsage from './ClusterUsage'

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

class ClusterMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
            mapData: {}
        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }

    static getDerivedStateFromProps(props, state) {
        return processData(props.avgData)
    }

    render() {
        const { mapData } = this.state
        const { chartData, avgData, filter, rowSelected, range, minimize, selectedOrg } = this.props
        return (
            filter.parent.id === 'cluster' ?
                <div className={minimize ? 'grid-charts-minimize' : 'grid-charts'}>
                    <div style={{ height: 400, marginBottom: 10 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <MexMap data={mapData}  region={filter.region}/>
                            </Grid>
                            {/* <Grid item xs={3}>
                                <Card style={{ height: 400, width: '100%' }}>
                                    <ClusterEvent regions={this.regions} filter={filter} range={range} org={selectedOrg} />
                                </Card>
                            </Grid> */}
                        </Grid>
                        {/* <div style={{ marginBottom: 5 }}></div>
                    <Card>
                        <ClusterUsage regions={this.regions} filter={filter} range={range} org={selectedOrg} />
                    </Card> */}
                    </div>
                    <MexChart chartData={chartData} avgData={avgData} filter={filter} rowSelected={rowSelected} style={{ height: 'calc(100vh - 330px)' }} />
                </div> : null
        )
    }
}
export default ClusterMonitoring