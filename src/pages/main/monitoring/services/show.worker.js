/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable */
import { SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLUSTER_INST, SHOW_ORG_CLOUDLET } from '../../../../services/endpoint'
import { MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION, PARENT_APP_INST, PARENT_CLUSTER_INST, PARENT_CLOUDLET } from '../../../../helper/constant/perpetual'
import { formatData } from '../../../../services/format'
import { localFields } from '../../../../services/fields'
import { darkColors } from '../../../../utils/color_utils'

const fetchAppInstData = (parentId, showList, keys, isOperator) => {
    let formattedObject = {}
    let formattedList = []
    let colors = darkColors(showList.length + 10)
    for (let i = 0; i < showList.length; i++) {
        const show = showList[i]
        if (show[localFields.appName] === MEX_PROMETHEUS_APP_NAME || show[localFields.appName] === NFS_AUTO_PROVISION || (show.cloudletLocation === undefined || Object.keys(show.cloudletLocation).length === 0)) {
            continue;
        }
        if (parentId === PARENT_CLOUDLET) {
            formattedList.push({ name: show[localFields.cloudletName], organization: show[localFields.operatorName] })
        }
        else if (parentId === PARENT_APP_INST) {
            formattedList.push(isOperator ? { cluster_inst_key: { cloudlet_key: { organization: show[localFields.operatorName] } } } : { app_key: { name: show[localFields.appName], organization: show[localFields.organizationName] } })
        }
        else if (parentId === PARENT_CLUSTER_INST) {
            formattedList.push(isOperator ? { cloudlet_key: { organization: show[localFields.operatorName] } } : { cluster_key: { name: show[localFields.clusterName] }, organization: show[localFields.organizationName] })
        }
        let dataKey = ''
        let data = {}
        keys.forEach(key => {
            if (!key.resourceLabel && key.field) {
                data[key.field] = show[key.field]
                if (key.field === localFields.resourceQuotas && show[key.field]) {
                    let resourceQuotas = show[key.field]
                    resourceQuotas.forEach(quota => {
                        keys.forEach(resource => {
                            if (resource.resourceLabel && resource.resourceLabel === quota.name) {
                                data[resource.field] = { allotted: quota.value }
                            }
                        })
                    })
                }
                else if (key.groupBy) {
                    //replace cluster name with realclustername for appmetrics
                    let isRealCluster = parentId === PARENT_APP_INST && show[localFields.realclustername]
                    if (isRealCluster && key.field === localFields.clusterName) {
                        dataKey = dataKey + show[localFields.realclustername] + '_'
                    }
                    else {
                        dataKey = dataKey + show[key.field] + '_'
                    }
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
    const { parentId, mcList, metricListKeys, isOperator, region } = worker
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
                        if (appInst[localFields.cloudletName] === cloudlet[localFields.cloudletName] && appInst[localFields.operatorName] === cloudlet[localFields.operatorName]) {
                            appInst[localFields.platformType] = cloudlet[localFields.platformType]
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
                        if (cluster[localFields.operatorName] === cloudlet[localFields.operatorName] && cluster[localFields.cloudletName] === cloudlet[localFields.cloudletName]) {
                            cluster[localFields.cloudletLocation] = cloudlet[localFields.cloudletLocation]
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