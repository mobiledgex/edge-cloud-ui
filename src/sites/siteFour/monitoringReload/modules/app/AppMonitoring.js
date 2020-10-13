import React from 'react'
import MexMap from '../../mexmap/MexMap'
import MexChart from '../../charts/MexChart'
import { showAppInsts } from '../../../../../services/model/appInstance'
import { showAppInstClient } from '../../../../../services/model/appInstClient'
import * as serverData from '../../../../../services/model/serverData'
import { fields } from '../../../../../services/model/format'
import { mcURL } from '../../../../../services/model/serviceMC'
import { getPath } from '../../../../../services/model/endPointTypes'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'



class AppMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
            row: undefined,
            mapData: {},
            avgData: {}
        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }

    static getDerivedStateFromProps(props, state) {
        if (props.row !== state.row) {
            return { row: props.row, mapData: {} }
        }

        if (props.avgData !== state.avgData) {
            let mapData = state.mapData
            let avgData = props.avgData
            Object.keys(avgData).map(region=>{
                let avgDataRegion = avgData[region]
                Object.keys(avgDataRegion).map(key=>{
                    let keyData = avgDataRegion[key]
                    if(keyData.location)
                    {
                        let location = keyData.location
                        mapData['cloudlet'] = {}
                        mapData['cloudlet'][`${location.latitude}_${location.longitude}`] = [{ location: keyData.location, label:keyData['app'], data: keyData, color: keyData.color }]
                    }
                })
            })
            return {mapData, avgData}
        }
        return null
    }

    onMapClick = (data)=>{
        this.sendWSRequest(showAppInstClient(data.data))
    }


    render() {
        const { mapData } = this.state
        const { chartData, avgData, filter } = this.props
        return (
            filter.parent.id === 'appinst' ?
                <div className='grid-charts'>
                    <MexMap data={mapData} onMapClick={this.onMapClick}/>
                    <div style={{ marginBottom: 5 }}></div>
                    <MexChart chartData={chartData} avgData={avgData} filter={filter} />
                </div> : null
        )
    }


    sendWSRequest = (request) => {
        const ws = new WebSocket(`${mcURL(true)}/ws${getPath(request)}`)
        ws.onopen = () => {
            ws.send(`{"token": "${serverData.getToken(this)}"}`);
            ws.send(JSON.stringify(request.data));
            setTimeout(() => {

                ws.close()
            }, 3000)
        }
        ws.onmessage = evt => {
            let response = JSON.parse(evt.data);
            if (response.code === 200) {
                let requestData = response.data
                let location = requestData.location
                let uniqueId = requestData.client_key.unique_id
                let mapData = cloneDeep(this.state.mapData)
                let key = `${location.latitude}_${location.longitude}`
                mapData['devices'] = mapData['devices'] ? mapData['devices'] : {} 
                let data = []
                if (mapData['devices'][key]) {
                    data = mapData['devices'][key][0]
                    data.devices = data.devices ? data.devices : []
                    if (!data.devices.includes(uniqueId)) {
                        data.devices.push(uniqueId)
                        let label = parseInt(data.label) + 1
                        data.label = label
                    }
                }
                else {
                    data = { location, label: 1, devices: [uniqueId] }
                }
                mapData['devices'][key] = [data]
                this.setState({ mapData })
            }
        }

        ws.onclose = evt => {

        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.row !== this.props.row) {
            
        }
        
    }

    componentDidMount() {

    }
}
export default AppMonitoring