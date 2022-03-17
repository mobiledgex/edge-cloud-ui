import * as formatter from '../../fields'
import { FORMAT_FULL_DATE_TIME } from '../../../utils/date_util';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import { labelFormatter } from '../../../helper/formatter';
import { redux_org } from '../../../helper/reduxData'
import { endpoint, perpetual } from '../../../helper/constant';

const fields = formatter.fields;

const clouldetKeys = [
    { field: localFields.cloudletName, serverField: 'name', label: 'Cloudlet Name' },
    { field: localFields.partnerOperator, serverField: 'federated_organization', label: 'Partner Operator' },
]

export const keys = () => ([
    { field: localFields.region, label: 'Region', sortable: true, visible: true, filter: true, key: true },
    { field: localFields.poolName, serverField: 'key#OS#name', label: 'Pool Name', sortable: true, visible: true, filter: true, key: true },
    { field: localFields.operatorName, serverField: 'key#OS#organization', label: 'Operator', sortable: true, visible: true, key: true },
    { field: localFields.cloudletCount, label: 'Number of  Cloudlets', sortable: true, visible: true },
    { field: localFields.organizationCount, label: 'Number of Organizations', sortable: true, visible: true },
    {
        field: localFields.cloudlets, label: 'Cloudlets', serverField: 'cloudlets', keys: clouldetKeys
    },
    {
        field: localFields.organizations, label: 'Organizations',
        keys: [{ field: localFields.organizationName, label: 'Organization' }, { field: localFields.status, label: 'Status' }]
    },
    { field: localFields.createdAt, serverField: 'created_at', label: 'Created', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } },
    { field: localFields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } }
])

export const getCloudletPoolKey = (data) => {
    return { name: data[localFields.poolName], organization: data[localFields.operatorName] }
}

export const getKey = (data) => {
    let cloudletpool = {}

    cloudletpool.key = getCloudletPoolKey(data)
    cloudletpool.cloudlets = data[localFields.cloudlets]

    if (data[localFields.fields]) {
        cloudletpool.fields = data[localFields.fields]
    }
    return ({
        region: data[localFields.region],
        cloudletpool: cloudletpool
    })
}

const formatInvitation = (poolList, invitationList) => {
    for (let i = 0; i < poolList.length; i++) {
        let pool = poolList[i]
        let organizations = []
        for (let j = 0; j < invitationList.length; j++) {
            let invitation = invitationList[j]
            if (pool[localFields.poolName] === invitation[localFields.poolName]) {
                pool[localFields.organizationCount] += 1
                let organization = {}
                organization[localFields.organizationName] = invitation[localFields.organizationName]
                organization[localFields.status] = labelFormatter.decision(invitation[localFields.decision])
                organizations.push(organization)
            }
        }
        pool[localFields.organizations] = organizations
    }
}

export const multiDataRequest = (keys, mcList) => {
    let poolList = []
    let invitationList = []
    let grantList = []
    for (let i = 0; i < mcList.length; i++) {
        let mc = mcList[i];
        let request = mc.request;
        if (request.method === endpoint.SHOW_CLOUDLET_POOL) {
            poolList = mc.response.data
        }
        else if (request.method === endpoint.SHOW_POOL_ACCESS_INVITATION) {
            invitationList = mc.response.data
        }
        else if (request.method === endpoint.SHOW_POOL_ACCESS_CONFIRMATION) {
            grantList = mc.response.data
        }
    }

    if (invitationList.length > 0) {
        invitationList.forEach(invitation => {
            for (let grant of grantList) {
                if (isEqual(omit(invitation, [localFields.uuid, localFields.decision]), omit(grant, [localFields.uuid, localFields.decision]))) {
                    invitation[localFields.decision] = grant[localFields.decision] ? grant[localFields.decision] : invitation[localFields.decision]
                    break;
                }
            }
        })
    }

    if (poolList && poolList.length > 0) {
        formatInvitation(poolList, invitationList)
    }
    return poolList;
}

export const showCloudletPools = (self, data) => {
    let organization = redux_org.nonAdminOrg(self)
    if (organization && redux_org.isOperator(self)) {
        data.cloudletpool = { key: { organization } }
    }
    return { method: endpoint.SHOW_CLOUDLET_POOL, data: data, keys: keys() }
}

export const createCloudletPool = (data) => {
    let requestData = getKey(data)
    return { method: endpoint.CREATE_CLOUDLET_POOL, data: requestData }
}

export const updateCloudletPool = (data) => {
    let requestData = getKey(data)
    return { method: endpoint.UPDATE_CLOUDLET_POOL, data: requestData }
}

export const deleteCloudletPool = (self, data) => {
    let requestData = getKey(data)
    return { method: endpoint.DELETE_CLOUDLET_POOL, data: requestData, success: `Cloudlet Pool ${data[localFields.poolName]} deleted successfully` }
}