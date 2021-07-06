/* eslint-disable */
import sortBy from 'lodash/sortBy'
import { SHOW_CLOUDLET, SHOW_CLUSTER_INST, SHOW_ORG_CLOUDLET } from '../../../../helper/constant/endpoint'
import { formatData } from '../../../../services/format'
import { fields } from '../../../../services/model/format'
import {darkColors} from '../../../../utils/color_utils'

const PARENT_APP_INST = 'appinst'
const PARENT_CLOUDLET = 'cloudlet'
const PARENT_CLUSTER_INST = 'cluster'

const fetchAppInstData = (parentId, showList, keys) => {
    let dataList = {}
    let colors = darkColors(showList.length + 10)
    for (let i = 0; i < showList.length; i++) {
        const show = showList[i]
        if (show[fields.appName] === 'MEXPrometheusAppName' || show[fields.appName] === 'NFSAutoProvision' || (show.cloudletLocation === undefined || Object.keys(show.cloudletLocation).length === 0)) {
            continue;
        }

        let dataKey = ''
        let data = {}
        keys.map(key => {
            data[key.field] = show[key.field]
            if (key.groupBy) {
                //replace cluster name with realclustername for appmetrics
                let isRealCluster = parentId === PARENT_APP_INST && show[fields.realclustername]
                if (isRealCluster && key.field === fields.clusterName) {
                    dataKey = dataKey + show[fields.realclustername] + '_'
                }
                else {
                    dataKey = dataKey + show[key.field] + '_'
                }
            }
        })
        dataKey = dataKey.replace('.', '')
        dataKey = dataKey.toLowerCase().slice(0, -1)
        data['selected'] = false
        data['color'] = colors[i]
        dataList[dataKey] = data
    }
    return dataList
}

const processData = (worker) => {
    const { parentId, mcList, metricListKeys } = worker
    let formattedList = []
    if (mcList && mcList.length > 0) {
        if (parentId === PARENT_APP_INST || parentId === PARENT_CLOUDLET) {
            let mc = mcList[0]
            if (mc && mc.response && mc.response.status === 200)
                formattedList = fetchAppInstData(parentId, mc.response.data, metricListKeys)
        }
        else if (parentId === PARENT_CLUSTER_INST) {
            let clusterList = []
            let cloudletList = []
            mcList.map(mc => {
                let request = mc.request
                if (mc && mc.response && mc.response.status === 200) {
                    if (request.method === SHOW_CLUSTER_INST) {
                        clusterList = mc.response.data
                    }
                    else if (request.method === SHOW_ORG_CLOUDLET || request.method === SHOW_CLOUDLET) {
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
                formattedList = fetchAppInstData(parentId, clusterList, metricListKeys)
            }
        }
    }
    let sortedList = {}
    sortBy(Object.keys(formattedList)).forEach(sorted => {
        sortedList[sorted] = formattedList[sorted]
    })

    self.postMessage({ status: 200, data: sortedList })
}

const format = (worker) => {
    let mcList = worker.mcList
    worker.mcList = mcList.map(mc => {
        let request = mc.request
        let response = mc.response
        return formatData(request, response)
    })
    processData(worker)
}

self.addEventListener("message", (event) => {
    format(event.data)
});