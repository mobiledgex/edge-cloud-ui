import { SHOW_APP_INST_CLIENT } from './endPointTypes'
import * as formatter from './format'

const fields = formatter.fields

export const appInstanceKey = (data) => {
    return {
        app_key: {
            organization: data[fields.organizationName],
            name: data[fields.appName],
            version: data[fields.version]
        },
        cluster_inst_key: {
            cloudlet_key: {
                name: data[fields.cloudletName],
                organization: data[fields.operatorName]
            },
            cluster_key: {
                name: data[fields.clusterName]
            },
            organization: data[fields.clusterdeveloper]
        }
    }
}

export const showAppInstClient = (data) => {
    console.log('Rahul1234', data)
    let requestData = {
        region: data[fields.region],
        appinstclientkey: {
            app_inst_key: appInstanceKey(data)
        },
        selector: "*"
    }
    return { method: SHOW_APP_INST_CLIENT, data: requestData }
}

const customData = (value) => {
}

export const getData = (response, body) => {
    //return formatter.formatData(response, body, keys(), customData, true)
}