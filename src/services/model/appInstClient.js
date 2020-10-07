import { SHOW_APP_INST_CLIENT } from './endPointTypes'
import * as formatter from './format'

export const showAppInstClient = () => {
    let data = {
        "region": "EU",
        "appinstclientkey": {
            "key": {
                    "app_key": {
                        "organization": "forwARdgame",
                        "name": "stackaarrooms",
                        "version": "1"
                    },
                    "cluster_inst_key": {
                        "cloudlet_key": {
                            "name": "berlin-main",
                            "organization": "TDG"
                        },
                        "cluster_key": {
                            "name": "multiroom"
                        },
                        "organization": "forwARdgame"
                    }
            }
        },
        "selector": "*"
    }
    return { method: SHOW_APP_INST_CLIENT, data: data }
}

const customData = (value) => {
}

export const getData = (response, body) => {
    console.log('Rahul1234', response)
    //return formatter.formatData(response, body, keys(), customData, true)
}