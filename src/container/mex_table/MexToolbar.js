import React from 'react'
import { isViewer } from '../../services/model/format';
import { Toolbar, Input, InputAdornment, IconButton, Switch } from '@material-ui/core'
import { Dropdown } from 'semantic-ui-react';
import { withStyles } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';

export const REGION_ALL = 1;
export const ACTION_REGION = 1
export const ACTION_REFRESH = 2
export const ACTION_NEW = 3
export const ACTION_CLOSE = 4
export const ACTION_MAP = 5
export const ACTION_SEARCH = 6;

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

const MexToolbar = (props) => {
    let requestInfo = props.requestInfo

    const [search, setSearch] = React.useState('')
    const [region, setRegion] = React.useState(REGION_ALL)
    const [map, setMap] = React.useState(true)

    /*Search Block*/
    const handleSearch = (e) => {
        setSearch(e ? e.target.value : '')
        props.onAction(ACTION_SEARCH, e ? e.target.value : '')
    }

    const searchForm = () => (
        <Input
            style={{marginRight:20}}
            size="small"
            onChange={handleSearch}
            startAdornment={
                <InputAdornment style={{ fontSize: 17 }} position="start">
                    <SearchIcon />
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position="end">
                    <CloseIcon style={{ fontSize: 17 }} onClick={() => { handleSearch() }} />
                </InputAdornment>
            }
            value={search}
            placeholder={'Search'} />
    )
    /*Search Block*/

    /*Add Block*/
    const addForm = () => (
        requestInfo.onAdd && !isViewer() ?
            <IconButton aria-label="new" style={{marginTop:-3}} className='buttonCreate' onClick={(e) => { props.onAction(ACTION_NEW) }}>
                <AddIcon style={{ color: '#76ff03' }} />
            </IconButton> : null
    )
    /*Add Block*/

    /*Region Block*/

    const getRegions = () => {
        let options = []
        if (props.regions) {
            options = props.regions.map(region => {
                return { key: region, value: region, text: region }
            })
            options.splice(0, 0, { key: 'ALL', value: REGION_ALL, text: 'ALL' })
        }
        return options
    }

    const onRegionChange = (value) => {
        setRegion(value)
        props.onAction(ACTION_REGION, value)
    }

    const regionForm = () => (
        requestInfo.isRegion ?
            <div style={{ display: 'inline', marginLeft: 10, marginRight:10 }}>
                <strong>Region:&nbsp;&nbsp;</strong>
                <Dropdown
                    options={getRegions()}
                    defaultValue={region}
                    onChange={(e, { value }) => { onRegionChange(value) }}
                />
            </div> : null
    )
    /*Region Block*/

    /*Map Block*/
    const onMapChange = (e) => {
        setMap(e.target.checked)
        props.onAction(ACTION_MAP, e.target.checked)
    }

    const mapForm = () => (
        requestInfo.isMap ?
            <div style={{ display: 'inline', marginLeft: 15 }}>
                <strong>Map:</strong>
                <CustomSwitch size="small" color="primary" checked={map}
                    onChange={onMapChange} />
            </div> :
            null
    )
    /*Map Block*/

    /*Refresh Block*/
    const refreshForm = () => (
        <IconButton aria-label="refresh" style={{marginTop:-3}} onClick={(e) => { props.onAction(ACTION_REFRESH) }}>
            <RefreshIcon style={{ color: '#76ff03' }} />
        </IconButton>
    )
    /*Refresh Block*/

    const getDetailView = (props) => (
        <div style={{ right: 0, position: 'absolute' }}>
            <IconButton aria-label="refresh" onClick={(e) => { props.onAction(ACTION_CLOSE) }}>
                <CloseIcon style={{ color: '#76ff03' }} />
            </IconButton>
        </div>
    )

    return (
        <Toolbar>
            <label className='content_title_label'>{requestInfo.headerLabel}</label>
            {
                props.isDetail ?
                    <div style={{ right: 0, position: 'absolute' }}>
                        {getDetailView(props)}
                    </div> :
                    <div style={{ right: 0, position: 'absolute' }}>
                        {searchForm()}
                        {regionForm()}
                        {mapForm()}
                        {addForm()}
                        {refreshForm()}
                    </div>
            }
        </Toolbar>
    )
}

export default MexToolbar