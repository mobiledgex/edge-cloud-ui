import React, { useRef } from 'react'
import { Toolbar, Input, InputAdornment, Switch, makeStyles, Box, Menu, ListItem, ListItemIcon, Checkbox, ListItemText, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import PublicOutlinedIcon from '@material-ui/icons/PublicOutlined';
import { summaryList } from '../../../services/model/appMetrics';

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

const MexToolbar = (props) => {
    const classes = useStyles();
    const [filter, setFilter] = React.useState({ region: props.regions, search: '', metricType: [props.metricKeys[0]], summary:summaryList[0]})
    const [focused, setFocused] = React.useState(false)
    const [metricAnchorEl, setMetricAnchorEl] = React.useState(null)
    const [regionAnchorEl, setRegionAnchorEl] = React.useState(null)
    const [summaryAnchorEl, setSummaryAnchorEl] = React.useState(null)
    const myRef = useRef(null);
    /*Search Block*/
    const handleSearch = (e) => {
        let value = e ? e.target.value : ''
        setFilter(filter => {
            filter.search = value
            props.onUpdateFilter(filter)
            return filter
        })
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
            props.onUpdateFilter(filter)
            return filter
        })
    }

    const renderMenu = (icon, order, dataList, anchorEl, setAnchorEl, isMultiple, type, labelKey) => {
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
                        return <ListItem key={i} role={undefined} dense button onClick={()=>{onMenuChange(type, data, isMultiple, setAnchorEl)}}>
                            {isMultiple ? <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={filter[type].includes(data)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': 1 }}
                                />
                            </ListItemIcon> : null}
                            <ListItemText id={1} primary={labelKey ? data[labelKey] : data} />
                        </ListItem>
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
                        {searchForm(4)}
                        {renderMenu(<PublicOutlinedIcon style={{color: '#76FF03'}}/>, 1, props.regions, regionAnchorEl, setRegionAnchorEl, true, 'region')}
                        {renderMenu(<InsertChartIcon style={{color: '#76FF03'}}/>, 2, props.metricKeys, metricAnchorEl, setMetricAnchorEl, true, 'metricType', 'header')}
                        {renderMenu(<strong style={{backgroundColor: 'rgba(118, 255, 3, 0.7)', borderRadius:5, width:40, height:20, fontSize:12, padding:2 }}>{filter.summary.label}</strong>, 3, summaryList, summaryAnchorEl, setSummaryAnchorEl, false, 'summary', 'label')}
                    </Box>
                </div>
            }
        </Toolbar>
    )

}

export default MexToolbar