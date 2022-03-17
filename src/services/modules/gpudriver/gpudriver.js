
import * as formatter from '../../fields'
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { perpetual } from '../../../helper/constant';
import { endpoint } from '../..';
import { redux_org } from '../../../helper/reduxData';
import { ADMIN, TYPE_JSON } from '../../../helper/constant/perpetual';
import { websocket } from '../..';

let localFields = formatter.localFields

export const buildKeys = [
    { field: localFields.buildName, serverField: 'name', label: 'Name' },
    { field: localFields.operatingSystem, serverField: 'operating_system', label: 'Operating System' },
    { field: localFields.kernelVersion, serverField: 'kernel_version', label: 'Kernel Version' },
    { field: localFields.hypervisorInfo, serverField: 'hypervisor_info', label: 'Hypervisor Info' },
    { field: localFields.driverPath, serverField: 'driver_path', label: 'Driver Path', roles: [ADMIN] },
    { field: localFields.md5Sum, serverField: 'md5sum', label: 'MD5 Sum' }
]

export const keys = () => ([
    { field: localFields.region, label: 'Region', sortable: true, visible: true, filter: true, key: true },
    { field: localFields.gpuDriverName, serverField: 'key#OS#name', label: 'GPU Driver', sortable: true, visible: true, filter: true, key: true },
    { field: localFields.organizationName, serverField: 'key#OS#organization', label: 'Organization', sortable: true, visible: true },
    {
        field: localFields.builds, serverField: 'builds', label: 'Builds',
        keys: buildKeys
    },
    { field: localFields.buildCount, label: 'Number of Builds', visible: true, detailView: false },
    { field: localFields.licenseConfig, serverField: 'license_config', label: 'License Configuration', format: true },
    { field: localFields.properties, serverField: 'properties', label: 'Properties', format: true, dataType: TYPE_JSON }
])

export const iconKeys = () => ([
    { field: localFields.licenseConfig, label: 'License Configuration', icon: 'certificate.svg' },
])

export const getKey = (data, isCreate) => {
    let gpuDriver = {}
    const organization = data[localFields.organizationName] === perpetual.MOBILEDGEX ? '' : data[localFields.organizationName]
    gpuDriver.key = { name: data[localFields.gpuDriverName], organization }

    if (isCreate) {
        gpuDriver.builds = data[localFields.builds]
        gpuDriver.properties = data[localFields.properties]
        gpuDriver.license_config = data[localFields.licenseConfig]
    }
    return ({
        region: data[localFields.region],
        gpuDriver
    })
}

export const showGPUDrivers = (self, data, ignoreOrg = false) => {
    let organization = redux_org.nonAdminOrg(self)
    if (organization && redux_org.isOperator(self) && !ignoreOrg) {
        data.gpuDriver = { key: { organization } }
    }
    return { method: endpoint.SHOW_GPU_DRIVER, data: data, keys: keys() }
}


export const getGPUDriverList = async (self, data) => {
    return await showAuthSyncRequest(self, showGPUDrivers(self, data))
}

export const createGPUDriver = async (self, data, callback) => {
    let requestData = getKey(data, true)
    data.uuid = data[localFields.cloudletName]
    let request = { uuid: data.uuid, method: endpoint.CREATE_GPU_DRIVER, data: requestData }
    return websocket.request(self, request, callback, data)
}

export const deleteGPUDriver = (self, data) => {
    let requestData = getKey(data);
    return { method: endpoint.DELETE_GPU_DRIVER, data: requestData, success: `GPU Driver ${data[localFields.gpuDriverName]} deleted successfully` }
}

export const getGPUDriverBuildURL = async (self, data) => {
    let organization = data[localFields.organizationName] === perpetual.MOBILEDGEX ? '' : data[localFields.organizationName]
    let requestData = {
        gpuDriverBuildMember: {
            build: { name: data[localFields.buildName] },
            key: { name: data[localFields.gpuDriverName], organization }
        },
        region: data[localFields.region]
    }
    return await authSyncRequest(self, { method: endpoint.GET_GPU_DRIVER_BUILD_URL, data: requestData })
}

export const addbuild = (self, data) => {
    let primaryKey = getKey(data)
    let requestData = { region: primaryKey[localFields.region] }
    requestData.gpuDriverBuildMember = { build: data.build, ...primaryKey.gpuDriver }
    return { method: endpoint.ADD_GPU_DRIVER_BUILD, data: requestData }
}

export const removeBuild = (self, data) => {
    let primaryKey = getKey(data)
    let requestData = { region: primaryKey[localFields.region] }
    requestData.gpuDriverBuildMember = { build: data.build, ...primaryKey.gpuDriver }
    return { method: endpoint.REMOVE_GPU_DRIVER_BUILD, data: requestData }
}