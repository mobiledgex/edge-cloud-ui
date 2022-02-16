/* eslint-disable */

import { SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLOUDLET_INFO, SHOW_CLUSTER_INST } from "../../../../helper/constant/endpoint"
import { toJson } from "../../../../utils/json_util"
import { map } from "../../../../services/format/shared";
import { sequence, dataForms } from "../sequence";
import { fields } from "../../../../services";

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

const skipData = (form, data) => {
    let skip = form.skip
    let valid = false
    if (skip) {
        valid = skip.every(item => {
            let field = item.field
            let values = item.values
            return values.includes(data[field])
        })
    }
    return valid
}

const validateData = (filters, parent, value) => {
    return filters ? filters.every((field) => {
        let field1 = field
        let field2 = field1
        if (Array.isArray(field)) {
            field1 = field[0]
            field2 = field[1]
        }
        return parent.data[field1] === value[field2]
    }) : true
}

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

const format = (worker) => {
    let start = new Date().getTime()
    const { region, rawList } = worker
    let rawListObject = {}
    rawList.map(item => {
        const { request, response } = item
        let dataArray = toJson(response.data);
        rawListObject[request.method] = { dataList: dataArray, keys: request.keys }
    })

    let dataList = []
    let total = {}
    dataForms.forEach((form, index) => {
        let keys = rawListObject[form.method].keys
        let rawDataList = rawListObject[form.method].dataList
        let tempFields = form.fields
        for (const item of rawDataList) {
            let data = map({}, item.data, keys)
            calculateTotal(form, total, data)
            let exist = false
            if (form.skip && skipData(form, data)) {
                continue;
            }
            if (index > 0) {
                if (form.method === SHOW_CLUSTER_INST) {
                    dataList.forEach(final => {
                        if (final[fields.clusterName].name === data[fields.clusterName] && final[fields.clusterdeveloper].name === data[fields.organizationName]) {
                            final[fields.clusterName].state = data[fields.state]
                            exist = true
                        }
                    })
                }
                else if (form.method === SHOW_CLOUDLET) {
                    dataList.forEach(final => {
                        if (final[fields.cloudletName].name === data[fields.cloudletName] && final[fields.operatorName].name === data[fields.operatorName]) {
                            final[fields.cloudletName].state = data[fields.state]
                            exist = true
                        }
                    })
                }
            }
            if (!exist) {
                let final = {}
                final[fields.region] = { name: region }
                tempFields.forEach(field => {
                    final[field] = { name: data[field] }
                })
                if (form.method === SHOW_APP_INST) {
                    final[fields.appDeveloper] = final[fields.organizationName]
                }
                else if (form.method === SHOW_CLUSTER_INST) {
                    final[fields.clusterdeveloper] = final[fields.organizationName]
                }
                dataList.push(final)
            }
        }
    })

    let sunburstData = formatData(sequence, dataList)
    console.log('new', (new Date().getTime()) - start)
    self.postMessage({ status: 200, data: sunburstData, total })
}

self.addEventListener("message", (event) => {
    format(event.data)
});