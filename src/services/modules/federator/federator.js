
import * as formatter from '../../model/format'
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { endpoint, perpetual } from '../../../helper/constant'
import { primaryKeys as cloudletKeys } from '../cloudlet/primary';
import { redux_org } from '../../../helper/reduxData'

let fields = formatter.fields

export const keys = () => ([
    { field: fields.region, label: 'region', serverField: 'region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorName, label: 'Operator', serverField: 'operatorid', sortable: true, visible: true, filter: true, key: true },
    { field: fields.federationId, label: 'federationid', serverField: 'federationid', sortable: true, visible: true, filter: true, key: true },
    { field: fields.mcc, label: 'mcc', sortable: true, visible: true, filter: true, key: true },
    { field: fields.mnc, label: 'mnc', sortable: true, visible: true, filter: true, key: true, dataType: perpetual.TYPE_ARRAY },
    { field: fields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true, key: true, dataType: perpetual.TYPE_ARRAY },
])

export const iconKeys = () => ([
    { field: fields.federationaddr, label: 'GPU', icon: 'gpu_green.svg', clicked: false, count: 0 },
])

export const getKey = (data, isCreate) => {
    let federator = {}
    federator.countrycode = data[fields.countryCode]
    federator.mcc = data[fields.mcc]
    federator.mnc = data[fields.mnc]
    federator.operatorid = data[fields.operatorName]
    federator.region = data[fields.region]
    if (data[fields.federationId]) {
        federator.federationid = data[fields.federationId]
    }
    if (data[fields.locatorendpoint]) {
        federator.locatorendpoint = data[fields.locatorEndPoint]
    }
    return federator
}

export const createFederator = async (self, data) => {
    let requestData = getKey(data)
    let request = { method: endpoint.CREATE_FEDERATOR, data: requestData }
    console.log(request)
    return await authSyncRequest(self, request)
}
export const updateFederator = (self, data) => {
    const request = {
        "operatorid": "TDG"
    }
    return { method: endpoint.SHOW_FEDERATOR, data: request, keys: keys() }
}

export const showFederator = (self, data) => {
    let requestData = {}
    let organization = data.org ? data.org : redux_org.orgName(self)
    console.log(redux_org.orgName(self), redux_org.isOperator(self) || data.type === perpetual.OPERATOR)
    if (organization) {
        if (redux_org.isOperator(self) || data.type === perpetual.OPERATOR) {
            requestData.operatorid = organization
        }
    }
    console.log(requestData, "requestData")
    return { method: endpoint.SHOW_FEDERATOR, data: requestData, keys: keys() }
}
export const showFederatorSelfZone = (self, data) => {
    const request = {
        "operatorid": "TDG"
    }
    return { method: endpoint.SHOW_FEDERATOR_SELF_ZONE, data: request, keys: keys() }
}
