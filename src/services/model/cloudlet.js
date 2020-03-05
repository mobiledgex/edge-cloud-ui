import React from 'react'
import {fields, formatData} from './format'
import {TYPE_JSON} from '../../hoc/constant';
import { Button, Popup, Icon } from 'semantic-ui-react';

const getStateStatus = (id) => {
    switch (id) {
        case 0:
            return "Tracked State Unknown"
        case 1:
            return "Not Present"
        case 2:
            return "Create Requested"
        case 3:
            return "Creating"
        case 4:
            return "Create Error"
        case 5:
            return "Ready"
        case 6:
            return "Update Requested"
        case 7:
            return "Updating"
        case 8:
            return "Update Error"
        case 9:
            return "Delete Requested"
        case 10:
            return "Deleting"
        case 11:
            return "Delete Error"
        case 12:
            return "Delete Prepare"
        case 13:
            return "CRM Init"
        case 14:
            return "Creating"
        default:
            return id
    }
}

const showProgress = (state, isDetailView) => {
    if (isDetailView) {
        return getStateStatus(state)
    }
    else {
        let icon = null;
        let color = 'red';
        switch (state) {
            case 5:
                icon = <Popup content={getStateStatus(state)} trigger={<Icon className="progressIndicator" name='check' color='green' />} />
                break;
            case 3:
            case 7:
            case 14:
                icon = <Popup content='View Progress' trigger={<Icon className={'progressIndicator'} loading size={12} color='green' name='circle notch' />} />
                break;
            case 10:
            case 12:
                icon = <Popup content='View Progress' trigger={<Icon className={'progressIndicator'} loading size={12} color='red' name='circle notch' />} />
                break;
            default:
                icon = <Popup content={getStateStatus(state)} trigger={<Icon className="progressIndicator" name='close' color='red' />} />
        }
        return (
            icon
        )
    }
}

export const getIPSupport = (id) => {
    switch (id) {
        case 1:
            return 'Static'
        case 2:
            return 'Dynamic'
    }
}
export const getCloudletInfoState = (id, isDetailView) => {
    let state = 'Not Present';
    let color = 'red'
    switch (id) {
        case 0:
            state = 'Unknown'
            break;
        case 1:
            state = 'Error'
            break;
        case 2:
            state = 'Online'
            color = 'green'
            break;
        case 3:
            state = 'Offline'
            break;
        case 4:
            state = 'Not Present'
            break;
        case 5:
            state = 'Init'
            break;
        case 6:
            state = 'Upgrade'
            break;
        default:
            state = 'Not Present'
            break;
    }

    return (
        isDetailView ? state :
        <Button basic size='mini' color={color} compact style={{ width: 100 }}>
            <label>{state}</label>
        </Button>
    )
}

const onProgress = (item) => {
}

const onAction = (item) =>{
    
}



export const keys = [
    { field: fields.region, label: 'Region', sortable: true, visible: true },
    { field: fields.cloudletName, serverField: 'key#OS#name', label: 'Cloudlet Name', sortable: true, visible: true  },
    { field: fields.operatorName, serverField: 'key#OS#operator_key#OS#name', label: 'Operator', sortable: true, visible: true },
    { field: fields.cloudletLocation, serverField: 'location', label: 'Cloudlet Location', dataType: TYPE_JSON },
    { field: fields.ipSupport, serverField: 'ip_support', label: 'IP Support', customizedData: getIPSupport },
    { field: fields.numDynamicIPs, serverField: 'num_dynamic_ips', label: 'Number of Dynamic IPs' },
    { field: fields.physicalName, serverField: 'physical_name' , label: '	Physical Name'},
    { field: fields.platformType, serverField: 'platform_type', label: 'Platform Type' },
    { field: fields.state, serverField: 'state', label: 'Progress', visible: true, customizedData: showProgress , onClick:onProgress },
    { field: fields.status, serverField: 'status', label: 'Status', dataType: TYPE_JSON },
    { field: fields.cloudletStatus, label: 'Cloudlet Status', visible:true, customizedData: getCloudletInfoState},
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, onClick:onAction }
]

export const getKey = (data) => {
    return ({
        region: data[fields.region],
        cloudlet: {
            key: {
                operator_key: { name: data[fields.operatorName] },
                name: data[fields.cloudletName]
            }
        }
    })
}



const customData = (value) => {
    value[fields.cloudletStatus] = 4
}

export const getData = (response, body) => {
    return formatData(response, body, keys, customData, true)
}