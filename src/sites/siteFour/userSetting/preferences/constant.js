import { preferences } from "../../../../helper/ls"
import { fields } from "../../../../services/model/format"

export const alertPrefValid = () => {
    let prefs = preferences()
    if (prefs[fields.type] && ((prefs[fields.slackchannel] && prefs[fields.slackwebhook]) || prefs[fields.email]) && prefs[fields.severity]) {
        return true
    }
}
