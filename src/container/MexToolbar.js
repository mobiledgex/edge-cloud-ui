import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { IconButton, Toolbar } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

export const REGION_ALL = 1;
export const ACTION_REGION = 1
export const ACTION_REFRESH = 2
export const ACTION_NEW = 3
export const ACTION_CLOSE = 4

const regions = [{ key: 'ALL', value: REGION_ALL, text: 'ALL' },
{ key: 'US', value: 'US', text: 'US' },
{ key: 'EU', value: 'EU', text: 'EU' }]

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
            <div style={{ display: 'inline', margin: 20 }}>
                <strong>Region:&nbsp;&nbsp;</strong>
                <Dropdown
                    options={regions}
                    defaultValue={regions[0].value}
                    onChange={(e, { value }) => { props.onAction(ACTION_REGION, value) }}
                />
            </div>
            <IconButton aria-label="new" onClick={(e) => { props.onAction(ACTION_NEW) }}>
                <AddIcon style={{ color: '#76ff03' }} />
            </IconButton>
            <IconButton aria-label="refresh" onClick={(e) => { props.onAction(ACTION_REFRESH) }}>
                <RefreshIcon style={{ color: '#76ff03' }} />
            </IconButton>
        </div>
    )
const MexToolbar = (props) => {
    return (
        <Toolbar>
            <label className='content_title_label'>{props.label}</label>
            {props.isDetail ? getDetail(props) : getList(props)}
        </Toolbar>
    )
}

export default MexToolbar