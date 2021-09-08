
import * as formatter from '../../model/format'
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { endpoint, perpetual } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData';
import { sendWSRequest } from '../../model/serverData';
import { ADMIN, TYPE_JSON } from '../../../helper/constant/perpetual';
import { operatorRoles } from '../../../constant';

let fields = formatter.fields

export const buildKeys = [
    { field: fields.buildName, serverField: 'name', label: 'Name' },
    { field: fields.operatingSystem, serverField: 'operating_system', label: 'Operating System' },
    { field: fields.kernelVersion, serverField: 'kernel_version', label: 'Kernel Version' },
    { field: fields.hypervisorInfo, serverField: 'hypervisor_info', label: 'Hypervisor Info' },
    { field: fields.driverPath, serverField: 'driver_path', label: 'Driver Path', roles: [ADMIN] },
    { field: fields.md5Sum, serverField: 'md5sum', label: 'MD5 Sum' }
]

export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.gpuDriverName, serverField: 'key#OS#name', label: 'GPU Driver', sortable: true, visible: true, filter: true, key: true },
    { field: fields.organizationName, serverField: 'key#OS#organization', label: 'Organization', sortable: true, visible: true },
    {
        field: fields.builds, serverField: 'builds', label: 'Builds',
        keys: buildKeys
    },
    { field: fields.buildCount, label: 'Number of Builds', visible: true, detailView: false },
    { field: fields.licenseConfig, serverField: 'license_config', label: 'License Configuration', format: true },
    { field: fields.properties, serverField: 'properties', label: 'Properties', format: true, dataType: TYPE_JSON },
    { field: 'actions', label: 'Actions', sortable: false, visible: true, clickable: true, roles: operatorRoles }
])

export const iconKeys = () => ([
    { field: fields.licenseConfig, label: 'License Configuration', icon: 'certificate.svg' },
])

export const getKey = (data, isCreate) => {
    let gpuDriver = {}
    const organization = data[fields.organizationName] === perpetual.MOBILEDGEX ? '' : data[fields.organizationName]
    gpuDriver.key = { name: data[fields.gpuDriverName], organization }

    if (isCreate) {
        gpuDriver.builds = data[fields.builds]
        gpuDriver.properties = data[fields.properties]
        gpuDriver.license_config = data[fields.licenseConfig]
    }
    return ({
        region: data[fields.region],
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
    data.uuid = data[fields.cloudletName]
    let request = { uuid: data.uuid, method: endpoint.CREATE_GPU_DRIVER, data: requestData }
    return sendWSRequest(self, request, callback, data)
}

export const deleteGPUDriver = (self, data) => {
    let requestData = getKey(data);
    return { method: endpoint.DELETE_GPU_DRIVER, data: requestData, success: `GPU Driver ${data[fields.gpuDriverName]} deleted successfully` }
}

export const getGPUDriverBuildURL = async (self, data) => {
    let organization = data[fields.organizationName] === perpetual.MOBILEDGEX ? '' : data[fields.organizationName]
    let requestData = {
        gpuDriverBuildMember: {
            build: { name: data[fields.buildName] },
            key: { name: data[fields.gpuDriverName], organization }
        },
        region: data[fields.region]
    }
    return await authSyncRequest(self, { method: endpoint.GET_GPU_DRIVER_BUILD_URL, data: requestData })
}

export const addbuild = (self, data) => {
    let primaryKey = getKey(data)
    let requestData = { region: primaryKey[fields.region] }
    requestData.gpuDriverBuildMember = { build: data.build, ...primaryKey.gpuDriver }
    return { method: endpoint.ADD_GPU_DRIVER_BUILD, data: requestData }
}

export const removeBuild = (self, data) => {
    let primaryKey = getKey(data)
    let requestData = { region: primaryKey[fields.region] }
    requestData.gpuDriverBuildMember = { build: data.build, ...primaryKey.gpuDriver }
    return { method: endpoint.REMOVE_GPU_DRIVER_BUILD, data: requestData }
}