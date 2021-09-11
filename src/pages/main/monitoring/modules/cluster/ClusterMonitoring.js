import { ImageList, ImageListItem } from '@material-ui/core'
import React from 'react'
import { fields } from '../../../../../services/model/format'
import ClusterMexMap from './ClusterMexMap'
import MexMetric from '../../common/MexMetric'

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
    return { mapData }
}

class ClusterMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
            mapData: {}
        }
    }

    static getDerivedStateFromProps(props, state) {
        return processData(props.avgData)
    }

    render() {
        const { mapData } = this.state
        const { avgData, filter, rowSelected, range, selectedOrg, updateAvgData, regions } = this.props
        return (
            <React.Fragment>
                <ImageList cols={4} rowHeight={300}>
                    {filter.metricType.includes('map') ?
                        <ImageListItem cols={4}>
                            <ClusterMexMap data={mapData} region={filter.region} />
                        </ImageListItem> : null}
                    <MexMetric avgData={avgData} updateAvgData={updateAvgData} filter={filter} regions={regions} rowSelected={rowSelected} range={range} org={selectedOrg} />
                </ImageList>
            </React.Fragment>
        )
    }
}
export default ClusterMonitoring