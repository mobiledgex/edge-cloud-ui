import React, { useRef } from 'react'
import { Toolbar, Input, InputAdornment, Switch, makeStyles, Box, Menu, ListItem, ListItemIcon, Checkbox, ListItemText, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import PublicOutlinedIcon from '@material-ui/icons/PublicOutlined';
import { summaryList, metricParentTypes, OPERATOR } from '../helper/Constant';
import { getUserRole } from '../../../../services/model/format';

const timeUnits = [
    { unit: 'Minute', min: 1, max: 59, default: 5 },
    { unit: 'Hour', min: 1, max: 24, default: 24 },
    { unit: 'Day', max: 31, min: 1, default: 1 },
    { unit: 'Month', min: 1, max: 12, default: 5 },
    { unit: 'Year', min: 1, max: 1, default: 1 }
]

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
    searchAdorment : {
        fontSize: 17, 
        pointerEvents: "none", 
        cursor: 'pointer'
    }
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

const fetchMetricTypeField = (metricTypeKeys) =>{
    return metricTypeKeys.map(metricType=>{return metricType.field})
}

const MexToolbar = (props) => {
    const classes = useStyles();
    const [filter, setFilter] = React.useState({ region: props.regions, search: '', metricType: fetchMetricTypeField(props.metricTypeKeys), summary:summaryList[0], parent : metricParentTypes[getUserRole().includes(OPERATOR)  ? 2 : 0] })
    const [focused, setFocused] = React.useState(false)
    const [metricAnchorEl, setMetricAnchorEl] = React.useState(null)
    const [regionAnchorEl, setRegionAnchorEl] = React.useState(null)
    const [summaryAnchorEl, setSummaryAnchorEl] = React.useState(null)
    const [parentAnchorEl, setParentAnchorEl] = React.useState(null)
    const myRef = useRef(null);
    /*Search Block*/
    const handleSearch = (e) => {
        let value = e ? e.target.value : ''
        filter.search = value
        setFilter(filter)
        props.onUpdateFilter(filter)
    }

    const searchForm = (order) => (
        <Box order={order} style={{ marginTop: `${focused ? '0px' : '7px'}`, marginLeft:10 }}>
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
                    <InputAdornment className={classes.searchAdorment} position="start" >
                        <SearchIcon style={{ color: '#76FF03' }} />
                    </InputAdornment>
                }
                value={filter.search}
                placeholder={'Search'} />
        </Box>
    )
    /*Search Block*/

    const onMenuChange = (type, value, isMultiple, setAnchorEl) => {
        setFilter(filter => {
            let types = filter[type]
            if (isMultiple) {
                if (types.includes(value)) {
                    types = types.filter(type => {
                        return type !== value
                    })
                }
                else {
                    types.push(value)
                }
            }
            else
            {
                types = value
                setAnchorEl(null)
            }
            filter[type] = types
            if(type === 'parent')
            {
                filter['metricType'] =  fetchMetricTypeField(value.metricTypeKeys)
            }
            props.onUpdateFilter(filter)
            return filter
        })
    }

    const renderMenu = (icon, order, dataList, anchorEl, setAnchorEl, isMultiple, type, labelKey, field) => {
        return (
            <Box order={order}>
                <IconButton aria-controls="chart" aria-haspopup="true" onClick={(e) => { setAnchorEl(e.currentTarget) }}>
                    {icon}
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    onClose={()=>{setAnchorEl(null)}}
                    keepMounted
                    open={Boolean(anchorEl)}
                >
                    {dataList.map((data, i) => {
                        let valid = data.role ? getUserRole().includes(data.role) : true
                        return valid ? <ListItem key={i} role={undefined} dense button onClick={()=>{onMenuChange(type, field ? data[field] : data , isMultiple, setAnchorEl)}}>
                            {isMultiple ? <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={filter[type].includes(field ? data[field] : data)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': 1 }}
                                />
                            </ListItemIcon> : null}
                            <ListItemText id={1} primary={labelKey ? data[labelKey] : data} />
                        </ListItem> : null
                    })}
                </Menu>
            </Box>
        )
    }

    return (
        <Toolbar>
            <label className='monitoring-header'>Monitoring</label>
            {
                <div style={{ width: '100%' }}>
                    <Box display="flex" justifyContent="flex-end">
                        {renderMenu(<strong style={{backgroundColor: 'rgba(118, 255, 3, 0.7)', borderRadius:5, maxWidth:100, height:20, fontSize:12, padding:'2px 5px 0px 5px' }}>{filter.parent.label}</strong>, 1, metricParentTypes, parentAnchorEl, setParentAnchorEl, false, 'parent', 'label')}
                        {renderMenu(<PublicOutlinedIcon style={{color: '#76FF03'}}/>, 2, props.regions, regionAnchorEl, setRegionAnchorEl, true, 'region')}
                        {renderMenu(<InsertChartIcon style={{color: '#76FF03'}}/>, 3, props.metricTypeKeys, metricAnchorEl, setMetricAnchorEl, true, 'metricType', 'header', 'field')}
                        {renderMenu(<strong style={{backgroundColor: 'rgba(118, 255, 3, 0.7)', borderRadius:5, maxWidth:70, height:20, fontSize:12, padding:'2px 5px 0px 5px' }}>{filter.summary.label}</strong>, 4, summaryList, summaryAnchorEl, setSummaryAnchorEl, false, 'summary', 'label')}
                        {searchForm(5)}
                    </Box>
                </div>
            }
        </Toolbar>
    )

}

export default MexToolbar