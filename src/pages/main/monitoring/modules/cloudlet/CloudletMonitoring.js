import React from 'react'
import { Card, GridList, GridListTile } from '@material-ui/core'
import { fields } from '../../../../../services/model/format'
import CloudletMexMap from './CloudletMexMap'
import CloudletEvent from './CloudletEvent'
import MexMetric from '../../common/MexMetric'
import CloudletFlavorUsage from './CloudletFlavorUsage'
import DMEMetrics from '../../dme/DMEMetrics'
import { ACTION_LATENCY_METRICS } from '../../../../../helper/constant/perpetual'

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
                let cloudletKey = 'data'//keyData.cloudlet
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
        const { avgData, filter, rowSelected, range, selectedOrg, updateAvgData, listAction, onActionClose, regions } = this.props
        return (
            <React.Fragment>
                <GridList cols={4} cellHeight={300}>
                    {filter.metricType.includes('map') ? <GridListTile cols={3}>
                        <CloudletMexMap data={mapData} region={filter.region} />
                    </GridListTile> : null}
                    {filter.metricType.includes('event') ? <GridListTile cols={1}>
                        <Card style={{ height: 300 }}>
                            <CloudletEvent regions={regions} filter={filter} range={range} org={selectedOrg} />
                        </Card>
                    </GridListTile> : null}
                    {filter.region.map((region, i) => (
                        <CloudletFlavorUsage key={`flavor_${region}_${i}`} range={range} filter={filter} avgData={avgData[region]} rowSelected={rowSelected} region={region} org={selectedOrg} />
                    ))}
                    <MexMetric avgData={avgData} updateAvgData={updateAvgData} filter={filter} regions={regions} rowSelected={rowSelected} range={range} org={selectedOrg} />
                </GridList>
                {listAction && listAction.id === ACTION_LATENCY_METRICS ? <DMEMetrics id={filter.parent.id} onClose={onActionClose} data={listAction.data} /> : null}
            </React.Fragment>
        )
    }

    componentDidMount() {
    }
}
export default CloudletMonitoring