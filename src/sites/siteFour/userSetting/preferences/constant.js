import { orgUserMetaDataLS } from "../../../../helper/ls"
import { fields } from "../../../../services/model/format"

export const alertPrefValid = () => {
    let data = orgUserMetaDataLS()
    if (data[fields.type] && ((data[fields.slackchannel] && data[fields.slackwebhook]) || data[fields.email]) && data[fields.severity]) {
        return true
    }
}
