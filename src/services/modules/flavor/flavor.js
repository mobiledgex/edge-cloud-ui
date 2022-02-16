
import * as formatter from '../../model/format'
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { endpoint, perpetual } from '../../../helper/constant'
import { cloudletKeys } from '../cloudlet/primary';

let fields = formatter.fields

export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.flavorName, serverField: 'key#OS#name', label: 'Flavor Name', sortable: true, visible: true, filter: true, key: true },
    { field: fields.ram, serverField: 'ram', label: 'RAM Size(MB)', sortable: true, visible: true },
    { field: fields.vCPUs, serverField: 'vcpus', label: 'Number of vCPUs', sortable: true, visible: true },
    { field: fields.disk, serverField: 'disk', label: 'Disk Space(GB)', sortable: true, visible: true },
    { field: fields.gpu, serverField: 'opt_res_map#OS#gpu', label: 'GPU', visible: false, format: true, dataType: perpetual.TYPE_JSON }
])

export const iconKeys = () => ([
    { field: fields.gpu, label: 'GPU', icon: 'gpu_green.svg', clicked: false, count: 0 },
])

export const getKey = (data, isCreate) => {
    let flavor = {}
    flavor.key = { name: data[fields.flavorName] }

    if (isCreate) {
        flavor.ram = parseInt(data[fields.ram])
        flavor.vcpus = parseInt(data[fields.vCPUs])
        flavor.disk = parseInt(data[fields.disk])
        if (data[fields.gpu]) {
            flavor.opt_res_map = { gpu: "gpu:1" }
        }
    }
    return ({
        region: data[fields.region],
        flavor: flavor
    })
}

export const showFlavors = (self, data) => {
    return { method: endpoint.SHOW_FLAVOR, data: data, keys: keys() }
}

export const fetchCloudletFlavors = async (self, data) => {
    const keys = [{ label: 'Name', field: 'flavorName', serverField: 'name' }]
    const requestData = {
        cloudletKey: cloudletKeys(data),
        region: data[fields.region]
    }
    return await showAuthSyncRequest(self, { method: endpoint.SHOW_FLAVORS_FOR_CLOUDLET, data: requestData, keys })
}


export const getFlavorList = async (self, data) => {
    return await showAuthSyncRequest(self, showFlavors(self, data))
}

export const createFlavor = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.CREATE_FLAVOR, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteFlavor = (self, data) => {
    let requestData = getKey(data);
    return { method: endpoint.DELETE_FLAVOR, data: requestData, success: `Flavor ${data[fields.flavorName]} deleted successfully` }
}