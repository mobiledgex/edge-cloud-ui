/* eslint-disable */

import { SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLOUDLET_INFO, SHOW_CLUSTER_INST } from "../../../../helper/constant/endpoint"
import { toJson } from "../../../../utils/json_util"
import { map } from "../../../../services/format/shared";
import { fields } from "../../../../services";
import { READY } from "../../../../helper/formatter/serverFields";
import { HEALTH_CHECK_OK } from "../../../../helper/constant/perpetual";

export const sequence = [
    { label: 'Cloudlet Name', active: false, field:fields.cloudletName, fields: [fields.cloudletName, fields.operatorName], method: SHOW_CLOUDLET, status: [{ field: fields.state, value: READY }] },
    { label: 'Cluster Name', active: false, field:fields.clusterName, fields: [fields.clusterName], method: SHOW_CLUSTER_INST , status: [{ field: fields.state, value: READY }]},
    { label: 'App Name', active: false, field:fields.appName, method: SHOW_APP_INST, status: [{ field: fields.healthCheck, value: HEALTH_CHECK_OK }] },
]

const validateCondition = (parent, order, data)=>{
    let success = false
    order.status.forEach(item=>{
        success = data[item.field].toLowerCase() === item.value.toLowerCase()
    })
    success ? parent.count.success = parent.count.success + 1 : parent.count.error = parent.count.error + 1
}

const createBurst = (orderList, index, dataObject, parent) => {
    let nextIndex = index + 1
    let fields = index - 1 >= 0 ? orderList[index - 1].fields : undefined
    let nextExist = Boolean(orderList[nextIndex]) && dataObject[orderList[nextIndex].method].dataList.length > 0
    let order = orderList[index]
    const { dataList, keys } = dataObject[order.method]
    for (let item of dataList) {
        let value = map({}, item.data, keys)
        if (fields ? fields.every(field => parent.data[field] === value[field]) : true) {
            let temp = { name: value[orderList[index].field], data: value, value:1 }
            if (nextExist) {
                temp.count = { success: 0, error: 0 }
                createBurst(orderList, nextIndex, dataObject, temp)
            }
            parent.children = parent.children ? parent.children : []
            parent.children.push(temp)
            validateCondition(parent, order, value)
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
    let output = { name: '', children: [], count: { success: 0, error: 0 } }
    createBurst(sequence, 0, rawListObject, output)
    self.postMessage({ status: 200, data: output })
}

self.addEventListener("message", (event) => {
    format(event.data)
});