import { endpoint } from "../../../helper/constant"
import { fields } from "../../model/format"

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
    let requestData = {
        region: data[fields.region],
        appinstclientkey: {
            app_inst_key: appInstanceKey(data)
        },
        selector: "*"
    }
    return { method: endpoint.SHOW_APP_INST_CLIENT, data: requestData }
}