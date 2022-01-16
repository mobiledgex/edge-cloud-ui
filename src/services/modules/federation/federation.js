
import * as formatter from '../../model/format'
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { endpoint, perpetual } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData'

let fields = formatter.fields



export const keys = () => ([
    { field: fields.region, label: 'region', serverField: 'region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.federationName, serverField: 'name', label: 'name', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorName, serverField: 'selfoperatorid', label: 'Self Operator', sortable: true, visible: true, filter: true, key: true },
    { field: fields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true, key: true },
    { field: fields.partnerRoleShareZonesWithSelf, serverField: 'PartnerRoleShareZonesWithSelf', label: 'Type', visible: true, key: true },
    { field: fields.federationAddr, serverField: 'federationaddr', label: 'Federation Address' },
    { field: fields.partnerOperatorName, serverField: 'operatorid', label: 'Partner Operator', visible: true, filter: true, key: true },
    { field: fields.partnerCountryCode, serverField: 'countrycode', label: 'Partner Country Code', visible: true, filter: true, key: true },
    { field: fields.zoneCount, label: 'zone Count', visible: true, key: true },
    { field: fields.partnerFederationid, serverField: 'federationid', label: 'Partner Federation ID' },
    { field: fields.apiKey, serverField: 'apikey', label: 'Api Key' },
    { field: fields.federationId, serverField: 'selffederationid', label: 'Federation ID' },
    { field: fields.PartnerRoleAccessToSelfZones, serverField: 'PartnerRoleAccessToSelfZones', label: 'PartnerRoleAccessToSelfZones' },
])

// export const iconKeys = () => ([
//     { field: fields.gpu, label: 'GPU', icon: 'gpu_green.svg', clicked: false, count: 0 },
// ])

export const getKey = (data, isCreate) => {
    console.log(data, "data")
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

export const showFederationPartnerZone = (self, data) => {
    let requestData = {}
    let organization = data.org ? data.org : redux_org.orgName(self)
    if (organization) {
        if (redux_org.isOperator(self) || data.type === perpetual.OPERATOR) {
            requestData.selfoperatorid = organization
        }
    }
    return { method: endpoint.SHOW_FEDERATION_PARTNER_ZONE, data: requestData, keys: keys() }
}

export const createFederation = (self, data) => {
    let requestData = getKey(data, true)
    console.log(requestData)
    // return { method: endpoint.CREATE_FEDERATION, data: requestData, keys: keys() }
}

export const deleteFederation = (self, data) => {
    let requestData = getKey(data)
    console.log(requestData)
    // return { method: endpoint.DELETE_FEDERATION, data: requestData, success: `Federation ${data[fields.federationName]} deleted successfully` }
}

export const registerFederation = (self, data) => {
    const requestData = getKey(data)
    console.log(requestData)
    // return { method: endpoint.REGISTER_FEDERATION, data: requestData, success: `Federation registered successfully`}
}

export const deregisterFederation = (self, data) => {
    const requestData = getKey(data)
    console.log(requestData)
    // return { method: endpoint.DEREGISTER_FEDERATION, data: requestData, success: `Federation registered successfully`}
}

export const setApiKey = async (self, data) => {
    let requestData = getKey(data)
    console.log(requestData)
    let request = { method: endpoint.SET_API_KEY, data: requestData }
    return await authSyncRequest(self, request)
}
export const multiDataRequest = (keys, mcRequestList, specific) => {
    let federationList = [], federatorList = [], federationPartnerZone = [], federatorSelfZone = [];
    for (let i = 0; i < mcRequestList.length; i++) {
        let mcRequest = mcRequestList[i];
        let request = mcRequest.request;
        if (request.method === endpoint.SHOW_FEDERATION) {
            federationList = mcRequest.response.data
        }
        else if (request.method === endpoint.SHOW_FEDERATOR) {
            federatorList = mcRequest.response.data
        }
        if (request.method === endpoint.SHOW_FEDERATOR_SELF_ZONE) {
            federatorSelfZone = mcRequest.response.data
        }
        else if (request.method === endpoint.SHOW_FEDERATION_PARTNER_ZONE) {
            federationPartnerZone = mcRequest.response.data
        }
    }
    let federationFedaratorList = []
    for (let i = 0; i < federatorList.length; i++) {
        let obj = {}
        for (let j = 0; j < federationList.length; j++) {
            if (federatorList[i].federationId === federationList[j].federationId) {
                obj['federationId'] = federationList[j].federationId
                obj['region'] = federatorList[i].region ? federatorList[i].region : undefined
                obj['federationName'] = federationList[j].federationName ? federationList[j].federationName : undefined
                obj['countryCode'] = federatorList[i].countryCode ? federatorList[i].countryCode : undefined
                obj['partnerOperator'] = federationList[j].partnerOperator ? federationList[j].partnerOperator : undefined
                obj['partnerCountryCode'] = federationList[j].partnerCountryCode ? federationList[j].partnerCountryCode : undefined
                obj['operatorName'] = federatorList[i].operatorName
                obj['mcc'] = federatorList[i].mcc
                obj['mnc'] = federatorList[i].mnc
                obj['partnerRoleShareZonesWithSelf'] = federationList[j].partnerRoleShareZonesWithSelf ? perpetual.PARTNER_SHARE : federationList[j].partnerroleaccesstoselfzones ? perpetual.SELF_SHARE : null
                federationFedaratorList.push(obj)
            } 
        }
    }
    const filterByReference = (federatorList, federationFedaratorList) => {
        let res = [];
        res = federatorList.filter(el => {
            return !federationFedaratorList.find(element => {
                return element.federationId === el.federationId;
            });
        });
        return res;
    }
    const filterData = filterByReference(federatorList, federationFedaratorList)
    const result = [...federationFedaratorList, ...filterData]
    if (result.length > 0) {
        result.forEach(res => {
            const arr = res.partnerRoleShareZonesWithSelf === perpetual.PARTNER_SHARE ? federationPartnerZone : res.partnerRoleShareZonesWithSelf === perpetual.SELF_SHARE ? federatorSelfZone : []
            let count = 0
            for (let zone of arr) {
                if (res.federationName === zone.federationname && res.operatorName === zone.selfoperatorid) {
                    res[fields.zoneCount] = count + 1
                    break;
                }
            }
        })
    }
    console.log(result, "dsdsd")

    // const map = new Map();
    // federationList.forEach(item => map.set(item.federationId, { ...map.get(item.federationId), ...item }));
    // federatorList.forEach(item => map.set(item.federationId, item));
    // const mergedArr = Array.from(map.values());
    // console.log(mergedArr, "mergedArr")
    // return mergedArr
    return result
}
