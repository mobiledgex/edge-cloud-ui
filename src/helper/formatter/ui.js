import React, { useEffect } from 'react'
import { useSelector } from "react-redux";
import { Icon, Popup } from 'semantic-ui-react';
import { fields } from '../../services/model/format';
import { IconButton, Tooltip, CircularProgress, makeStyles } from '@material-ui/core';
import { labelFormatter } from '.';
import { redux_org } from '../reduxData';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import { perpetual } from '../constant';
import { toFirstUpperCase } from '../../utils/string_utils';

const COLOR_ERROR = '198, 40, 40'
const COLOR_SUCCESS = '56, 142, 60'
const COLOR_WARNING = '255, 160, 0'
const COLOR_INFO = '24, 118, 210'

const useStyles = makeStyles((theme) => ({
    text_icon: {
        cursor: props => `${props.clickable ? 'pointer' : 'default'}`,
        backgroundColor: props => `rgba(${props.color}, ${props.inverse ? 0.7 : 0.1})`,
        borderRadius: 5,
        width: 80,
        color: props => props.inverse ? '#FFF' : `rgb(${props.color})`,
        textAlign: 'center',
        padding: '3px 0 3px 0px',
        '&:hover': {
            backgroundColor: props => props.clickable ? `rgba(${props.color})` : 'default',
            color: props => props.clickable ? '#FFF' : 'default'
        }
    }
}));

const TextIcon = (props) => {
    const { color, value, onClick, clickable, inverse } = props
    const click = clickable || onClick
    const classes = useStyles({ clickable: click, color, inverse })
    return (
        <div className={classes.text_icon} onClick={onClick} align='center'>
            <strong>{value}</strong>
        </div>
    )
}

export const trusted = (key, data, isDetail) => {
    return labelFormatter.showYesNo(data[key.field])
}

export const Manage = (props) => {
    const orgInfo = useSelector(state => state.organizationInfo.data)
    const { data } = props
    let active = redux_org.orgName(orgInfo) === data[fields.organizationName]
    return (
        <TextIcon value={active ? 'ACTIVE' : 'MANAGE'} color={COLOR_SUCCESS} clickable={!active} inverse={active}/>
    )
}

export const edgeboxOnly = (key, data, isDetail) => {
    let edgeboxOnly = data[key.field]
    let isOperator = data[fields.type].includes(perpetual.OPERATOR)
    if (isDetail) {
        return labelFormatter.showYesNo(edgeboxOnly)
    }
    else {
        return <Icon name={edgeboxOnly ? 'check' : 'close'} style={{ color: isOperator ? edgeboxOnly ? perpetual.COLOR_SUCCESS : perpetual.COLOR_ERROR : '#9E9E9E' }} />
    }
}

export const cloudletInfoState = (key, data, isDetail) => {
    let id = data[key.field]
    let state = 'Not Present';
    let color = COLOR_ERROR
    switch (id) {
        case 0:
            state = perpetual.UNKNOWN
            break;
        case 1:
            state = 'Error'
            break;
        case 2:
            state = perpetual.ONLINE
            color = COLOR_SUCCESS
            break;
        case 3:
            state = perpetual.OFFLINE
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
            state = perpetual.MAINTENANCE_STATE_UNDER_MAINTENANCE
            color = COLOR_WARNING
            break;
        default:
            state = 'Not Present'
            break;
    }

    return (
        isDetail ? state : <TextIcon value={state} color={color} />
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
            <TextIcon color={id ? COLOR_SUCCESS : COLOR_WARNING} value={id ? 'VERIFIED' : 'VERIFY'} onClick={callback} />
            // <Button basic size='mini' compact disabled={id} color={id ? 'green' : 'yellow'} className='row-button' onClick={callback}>{id ? 'VERIFIED' : 'VERIFY'}</Button>
        )
    }
}

export const lock = (key, data, isDetail, callback) => {
    const [locked, setLocked] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    let id = data[key.field]
    useEffect(() => {
        setLocked(id)
    }, [id]);

    const onAction = async (data) => {
        setLoading(true)
        setLocked(await callback(data))
        setLoading(false)
    }

    if (isDetail) {
        return labelFormatter.showYesNo(id)
    }
    else {
        return (
            loading ? <div align='left' style={{ marginLeft: 13 }}><CircularProgress size={17} /></div> : <IconButton onClick={() => onAction(data)} >{locked === true ? <LockOutlinedIcon style={{ color: 'rgba(136,221,0,.9)' }} /> : <LockOpenOutlinedIcon style={{ color: '#6a6a6a' }} />}</IconButton>
        )
    }
}


export const reporterStatus = (key, data, isDetail) => {
    let success = data[key.field] === 'success'
    if (isDetail) {
        return toFirstUpperCase(data[key.field])
    }
    else {
        return <Icon name={success ? 'check' : 'close'} style={{ color: success ? perpetual.COLOR_SUCCESS : perpetual.COLOR_ERROR }} />
    }
}

export const renderYesNo = (key, data, isDetail) => {
    if (isDetail) {
        return data ? perpetual.YES : perpetual.NO
    }
}

export const NoData = () => {
    return (
        <div align='center' style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}>
            <img src={`assets/icons/inbox_empty.svg`} />
            <h4 style={{ color: 'grey' }}><b>No Data</b></h4>
        </div>
    )
}

export const RenderSeverity = (data, isDetailView) => {
    let id = data[fields.severity]
    let color = COLOR_ERROR
    let label = 'Error'
    let icon = 'cancel'
    switch (id) {
        case perpetual.INFO:
            label = 'Info'
            color = COLOR_INFO
            icon = 'info'
            break;
        case perpetual.ERROR:
            label = 'Error'
            color = COLOR_ERROR
            icon = 'cancel'
            break;
        case perpetual.WARNING:
            label = 'Warning'
            color = COLOR_WARNING
            icon = 'report_problem'
            break;
    }

    return (
        isDetailView ? label : <TextIcon color={color} value={label} />
    )
}

