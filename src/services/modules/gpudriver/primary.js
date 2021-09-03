import { fields } from "../../model/format"

export const buildKey = (data) => {
    let build = {}
    if (data[fields.buildName]) {
        build.name = data[fields.buildName]
    }
    if (data[fields.driverPath]) {
        build.driver_path = data[fields.driverPath]
    }
    if (data[fields.driverPathCreds]) {
        build.driver_path_creds = data[fields.driverPathCreds]
    }
    if (data[fields.operatingSystem]) {
        build.operating_system = data[fields.operatingSystem]
    }
    if (data[fields.kernelVersion]) {
        build.kernel_version = data[fields.kernelVersion]
    }
    if (data[fields.hypervisorInfo]) {
        build.hypervisor_info = data[fields.hypervisorInfo]
    }
    if (data[fields.md5Sum]) {
        build.md5sum = data[fields.md5Sum]
    }
    return build
}