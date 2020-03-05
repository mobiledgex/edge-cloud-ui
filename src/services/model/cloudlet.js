import React from 'react'
import {fields, formatData} from './format'
import {TYPE_JSON} from '../../hoc/constant';
import { Button, Popup, Icon } from 'semantic-ui-react';
import * as constant from './shared';


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

export const keys = [
    { field: fields.region, label: 'Region', sortable: true, visible: true },
    { field: fields.cloudletName, serverField: 'key#OS#name', label: 'Cloudlet Name', sortable: true, visible: true  },
    { field: fields.operatorName, serverField: 'key#OS#operator_key#OS#name', label: 'Operator', sortable: true, visible: true },
    { field: fields.cloudletLocation, serverField: 'location', label: 'Cloudlet Location', dataType: TYPE_JSON },
    { field: fields.ipSupport, serverField: 'ip_support', label: 'IP Support', customizedData: constant.getIPSupport },
    { field: fields.numDynamicIPs, serverField: 'num_dynamic_ips', label: 'Number of Dynamic IPs' },
    { field: fields.physicalName, serverField: 'physical_name' , label: '	Physical Name'},
    { field: fields.platformType, serverField: 'platform_type', label: 'Platform Type' },
    { field: fields.state, serverField: 'state', label: 'Progress', visible: true, customizedData: constant.showProgress , clickable:true },
    { field: fields.status, serverField: 'status', label: 'Status', dataType: TYPE_JSON },
    { field: fields.cloudletStatus, label: 'Cloudlet Status', visible:true, customizedData: getCloudletInfoState},
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable:true  }
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