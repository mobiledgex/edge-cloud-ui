import * as formatter from './format'
import * as constant from '../../constant'
import { FORMAT_FULL_DATE_TIME } from '../../utils/date_util';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import { labelFormatter } from '../../helper/formatter';
import { redux_org } from '../../helper/reduxData'
import { endpoint } from '../../helper/constant';

const fields = formatter.fields;

export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.poolName, serverField: 'key#OS#name', label: 'Pool Name', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorName, serverField: 'key#OS#organization', label: 'Operator', sortable: true, visible: true, key: true },
    { field: fields.cloudletCount, label: 'Number of  Cloudlets', sortable: true, visible: true },
    { field: fields.organizationCount, label: 'Number of Organizations', sortable: true, visible: true },
    {
        field: fields.cloudlets, label: 'Cloudlets', serverField: 'cloudlets', dataType: constant.TYPE_STRING
    },
    {
        field: fields.organizations, label: 'Organizations',
        keys: [{ field: fields.organizationName, label: 'Organization' }, { field: fields.status, label: 'Status' }]
    },
    { field: fields.createdAt, serverField: 'created_at', label: 'Created', dataType: constant.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
    { field: fields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: constant.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
])

export const getKey = (data) => {
    let cloudletpool = {}

    cloudletpool.key = { name: data[fields.poolName], organization: data[fields.operatorName] }
    cloudletpool.cloudlets = data[fields.cloudlets]

    if (data[fields.fields]) {
        cloudletpool.fields = data[fields.fields]
    }
    return ({
        region: data[fields.region],
        cloudletpool: cloudletpool
    })
}

const formatInvitation = (poolList, invitationList) => {
    for (let i = 0; i < poolList.length; i++) {
        let pool = poolList[i]
        let organizations = []
        for (let j = 0; j < invitationList.length; j++) {
            let invitation = invitationList[j]
            if (pool[fields.poolName] === invitation[fields.poolName]) {
                pool[fields.organizationCount] += 1
                let organization = {}
                organization[fields.organizationName] = invitation[fields.developerOrg]
                organization[fields.status] = labelFormatter.decision(invitation[fields.decision])
                organizations.push(organization)
            }
        }
        pool[fields.organizations] = organizations
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
            for(let grant of grantList){
                if (isEqual(omit(invitation, [fields.uuid, fields.decision]), omit(grant, [fields.uuid, fields.decision]))) {
                    invitation[fields.decision] = grant[fields.decision] ? grant[fields.decision] : invitation[fields.decision]
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
    return { method: endpoint.DELETE_CLOUDLET_POOL, data: requestData, success: `Cloudlet Pool ${data[fields.poolName]} deleted successfully` }
}

const customData = (value) => {
    value[fields.cloudletCount] = value[fields.cloudlets] ? value[fields.cloudlets].length : 0
    value[fields.createdAt] = value[fields.createdAt] ? value[fields.createdAt][fields.seconds] : undefined
    value[fields.updatedAt] = value[fields.updatedAt] ? value[fields.updatedAt][fields.seconds] : undefined
    value[fields.organizationCount] = 0
    return value
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys(), customData, true)
}