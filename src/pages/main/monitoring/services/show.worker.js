/* eslint-disable */
import { SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLUSTER_INST, SHOW_ORG_CLOUDLET } from '../../../../helper/constant/endpoint'
import { formatData } from '../../../../services/format'
import { fields } from '../../../../services/model/format'
import { darkColors } from '../../../../utils/color_utils'

const PARENT_APP_INST = 'appinst'
const PARENT_CLOUDLET = 'cloudlet'
const PARENT_CLUSTER_INST = 'cluster'

const fetchAppInstData = (parentId, showList, keys, isOperator) => {
    let formattedObject = {}
    let formattedList = []
    let colors = darkColors(showList.length + 10)
    for (let i = 0; i < showList.length; i++) {
        const show = showList[i]
        if (show[fields.appName] === 'MEXPrometheusAppName' || show[fields.appName] === 'NFSAutoProvision' || (show.cloudletLocation === undefined || Object.keys(show.cloudletLocation).length === 0)) {
            continue;
        }
        if (parentId === PARENT_CLOUDLET) {
            formattedList.push({ name: show[fields.cloudletName], organization: show[fields.operatorName] })
        }
        else if (parentId === PARENT_APP_INST) {
            formattedList.push(isOperator ? { cluster_inst_key: { cloudlet_key: { organization: show[fields.operatorName] } } } : { app_key: { name: show[fields.appName], organization: show[fields.organizationName] } })
        }
        else if (parentId === PARENT_CLUSTER_INST) {
            formattedList.push(isOperator ? { cloudlet_key: { organization: show[fields.operatorName] } } : { cluster_key: { name: show[fields.clusterName] }, organization: show[fields.organizationName] })
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
        dataKey = dataKey.replaceAll('.', '')
        dataKey = dataKey.toLowerCase().slice(0, -1)
        data['selected'] = false
        data['color'] = colors[i]
        formattedObject[dataKey] = data
    }
    return { formattedObject, formattedList }
}

const processData = (worker) => {
    const { parentId, mcList, metricListKeys, isOperator } = worker
    let dataObject = {}
    if (mcList && mcList.length > 0) {
        if (parentId === PARENT_CLOUDLET) {
            let mc = mcList[0]
            if (mc && mc.response && mc.response.status === 200)
                dataObject = fetchAppInstData(parentId, mc.response.data, metricListKeys, isOperator)
        }
        else if (parentId === PARENT_APP_INST) {
            let appInstList = []
            let cloudletList = []
            mcList.map(mc => {
                let request = mc.request
                if (mc && mc.response && mc.response.status === 200) {
                    if (request.method === SHOW_APP_INST) {
                        appInstList = mc.response.data
                    }
                    else if (request.method === SHOW_ORG_CLOUDLET || request.method === SHOW_CLOUDLET) {
                        cloudletList = mc.response.data
                    }
                }
            })
            if (appInstList && appInstList.length > 0) {
                for (let appInst of appInstList) {
                    for (const cloudlet of cloudletList) {
                        if (appInst[fields.cloudletName] === cloudlet[fields.cloudletName] && appInst[fields.operatorName] === cloudlet[fields.operatorName]) {
                            appInst[fields.platformType] = cloudlet[fields.platformType]
                            break;
                        }
                    }
                }
                dataObject = fetchAppInstData(parentId, appInstList, metricListKeys)
            }
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
                dataObject = fetchAppInstData(parentId, clusterList, metricListKeys)
            }
        }
    }
    const { formattedObject, formattedList } = dataObject
    self.postMessage({ status: 200, data: formattedObject, list: formattedList })
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