import { endpoint } from "../.."
import { localFields } from "../../fields"

export const appInstanceKey = (data) => {
    return {
        app_key: {
            organization: data[localFields.organizationName],
            name: data[localFields.appName],
            version: data[localFields.version]
        },
        cluster_inst_key: {
            cloudlet_key: {
                name: data[localFields.cloudletName],
                organization: data[localFields.operatorName]
            },
            cluster_key: {
                name: data[localFields.clusterName]
            },
            organization: data[localFields.clusterdeveloper]
        }
    }
}

export const showAppInstClient = (data) => {
    let requestData = {
        region: data[localFields.region],
        appinstclientkey: {
            app_inst_key: appInstanceKey(data)
        },
        selector: "*"
    }
    return { method: endpoint.SHOW_APP_INST_CLIENT, data: requestData }
}