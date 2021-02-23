import React from 'react'
import { Card, GridList, GridListTile } from '@material-ui/core'
import { fields } from '../../../../../services/model/format'
import MexMap from './CloudletMexMap'
import CloudletEvent from './CloudletEvent'
import MexMetric from '../../common/MexMetric'
import CloudletFlavorUsage from './CloudletFlavorUsage'

const processData = (avgData) => {
    let mapData = {}
    let selected = 0
    Object.keys(avgData).map(region => {
        let avgDataRegion = avgData[region]
        Object.keys(avgDataRegion).map(key => {
            let keyData = avgDataRegion[key]
            if (keyData[fields.cloudletLocation]) {
                let cloudletLocation = keyData[fields.cloudletLocation]
                let key = `${cloudletLocation.latitude}_${cloudletLocation.longitude}`
                let cloudletKey = keyData.cloudlet
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
    return { mapData }
}
class CloudletMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
            mapData: {}
        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }

    static getDerivedStateFromProps(props, state) {
        if (props.listAction) {
            return null
        }
        else {
            return processData(props.avgData)
        }
    }

    render() {
        const { mapData } = this.state
        const { avgData, filter, rowSelected, range, minimize, selectedOrg, updateAvgData, listAction } = this.props
        return (
            filter.parent.id === 'cloudlet' ?
                <div className={minimize ? 'grid-charts-minimize' : 'grid-charts'}>
                    <GridList cols={4} cellHeight={300}>
                        {filter.metricType.includes('map') ? <GridListTile cols={3}>
                            <MexMap data={mapData} region={filter.region} />
                        </GridListTile> : null}
                        {filter.metricType.includes('event') ? <GridListTile cols={1}>
                            <Card style={{ height: 300 }}>
                                <CloudletEvent regions={this.regions} filter={filter} range={range} org={selectedOrg} />
                            </Card>
                        </GridListTile> : null}
                        <GridListTile cols={1}>
                            <Card style={{ height: 300 }}>
                                <CloudletFlavorUsage range={range} filter={filter} avgData={avgData} rowSelected={rowSelected}/>
                            </Card>
                        </GridListTile>
                        <MexMetric avgData={avgData} updateAvgData={updateAvgData} filter={filter} regions={this.regions} rowSelected={rowSelected} range={range} org={selectedOrg} />
                    </GridList>
                </div> : null
        )
    }

    componentDidMount() {
    }
}
export default CloudletMonitoring