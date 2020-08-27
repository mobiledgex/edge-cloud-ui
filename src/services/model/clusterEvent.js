
import * as formatter from './format'
import { CLUSTER_EVENT_LOG_ENDPOINT } from './endPointTypes'
import * as dateUtil from '../../utils/date_util'
import * as serverData from './serverData'

let fields = formatter.fields

export const showKey = (data) => (
    {
        region : data[fields.region],
        clusterinst: {
            cluster_key: { name: "hareservable1" },
            cloudlet_key:
            {
                cloudlet: { organization: "TDG", name: "automationBerlinCloudlet" }
            },
            organization: data[fields.organizationName]
        }
    }
)


export const clusterEventLogs = async (self, data) => {
    let requestInfo = { method: CLUSTER_EVENT_LOG_ENDPOINT, data: showKey(data) }
    let mcRequest = await serverData.sendRequest(self, requestInfo)
    return getData(mcRequest)
}

const customData = (value) => {
    value[fields.time] = dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, value[fields.time])
}

export const getData = (mcRequest) => {
    return formatter.formatEventData(mcRequest, customData)
}
