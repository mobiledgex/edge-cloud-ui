/* eslint-disable */

import { SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLOUDLET_INFO, SHOW_CLUSTER_INST } from "../../../../helper/constant/endpoint"
import { toJson } from "../../../../utils/json_util"
import { map } from "../../../../services/format/shared";
import { fields } from "../../../../services";

export const sequence = [
    { label: 'Cloudlet Name', active: false, fields:[fields.cloudletName, fields.operatorName], method: SHOW_CLOUDLET,  },
    { label: 'Cluster Name', active: false, fields:[fields.clusterName], method: SHOW_CLUSTER_INST },
    { label: 'App Name', active: false, method: SHOW_APP_INST },
]

const processData = (worker) => {

}


const createBurst = (orderList, index, dataObject, output) => {
    let nextIndex = index + 1
    let fields = index - 1 >= 0 ? orderList[index - 1].fields : undefined
    let nextExist = Boolean(orderList[nextIndex])
    let order = orderList[index]
    const { dataList, keys } = dataObject[order.method]
    for (let item of dataList) {
        let value = map({}, item.data, keys)
        if (fields ? fields.every(field => output.data[field] === value[field]) : true) {
            let temp = { data: value }
            if (nextExist) {
                temp.children = []
                createBurst(orderList, nextIndex, dataObject, temp)
            }
            output.children.push(temp)
        }
    }
}

const format = (worker) => {
    const { rawList } = worker
    let rawListObject = {}
    rawList.map(item => {
        const {request, response} = item
        let dataArray = toJson(response.data);
        rawListObject[request.method] = {dataList:dataArray, keys:request.keys}
    })
    console.log(new Date())
    let output = { name: 'start', children:[]}
    createBurst(sequence, 0, rawListObject, output)
    console.log(new Date())
    console.log(output)
}

self.addEventListener("message", (event) => {
    format(event.data)
});