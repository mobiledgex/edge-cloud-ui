import { ALERT_SHOW_RECEIVER } from "../../endpoint"
import { localFields } from "../../fields"

export const customize = (request, value) => {
    if (request.method === ALERT_SHOW_RECEIVER && value) {
        value[localFields.receiverAddress] = value[localFields.type] === 'pagerduty' ? 'PagerDuty' : value[localFields.type] === 'email' ? value[localFields.email] : value[localFields.slackchannel]
        value[localFields.receiverAddress] = value[localFields.type] + '#OS#' + value[localFields.receiverAddress]
    }
    return value
}