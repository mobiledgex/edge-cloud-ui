import * as formatter from '../../model/format'
import { endpoint, perpetual } from '../../../helper/constant';
import { authSyncRequest } from "../../service";
import { getAppKey } from '../app';
import { getCloudletPoolKey } from '../cloudletPool';
let fields = formatter.fields;

export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: fields.operatorName, label: 'Operator', sortable: true, serverField: 'key#OS#cloudlet_pool_key#OS#organization', visible: true, filter: true, group: true, key: true },
    { field: fields.name, label: 'Trust Policy Exception', sortable: true, serverField: 'key#OS#name', visible: true, filter: true, group: true, key: true },
    { field: fields.organizationName, label: 'App [Organization]', sortable: true, serverField: 'key#OS#app_key#OS#organization', visible: true, filter: true, group: true, key: true },
    { field: fields.appName, label: 'App Name', sortable: true, serverField: 'key#OS#app_key#OS#name', visible: false, filter: true, group: true, key: true },
    { field: fields.version, label: 'App [Version]', sortable: true, serverField: 'key#OS#app_key#OS#version', visible: false, filter: true, group: true, key: true },
    { field: fields.poolName, label: 'cloudlet Pool Name', serverField: 'key#OS#cloudlet_pool_key#OS#name', visible: false, key: true },
    { field: fields.requiredOutboundConnections, serverField: 'outbound_security_rules', label: 'Required Outbound Connections', visible: false, dataType: perpetual.TYPE_JSON },
    { field: fields.state, label: 'State', sortable: true, serverField: 'state', visible: true, filter: true, group: true, key: true, format: true, detailView: false },
])

export const getKey = (data, isCreate) => {
    let TrustPolicyException = {}
    TrustPolicyException.key = { app_key: getAppKey(data), Name: data[fields.name], cloudlet_pool_key: getCloudletPoolKey(data) }
    if (data[fields.state]) {
        TrustPolicyException.state = data[fields.state]
    }
    if (data[fields.requiredOutboundConnections]) {
        TrustPolicyException.outbound_security_rules = data[fields.requiredOutboundConnections]
    }
    return ({
        region: data[fields.region],
        TrustPolicyException: TrustPolicyException
    })
}

export const createTrustPolicyException = async (self, data, callback) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.CREATE_TRUST_POLICY_EXCEPTION, data: requestData }
    return await authSyncRequest(self, request, callback, data)
}

export const showTrustPolicyException = (self, data) => {
    return { method: endpoint.SHOW_TRUST_POLICY_EXCEPTION, data: data, keys: keys() }
}

export const updateTrustPolicyException = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.UPDATE_TRUST_POLICY_EXCEPTION, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteTrustPolicyException = (self, data) => {
    let requestData = getKey(data)
    return { method: endpoint.DELETE_TRUST_POLICY_EXCEPTION, data: requestData, success: `Trust Policy Exception ${data[fields.name]} deleted successfully` }
}
