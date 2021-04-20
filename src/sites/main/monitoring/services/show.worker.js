/* eslint-disable */

import randomColor from 'randomcolor'
import { fields, formatData } from '../../../../services/model/format'
import sortBy from 'lodash/sortBy'

const defaultFields = (data) => {
    data['color'] = randomColor({
        count: 1,
    })[0]
    data['selected'] = false
}

const fetchAppInstData = (showList, keys) => {
    let dataList = {}
    for (let show of showList) {
        if (show[fields.appName] === 'MEXPrometheusAppName' || show[fields.appName] === 'NFSAutoProvision' || (show.cloudletLocation === undefined || Object.keys(show.cloudletLocation).length === 0)) {
            continue;
        }

        let dataKey = ''
        let data = {}
        keys.map(key => {
            data[key.field] = show[key.field]
            if (key.groupBy) {
                dataKey = dataKey + show[key.field] + '_'
            }
        })
        dataKey = dataKey.replace('.', '')
        dataKey = dataKey.toLowerCase().slice(0, -1)
        defaultFields(data)
        dataList[dataKey] = data
    }
    return dataList
}

const processData = (worker) => {
    const { parentId, mcList, metricListKeys } = worker
   
    let formattedList = []
    if (mcList && mcList.length > 0) {
        if (parentId === 'appinst' || parentId === 'cloudlet') {
            let mc = mcList[0]
            if (mc && mc.response && mc.response.status === 200)
                formattedList = fetchAppInstData(mc.response.data, metricListKeys)
        }
        else if (parentId === 'cluster') {
            let clusterList = []
            let cloudletList = []
            mcList.map(mc => {
                let request = mc.request
                if (mc && mc.response && mc.response.status === 200) {
                    if (request.method === 'ShowClusterInst') {
                        clusterList = mc.response.data
                    }
                    else if (request.method === 'orgcloudlet/show') {
                        cloudletList = mc.response.data
                    }
                }
            })
            if (clusterList && clusterList.length > 0) {
                for (let i = 0; i < clusterList.length; i++) {
                    let cluster = clusterList[i]
                    for (let j = 0; j < cloudletList.length; j++) {
                        let cloudlet = cloudletList[j]
                        if (cluster[fields.operatorName] === cloudlet[fields.operatorName] && cluster[fields.cloudletName] === cloudlet[fields.cloudletName]) {
                            cluster[fields.cloudletLocation] = cloudlet[fields.cloudletLocation]
                            break;
                        }
                    }
                }
                formattedList = fetchAppInstData(clusterList, metricListKeys)
            }
        }
    }
    let sortedList = {}
    sortBy(Object.keys(formattedList)).forEach(sorted=>{
        sortedList[sorted] = formattedList[sorted]
    })
    self.postMessage({ status: 200, data: sortedList })
}

const format = (worker) => {
    let mcList = worker.mcList
    worker.mcList = mcList.map(mc => {
        let request = mc.request
        let response = mc.response
        response.data =  formatData(response, request.data, request.keys)
        return {request, response}
    })
    processData(worker)
}

self.addEventListener("message", (event) => {
    format(event.data)
});