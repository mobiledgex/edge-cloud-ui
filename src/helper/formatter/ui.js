import React from 'react'
import { useSelector } from "react-redux";
import * as constant from '../../constant'
import { Icon, Popup } from 'semantic-ui-react';
import { fields } from '../../services/model/format';
import { IconButton, Tooltip } from '@material-ui/core';
import { Button } from 'semantic-ui-react';
import { labelFormatter } from '.';
import { redux_org } from '../reduxData';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';

export const trusted = (key, data, isDetail) => {
    return labelFormatter.showYesNo(data[key.field])
}

export const Manage = (props) => {
    const orgInfo = useSelector(state => state.organizationInfo.data)
    const { data } = props
    const orgName = data[fields.organizationName]
    let active = redux_org.orgName(orgInfo) === data[fields.organizationName]
    return (
        <Button basic size='mini' compact color={orgInfo && orgInfo[fields.organizationName] === orgName ? 'green' : 'grey'} className='row-button'>{active ? 'ACTIVE' : 'MANAGE'}</Button>
    )
}

export const edgeboxOnly = (key, data, isDetail) => {
    let edgeboxOnly = data[key.field]
    let isOperator = data[fields.type].includes(constant.OPERATOR.toLowerCase())
    if (isDetail) {
        return labelFormatter.showYesNo(edgeboxOnly)
    }
    else {
        return <Icon name={edgeboxOnly ? 'check' : 'close'} style={{ color: isOperator ? edgeboxOnly ? constant.COLOR_GREEN : constant.COLOR_RED : '#9E9E9E' }} />
    }
}

export const cloudletInfoState = (key, data, isDetail) => {
    let id = data[key.field]
    let state = 'Not Present';
    let color = 'red'
    switch (id) {
        case 0:
            state = constant.UNKNOWN
            break;
        case 1:
            state = 'Error'
            break;
        case 2:
            state = constant.ONLINE
            color = 'green'
            break;
        case 3:
            state = constant.OFFLINE
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
        case 999:
            state = constant.MAINTENANCE_STATE_UNDER_MAINTENANCE
            color = 'yellow'
            break;
        default:
            state = 'Not Present'
            break;
    }

    return (
        isDetail ? state :
            <Button disabled={true} basic size='mini' color={color} compact style={{ width: 90 }}>
                <label>{state}</label>
            </Button>
    )
}

export const healthCheck = (key, data, isDetail) => {
    let id = data[key.field]
    let label = labelFormatter.healthCheck(id)
    if (isDetail) {
        return label
    }
    else {
        switch (id) {
            case 3:
                return <Popup content={label} trigger={<Icon className="progressIndicator" name='check' color='green' />} />
            default:
                return <Popup content={label} trigger={<Icon className="progressIndicator" name='close' color='red' />} />
        }
    }
}

export const appInstRegion = (key, data, isDetail) => {
    let value = data[key.field]
    return (
        isDetail ? value :
            data[fields.updateAvailable] ?
                <Tooltip title={<div><strong style={{ fontSize: 13 }}>{`Current Version: ${data[fields.revision]}`}</strong><br /><br /><strong style={{ fontSize: 13 }}>{`Available Version: ${data[fields.appRevision]}`}</strong></div>}>
                    <label>
                        <Icon color={'orange'} name={'arrow alternate circle up outline'} />&nbsp;{value}
                    </label>
                </Tooltip> :
                <label>{value}</label>
    )
}

export const emailVerfied = (key, data, isDetail, callback) => {
    let id = data[key.field]
    if (isDetail) {
        return labelFormatter.showYesNo(id)
    }
    else {
        return (
            <Button basic size='mini' compact disabled={id} color={id ? 'green' : 'yellow'} className='row-button' onClick={callback}>{id ? 'VERIFIED' : 'VERIFY'}</Button>
        )
    }
}

export const lock = (key, data, isDetail, callback) => {
    let id = data[key.field]
    if (isDetail) {
        return labelFormatter.showYesNo(id)
    }
    else {
        return (
            <IconButton onClick={() => callback(data)} >{id === true ? <LockOutlinedIcon style={{ color: 'rgba(136,221,0,.9)' }} /> : <LockOpenOutlinedIcon style={{ color: '#6a6a6a' }} />}</IconButton>
        )
    }
}


export const reporterStatus = (key, data, isDetail) => {
    let success = data[key.field] === 'success' 
    if (isDetail) {
        return constant.toFirstUpperCase(data[key.field])
    }
    else
    {
        return <Icon name={success ? 'check' : 'close'} style={{ color: success ? constant.COLOR_GREEN : constant.COLOR_RED }} /> 
    }
}

export const NoData = ()=>{
    return (
        <div align='center' style={{position:'relative', top:'50%', transform: 'translateY(-50%)'}}>
            <img src={`assets/icons/inbox_empty.svg`}/>
            <h4 style={{ color:'grey'}}><b>No Data</b></h4>
        </div>
    )
}
