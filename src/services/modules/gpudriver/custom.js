import { OS_LINUX } from "../../../helper/constant/perpetual"
import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.gpuConfig] = `${value[fields.gpuDriverName]}${value[fields.organizationName] ? '' : ' [MobiledgeX]'}`
    value[fields.organizationName] = value[fields.organizationName] ? value[fields.organizationName] : 'MobiledgeX'
    value[fields.operatorName] = value[fields.organizationName]
    value[fields.buildCount] = value[fields.builds] ? value[fields.builds].length : 0
    value[fields.licenseConfig] = value[fields.licenseConfig] !== undefined ? true : false
    if(value[fields.buildCount] > 0)
    {
        value[fields.builds].forEach(build=>{
            build[fields.operatingSystem] = build[fields.operatingSystem] ? build[fields.operatingSystem] : OS_LINUX
        })
    }
    return value
}