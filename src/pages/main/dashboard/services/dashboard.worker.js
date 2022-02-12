/* eslint-disable */

import { SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLOUDLET_INFO, SHOW_CLUSTER_INST } from "../../../../helper/constant/endpoint"
import { toJson } from "../../../../utils/json_util"
import { map } from "../../../../services/format/shared";
import { fields } from "../../../../services";
import { MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION } from "../../../../helper/constant/perpetual";
import * as serverFields from "../../../../helper/formatter/serverFields";

export const sequence = [ 
    { label: 'Cloudlet Name', active: false, field: fields.cloudletName, filters: { 'appName': [fields.cloudletName, fields.operatorName], 'clusterName': [fields.cloudletName, fields.operatorName]}, method: SHOW_CLOUDLET, total: [{ field: fields.state, values: [serverFields.READY] }, { type:'Transient', field: fields.state, values: [serverFields.CREATING] }] },
    { label: 'Cluster Name', active: false, field: fields.clusterName, filters: { 'appName': [fields.clusterName], 'cloudletName': [fields.cloudletName, fields.operatorName] }, method: SHOW_CLUSTER_INST, total: [{ field: fields.state, values: [serverFields.READY] }] },
    { label: 'App Name', active: false, field: fields.appName, method: SHOW_APP_INST, skip: [{ field: fields.appName, values: [MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION] }], filters: { 'cloudletName': [fields.cloudletName, fields.operatorName], 'clusterName': [fields.clusterName] }, total: [{ field: fields.healthCheck, values: [serverFields.OK] }] },
]

const calculateTotal = (order, total, data) => {
    let attTotal = order.total
    if (attTotal) {
        total[order.field] = total[order.field] ? total[order.field] : {}
        let type = 'error'
        attTotal.forEach(item => {
            let field = item.field
            let values = item.values
            if (values.includes(data[field])) {
                type = item.type ? item.type : 'success'
            }
        })
        total[order.field][type] = total[order.field][type] ? total[order.field][type] : 0
        total[order.field][type] = total[order.field][type] + 1
    }
}

const skipData = (order, data) => {
    let attSkip = order.skip
    let valid = false
    if (attSkip) {
        valid = attSkip.every(item => {
            let field = item.field
            let values = item.values
            return values.includes(data[field])
        })
    }
    return valid
}

const createBurst = (orderList, index, dataObject, parent, total) => {
    let nextIndex = index + 1
    let order = orderList[index]
    let filters = index - 1 >= 0 ? orderList[index - 1].filters[order.field] : undefined
    let nextExist = Boolean(orderList[nextIndex])
    const { dataList, keys } = dataObject[order.method]
    for (let i = 0; i < dataList.length; i++) {
        let value = dataList[i]
        if (!value.calculated) {
            value = map({}, value.data, keys)
            if (skipData(order, value)) {
                dataList.splice(i, 1)
                continue;
            }
            else {
                dataList[i] = value
                dataList[i].calculated = true
                calculateTotal(order, total, value)
            }
        }
        if ((filters ? filters.every(field => parent.data[field] === value[field]) : true)) {
            let temp = { name: value[order.field], data: value, value: 1 }
            if (nextExist) {
                temp.count = {}
                createBurst(orderList, nextIndex, dataObject, temp, total)
            }
            parent.children = parent.children ? parent.children : []
            parent.children.push(temp)
            // calculateTotal(order, parent, total, value)
        }
    }
}

const format = (worker) => {
    const { rawList } = worker
    let rawListObject = {}
    rawList.map(item => {
        const { request, response } = item
        let dataArray = toJson(response.data);
        rawListObject[request.method] = { dataList: dataArray, keys: request.keys }
    })
    // console.log(rawListObject[SHOW_APP_INST].dataList.filter(item=>![MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION].includes(item.data.key.app_key.name)))
    let total = {}
    let output = { name: '', children: [], count: { } }
    createBurst(sequence, 0, rawListObject, output, total)
    self.postMessage({ status: 200, data: output, total })
}

self.addEventListener("message", (event) => {
    format(event.data)
});