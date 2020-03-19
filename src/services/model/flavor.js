
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

export const getKey = (data) => {
    return ({
        region: data[fields.region],
        flavor: {
            key: {
                name: data[fields.flavorName]
            }
        }
    })
}

export const showFlavors = (data) => {
    return { method: SHOW_FLAVOR, data: data }
}

export const getFlavorList = async (self, data) => {
    return await serverData.showDataFromServer(self, showFlavors(data))
}

export const deleteFlavor = (data) => {
    let requestData = getKey(data);
    return { method: DELETE_FLAVOR, data: requestData, success: `Flavor ${data[fields.organizationName]}` }
}

const customData = (value) => {
    value[fields.gpu] = value.gpu === 'gpu:1' ? 1 : 0;
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData)
}
