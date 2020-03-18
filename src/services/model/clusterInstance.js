import * as formatter from './format'
import uuid from 'uuid'
import { SHOW_CLUSTER_INST, STREAM_CLUSTER_INST, CREATE_CLUSTER_INST, DELETE_CLUSTER_INST, SHOW_CLOUDLET, SHOW_ORG_CLOUDLET } from './endPointTypes'
import { TYPE_JSON, IPAccessLabel } from '../../constant';

let fields = formatter.fields;

export const keys = [
    { field: fields.region, label: 'Region', sortable: true, visible: true },
    { field: fields.clusterName, serverField: 'key#OS#cluster_key#OS#name', sortable: true, label: 'Cluster', visible: true },
    { field: fields.organizationName, serverField: 'key#OS#organization', sortable: true, label: 'Organization', visible: true },
    { field: fields.operatorName, serverField: 'key#OS#cloudlet_key#OS#organization', sortable: true, label: 'Operator', visible: true },
    { field: fields.cloudletName, serverField: 'key#OS#cloudlet_key#OS#name', sortable: true, label: 'Cloudlet', visible: true },
    { field: fields.flavorName, serverField: 'flavor#OS#name', sortable: true, label: 'Flavor', visible: true },
    { field: fields.ipAccess, serverField: 'ip_access', label: 'IP Access', sortable: true, visible: true },
    { field: fields.cloudletLocation, label: 'Cloudlet Location', dataType: TYPE_JSON },
    { field: fields.nodeFlavor, serverField: 'node_flavor', label: 'Node Flavor' },
    { field: fields.numberOfMasters, serverField: 'num_masters', label: 'Number of Masters' },
    { field: fields.numberOfNodes, serverField: 'num_nodes', label: 'Node of Nodes' },
    { field: fields.deployment, serverField: 'deployment', sortable: true, label: 'Deployment', visible: true },
    { field: fields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true },
    { field: fields.status, serverField: 'status', label: 'Status', dataType: TYPE_JSON },
    { field: fields.reservable, serverField: 'reservable' },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const formKeys = [
        { label: 'Cluster Instance', formType: 'Header', visible: true },
        { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true },
        { field: fields.clusterName, label: 'Cluster Name', formType: 'Input', placeholder: 'Enter Cluster Inst Name', rules: { required: true }, visible: true, },
        { field: fields.organizationName, label: 'Organization', formType: 'Select', placeholder: 'Select Organization', rules: { required: true }, visible: true },
        { field: fields.operatorName, label: 'Operator', formType: 'Select', placeholder: 'Select Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }] },
        { field: fields.cloudletName, label: 'Cloudlet', formType: 'MultiSelect', placeholder: 'Select Cloudlet', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }, { index: 4, field: fields.operatorName }] },
        { field: fields.deployment, label: 'Deployment Type', formType: 'Select', placeholder: 'Select Deployment Type', rules: { required: true }, visible: true, update: true },
        { field: fields.ipAccess, label: 'IP Access', formType: 'Select', placeholder: 'Select IP Access', visible: true, update: true },
        { field: fields.privacyPolicyName, label: 'Privacy Policy', formType: 'Select', placeholder: 'Select Privacy Policy Name', visible: false, update: true, dependentData: [{ index: 1, field: fields.region }] },
        { field: fields.flavorName, label: 'Flavor', formType: 'Select', placeholder: 'Select Flavor', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }] },
        { field: fields.numberOfMasters, label: 'Number of Masters', formType: 'Input', placeholder: 'Enter Number of Masters', rules: { type: 'number', disabled: true }, visible: false, value: 1, update: true },
        { field: fields.numberOfNodes, label: 'Number of Nodes', formType: 'Input', placeholder: 'Enter Number of Nodes', rules: { type: 'number' }, visible: false, update: true },
        { field: fields.reservable, label: 'Reservable', formType: 'Checkbox', visible: true, roles: ['AdminManager'], value: false, update: true },
        { field: fields.reservedBy, label: 'Reserved By', formType: 'Input', placeholder: 'Enter Reserved By', visible: true, roles: ['AdminManager'], update: true },
    ]

export const multiDataRequest = (keys, mcRequestList) => {
    let cloudletDataList = [];
    let clusterDataList = [];
    for (let i = 0; i < mcRequestList.length; i++) {
        let mcRequest = mcRequestList[i];
        if (mcRequest.response) {
            let request = mcRequest.request;
            if (request.method === SHOW_CLOUDLET || request.method === SHOW_ORG_CLOUDLET) {
                cloudletDataList = mcRequest.response.data;
            }
            if (mcRequest.request.method === SHOW_CLUSTER_INST) {
                clusterDataList = mcRequest.response.data;
            }
        }
    }

    if (clusterDataList && clusterDataList.length > 0) {
        for (let i = 0; i < clusterDataList.length; i++) {
            let found = false
            let clusterData = clusterDataList[i]
            for (let j = 0; j < cloudletDataList.length; j++) {
                let cloudletData = cloudletDataList[j]
                if (clusterData[fields.cloudletName] === cloudletData[fields.cloudletName]) {
                    found = true;
                    clusterData[fields.cloudletLocation] = cloudletData[fields.cloudletLocation];
                    break;
                }
            }
            if (!found) {
                //Remove cluster if cloudlet not found
                clusterDataList.splice(i, 1)
            }
        }
    }
    return clusterDataList;
}

export const showClusterInsts = (data) => {
    if (!formatter.isAdmin()) {
        {
            data.clusterinst = {
                key: {
                    developer: formatter.getOrganization()
                }
            }
        }
    }
    return { method: SHOW_CLUSTER_INST, data: data }
}

export const clusterKey = (data, isCreate) => {
    let clusterinst = {}
    clusterinst.key = {
        cluster_key: { name: data[fields.clusterName] },
        cloudlet_key: { organization: data[fields.operatorName], name: data[fields.cloudletName] },
        organization: data[fields.organizationName]
    }
    clusterinst.flavor = { name: data[fields.flavorName] }
    if (isCreate) {
        clusterinst.deployment = data[fields.deployment]
        if (data[fields.ipAccess]) {
            clusterinst.ip_access = parseInt(IPAccessLabel(data[fields.ipAccess]))
        }
        clusterinst.reservable = data[fields.reservable]
        if (data[fields.reservedBy]) {
            clusterinst.reserved_by = data[fields.reservedBy]
        }
        if (data[fields.numberOfMasters]) {
            clusterinst.num_masters = parseInt(data[fields.numberOfMasters])
        }
        if (data[fields.num_nodes]) {
            clusterinst.num_nodes = parseInt(data[fields.num_nodes])
        }
    }
    return ({
        region: data[fields.region],
        clusterinst: clusterinst
    })
}

export const createClusterInst = (data) => {
    let requestData = clusterKey(data, true)
    return { uuid: data.uuid ? data.uuid : uuid(), method: CREATE_CLUSTER_INST, data: requestData }
}

export const deleteClusterInst = (data) => {
    let requestData = clusterKey(data)
    return { uuid: data.uuid, method: DELETE_CLUSTER_INST, data: requestData, success: `Cluster Instance ${data[fields.appName]}` }
}

export const streamClusterInst = (data) => {
    let requestData = clusterKey(data)
    return { uuid: data.uuid, method: STREAM_CLUSTER_INST, data: requestData }
}


const customData = (value) => {
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData, true)
}