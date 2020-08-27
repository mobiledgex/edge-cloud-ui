
import * as formatter from './format'
import { APP_INST_EVENT_LOG_ENDPOINT } from './endPointTypes'
import * as dateUtil from '../../utils/date_util'
import * as serverData from './serverData'

let fields = formatter.fields

export const showKey = (data) => (
    {
        region : data[fields.region],
        appinst: {
            app_key: {
                organization: data[fields.organizationName]
            },
            cluster_inst_key:
            {
                cluster_key: { name: "autoclusterautomation-sdk-porttest" },
                cloudlet_key:
                {
                    cloudlet: { organization: "TDG", name: "automationDusseldorfCloudlet" }
                }
            }
        }
    }
)

const customData = (value) => {
    value[fields.time] = dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, value[fields.time])
}

export const appInstEventLogs = async (self, data) => {
    let requestInfo = { method: APP_INST_EVENT_LOG_ENDPOINT, data: showKey(data) }
    let mcRequest = await serverData.sendRequest(self, requestInfo)
    return getData(mcRequest)
}

export const getData = (mcRequest) => {
        return formatter.formatEventData(mcRequest, customData)
}

