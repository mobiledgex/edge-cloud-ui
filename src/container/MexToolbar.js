import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { IconButton, Toolbar, Switch, withStyles, TextField, Input, InputAdornment } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

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

const getRegion = (props)=>
{
    let options = []
    if (props.regions) {
        options = props.regions.map(region => {
            return { key: region, value: region, text: region }
        })
        options.splice(0, 0, { key: 'ALL', value: REGION_ALL, text: 'ALL' })
    }
    return options
}

const MexToolbar = (props) => {
    let requestInfo = props.requestInfo;
    const getDetail = (props) => (
        <div style={{ right: 0, position: 'absolute' }}>

            <IconButton aria-label="refresh" onClick={(e) => { props.onAction(ACTION_CLOSE) }}>
                <CloseIcon style={{ color: '#76ff03' }} />
            </IconButton>
        </div>
    )

    const getList = (props) => {
        let regions = getRegion(props)
        return (
            <div style={{ right: 0, position: 'absolute' }}>
                <Input 
                    onChange={(e) => { props.onFilterValue(e) }} 
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    }
                    value = {props.filterText}
                    placeholder={'Search'} 
                />
                {requestInfo.isRegion ?
                    <div style={{ display: 'inline', margin: 20 }}>
                        <strong>Region:&nbsp;&nbsp;</strong>
                        <Dropdown
                            options={regions}
                            defaultValue={regions && regions.length > 0 ? regions[0].value : undefined}
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
                        <IconButton aria-label="new" className='buttonCreate' onClick={(e) => { props.onAction(ACTION_NEW) }}>
                            <AddIcon style={{ color: '#76ff03' }} />
                        </IconButton> : null
                }
                <IconButton aria-label="refresh" onClick={(e) => { props.onAction(ACTION_REFRESH) }}>
                    <RefreshIcon style={{ color: '#76ff03' }} />
                </IconButton>
            </div>
        )}
    return (
        <Toolbar>
            <label className='content_title_label'>{requestInfo.headerLabel}</label>
            {props.isDetail ? getDetail(props) : getList(props)}
        </Toolbar>
    )
}

export default MexToolbar