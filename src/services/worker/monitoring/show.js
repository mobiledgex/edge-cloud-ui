/* eslint-disable */

import randomColor from 'randomcolor'
import { fields } from '../../model/format'

const defaultFields = (data) => {
    data['color'] = randomColor({
        count: 1,
    })[0]
    data['selected'] = false
}

const fetchAppInstData = (showList) => {
    let dataList = []
    for(let i=0;i<showList.length;i++)
    {
        let show = showList[i]
        if (show[fields.appName] === 'MEXPrometheusAppName' || show[fields.appName] === 'NFSAutoProvision') {
            continue;
        }
        let data = {}
        data[fields.region] = show[fields.region]
        data[fields.appName] = show[fields.appName]
        data[fields.version] = show[fields.version]
        data[fields.organizationName] = show[fields.organizationName]
        data[fields.clusterName] = show[fields.clusterName]
        data[fields.clusterdeveloper] = show[fields.clusterdeveloper]
        data[fields.cloudletName] = show[fields.cloudletName]
        data[fields.operatorName] = show[fields.operatorName]
        data[fields.location] = show[fields.cloudletLocation]
        defaultFields(data)
        dataList.push(data)
    }
    return dataList
}

const processData = (worker) => {
    let parentId = worker.parentId
    let region = worker.region
    let mcList = worker.data

    let avgData = worker.avgData
    avgData[parentId] = avgData[parentId] ? avgData[parentId] : {}
    avgData[parentId][region] = avgData[parentId][region] ? avgData[parentId][region] : {}

    let formattedList = []
    if (mcList && mcList.length > 0) {
        if (parentId === 'appinst') {
            let mc = mcList[0]
            if (mc && mc.response && mc.response.status === 200)
                formattedList = fetchAppInstData(mc.response.data)
        }
    }
    avgData[parentId][region] = formattedList
    self.postMessage({ avgData })
}

export const format = (worker) => {
    processData(worker)
}