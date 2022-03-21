import * as perpetual from "../../../helper/constant/perpetual"
import { accessType, imageType, vmAppOS, kind, qosProfile } from "../../../helper/formatter/label"
import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.trusted] = value[localFields.trusted] ? value[localFields.trusted] : false
    value[localFields.accessType] = accessType(value[localFields.accessType])
    value[localFields.imageType] = imageType(value[localFields.imageType])
    value[localFields.vmappostype] = vmAppOS(value[localFields.vmappostype])
    value[localFields.qosSessionProfile] = qosProfile(value[localFields.qosSessionProfile])
    value[localFields.revision] = value[localFields.revision] ? value[localFields.revision] : '0'
    value[localFields.deploymentManifest] = value[localFields.deploymentManifest] ? value[localFields.deploymentManifest].trim() : value[localFields.deploymentManifest]
    if (value[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES) {
        value[localFields.scaleWithCluster] = value[localFields.scaleWithCluster] ? value[localFields.scaleWithCluster] : false
        value[localFields.allowServerless] = value[localFields.allowServerless] ? value[localFields.allowServerless] : false
    }
    value[localFields.createdAt] = value[localFields.createdAt] ? value[localFields.createdAt] : undefined
    value[localFields.updatedAt] = value[localFields.updatedAt] ? value[localFields.updatedAt] : undefined
    value[localFields.autoProvPolicies] = value[localFields.autoPolicyName] ? [value[localFields.autoPolicyName]] : value[localFields.autoProvPolicies]
    value[localFields.autoPolicyName] = undefined
    if (value[localFields.configs]) {
        let configs = value[localFields.configs]
        for (let i = 0; i < configs.length; i++) {
            let config = configs[i]
            config.kind = kind(config.kind)
        }
    }
    value[localFields.app_name_version] = `${value[localFields.appName]} [${value[localFields.version]}]`
    return value
}