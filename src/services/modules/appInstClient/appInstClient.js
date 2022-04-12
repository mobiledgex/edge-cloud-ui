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