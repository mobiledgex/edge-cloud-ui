import * as formatter from '../../model/format'
import { endpoint, perpetual } from '../../../helper/constant';
import { getCloudletKey } from '../../modules/cloudlet'
import { authSyncRequest } from "../../service";
import { idFormatter } from '../../../helper/formatter'
import { operatorRoles } from '../../../constant'
let fields = formatter.fields;

export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: fields.networkName, serverField: 'key#OS#organization', label: 'Network Name', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: fields.cloudletName, serverField: 'key#OS#name', label: 'Cloudlet', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorName, label: 'Organization', sortable: false, visible: true, clickable: true },
    { field: fields.connectionType, label: 'Connection Type', serverField: 'connection_type', sortable: false, visible: false, clickable: true },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true, roles: operatorRoles },
    { field: fields.routes, label: 'Routes', serverField: 'routes', sortable: false, visible: false, clickable: true, dataType: perpetual.TYPE_JSON },
])

export const getKey = (data, isCreate, isDelete) => {
    let Network = {}
    let key = {}
    let sendData = {}
    key = { cloudlet_key: getCloudletKey(data), name: data[fields.networkName] }
    if (isCreate) {
        Network = {
            key,
            connection_type: idFormatter.connectionType(data[fields.connectionType])
        }
        sendData = { Network }
    }
    if (isDelete) {
        sendData = { key }
    }
    sendData.region = data[fields.region]
    return sendData
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
    let requestData = getKey(data, null, true)
    return { method: endpoint.DELETE_NETWORK, data: requestData, success: `Network ${data[fields.networkName]} deleted successfully` }
}
