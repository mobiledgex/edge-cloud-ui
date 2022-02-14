import { SHOW_CLOUDLET, SHOW_CLUSTER_INST, SHOW_APP_INST } from '../../../../helper/constant/endpoint'
import { HEALTH_CHECK_OK, MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION } from '../../../../helper/constant/perpetual'
import { serverFields } from '../../../../helper/formatter'
import { READY } from '../../../../helper/formatter/serverFields'
import { fields } from '../../../../services'

const rawData = require('./cloudlet.json')

export const sequence1 = [
    // { label: 'Region', active: true, field: 'region' },
    // { label: 'Cloudlet Status', active: true, field: 'cloudletStatus' },
    { label: 'Operator Name', active: false, field: 'operator' },
    { label: 'Cloudlet Name', active: false, field: 'cloudlet' },
    { label: 'Cluster Name', active: false, field: 'cluster' },
    { label: 'App Name', active: false, field: 'app' },
]

export const color = { 'Ready': '#00C851', "Delete": '#ff4444', 'Maintainance': '#ffbb33' }

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
            newout = {  ...data }
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
export const formatData = (order) => {
    let data = { name: '', children: [] }
    for (let i = 0; i < rawData.length; i++) {
        let item = rawData[i]
        formatSequence(order, 0, item, data.children)
    }
    return data
}