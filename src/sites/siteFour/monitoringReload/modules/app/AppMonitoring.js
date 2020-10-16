import React from 'react'
import MexMap from '../../mexmap/AppMexMap'
import MexChart from '../../charts/MexChart'

class AppMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
            mapData: {}
        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }

    static getDerivedStateFromProps(props, state) {
        let mapData = {}
        let avgData = props.avgData
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

    render() {
        const { mapData } = this.state
        const { chartData, avgData, filter } = this.props
        return (
            filter.parent.id === 'appinst' ?
                <div className='grid-charts'>
                    <MexMap data={mapData} mapClick={this.mapClick}/>
                    <div style={{ marginBottom: 5 }}></div>
                    <MexChart chartData={chartData} avgData={avgData} filter={filter} />
                </div> : null
        )
    }


    


    componentDidMount() {

    }
}
export default AppMonitoring