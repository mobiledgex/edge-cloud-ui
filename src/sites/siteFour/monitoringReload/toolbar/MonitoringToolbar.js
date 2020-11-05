import React from 'react'
import { Toolbar, Input, InputAdornment, Switch, makeStyles, Box, Menu, ListItem, ListItemIcon, Checkbox, ListItemText, IconButton, Tooltip, Grid, Divider } from '@material-ui/core'
import { withStyles } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import PublicOutlinedIcon from '@material-ui/icons/PublicOutlined';
import * as constant from '../helper/Constant';
import MexTimer from '../helper/MexTimer'
import MonitoringMenu from './MonitoringMenu'
import RefreshIcon from '@material-ui/icons/Refresh';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
    searchAdorment: {
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
    const [search, setSearch] = React.useState('')
    const [focused, setFocused] = React.useState(false)
    const [refreshRange, setRefreshRange] = React.useState(constant.refreshRates[0])

    /*Search Block*/
    const handleSearch = (e) => {
        let value = e ? e.target.value : ''
        setSearch(value)
        props.onChange(constant.ACTION_SEARCH, value)
    }

    const searchForm = (order) => (
        <Box order={order} style={{ marginTop: `${focused ? '0px' : '7px'}`, marginLeft: 10 }}>
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
                        <SearchIcon style={{ color: 'rgba(118, 255, 3, 0.7)' }} />
                    </InputAdornment>
                }
                value={search}
                placeholder={'Search'} />
        </Box>
    )
    /*Search Block*/

    const onRegionChange = (values) => {
        props.onChange(constant.ACTION_REGION, values)
    }


    const onMetricParentTypeChange = (value) => {
        props.onChange(constant.ACTION_METRIC_PARENT_TYPE, value)
    }

    const onMetricTypeChange = (values) => {
        props.onChange(constant.ACTION_METRIC_TYPE, values)
    }


    const onSummaryChange = (value) => {
        props.onChange(constant.ACTION_SUMMARY, value)
    }

    const onRefreshRateChange = (value) => {
        setRefreshRange(value)
        props.onChange(constant.ACTION_REFRESH_RATE, value)
    }
    
    const onTimeRangeChange = (from, to)=>{
        setRefreshRange(constant.refreshRates[0])
        props.onChange(constant.ACTION_TIME_RANGE, {starttime:from, endtime:to})
    }

    const onRelativeTimeChange = (duration) =>{
        props.onChange(constant.ACTION_RELATIVE_TIME, duration)
    }

    const onRefresh = ()=>{
        props.onChange(constant.ACTION_REFRESH)
    }

    const renderRefresh = (order) => (
        <Box order={order}>
            <Grid container>
                <IconButton onClick={onRefresh}><RefreshIcon style={{ color: 'rgba(118, 255, 3, 0.7)'}} /></IconButton>
                <Divider orientation="vertical" style={{marginTop:13, marginBottom:13}} flexItem/>
                <MonitoringMenu showTick={true} data={constant.refreshRates} labelKey='label' onChange={onRefreshRateChange} icon={<ExpandMoreIcon style={{ color: '#76FF03'}}/>} value={refreshRange} tip={'Refresh Rate'}/>
            </Grid>
        </Box>
    )

    return (
        <Toolbar>
            <label className='monitoring-header'>Monitoring</label>
            {
                <div style={{ width: '100%' }}>
                    <Box display="flex" justifyContent="flex-end">
                        <MexTimer order={1}  onChange={onTimeRangeChange} onRelativeChange={onRelativeTimeChange} range={props.range} duration={props.duration} />
                        <MonitoringMenu data={constant.metricParentTypes} default={props.defaultParent} labelKey='label' order={2} onChange={onMetricParentTypeChange} default={props.defaultParent}/>
                        <MonitoringMenu data={props.regions} order={3} multiple={true} icon={<PublicOutlinedIcon style={{ color: 'rgba(118, 255, 3, 0.7)' }} />} onChange={onRegionChange} tip='Region'/>
                        <MonitoringMenu data={props.metricTypeKeys} labelKey='header' order={4} multiple={true} field={'field'} type={'metricType'} icon={<InsertChartIcon style={{ color: 'rgba(118, 255, 3, 0.7)' }} />} onChange={onMetricTypeChange} tip='Metric Type'/>
                        <MonitoringMenu data={constant.summaryList} labelKey='label' order={5} onChange={onSummaryChange} />
                        {renderRefresh(7)}
                        {searchForm(8)}
                    </Box>
                </div>
            }
        </Toolbar>
    )

}

export default MexToolbar