
import * as formatter from '../../model/format'
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { endpoint, perpetual } from '../../../helper/constant'
import { primaryKeys as cloudletKeys } from '../cloudlet/primary';
import { redux_org } from '../../../helper/reduxData'

let fields = formatter.fields

export const keys = () => ([
    { field: fields.region, label: 'region', serverField: 'region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.federationName, serverField: 'name', label: 'name', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorName, serverField: 'selfoperatorid', label: 'Self Operator', sortable: true, visible: true, filter: true, key: true },
    { field: fields.federationAddr, serverField: 'federationaddr', label: 'Federation Address' },
    { field: fields.partnerCountryCode, serverField: 'countrycode', label: 'Partner Country Code', visible: true, filter: true, key: true },
    { field: fields.partnerOperatorName, serverField: 'operatorid', label: 'Partner Operator', visible: true, filter: true, key: true },
    { field: fields.partnerFederationid, serverField: 'federationid', label: 'Partner Federation ID' },
    { field: fields.apiKey, serverField: 'apikey', label: 'Api Key' },
    { field: fields.federationId, serverField: 'selffederationid', label: 'Federation ID' },
    { field: fields.partnerRoleAccessToSelfZones, serverField: 'PartnerRoleAccessToSelfZones', label: 'PartnerRoleAccessToSelfZones' },
    { field: fields.partnerRoleShareZonesWithSelf, serverField: 'PartnerRoleShareZonesWithSelf', label: 'PartnerRoleShareZonesWithSelf' },
])


export const iconKeys = () => ([
    { field: fields.gpu, label: 'GPU', icon: 'gpu_green.svg', clicked: false, count: 0 },
])

export const getKey = (data, federatorData, federationID) => {
    console.log(data, federatorData)
    let federation = {}
    federation.apikey = data[fields.apiKey]
    federation.countrycode = data[fields.partnerCountryCode]
    federation.federationaddr = data[fields.federationAddr]
    federation.federationid = data[fields.partnerFederationid]
    federation.selffederationid = federationID
    federation.selfoperatorid = federatorData[fields.operatorName]
    federation.name = data[fields.federationName]
    federation.operatorid = data[fields.partnerOperatorName]
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
    const request = {
        "operatorid": "TDG"
    }
    return { method: endpoint.SHOW_FEDERATION_PARTNER_ZONE, data: request, keys: keys() }
}

export const createFederation = (self, data, federatorData, federationID) => {
    let requestData = getKey(data, federatorData, federationID)
    return { method: endpoint.CREATE_FEDERATION, data: requestData, keys: keys() }
}

export const multiDataRequest = (keys, mcRequestList, specific) => {
    let federationList = [], federatorList = [], federationPartnerZone = [], federatorSelfZone = [];
    let exactFederator;
    for (let i = 0; i < mcRequestList.length; i++) {
        let mcRequest = mcRequestList[i];
        let request = mcRequest.request;
        if (request.method === endpoint.SHOW_FEDERATION) {
            console.log(federationList, "federationList")
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
    let federationId = federationList.map(function (item) { return item["selffederationid"]; });
    federationId.map((item) => {
        exactFederator = federatorList.find((each) => each.federationid === item)
    })
    let federationFedaratorList = []
    for (let i = 0; i < federatorList.length; i++) {
        let obj = {}
        for (let j = 0; j < federationList.length; j++) {
            if (federatorList[i].federationId === federationList[j].federationId) {
                obj['federationId'] = federationList[j].federationId
                obj['region'] = federatorList[j].region ? federatorList[j].region : undefined
                obj['federationName'] = federationList[j].federationName ? federationList[j].federationName : undefined
                obj['countryCode'] = federatorList[i].countrycode ? federatorList[i].countrycode : undefined
                obj['partnerOperator'] = federationList[j].partnerOperator ? federationList[j].partnerOperator : undefined
                obj['partnerCountryCode'] = federationList[j].partnerCountryCode ? federationList[j].partnerCountryCode : undefined
                obj['operatorName'] = federatorList[i].operatorName
                federationFedaratorList.push(obj)
            }
        }
    }
    const map = new Map();
    federatorList.forEach(item => map.set(item.federationId, item));
    federationList.forEach(item => map.set(item.federationId, { ...map.get(item.federationId), ...item }));
    const mergedArr = Array.from(map.values());
    console.log(mergedArr, "mergedArr")
    return mergedArr
}
