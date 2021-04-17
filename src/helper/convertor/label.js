import * as constant from "../../constant"
import { fields } from "../../services/model/format"

export const kind = (data) => {
    let id = data[fields.kind]
    switch (id) {
        case 'helmCustomizationYaml':
            return constant.CONFIG_HELM_CUST
        case 'envVarsYaml':
            return constant.CONFIG_ENV_VAR
        default:
            return id
    }
}

export const imageType = (data) => {
    let id = data[fields.imageType]
    switch (id) {
        case 1:
            return constant.IMAGE_TYPE_DOCKER
        case 2:
            return constant.IMAGE_TYPE_QCOW
        case 3:
            return constant.IMAGE_TYPE_HELM
        default:
            return id
    }
}

export const accessType = (data) => {
    let id = data[fields.accessType]
    switch (id) {
        case 0:
            return constant.ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT
        case 1:
            return constant.ACCESS_TYPE_DIRECT
        case 2:
            return constant.ACCESS_TYPE_LOAD_BALANCER
        default:
            return id
    }
}