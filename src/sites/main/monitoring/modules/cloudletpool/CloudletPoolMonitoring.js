import React from 'react'
import { Card, GridList, GridListTile } from '@material-ui/core'
import { fields } from '../../../../../services/model/format'
import MexMap from '../cloudlet/CloudletMexMap'
import MexMetric from '../../common/MexMetric'
import Usage from './usage/Usage'
import { mapGridHeight, PARENT_APP_INST, PARENT_CLOUDLET, PARENT_CLOUDLET_POOL } from '../../helper/Constant'
import { appInstMetrics, appInstMetricTypeKeys } from '../../../../../services/model/appMetrics'
import { sendRequest } from '../../services/service'
import LineChart from '../../charts/linechart/MexLineChart'
import MetricWorker from '../../services/metric.worker.js'
import { processWorker } from '../../../../../services/worker/interceptor'
import { timezonePref } from '../../../../../utils/sharedPreferences_util'
import { isEqual } from 'lodash'
import { cloudletMetrics, utilizationMetricType } from '../../../../../services/model/cloudletMetrics'

const checkExist = (key, data) => {
    data = data.toLowerCase()
    return key.includes(data)
}
const processData = (avgData) => {
    let mapData = {}
    if (avgData) {
        let selected = 0
        Object.keys(avgData).map(region => {
            let avgDataRegion = avgData[region]
            Object.keys(avgDataRegion).map(key => {
                let keyData = avgDataRegion[key]
                if (keyData[fields.cloudletLocation]) {
                    let cloudletLocation = keyData[fields.cloudletLocation]
                    let key = `${cloudletLocation.latitude}_${cloudletLocation.longitude}`
                    let cloudletKey = 'data'
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
    }
    return { mapData }
}
class CloudletPoolMonitoring extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mapData: {},
            load:false
        }
        this.metricWorker = new MetricWorker()
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.chartData = undefined
        this.avgData = undefined
        this.pool = undefined
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
        const { mapData, load } = this.state
        const { avgData, filter, rowSelected, minimize, selectedOrg, updateAvgData, listAction } = this.props
        let selected = mapData.selected
        let range  = {starttime: '2021-03-31T06:35:20+00:00',endtime: '2021-03-31T06:41:20+00:00'}
        return (
            filter.parent.id === PARENT_CLOUDLET_POOL ?
                <div className='grid-charts' style={{ height: mapGridHeight(minimize, selected) }}>
                    <GridList cols={4} cellHeight={300}>
                        {filter.metricType.includes('map') ?
                            <GridListTile cols={3}>
                                <MexMap data={mapData} region={filter.region} filter={filter} />
                            </GridListTile> : null}
                            {load ? 
                            <GridListTile  cols={1}>
                                <Card style={{ height: 300 }}>
                                    <LineChart id={'cloudlet-pool-app-metric'} rowSelected={0} data={this.chartData[0]} avgData={this.avgData} globalFilter={filter} range={range} />
                                </Card>
                            </GridListTile> : null}
                        {/* {filter.pool ? <Usage filter={filter} range={range}/> : null} */}
                    </GridList>
                   
                </div> : null
        )
    }

    fetchAppMetric = async () => {
        let range = this.props.range
        let mc = await sendRequest(this, appInstMetrics({
            region: 'EU',
            starttime: '2021-03-31T06:35:20+00:00',//range.starttime,
            endtime: '2021-03-31T06:41:20+00:00',//range.endtime,
            selector: 'cpu',
            appinst: {
                cluster_inst_key: {
                    cloudlet_key: {
                        organization: 'TDG'
                    }
                }
            }
        }))
        if (mc && mc.response && mc.response.status === 200) {
            let response = await processWorker(this.metricWorker, {
                response: mc.response,
                request: mc.request,
                parentId: PARENT_APP_INST,
                region: 'EU',
                metric: appInstMetricTypeKeys()[0],
                timezone: timezonePref(),
                calculateAvgData: true
            })
            if (response.status === 200) {
                const { chartData, avgData } = response.data
                this.chartData = chartData
                this.avgData = avgData
            }
        }
    }

    fetchCloudletMetric = async()=>{
        let mc = await sendRequest(this, cloudletMetrics({
            region: 'EU',
            starttime: '2021-03-31T06:35:20+00:00',//range.starttime,
            endtime: '2021-03-31T06:41:20+00:00',//range.endtime,
            selector: 'utilization',
        }, 'TDG'))
        if (mc && mc.response && mc.response.status === 200) {
            let response = await processWorker(this.metricWorker, {
                response: mc.response,
                request: mc.request,
                parentId: PARENT_CLOUDLET,
                region: 'EU',
                metric: utilizationMetricType[0],
                timezone: timezonePref(),
                avgData:this.props.avgData['EU']
            })
            if (response.status === 200) {
                let cloudletChartKey = Object.keys(response.data[0].datasets)
                this.chartData[0].datasets[cloudletChartKey[0]] = response.data[0].datasets[cloudletChartKey[0]]
                this.setState({load:true})
            //     const { chartData, avgData } = response.data
            //     this.chartData = chartData
            //     this.avgData = avgData
            }
        }
    }

    componentDidUpdate(preProps, preState) {
        let pool = this.props.filter.pool
        if (!isEqual(preProps.range, this.props.range)) {
            this.fetchAppMetric()
        }
        else if (!isEqual(pool, this.pool)) {
            this.pool = pool
            let cloudletAvgData = {}
            cloudletAvgData[pool[fields.region]] = pool[fields.cloudlets]
            let cloudletAvgDataRegion = cloudletAvgData['EU']
            let cloudletAvgDataKeys = Object.keys(cloudletAvgDataRegion)
            let appAvgDataKeys = Object.keys(this.avgData)
            cloudletAvgDataKeys.forEach(cloudletAvgDataKey => {
                let cloudlet = cloudletAvgDataRegion[cloudletAvgDataKey]
                let cloudletAppAvgData = []
                appAvgDataKeys.forEach(key => {
                    if (checkExist(key, cloudlet[fields.region]) && checkExist(key, cloudlet[fields.cloudletName]) && checkExist(key, cloudlet[fields.operatorName])) {
                        cloudletAppAvgData.push(this.avgData[key])
                    }
                })

                if(cloudletAppAvgData.length > 0)
                {
                cloudlet['subData'] = { 'appinst': cloudletAppAvgData }
                }
            })
            cloudletAvgData['EU'] = cloudletAvgDataRegion
            this.props.updateAvgData(cloudletAvgData)
            this.fetchCloudletMetric()
        }
    }

    componentDidMount() {
        this.fetchAppMetric()
    }

    componentWillUnmount() {
        this.metricWorker.terminate()
    }
}
export default CloudletPoolMonitoring