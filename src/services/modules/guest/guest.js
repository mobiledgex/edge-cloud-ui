
import * as formatter from '../../model/format'
import { endpoint, perpetual } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData'

let fields = formatter.fields

export const keys = () => ([
    { field: fields.region, label: 'Region', serverField: 'region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.federationName, serverField: 'name', label: 'Federation Name', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorName, serverField: 'selfoperatorid', label: 'Operator', sortable: true, visible: true, filter: true, key: true },
    { field: fields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, filter: true, key: true },
    { field: fields.federationAddr, serverField: 'federationaddr', label: 'Federation Address' },
    { field: fields.partnerOperatorName, serverField: 'operatorid', label: 'Partner Operator', visible: true, filter: true, key: true },
    { field: fields.partnerCountryCode, serverField: 'countrycode', label: 'Partner Country Code', filter: true, key: true },
    { field: fields.partnerFederationid, serverField: 'federationid', label: 'Partner Federation ID' },
    { field: fields.apiKey, serverField: 'apikey', label: 'API Key' },
    { field: fields.federationId, serverField: 'selffederationid', label: 'Federation ID' },
    { field: fields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets', key: true, dataType: perpetual.TYPE_ARRAY },
    { field: fields.zoneId, label: 'Partner  sharing Zones', serverField: 'zoneid', dataType: perpetual.TYPE_STRING },
    { field: fields.zoneCount, label: 'Zones Received', sortable: true, visible: true, filter: true, key: true },
    { field: fields.federationName, serverField: 'federationname', label: 'Federation Name', detailView: false },
    { field: fields.partnerRoleShareZoneWithSelf, label: 'Partner Share Zone', serverField: 'PartnerRoleShareZonesWithSelf', format: true },
])

export const iconKeys = () => ([
    { field: fields.partnerRoleShareZoneWithSelf, label: 'Registered', icon: 'bookmark_added', clicked: false, count: 0, roles: [perpetual.ADMIN_MANAGER, perpetual.OPERATOR_MANAGER, perpetual.OPERATOR_VIEWER] }
])

export const partnerKey = () => ([
    { field: fields.federationName, serverField: 'federationname', label: 'Federation Name', sortable: true, visible: true, filter: true, key: true },
])

export const getKey = (data, isCreate) => {
    let federation = {}
    federation.selfoperatorid = data[fields.operatorName]
    federation.name = data[fields.federationName]
    if (isCreate) {
        data[fields.apiKey] ? (federation.apikey = data[fields.apiKey]) : null
        data[fields.partnerCountryCode] ? (federation.countrycode = data[fields.partnerCountryCode]) : null
        data[fields.federationAddr] ? (federation.federationaddr = data[fields.federationAddr]) : null
        data[fields.partnerFederationid] ? federation.federationid = data[fields.partnerFederationid] : null
        data[fields.federationId] ? federation.selffederationid = data[fields.federationId] : null
        data[fields.partnerOperatorName] ? federation.operatorid = data[fields.partnerOperatorName] : null
    }

    return federation
}


export const showPartnerFederatorZone = (self, data, specific) => {
    let requestData = {}
    if (specific) {
        requestData['federationname'] = data[fields.federationName]
        requestData['selfoperatorid'] = data[fields.operatorName]
    }
    else {
        let organization = data.org ? data.org : redux_org.nonAdminOrg(self)
        if (organization) {
            if (redux_org.isOperator(self)) {
                requestData.selfoperatorid = organization
            }
        }
    }
    return { method: endpoint.SHOW_FEDERATOR_PARTNER_ZONE, data: requestData, keys: keys(), iconKeys: iconKeys() }
}

export const multiDataRequest = (keys, mcRequestList, specific) => {
    let federationList = [], federatorList = [], zonesList = [], selfZones = [];
    for (let i = 0; i < mcRequestList.length; i++) {
        let mcRequest = mcRequestList[i];
        let request = mcRequest.request;
        if (request.method === endpoint.SHOW_FEDERATION) {
            federationList = mcRequest.response.data
        }
        else if (request.method === endpoint.SHOW_FEDERATOR) {
            federatorList = mcRequest.response.data
        }
        else if (request.method === endpoint.SHOW_FEDERATOR_PARTNER_ZONE) {
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
                    federator[fields.partnerRoleShareZoneWithSelf] = federation[fields.partnerRoleShareZoneWithSelf] ? true : false
                    break
                }
            }
            let zone = []
            for (let j = 0; j < zonesList.length; j++) {
                let zones = zonesList[j]
                if (federator[fields.federationName] === zones[fields.federationName] && federator[fields.operatorName] === zones[fields.operatorName]) {
                    zone.push(zones[fields.zoneId])
                    federator[fields.zoneId] = zone
                    federator[fields.register] = zones[fields.register]
                    federator[fields.zoneCount] = zone.length
                }
            }
        }
    }
    return federatorList;
}
