import { SHOW_APP_INST_CLIENT } from './endPointTypes'
import * as formatter from './format'

const fields = formatter.fields

export const showAppInstClient = (data) => {
    let requestData = {
        region: data[fields.region],
        appinstclientkey: {
            key: {
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