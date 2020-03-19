import * as formatter from './format'
import * as serverData from './serverData'
import { TYPE_JSON } from '../../constant';
import { SHOW_CLOUDLET, SHOW_ORG_CLOUDLET, STREAM_CLOUDLET, DELETE_CLOUDLET, SHOW_CLOUDLET_INFO} from './endPointTypes'

const fields = formatter.fields;

export const getKey = (data) => {
    return ({
        region: data[fields.region],
        cloudlet: {
            key: {
                organization: data[fields.operatorName],
                name: data[fields.cloudletName]
            }
        }
    })
}

export const multiDataRequest = (keys, mcRequestList) => {
    let cloudletList = [];
    let cloudletInfoList = [];
    for (let i = 0; i < mcRequestList.length; i++) {
        let mcRequest = mcRequestList[i];
        let request = mcRequest.request;
        if (request.method === SHOW_CLOUDLET || request.method === SHOW_ORG_CLOUDLET) {
            for (let i = 0; i < keys.length > 0; i++) {
                let key = keys[i];
                if (key.field === fields.cloudletStatus) {
                    key.visible = request.method === SHOW_ORG_CLOUDLET ? false : true;
                    break;
                }
            }
            cloudletList = mcRequest.response.data
        }
        else if (request.method === SHOW_CLOUDLET_INFO) {
            cloudletInfoList = mcRequest.response.data
        }
    }
   
    if (cloudletList && cloudletList.length > 0) {
        for (let i = 0; i < cloudletList.length; i++) {
            let cloudlet = cloudletList[i]
            for (let j = 0; j < cloudletInfoList.length; j++) {
                let cloudletInfo = cloudletInfoList[j]
                if (cloudlet[fields.cloudletName] === cloudletInfo[fields.cloudletName]) {
                    cloudlet[fields.cloudletStatus] = cloudletInfo[fields.state]
                    break;
                }
            }
        }
    }
    return cloudletList;
}

export const showCloudlets = (data) => {
    let method = SHOW_ORG_CLOUDLET
    if (formatter.isAdmin()) {
        method = SHOW_CLOUDLET;
    }
    else {
        data.org = formatter.getOrganization()
    }
    return { method: method, data: data }
}

export const getCloudletList = async (self, data) => {
   return await serverData.showDataFromServer(self, showCloudlets(data))
}

export const deleteCloudlet = (data) => {
    let requestData = getKey(data)
    return { uuid: data.uuid, method: DELETE_CLOUDLET, data: requestData, success: `Cloudlet ${data[fields.cloudletName]}` }
}

export const streamCloudlet = (data) => {
    let requestData = getKey(data)
    return { uuid: data.uuid, method: STREAM_CLOUDLET, data: requestData }
}



export const keys = [
    { field: fields.region, label: 'Region', sortable: true, visible: true },
    { field: fields.cloudletName, serverField: 'key#OS#name', label: 'Cloudlet Name', sortable: true, visible: true },
    { field: fields.operatorName, serverField: 'key#OS#organization', label: 'Operator', sortable: true, visible: true },
    { field: fields.cloudletLocation, serverField: 'location', label: 'Cloudlet Location', dataType: TYPE_JSON },
    { field: fields.ipSupport, serverField: 'ip_support', label: 'IP Support' },
    { field: fields.numDynamicIPs, serverField: 'num_dynamic_ips', label: 'Number of Dynamic IPs' },
    { field: fields.physicalName, serverField: 'physical_name', label: '	Physical Name' },
    { field: fields.platformType, serverField: 'platform_type', label: 'Platform Type' },
    { field: fields.cloudletStatus, label: 'Cloudlet Status', visible: true },
    { field: fields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true },
    { field: fields.status, serverField: 'status', label: 'Status', dataType: TYPE_JSON },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const formKeys = () => {
    return [
        { label: 'Cloudlet', formType: 'Header', visible: true },
        { field: fields.region, label: 'Region', formType: 'Select', placeholder: 'Select Region', rules: { required: true }, visible: true },
        { field: fields.cloudletName, label: 'cloudlet Name', formType: 'Input', placeholder: 'Enter cloudlet Name', rules: { required: true }, visible: true, },
        { field: fields.operatorName, label: 'Operator', formType: 'Select', placeholder: 'Select Operator', rules: { required: true }, visible: true, dependentData: [{ index: 1, field: fields.region }] },
    ]
}



const customData = (value) => {
    value[fields.cloudletStatus] = 4
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData, true)
}