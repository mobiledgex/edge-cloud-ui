import * as formatter from './format'
import { CLUSTER_EVENT_LOG_ENDPOINT } from './endPointTypes'
import * as dateUtil from '../../utils/date_util'
import * as serverData from './serverData'

let fields = formatter.fields

export const clusterEventKeys = [
    {label:'Date', serverField:'time', visible : false, detailedView : false},
    {label:'Cluster', serverField:'cluster', visible : true, detailedView : false},
    {label:'Cluster Developer', serverField:'clusterorg', visible : true, detailedView : false},
    {label:'Cloudlet', serverField:'cloudlet', visible : true, detailedView : false},
    {label:'Operator', serverField:'cloudletorg', visible : true, detailedView : false},
    {label:'Flavor', serverField:'flavor', visible : false, detailedView : true},
    {label:'vCPU', serverField:'vcpu', visible : false, detailedView : true},
    {label:'RAM', serverField:'ram', visible : false, detailedView : true},
    {label:'Disk', serverField:'disk', visible : false, detailedView : true},
    {label:'Other', serverField:'other', visible : false, detailedView : false},
    {label:'Event', serverField:'event', visible : true, detailedView : true},
    {label:'Status', serverField:'status', visible : true, detailedView : true},
]

export const showKey = (data) => (
    {
        region : data[fields.region],
        clusterinst: {
            cluster_key: { name: "hareservable1" },
            cloudlet_key: { organization: "TDG", name: "automationMunichCloudlet" },
            organization: data[fields.organizationName]
        }
    }
)


export const clusterEventLogs = async (self, data) => {
    let requestInfo = { method: CLUSTER_EVENT_LOG_ENDPOINT, data: showKey(data)}
    let mcRequest = await serverData.sendRequest(self, requestInfo)
    return getData(mcRequest)
}

const customData = (value) => {
    value[fields.time] = dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, value[fields.time])
}

export const formatColumns = (columns)=>
{
    let newColumns = []
    clusterEventKeys.map(key=>{
        newColumns[columns.indexOf(key.serverField)] = key
    })
    return newColumns
}

export const colorType = (value) => {
    switch (value) {
        case 'UP':
            return '#388E3C'
        case 'DOWN':
            return '#D32F2F'
        case 'RESERVED':
            return '#388E3C'
        case 'UNRESERVED':
            return '#0097A7'
        case 'DELETED':
            return '#D32F2F'
        default:
            return '#03A9F4'
    }
}

export const getData = (mcRequest) => {
    let formatted = {}
    if (mcRequest && mcRequest.response) {
        let response = mcRequest.response
        let body = mcRequest.request.data
        if (response.data && response.data.data) {
            let dataList = response.data.data;
            if (dataList && dataList.length > 0) {
                let series = dataList[0].Series
                let messages = dataList[0].messages
                if (series && series.length > 0) {
                    let formattingData = {}
                    let columns = series[0].columns
                    let values = series[0].values
                    let key = series[0].name
                    formattingData['columns'] = formatColumns(columns)
                    formattingData['values'] = values
                    formattingData['colorType'] = colorType
                    formatted[key] = [formattingData]
                    return formatted
                }
            }
        }
    }
    return formatted
    //return formatter.formatEventData(mcRequest, customData)
}
