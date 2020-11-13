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
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';

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

    const onMinimize = ()=>{
        props.onChange(constant.ACTION_MINIMIZE)
    }

    const renderRefresh = (order) => (
        <Box order={order}>
            <Grid container>
                <Tooltip title={<strong style={{ fontSize: 13 }}>Refresh</strong>} arrow>
                    <IconButton onClick={onRefresh}><RefreshIcon style={{ color: 'rgba(118, 255, 3, 0.7)' }} /></IconButton>
                </Tooltip>
                <Divider orientation="vertical" style={{ marginTop: 13, marginBottom: 13 }} flexItem />
                <MonitoringMenu showTick={true} data={constant.refreshRates} labelKey='label' onChange={onRefreshRateChange} icon={<ExpandMoreIcon style={{ color: '#76FF03' }} />} value={refreshRange} tip={'Refresh Rate'} />
            </Grid>
        </Box>
    )

    const renderMinimize = (order) => (
        <Box order={order}>
            <Grid container>
                <Tooltip title={<strong style={{ fontSize: 13 }}>Minimize</strong>} arrow>
                    <IconButton onClick={onMinimize}><IndeterminateCheckBoxOutlinedIcon style={{ color: 'rgba(118, 255, 3, 0.7)' }} /></IconButton>
                </Tooltip>
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
                        {renderMinimize(9)}
                    </Box>
                </div>
            }
        </Toolbar>
    )

}

export default MexToolbar