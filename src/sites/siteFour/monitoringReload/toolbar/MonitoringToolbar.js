import React, { useRef } from 'react'
import { Toolbar, Input, InputAdornment, Switch, makeStyles, Box, Menu, ListItem, ListItemIcon, Checkbox, ListItemText, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import PublicOutlinedIcon from '@material-ui/icons/PublicOutlined';
import * as constant from '../helper/Constant';
import { getUserRole } from '../../../../services/model/format';
import MonitoringMenu from './MonitoringMenu'

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

const fetchMetricTypeField = (metricTypeKeys) => {
    return metricTypeKeys.map(metricType => { return metricType.field })
}

const MexToolbar = (props) => {
    const classes = useStyles();
    const [search, setSearch] = React.useState('')
    const [focused, setFocused] = React.useState(false)

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
                        <SearchIcon style={{ color: '#76FF03' }} />
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
        props.onChange(constant.ACTION_SUMMARY, values)
    }

    const onRefreshRateChange = (value) => {
        props.onChange(constant.ACTION_REFRESH_RATE, value)
    }


    return (
        <Toolbar>
            <label className='monitoring-header'>Monitoring</label>
            {
                <div style={{ width: '100%' }}>
                    <Box display="flex" justifyContent="flex-end">
                        <MonitoringMenu data={constant.metricParentTypes} labelKey='label' order={1} onChange={onMetricParentTypeChange} />
                        <MonitoringMenu data={props.regions} order={2} multiple={true} icon={<PublicOutlinedIcon style={{ color: '#76FF03' }} />} onChange={onRegionChange} />
                        <MonitoringMenu data={props.metricTypeKeys} labelKey='header' order={3} multiple={true} field={'field'} type={'metricType'} icon={<InsertChartIcon style={{ color: '#76FF03' }} />} onChange={onMetricTypeChange} />
                        <MonitoringMenu data={constant.summaryList} labelKey='label' order={4} onChange={onSummaryChange} />
                        {searchForm(5)}
                        <MonitoringMenu data={constant.refreshRates} labelKey='label' order={6} onChange={onRefreshRateChange} />
                    </Box>
                </div>
            }
        </Toolbar>
    )

}

export default MexToolbar