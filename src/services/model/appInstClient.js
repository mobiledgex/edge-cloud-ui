import { SHOW_APP_INST_CLIENT } from './endPointTypes'
import * as formatter from './format'

const fields = formatter.fields

export const showAppInstClient = (data) => {
    let requestData = {
        region: data[fields.region],
        appinstclientkey: {
            key: {
                    app_key: {
                        organization: data['apporg'],
                        name: data['app'],
                        version: data['ver']
                    },
                    cluster_inst_key: {
                        cloudlet_key: {
                            name: data['cloudlet'],
                            organization: data['cloudletorg']
                        },
                        cluster_key: {
                            name: data['cluster']
                        },
                        organization: data['clusterorg']
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
    console.log('Rahul1234', response)
    //return formatter.formatData(response, body, keys(), customData, true)
}