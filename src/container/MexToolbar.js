import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { IconButton, Toolbar, Switch, withStyles } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

export const REGION_ALL = 1;
export const ACTION_REGION = 1
export const ACTION_REFRESH = 2
export const ACTION_NEW = 3
export const ACTION_CLOSE = 4
export const ACTION_MAP = 5


//Todo: move to standard file
const CustomSwitch = withStyles({
    switchBase: {
        color: '#D32F2F',
        '&$checked': {
            color: '#388E3C',
        },
        '&$checked + $track': {
            backgroundColor: '#388E3C',
        },
    },
    checked: {},
    track: {},
})(Switch);

const regions = [{ key: 'ALL', value: REGION_ALL, text: 'ALL' },
{ key: 'US', value: 'US', text: 'US' },
{ key: 'EU', value: 'EU', text: 'EU' }]


const MexToolbar = (props) => {
    let requestInfo = props.requestInfo;
    const getDetail = (props) => (
        <div style={{ right: 0, position: 'absolute' }}>

            <IconButton aria-label="refresh" onClick={(e) => { props.onAction(ACTION_CLOSE) }}>
                <CloseIcon style={{ color: '#76ff03' }} />
            </IconButton>
        </div>
    )
    const getList = (props) =>
        (
            <div style={{ right: 0, position: 'absolute' }}>
                {requestInfo.isRegion ?
                    <div style={{ display: 'inline', margin: 20 }}>
                        <strong>Region:&nbsp;&nbsp;</strong>
                        <Dropdown
                            options={regions}
                            defaultValue={regions[0].value}
                            onChange={(e, { value }) => { props.onAction(ACTION_REGION, value) }}
                        />
                    </div> :
                    null
                }
                {requestInfo.isMap ?
                    <div style={{ display: 'inline', margin: 20 }}>
                        <strong>Map:&nbsp;&nbsp;</strong>
                        <CustomSwitch size="small" color="primary" defaultChecked
                            onChange={(e) => { props.onAction(ACTION_MAP, e.target.checked) }} />
                    </div> :
                    null
                }
                {
                    requestInfo.onAdd ?
                        <IconButton aria-label="new" onClick={(e) => { props.onAction(ACTION_NEW) }}>
                            <AddIcon style={{ color: '#76ff03' }} />
                        </IconButton> : null
                }
                <IconButton aria-label="refresh" onClick={(e) => { props.onAction(ACTION_REFRESH) }}>
                    <RefreshIcon style={{ color: '#76ff03' }} />
                </IconButton>
            </div>
        )
    return (
        <Toolbar>
            <label className='content_title_label'>{requestInfo.headerLabel}</label>
            {props.isDetail ? getDetail(props) : getList(props)}
        </Toolbar>
    )
}

export default MexToolbar