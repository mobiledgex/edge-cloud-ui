import { ALERT_SHOW_RECEIVER } from "../../../helper/constant/endpoint"
import { fields } from "../../model/format"

export const customize = (request, value) => {
    if (request.method === ALERT_SHOW_RECEIVER && value) {
        value[fields.receiverAddress] = value[fields.type] === 'pagerduty' ? 'PagerDuty' : value[fields.type] === 'email' ? value[fields.email] : value[fields.slackchannel]
        value[fields.receiverAddress] = value[fields.type] + '#OS#' + value[fields.receiverAddress]
    }
    return value
}