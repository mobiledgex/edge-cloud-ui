import * as perpetual from "../../../helper/constant/perpetual"
import { accessType, imageType, vmAppOS, kind } from "../../../helper/formatter/label"
import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.trusted] = value[fields.trusted] ? value[fields.trusted] : false
    value[fields.accessType] = accessType(value[fields.accessType])
    value[fields.imageType] = imageType(value[fields.imageType])
    value[fields.vmappostype] = vmAppOS(value[fields.vmappostype])
    value[fields.revision] = value[fields.revision] ? value[fields.revision] : '0'
    value[fields.deploymentManifest] = value[fields.deploymentManifest] ? value[fields.deploymentManifest].trim() : value[fields.deploymentManifest]
    if (value[fields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES) {
        value[fields.scaleWithCluster] = value[fields.scaleWithCluster] ? value[fields.scaleWithCluster] : false
    }
    value[fields.createdAt] = value[fields.createdAt] ? value[fields.createdAt][fields.seconds] : undefined
    value[fields.updatedAt] = value[fields.updatedAt] ? value[fields.updatedAt][fields.seconds] : undefined
    value[fields.autoProvPolicies] = value[fields.autoPolicyName] ? [value[fields.autoPolicyName]] : value[fields.autoProvPolicies]
    value[fields.autoPolicyName] = undefined
    if (value[fields.configs]) {
        let configs = value[fields.configs]
        for (let i = 0; i < configs.length; i++) {
            let config = configs[i]
            config.kind = kind(config.kind)
        }
    }
    value[fields.app_name_version] = `${value[fields.appName]} [${value[fields.version]}]`
    return value
}