import * as formatter from '../../model/format'
import { endpoint, perpetual } from '../../../helper/constant';
import { getCloudletKey } from '../../modules/cloudlet'
import { authSyncRequest } from "../../service";
import { idFormatter } from '../../../helper/formatter'
import { operatorRoles } from '../../../constant'
let fields = formatter.fields;

export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: fields.networkName, serverField: 'key#OS#name', label: 'Network Name', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: fields.cloudletName, serverField: 'key#OS#cloudlet_key#OS#name', label: 'Cloudlet', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorName, label: 'Organization', serverField: 'key#OS#cloudlet_key#OS#organization', sortable: false, visible: true, clickable: true },
    { field: fields.connectionType, label: 'Connection Type', serverField: 'connection_type', sortable: false, visible: false, clickable: true },
    { field: fields.accessRoutes, abel: 'Routes', serverField: 'routes', sortable: false, visible: false, clickable: true, dataType: perpetual.TYPE_JSON },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true, roles: operatorRoles }
])

export const getKey = (data, isCreate) => {
    let Network = {}
    Network.key = { cloudlet_key: getCloudletKey(data), name: data[fields.networkName] }
    if (isCreate) {
        Network.connection_type = idFormatter.connectionType(data[fields.connectionType])
        if (data[fields.fields]) {
            Network.fields = data[fields.fields]
        }
        if (data[fields.accessRoutes]) {
            Network.routes = data[fields.accessRoutes]
        }
    }
    return ({
        region: data[fields.region],
        Network: Network
    })
}

export const createNetwork = async (self, data, callback) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.CREATE_NETWORKS, data: requestData }
    return await authSyncRequest(self, request, callback, data)
}

export const showNetwork = (self, data) => {
    return { method: endpoint.SHOW_NETWORKS, data: data, keys: keys() }
}

export const updateNetwork = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.UPDATE_NETWORKS, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteNetwork = (self, data) => {
    let requestData = getKey(data)
    return { method: endpoint.DELETE_NETWORKS, data: requestData, success: `Network ${data[fields.networkName]} deleted successfully` }
}
