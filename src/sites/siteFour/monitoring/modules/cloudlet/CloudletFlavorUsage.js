import React from 'react'
import { sendAuthRequest } from '../../../../../services/model/serverWorker'
import randomColor from 'randomcolor'
import { cloudletFlavorUsageMetrics } from '../../../../../services/model/cloudletMetrics'
import { fields, getOrganization, isAdmin } from '../../../../../services/model/format'
import LineChart from '../../charts/linechart/MexLineChart'
import * as dateUtil from '../../../../../utils/date_util'
import cloneDeep from 'lodash/cloneDeep'
// import MexWorker from '../../../../../services/worker/mex.worker.js'
// import { WORKER_MONITORING_FLAVOR_USAGE } from '../../../../../services/worker/constant'


const metric = { field: 'count', serverField: 'count', serverHead: 'cloudlet-flavor-usage', header: 'Flavor Usage', position: 4 }

const FLAVOR_USAGE_TIME = 0
const FLAVOR_USAGE_REGION = 1
const FLAVOR_USAGE_CLOUDLET = 2
const FLAVOR_USAGE_OPERATOR = 3
const FLAVOR_USAGE_COUNT = 4
const FLAVOR_USAGE_FLAVOR = 5

class CloudletFlavorUsage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            chartData: {metric, region:'EU'},
            colors: [],
            loading: false
        }
        this.orgData = []
        this.avgData = {}
    }

    header = (data) => {
        let cloudlet = data['cloudlet']
        return (
            <React.Fragment>
                {cloudlet}
            </React.Fragment>
        )
    }

    loadMore = () => {
        let starttime = this.props.range.starttime
        let eventData = this.state.eventData
        let endtime = eventData[eventData.length - 1]['timestamp']
        this.event({ starttime, endtime }, true)
    }


    render() {
        const { chartData } = this.state
        const { filter } = this.props
        return (
            chartData ? <div>
                <LineChart id={'cloudlet-flavor-usage'} rowSelected={0} data={chartData} avgDataRegion={this.avgData} globalFilter={filter} range={this.props.range} labelPosition={5} steppedLine={true} />
            </div> : null
        )

    }

    fetchAvgData = (data) => {
        let values = data.values
        let columns = data.columns
        let valueKeys = Object.keys(values)
        let avgKeys = Object.keys(this.avgData)

        let avgData = {}
        if(avgKeys.length > valueKeys.length)
        {
            avgKeys.map(avgKey=>{
                if(valueKeys.includes(avgKey))
                {
                    avgData[avgKey] = this.avgData[avgKey]
                }
            })
        }
        this.avgData = avgData

        valueKeys.map((valueKey, i) => {
            let avg = {}
            if(this.avgData[valueKey])
            {
                avg = this.avgData[valueKey]
            }
            else
            {
                avg['color'] = randomColor({
                    count: 1,
                })[0]
            }
            columns.map((column, j) => {
                avg[column.serverField] = values[valueKey][FLAVOR_USAGE_TIME][j]
            })
            this.avgData[valueKey] = avg
        })
    }

    /*
     * 
     */
    formatData = () => {
        // const worker = new MexWorker();
        // worker.postMessage({ type: WORKER_MONITORING_FLAVOR_USAGE, metricList:this.metricList, avgData:this.props.avgData, rowSelected:this.props.rowSelected})
        // worker.addEventListener('message', event => {
        //     console.log('Rahul1234', event.data)
        // })
        // if (this.metricList && this.metricList.length > 0) {
        //     let rowSelected = this.props.rowSelected
        //     let selected = []
        //     if (rowSelected > 0) {
        //         let avgDataEU = this.props.avgData['EU']
        //         Object.keys(avgDataEU).map(key => {
        //             if (avgDataEU[key].selected) {
        //                 selected.push(`${avgDataEU[key][fields.cloudletName]}_${avgDataEU[key][fields.operatorName]}`)
        //             }
        //         })
        //     }
        //     let metricData = this.metricList[0]['cloudlet-flavor-usage']
        //     let values = cloneDeep(metricData.values)
        //     Object.keys(values).map(valueKey => {
        //         let formattedList = values[valueKey].reduce((result, dataList) => {
        //             if (rowSelected === 0 || selected.includes(`${dataList[FLAVOR_USAGE_CLOUDLET]}_${dataList[FLAVOR_USAGE_OPERATOR]}`)) {
        //                 let time = dateUtil.utcTime(dateUtil.FORMAT_FULL_DATE_TIME, dataList[FLAVOR_USAGE_TIME])
        //                 let flavor = dataList[FLAVOR_USAGE_FLAVOR]
        //                 let key = `${time}_${flavor}`

        //                 let data = dataList.map((data, i) => {
        //                     if (i === FLAVOR_USAGE_COUNT) {
        //                         return data + (result[key] ? result[key][i] : 0)
        //                     }
        //                     else {
        //                         return data
        //                     }
        //                 })
        //                 result[key] = data
        //             }
        //             return result
        //         }, {})

        //         values[valueKey] = Object.keys(formattedList).map(formatted => {
        //             return formattedList[formatted]
        //         })
        //     })
        //     let newData = {}
        //     newData.region = 'EU'
        //     newData.metric = metric
        //     newData.values = values
        //     newData.columns = metricData.columns
        //     this.setState({ chartData: newData })
        // }
    }

    serverResponse = (mc) => {
        if (mc && mc.response && mc.response.data) {
            this.metricList = mc.response.data
            this.fetchAvgData(this.metricList[0]['cloudlet-flavor-usage'])
            this.formatData()
        }
    }

    fetchData = async (range) => {
        let requestData = {
            region: 'EU',
            cloudlet: {
                organization: isAdmin() ? this.props.org : getOrganization(),
            },
            starttime: '2021-02-21T05:46:54+00:00',//range.starttime,
            endtime: range.endtime,
            selector: 'flavorusage',
        }
        this.setState({ loading: true }, () => {
            sendAuthRequest(this, cloudletFlavorUsageMetrics(requestData), this.serverResponse)
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.rowSelected !== this.props.rowSelected) {
            this.formatData()
        }
        // if (prevProps.org !== this.props.org) {
        //     this.setState({ eventData: [] }, () => {
        //         this.event(this.props.range)
        //     })
        // }
        if (prevProps.range !== this.props.range) {
            this.setState({
                chartData: {metric, region:'EU'}
            }, () => {
                this.fetchData(this.props.range)
            })
        }
    }

    componentDidMount() {
        this.fetchData(this.props.range)
    }
}

export default CloudletFlavorUsage