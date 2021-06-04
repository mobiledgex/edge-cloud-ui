import React from 'react'
import { connect } from 'react-redux';
import { Toolbar, Input, InputAdornment, IconButton, Switch, makeStyles, Box, Menu, ListItem, ListItemText, Tooltip } from '@material-ui/core'
import { withStyles } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SelectMenu from '../hoc/selectMenu/SelectMenu'
import { redux_org } from '../helper/reduxData'
import { lightGreen } from '@material-ui/core/colors';

export const REGION_ALL = 1;
export const ACTION_REGION = 1
export const ACTION_REFRESH = 2
export const ACTION_NEW = 3
export const ACTION_CLOSE = 4
export const ACTION_MAP = 5
export const ACTION_SEARCH = 6;
export const ACTION_CLEAR = 7;
export const ACTION_BACK = 8;
export const ACTION_GROUP = 9;

const iconColor = lightGreen['A700']

const useStyles = makeStyles((theme) => ({
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        transition: theme.transitions.create('width'),
        width: '0ch',
        height: 20,
        [theme.breakpoints.up('sm')]: {
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

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
    const classes = useStyles();
    let requestInfo = props.requestInfo

    const [search, setSearch] = React.useState('')
    const [region, setRegion] = React.useState('ALL')
    const [map, setMap] = React.useState(props.showMap)
    const [focused, setFocused] = React.useState(false)
    const [anchorRegionEL, setAnchorRegionEL] = React.useState(null)

    /*Search Block*/
    const handleSearch = (e) => {
        setSearch(e ? e.target.value : '')
        props.onAction(ACTION_SEARCH, e ? e.target.value : '')
    }

    const searchForm = () => (
        <Box order={3} style={{ marginTop: `${focused ? '0px' : '4px'}` }}>
            <Input
                onFocus={() => {
                    setFocused(true)
                }}
                onBlur={() => {
                    setFocused(false)
                }}
                size="small"
                disableUnderline={!focused}
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                onChange={handleSearch}
                startAdornment={
                    <InputAdornment style={{ fontSize: 17, pointerEvents: "none", cursor: 'pointer' }} position="start" >
                        <SearchIcon style={{ color: iconColor }} />
                    </InputAdornment>
                }
                value={search}
                placeholder={'Search'} />
        </Box>
    )
    /*Search Block*/

    /*Add Block*/
    const addForm = () => (
        requestInfo.onAdd && (!redux_org.isViewer(this) || requestInfo.viewerEdit) ?
            <Box order={5} >
                <IconButton aria-label="new" style={{ marginTop: -3 }} className='buttonCreate' onClick={(e) => { props.onAction(ACTION_NEW) }}>
                    <AddIcon style={{ color: iconColor }} />
                </IconButton>
            </Box> : null
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
        value = value[0]
        setRegion(value.text)
        props.onAction(ACTION_REGION, value.value)
        setAnchorRegionEL(null)
    }

    const regionForm = () => (
        requestInfo.isRegion ?
            <Box order={2} p={1} style={{ marginTop: 4, marginRight: 12 }}>
                <SelectMenu header='Region' labelKey='text' dataList={getRegions()} onChange={onRegionChange} default={'ALL'} />
            </Box> : null
    )
    /*Region Block*/

    /*Map Block*/
    const onMapChange = (e) => {
        setMap(e.target.checked)
        props.onAction(ACTION_MAP, e.target.checked)
    }

    const mapForm = () => (
        requestInfo.isMap ?
            <Box order={4} p={1}>
                <strong>Map:</strong>
                <CustomSwitch size="small" color="primary" checked={map}
                    onChange={onMapChange} />
            </Box> :
            null
    )
    /*Map Block*/

    /*Refresh Block*/
    const refreshForm = () => (
        <Box order={6} >
            <IconButton aria-label="refresh" style={{ marginTop: -3 }} onClick={(e) => { props.onAction(ACTION_REFRESH) }}>
                <RefreshIcon style={{ color: iconColor }} />
            </IconButton>
        </Box>
    )
    /*Refresh Block*/

    const getDetailView = (props) => (
        <div style={{ right: 0, position: 'absolute' }}>
            <IconButton aria-label="refresh" onClick={(e) => { props.onAction(ACTION_CLOSE) }}>
                <CloseIcon style={{ color: iconColor }} />
            </IconButton>
        </div>
    )

    const renderBack = () => (
        props.requestInfo.back ?
            <Box>
                <Tooltip title={<strong style={{ fontSize: 13 }}>Back</strong>}>
                    <IconButton aria-label="back" style={{ marginTop: -3, marginLeft: -20 }} onClick={(e) => { props.requestInfo.back() }}>
                        <ArrowBackIosIcon style={{ color: iconColor }} />
                    </IconButton>
                </Tooltip>
            </Box> : null
    )

    const onGroupChange = (data) => {
        props.onAction(ACTION_GROUP, data)
    }

    const renderGroup = () => {
        const { requestInfo } = props
        let dataList = [{ label: 'None' }, ...requestInfo.keys.filter(key => (key.group))]
        return (
            requestInfo.grouping ? <Box order={1} p={1} style={{ marginTop: 4, marginRight: 12 }}>
                <SelectMenu header='Group By' labelKey='label' dataList={dataList} onChange={onGroupChange} default={'None'} />
            </Box> : null
        )
    }

    const customAction = () => {
        return props.toolbarAction ? props.toolbarAction() : null
    }

    return (
        <Toolbar>
            <div style={{ width: '100%' }}>
                <Box display="flex" p={1} flexWrap="wrap">
                    <Box flexGrow={1}>
                        <Box display="flex">
                            {renderBack()}
                            <Box>
                                <label className='content_title_label'>{requestInfo.headerLabel}</label>
                            </Box>
                        </Box>
                    </Box>
                    {
                        props.isDetail ?
                            <div style={{ right: 0, position: 'absolute' }}>
                                {getDetailView(props)}
                            </div> :
                            <React.Fragment>
                                {customAction()}
                                {searchForm()}
                                {regionForm()}
                                {mapForm()}
                                {addForm()}
                                {refreshForm()}
                                {renderGroup()}
                            </React.Fragment>
                    }
                </Box></div>
        </Toolbar>
    )
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default connect(mapStateToProps, null)(MexToolbar);