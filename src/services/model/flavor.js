
import * as formatter from './format'
import * as serverData from './serverData'
import { SHOW_FLAVOR, CREATE_FLAVOR, DELETE_FLAVOR } from './endPointTypes'

let fields = formatter.fields

export const keys = [ 
    { field: fields.region, label: 'Region', sortable: true, visible: true },
    { field: fields.flavorName, serverField: 'key#OS#name', label: 'Flavor Name', visible: true },
    { field: fields.ram, serverField: 'ram', label: 'RAM Size(MB)', visible: true },
    { field: fields.vCPUs, serverField: 'vcpus', label: 'Number of vCPUs', visible: true },
    { field: fields.disk, serverField: 'disk', label: 'Disk Space(GB)', visible: true },
    { field: fields.gpu, serverField: 'opt_res_map#OS#gpu', label: 'Number of GPUs', visible: true },
    { field: 'actions', label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const getKey = (data, isCreate) => {
    let flavor  = {}
    flavor.key = {name: data[fields.flavorName]}

    if(isCreate)
    {
        flavor.ram = parseInt(data[fields.ram])
        flavor.vcpus = parseInt(data[fields.vCPUs])
        flavor.disk = parseInt(data[fields.disk])
        if(data[fields.gpu])
        {
            flavor.opt_res_map = {gpu:"gpu:1"}
        }
    }
    return ({
        region: data[fields.region],
        flavor: flavor
    })
}

export const showFlavors = (data) => {
    return { method: SHOW_FLAVOR, data: data }
}

export const getFlavorList = async (self, data) => {
    return await serverData.showDataFromServer(self, showFlavors(data))
}

export const createFlavor = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: CREATE_FLAVOR, data: requestData }
    return await serverData.sendRequest(self, request)
}

export const deleteFlavor = (data) => {
    let requestData = getKey(data);
    return { method: DELETE_FLAVOR, data: requestData, success: `Flavor ${data[fields.flavorName]}` }
}

const customData = (value) => {
    value[fields.gpu] = value.gpu === 'gpu:1' ? 1 : 0;
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData)
}
