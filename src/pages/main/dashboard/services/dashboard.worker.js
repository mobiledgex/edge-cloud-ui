/* eslint-disable */

import { SHOW_CLOUDLET, SHOW_ORG } from "../../../../helper/constant/endpoint"
import { toJson } from "../../../../utils/json_util"
import { map } from "../../../../services/format/shared";
import { sequence } from "../sequence";
import { fields } from "../../../../services";
import { platformType } from "../../../../helper/formatter/label";


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

const rec = (data, order, index, output)=>{
    let nextIndex = index + 1
    let field = data[order[index]]
    output[field] = output[field] ? output[field] : order[nextIndex] ? {} : []
    if(order[nextIndex])
    {
        rec(data, order, nextIndex,  output[field]) 
    }
    else
    {
        output[field]= output[field] ? [...output[field], data] : [data] 
    }
}

const inlineCompress = (output) => {
    let keys = Array.isArray(output) ? undefined : Object.keys(output)
    if (keys && keys.length > 0) {
        let dataList = []
        keys.map(key => {
            let data = {name: key}
            let children = inlineCompress(output[key])
            if(children)
            {
                data.children = children 
            }
            else
            {
                data.data = output[key][0]
            }
            dataList.push(data)
        })
        return dataList
    }
    return null
}

const inlineGrouping = (orderList, rawListObject) => {
    const se = [fields.operatorName, fields.platformType, fields.cloudletName]
    const { dataList, keys } = rawListObject[SHOW_CLOUDLET]
    let output = {}
    dataList.map(data => {
        rec(data, se, 0, output)
    })
    let vv = {children:[]}
    vv.children = inlineCompress(output)
    console.log(vv)
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
            value = order.format ? map({}, value.data, keys) : value
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
        if (validateData(filters, parent, value)) {
            let temp = { name: value[order.fieldAlt ? order.fieldAlt : order.field], data: value, value: 1, childrenMust:order.childrenMust }
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
        if (request.method === SHOW_ORG) {
            rawListObject[request.data.type] = { dataList: dataArray, keys: request.keys }
        }
        else {
            rawListObject[request.method] = { dataList: dataArray, keys: request.keys }
        }
    })
    let total = {}
    let output = { name: '', children: [], count: {} }
    createBurst(sequence, 0, rawListObject, output, total)
    // inlineGrouping(sequence, rawListObject)
    self.postMessage({ status: 200, data: output, total }) 
}

self.addEventListener("message", (event) => {
    format(event.data)
});