import React from 'react'
import MexMap from '../../mexmap/AppMexMap'
import MexChart from '../../charts/MexChart'
import { Card, Grid } from '@material-ui/core'
import { clientMetrics } from '../../../../../services/model/clientMetrics'
import { orgEvents } from '../../../../../services/model/events'
import * as serverData from '../../../../../services/model/serverData'
import { fields, getOrganization } from '../../../../../services/model/format'
import { OFFLINE, ONLINE } from '../../../../../constant';
import isEqual from 'lodash/isEqual'
import * as dateUtil from '../../../../../utils/date_util'
import HorizontalBar from '../../charts/horizontalBar.js/MexHorizontalBar'
import EventList from '../../list/EventList'
import cloneDeep from 'lodash/cloneDeep'

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
            stackedData: [],
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
        const { mapData, stackedData, eventData } = this.state
        const { chartData, avgData, filter } = this.props
        return (
            filter.parent.id === 'appinst' ?
                <div className='grid-charts'>
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <Card style={{ height: '100%', width: '100%' }}>
                                {stackedData.length > 0 ? <HorizontalBar header='Client API Usage Count' chartData={stackedData} filter={filter} /> : null}
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <MexMap data={mapData} mapClick={this.mapClick} />
                        </Grid>
                        <Grid item xs={3}>
                            <Card style={{ height: '100%', width: '100%' }}>
                                <EventList header='Events' eventData={eventData} avgData={avgData}/>
                            </Card> 
                        </Grid>
                    </Grid>
                    <div style={{ marginBottom: 5 }}></div>
                    <MexChart chartData={chartData} avgData={avgData} filter={filter} />
                </div> : null
        )
    }

    timeRangeInMin = (range) => {
        let endtime = dateUtil.currentUTCTime()
        let starttime = dateUtil.subtractMins(range, endtime).valueOf()
        starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
        endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
        return { starttime, endtime }
    }

    client = async (region, range) => {
        let mc = await serverData.sendRequest(this, clientMetrics({ region: region, selector: "api",  }))
        if (mc && mc.response && mc.response.data) {
            let findCloudletList = []
            let registerClientList = []
            let verifyLocationList = []
            let labelList = []
            let dataList = mc.response.data
            dataList && dataList.map(clientData => {
                let dataObject = clientData['dme-api'].values
                Object.keys(dataObject).map(key => {
                    let findCloudlet = 0
                    let registerClient = 0
                    let verifyLocation = 0
                    dataObject[key].map(data => {
                        findCloudlet += data.includes('FindCloudlet') ? 1 : 0
                        registerClient += data.includes('RegisterClient') ? 1 : 0
                        verifyLocation += data.includes('VerifyLocation') ? 1 : 0
                    })
                    findCloudletList.push(findCloudlet)
                    registerClientList.push(registerClient)
                    verifyLocationList.push(verifyLocation)
                    labelList.push(`${region} - ${dataObject[key][0][7]} [${dataObject[key][0][18]}]`)
                })
            })

            let stackedData = cloneDeep(this.state.stackedData)
            if(stackedData.length === 0)
            {
                stackedData = [{ key: 'labels', value: labelList }, { key: 'Find Cloudlet', value: findCloudletList, color: '#80C684' }, { key: 'Register Client', value: registerClientList, color: '#4693BC' }, { key: 'Verify Location', value: verifyLocationList, color: '#FD8D3C' }]   
            }
            else
            {
                stackedData.map(data=>{
                    if(data.key === 'labels')
                    {
                        data.value = [...data.value, ...labelList]
                    }
                    else if(data.key === 'Find Cloudlet')
                    {
                        data.value = [...data.value, ...findCloudletList]
                    }
                    else if(data.key === 'Register Client')
                    {
                        data.value = [...data.value, ...registerClientList]
                    }
                    else if(data.key === 'Verify Location')
                    {
                        data.value = [...data.value, ...verifyLocationList]
                    }
                })
            }
            this.setState({ stackedData })
        }
    }

    event = async (range) => {
        let mc = await serverData.sendRequest(this, orgEvents({
            // starttime: range.starttime,
            // endtime: range.endtime,
            match: {
                orgs: [getOrganization()],
                types: ["event"],
                tags: { app: "*" }
            },
            limit: 10
        }))
        if (mc && mc.response && mc.response.data) {
            console.log('Rahul1234', mc)
            let dataList = mc.response.data
            this.setState({ eventData: dataList })
        }
    }

    componentDidMount() {

        let range = this.timeRangeInMin(40)
        this.regions.map(region=>{
            this.client(region, range)
        })
        this.event(range)
    }

    componentDidUpdate(prevProps, prevState) {
        if (!isEqual(prevProps.avgData, this.props.avgData)) {
            this.processData(this.props.avgData)
        }
    }
}
export default AppMonitoring