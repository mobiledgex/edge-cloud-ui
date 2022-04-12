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

import { toJson } from "../../../../../utils/json_util"
import { map } from "../../../../../services/format/shared";
import { dataForms } from "./sequence";
import { localFields } from "../../../../../services/fields";
import { SHOW_APP_INST, SHOW_CLUSTER_INST, SHOW_CLOUDLET, SHOW_ORG_CLOUDLET } from "../../../../../services/endpoint";

const formatSequence = (order, index, inp, outputs) => {
    let currentOrder = order[index]
    let data = inp[currentOrder.field]
    let nextIndex = index + 1
    let alert = undefined
    if (data) {
        let exist = false
        let nextsequence = (nextIndex < order.length) && inp[order[nextIndex].field] !== undefined
        let newout = undefined
        if (outputs?.length > 0) {
            for (const output of outputs) {
                if (output.name === inp[currentOrder.field].name) {
                    exist = true
                    newout = output
                    break;
                }
            }
        }
        if (!exist) {
            newout = { ...data, field: currentOrder.field, header: currentOrder.label, childrenLabel: order[nextIndex] && order[nextIndex].label }
            if (currentOrder.alerts) {
                let alerts = currentOrder.alerts
                alerts && alerts.forEach(item => {
                    let field = item.field
                    let type, color
                    item.states.map(state => {
                        let values = state.values
                        if (values.includes(data[field])) {
                            type = state.type ? state.type : 'success'
                            color = state.color
                        }
                    })

                    type = type ? type : 'error'
                    color = color ? color : '#D32F2F'

                    if (type !== 'success') {
                        newout.alert = newout.alert ? newout.alert : { self: true }
                        newout.alert['type'] = type
                        newout.alert['field'] = field
                        newout.alert['value'] = data[field]
                        newout.alert['color'] = color
                    }
                })
            }
        }

        //if sequence exist and children is undefined
        if (nextsequence) {
            if (newout.children === undefined) {
                newout.children = []
                newout.value = undefined
            }
            alert = formatSequence(order, nextIndex, inp, newout.children)
        }
        else {
            //assign value if no children
            newout.value = 1
        }

        if (exist === false) {
            outputs.push(newout)
        }

        if ((!newout.alert || !newout.alert.self) && alert) {
            if (alert.self) {
                if (!newout.alert || newout.alert.type !== 'error') {
                    newout.alert = {}
                    newout.alert.type = alert.type
                    newout.alert.color = alert.color
                }
            }
            else {
                newout.alert = alert
            }
        }
        return newout.alert
    }
}

export const formatData = (order, rawDatas) => {
    let data = { name: '', children: [] }
    for (const rawData of rawDatas) {
        let item = rawData
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

const calculateTotal = (order, total, data) => {
    let alerts = order.alerts
    if (alerts) {
        total[order.field] = total[order.field] ? total[order.field] : {}
        let type = 'error'
        alerts.forEach(item => {
            let field = item.field
            let values = item.values
            if (values.includes(data[field])) {
                type = item.type ?? 'success'
            }
        })
        total[order.field][type] = total[order.field][type] ? total[order.field][type] : 0
        total[order.field][type] = total[order.field][type] + 1
    }
}

const format = (worker) => {
    const { mcsList, initFormat, sequence } = worker
    let total = {}
    let temp = { dataList: [], data: { name: '', children: [] } }
    if (initFormat) {
        mcsList.forEach(item => {
            const { region, rawList } = item
            let dataList = []
            if (rawList?.length > 0) {
                let rawListObject = {}
                rawList.map(item => {
                    const { request, response } = item
                    let dataArray = toJson(response.data);
                    let method = request.method
                    if (method === SHOW_ORG_CLOUDLET) {
                        method = SHOW_CLOUDLET
                    }
                    rawListObject[method] = { dataList: dataArray, keys: request.keys }
                })
                dataForms.forEach((form, index) => {
                    if (rawListObject[form.method]) {
                        let keys = rawListObject[form.method].keys
                        let rawDataList = rawListObject[form.method].dataList
                        let tempFields = form.fields
                        for (const item of rawDataList) {
                            let rawData = item?.data ?? item
                            if (rawData) {
                                let data = map({}, rawData, keys)
                                if (form.skip && skipData(form, data)) {
                                    continue;
                                }
                                let exist = false
                                calculateTotal(form, total, data)
                                if (index > 0) {
                                    if (form.method === SHOW_CLUSTER_INST) {
                                        dataList.forEach(final => {
                                            if (final[localFields.clusterName].name === data[localFields.clusterName] && final[localFields.clusterdeveloper].name === data[localFields.organizationName]) {
                                                final[localFields.clusterName].state = data[localFields.state]
                                                final[localFields.clusterName].data = { ...data, region }
                                                exist = true
                                            }
                                        })
                                    }
                                    else if (form.method === SHOW_CLOUDLET) {
                                        dataList.forEach(final => {
                                            if (final[localFields.cloudletName].name === data[localFields.cloudletName] && final[localFields.operatorName].name === data[localFields.operatorName]) {
                                                final[localFields.cloudletName].state = data[localFields.state]
                                                final[localFields.cloudletName].data = { ...data, region }
                                                exist = true
                                            }
                                        })
                                    }
                                }
                                if (!exist) {
                                    let final = {}
                                    final[localFields.region] = { name: region }
                                    final[form.field] = {}
                                    final[form.field].name = data[form.field]
                                    final[form.field].data = { ...data, region }
                                    tempFields.forEach(field => {
                                        if (Array.isArray(field)) {
                                            field.forEach(item => {
                                                final[form.field][item] = data[item]
                                            })
                                        }
                                        else {
                                            final[field] = { name: data[field] }
                                        }
                                    })
                                    if (form.method === SHOW_APP_INST) {
                                        final[localFields.appDeveloper] = final[localFields.organizationName]
                                    }
                                    else if (form.method === SHOW_CLUSTER_INST) {
                                        final[localFields.clusterdeveloper] = final[localFields.organizationName]
                                    }
                                    dataList.push(final)
                                }
                            }
                        }
                    }
                })
            }
            let sunburstData = formatData(sequence, dataList)
            temp.data.children = [...temp.data.children, ...sunburstData.children]
            temp.dataList = [...temp.dataList, ...dataList]
            temp.total = total
        })
        postMessage({ status: 200, ...temp })
    }
    else {
        let dataList = worker.rawList
        let sunburstData = formatData(sequence, dataList)
        postMessage({ status: 200, data: sunburstData })
    }

}

addEventListener("message", (event) => {
    format(event.data)
});