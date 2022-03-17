import { localFields } from "../../fields"

export const buildKey = (data) => {
    let build = {}
    if (data[localFields.buildName]) {
        build.name = data[localFields.buildName]
    }
    if (data[localFields.driverPath]) {
        build.driver_path = data[localFields.driverPath]
    }
    if (data[localFields.driverPathCreds]) {
        build.driver_path_creds = data[localFields.driverPathCreds]
    }
    if (data[localFields.operatingSystem]) {
        build.operating_system = data[localFields.operatingSystem]
    }
    if (data[localFields.kernelVersion]) {
        build.kernel_version = data[localFields.kernelVersion]
    }
    if (data[localFields.hypervisorInfo]) {
        build.hypervisor_info = data[localFields.hypervisorInfo]
    }
    if (data[localFields.md5Sum]) {
        build.md5sum = data[localFields.md5Sum]
    }
    return build
}