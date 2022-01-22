
import * as formatter from '../../model/format'
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { endpoint, perpetual } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData'

let fields = formatter.fields



export const keys = () => ([
    { field: fields.region, label: 'region', serverField: 'region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.federationName, serverField: 'name', label: 'Federation Name', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorName, serverField: 'selfoperatorid', label: 'Self Operator', sortable: true, visible: true, filter: true, key: true },
    { field: fields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true, key: true },
    { field: fields.federationAddr, serverField: 'federationaddr', label: 'Federation Address' },
    { field: fields.partnerOperatorName, serverField: 'operatorid', label: 'Partner Operator', visible: true, filter: true, key: true },
    { field: fields.partnerCountryCode, serverField: 'countrycode', label: 'Partner Country Code', visible: true, filter: true, key: true },
    { field: fields.partnerFederationid, serverField: 'federationid', label: 'Partner Federation ID' },
    { field: fields.apiKey, serverField: 'apikey', label: 'Api Key' },
    { field: fields.federationId, serverField: 'selffederationid', label: 'Federation ID' },
    { field: fields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets', key: true, dataType: perpetual.TYPE_ARRAY },
    { field: fields.zoneId, label: 'Zone id', serverField: 'zoneid', dataType: perpetual.TYPE_ARRAY }
])

// export const iconKeys = () => ([
//     { field: fields.gpu, label: 'GPU', icon: 'gpu_green.svg', clicked: false, count: 0 },
// ])

export const getKey = (data, isCreate) => {
    let federation = {}
    federation.selfoperatorid = data[fields.operatorName]
    federation.name = data[fields.federationName]
    if (isCreate) {
    federation.apikey = data[fields.apiKey]
    federation.countrycode = data[fields.partnerCountryCode]
    federation.federationaddr = data[fields.federationAddr]
    federation.federationid = data[fields.partnerFederationid]
        federation.selffederationid = data[fields.federationId]
    federation.operatorid = data[fields.partnerOperatorName]
    }

    return federation
}

export const showFederation = (self, data, specific) => {
    let requestData = {}
    let organization = data.org ? data.org : redux_org.orgName(self)
    if (organization) {
        if (redux_org.isOperator(self) || data.type === perpetual.OPERATOR) {
            requestData.selfoperatorid = organization
        }
    }
    return { method: endpoint.SHOW_FEDERATION, data: requestData, keys: keys() }
}


export const createFederation = (self, data) => {
    let requestData = getKey(data, true)
    return { method: endpoint.CREATE_FEDERATION, data: requestData, keys: keys() }
}

export const deleteFederation = (self, data) => {
    let requestData = getKey(data)
    return { method: endpoint.DELETE_FEDERATION, data: requestData, success: `Federation ${data[fields.federationName]} deleted successfully` }
}


export const setApiKey = async (self, data) => {
    let requestData = getKey(data)
    let request = { method: endpoint.SET_API_KEY, data: requestData }
    return await authSyncRequest(self, request)
}
export const multiDataRequest = (keys, mcRequestList, specific) => {
    let federationList = [], federatorList = [], zonesList = [];
    for (let i = 0; i < mcRequestList.length; i++) {
        let mcRequest = mcRequestList[i];
        let request = mcRequest.request;
        if (request.method === endpoint.SHOW_FEDERATION) {
            federationList = mcRequest.response.data
        }
        else if (request.method === endpoint.SHOW_FEDERATOR) {
            federatorList = mcRequest.response.data
        }
        else if (request.method === endpoint.SHOW_SELF_ZONES) {
            zonesList = mcRequest.response.data
        }
    }

    if (federatorList && federatorList.length > 0) {
        for (let i = 0; i < federatorList.length; i++) {
            let federator = federatorList[i]
            for (let j = 0; j < federationList.length; j++) {
                let federation = federationList[j]
                if (federator[fields.federationId] === federation.federationId) {
                    federator[fields.region] = federator[fields.region] ? federator[fields.region] : undefined
                    federator[fields.federationId] = federation[fields.federationId]
                    federator[fields.partnerOperatorName] = federation[fields.partnerOperatorName] ? federation[fields.partnerOperatorName] : undefined
                    federator[fields.countryCode] = federator[fields.countryCode] ? federator[fields.countryCode] : undefined
                    federator[fields.partnerCountryCode] = federation[fields.partnerCountryCode] ? federation[fields.partnerCountryCode] : undefined
                    federator[fields.operatorName] = federator[fields.operatorName]
                    federator[fields.mcc] = federator[fields.mcc]
                    federator[fields.mnc] = federator[fields.mnc]
                    federator[fields.federationName] = federation[fields.federationName] ? federation[fields.federationName] : undefined
                }
            }
            let zone = []
            for (let j = 0; j < zonesList.length; j++) {
                let zones = zonesList[j]
                if (federator[fields.federationName] && zones[fields.operatorName] === federator[fields.operatorName]) {
                    zone.push(zones[fields.zoneId])
                    federator[fields.zoneId] = zone
                    federator[fields.cloudlets] = zones[fields.cloudlets]
                    federator[fields.geolocation] = zones[fields.geolocation]
                    federator[fields.state] = zones[fields.state] ? zones[fields.state] : undefined
                    federator[fields.city] = zones[fields.city] ? zones[fields.city] : undefined
                }
            }
        }
    }
    return federatorList;
}
