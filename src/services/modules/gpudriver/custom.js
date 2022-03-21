import { OS_LINUX } from "../../../helper/constant/perpetual"
import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.gpuConfig] = `${value[localFields.gpuDriverName]}${value[localFields.organizationName] ? '' : ' [MobiledgeX]'}`
    value[localFields.organizationName] = value[localFields.organizationName] ? value[localFields.organizationName] : 'MobiledgeX'
    value[localFields.operatorName] = value[localFields.organizationName]
    value[localFields.buildCount] = value[localFields.builds] ? value[localFields.builds].length : 0
    value[localFields.licenseConfig] = value[localFields.licenseConfig] !== undefined ? true : false
    if(value[localFields.buildCount] > 0)
    {
        value[localFields.builds].forEach(build=>{
            build[localFields.operatingSystem] = build[localFields.operatingSystem] ? build[localFields.operatingSystem] : OS_LINUX
        })
    }
    return value
}