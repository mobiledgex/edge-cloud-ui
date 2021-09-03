import React from 'react'
import { connect } from 'react-redux';
import { Toolbar, Input, InputAdornment, Switch, makeStyles, Box, Menu, ListItem, ListItemText, Tooltip, Divider, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SelectMenu from '../hoc/selectMenu/SelectMenu'
import { redux_org } from '../helper/reduxData'
import Picker from '../hoc/mexui/Picker'
import { lightGreen } from '@material-ui/core/colors';
import { Icon, IconButton } from '../hoc/mexui';

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
export const ACTION_PICKER = 10;

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
    root: {
        marginTop: -2,
        marginLeft: 4
    },
    checked: {},
    track: {},
})(Switch);

const MBox = (props) => {
    let style = props.style ? props.style : {}
    style = { ...style, display: 'flex', alignItems: 'center' }
    return (
        <React.Fragment>
            {/* <Box order={props.order}><Divider orientation='vertical' style={{ height: 25, marginTop:7 }} /></Box> */}
            <Box order={props.order} style={style} p={props.p}>
                {props.children}
            </Box>
        </React.Fragment>
    )
}

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

    const searchForm = (order) => (
        <MBox order={order} style={{ marginTop: `${focused ? '-10px' : '-3px'}`, paddingLeft:10 }}>
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
                        <Icon style={{ color: iconColor }}>search</Icon>
                    </InputAdornment>
                }
                value={search}
                placeholder={'Search'} />
        </MBox>
    )
    /*Search Block*/

    /*Add Block*/
    const addForm = (order) => (
        requestInfo.onAdd && (!redux_org.isViewer(this) || requestInfo.viewerEdit) ?
            <MBox order={order} style={{ marginTop: -5 }}>
                <IconButton aria-label="new" onClick={(e) => { props.onAction(ACTION_NEW) }}>
                    <Icon style={{ color: iconColor }} >add</Icon>
                </IconButton>
            </MBox> : null
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

    const regionForm = (order) => (
        requestInfo.isRegion ?
            <MBox order={order} p={1}>
                <SelectMenu header='Region' labelKey='text' dataList={getRegions()} onChange={onRegionChange} default={'ALL'} />
            </MBox> : null
    )
    /*Region Block*/

    /*Map Block*/
    const onMapChange = (e) => {
        setMap(e.target.checked)
        props.onAction(ACTION_MAP, e.target.checked)
    }

    const mapForm = (order) => (
        requestInfo.isMap ?
            <MBox order={order} p={1} style={{marginTop:1}}>
                <strong>Map:</strong>
                <CustomSwitch size="small" color="primary" checked={map} onChange={onMapChange} />
            </MBox> :
            null
    )
    /*Map Block*/

    /*Refresh Block*/
    const refreshForm = (order) => (
        <MBox order={order}  style={{ marginTop: -5 }}>
            <IconButton aria-label="refresh" onClick={(e) => { props.onAction(ACTION_REFRESH) }}>
                <Icon style={{ color: iconColor }}>refresh</Icon>
            </IconButton>
        </MBox>
    )
    /*Refresh Block*/

    const getDetailView = (props) => (
        <div style={{ right: 0, position: 'absolute' }}>
            <IconButton aria-label="detail-view" onClick={(e) => { props.onAction(ACTION_CLOSE) }}>
                <Icon style={{ color: iconColor }}>close</Icon>
            </IconButton>
        </div>
    )

    const renderBack = () => (
        props.requestInfo.back ?
            <MBox order={order}>
                <Tooltip title={<strong style={{ fontSize: 13 }}>Back</strong>}>
                    <IconButton aria-label="back" style={{ marginTop: -3, marginLeft: -20 }} onClick={(e) => { props.requestInfo.back() }}>
                        <ArrowBackIosIcon style={{ color: iconColor }} />
                    </IconButton>
                </Tooltip>
            </MBox> : null
    )

    const onGroupChange = (data) => {
        props.onAction(ACTION_GROUP, data)
    }

    const renderGroup = (order) => {
        const { requestInfo } = props
        let dataList = [{ label: 'None' }, ...requestInfo.keys.filter(key => (key.group))]
        return (
            requestInfo.grouping ? <MBox order={order} p={1}>
                <SelectMenu header='Group By' labelKey='label' dataList={dataList} onChange={onGroupChange} default={'None'} />
            </MBox> : null
        )
    }

    const customAction = () => {
        return props.toolbarAction ? props.toolbarAction() : null
    }

    const picker = (order) => {
        const { requestInfo } = props
        return (
            requestInfo.picker ?
                <Box order={order} style={{ marginLeft: 15, marginRight: 10 }} m={0.7}>
                    <Picker onChange={(value) => { props.onAction(ACTION_PICKER, value) }} relativemax={6} />
                </Box> : null
        )
    }

    return (
        <Toolbar>
            <div style={{ width: '100%' }}>
                <Box display="flex" flexWrap="wrap">
                    <Box flexGrow={1}>
                        <Box display="flex">
                            {renderBack()}
                            <Box>
                                <Typography component='h4' variant='h5' style={{marginTop:8}}>{requestInfo.headerLabel}</Typography>
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
                                {renderGroup(1)}
                                {regionForm(2)}
                                {mapForm(3)}
                                {searchForm(4)}
                                {addForm(5)}
                                {picker(6)}
                                {refreshForm(7)}
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