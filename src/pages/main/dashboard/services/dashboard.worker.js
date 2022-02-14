/* eslint-disable */

import { SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLOUDLET_INFO, SHOW_CLUSTER_INST } from "../../../../helper/constant/endpoint"
import { toJson } from "../../../../utils/json_util"
import { map } from "../../../../services/format/shared";
import { sequence } from "../sequence";
import { fields } from "../../../../services";
import { MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION } from "../../../../helper/constant/perpetual";

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

const formatSequence = (order, index, inp, output) => {
    let data = inp[order[index].field]
    let nextIndex = index + 1
    if (data) {
        let alertType = data.alert && data.alert.type
        let exist = false
        let nextsequence = (nextIndex < order.length) && inp[order[nextIndex].field] !== undefined
        let newout = undefined
        if (output && output.length > 0) {
            for (let i = 0; i < output.length; i++) {
                if (output[i].name === inp[order[index].field].name) {
                    exist = true
                    newout = output[i]
                    break;
                }
            }
        }
        if (exist === false) {
            newout = { ...data }
            // if (order[index].field === 'cloudletStatus') {
            //     newout.color = color[data.name]
            // }
        }

        //if sequence exist and children is undefined
        if (nextsequence) {
            if (newout.children === undefined) {
                newout.children = []
                newout.value = undefined
            }
            alertType = formatSequence(order, nextIndex, inp, newout.children)
        }
        else {
            //assign value if no children
            newout.value = 1
        }

        if (exist === false) {
            output.push(newout)
        }

        newout.alertType = newout.alert ? newout.alert : newout.alertType ? newout.alertType : alertType
        return newout.alertType
    }

}
export const formatData = (order, rawData) => {
    let data = { name: '', children: [] }
    for (let i = 0; i < rawData.length; i++) {
        let item = rawData[i]
        formatSequence(order, 0, item, data.children)
    }
    return data
}

const format = (worker) => {
    let start = new Date().getTime()
    const { region, rawList } = worker
    let rawListObject = {}
    rawList.map(item => {
        const { request, response } = item
        let dataArray = toJson(response.data);
        rawListObject[request.method] = { dataList: dataArray, keys: request.keys }
    })
    let finalList = []

    let keys = rawListObject[SHOW_APP_INST].keys
    let rawDataList = rawListObject[SHOW_APP_INST].dataList
    rawDataList.map(item => {
        let data = map({}, item.data, keys)
        if ([MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION].includes(data[fields.appName])) {

        }
        else {
            let final = {}
            final[fields.region] = { name: region }
            final[fields.cloudletName] = { name: data[fields.cloudletName] }
            final[fields.operatorName] = { name: data[fields.operatorName] }
            final[fields.appName] = { name: data[fields.appName], healthCheck: data[fields.healthCheck], state: data[fields.state] }
            final[fields.clusterName] = { name: data[fields.clusterName] }
            final[fields.clusterdeveloper] = { name: data[fields.clusterdeveloper] }
            final[fields.appDeveloper] = { name: data[fields.organizationName] }
            finalList.push(final)
        }
    })

    keys = rawListObject[SHOW_CLUSTER_INST].keys
    rawDataList = rawListObject[SHOW_CLUSTER_INST].dataList
    rawDataList.map(item => {
        let data = map({}, item.data, keys)
        let exist = false
        finalList.map(final => {
            if (final[fields.clusterName].name === data[fields.clusterName] && final[fields.clusterdeveloper].name === data[fields.organizationName]) {
                final[fields.clusterName].state = data[fields.state]
                exist = true
            }
        })
        if (!exist) {
            let final = {}
            final[fields.cloudletName] = { name: data[fields.cloudletName] }
            final[fields.operatorName] = { name: data[fields.operatorName] }
            final[fields.clusterName] = { name: data[fields.clusterName], state: data[fields.state] }
            final[fields.clusterdeveloper] = { name: data[fields.organizationName] }
            finalList.push(final)
        }
    })

    keys = rawListObject[SHOW_CLOUDLET].keys
    rawDataList = rawListObject[SHOW_CLOUDLET].dataList
    rawDataList.map(item => {
        let data = map({}, item.data, keys)
        let exist = false
        finalList.map(item1 => {
            if (item1[fields.cloudletName].name === data[fields.cloudletName] && item1[fields.operatorName].name === data[fields.operatorName]) {
                item1[fields.cloudletName].state = data[fields.state]
                exist = true
            }
        })
        if (!exist) {
            let final = {}
            final[fields.cloudletName] = { name: data[fields.cloudletName] }
            final[fields.operatorName] = { name: data[fields.operatorName], state: data[fields.state] }
            finalList.push(final)
        }
    })

    let dd = formatData(sequence, finalList)
    console.log('new', (new Date().getTime()) - start)
    self.postMessage({ status: 200, data: dd })
}

self.addEventListener("message", (event) => {
    format(event.data)
});