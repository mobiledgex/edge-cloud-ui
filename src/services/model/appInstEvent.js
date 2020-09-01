
import * as formatter from './format'
import { APP_INST_EVENT_LOG_ENDPOINT } from './endPointTypes'
import * as dateUtil from '../../utils/date_util'

let fields = formatter.fields


const customData = (value) => {
    value[fields.time] = dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, value[fields.time])
}

export const appInstEventLogs = (data) => {
    if (!formatter.isAdmin()) {
        {
            data.appinst = {
                app_key: {
                    organization: formatter.getOrganization()
                }
            }
        }
    }
    data.last = 50
    return { method: APP_INST_EVENT_LOG_ENDPOINT, data: data }
}

export const getData = (mcRequest) => {
        return formatter.formatEventData(mcRequest, customData)
}

