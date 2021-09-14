import React from 'react'
import { connect, useSelector } from 'react-redux';
import { Toolbar, makeStyles, Box, IconButton, Tooltip, Grid, Divider } from '@material-ui/core'
import PublicOutlinedIcon from '@material-ui/icons/PublicOutlined';
import * as constant from '../helper/Constant';
import MexTimer from '../helper/MexTimer'
import MonitoringMenu from './MonitoringMenu'
import RefreshIcon from '@material-ui/icons/Refresh';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { fields } from '../../../../services/model/format';
import {redux_org, redux_private} from '../../../../helper/reduxData'
import { lightGreen } from '@material-ui/core/colors';
import SearchFilter from '../../../../hoc/filter/SearchFilter'

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
    console.log(props,'props for mextoolbar')
    const classes = useStyles();
    const orgInfo = useSelector(state=>state.organizationInfo.data)
    const privateAccess = useSelector(state=>state.privateAccess.data)
    const [search, setSearch] = React.useState('')
    const [focused, setFocused] = React.useState(false)
    const [refreshRange, setRefreshRange] = React.useState(constant.refreshRates[0])
    const parentId = props.filter.parent.id
    /*Search Block*/
    const handleSearch = (e) => {
        let value = e ? e.target.value : ''
        setSearch(value)
        props.onChange(constant.ACTION_SEARCH, value)
    }

    const onSearch = (value)=>{
        props.onChange(constant.ACTION_SEARCH, value)
    }

    const searchForm = (order) => (
        <Box order={order} style={{ marginTop: `${focused ? '0px' : '7px'}`, marginLeft: 10 }}>
            <SearchFilter onFilter={onSearch} style={{ marginBottom: 10 }} compact={true} insensitive={true} />
        </Box>
    )
    /*Search Block*/

    const onRegionChange = (values) => {
        props.onChange(constant.ACTION_REGION, values)
    }

    const onOrgChange = (value) => {
        props.onChange(constant.ACTION_ORG, value)
    }

    const onMetricParentTypeChange = (value) => {
        if (value.id === constant.PARENT_CLOUDLET) {
            props.onChange(constant.ACTION_SUMMARY, constant.summaryList[0])
        }
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

    const onTimeRangeChange = (from, to) => {
        setRefreshRange(constant.refreshRates[0])
        props.onChange(constant.ACTION_TIME_RANGE, { starttime: from, endtime: to })
    }

    const onRelativeTimeChange = (duration) => {
        props.onChange(constant.ACTION_RELATIVE_TIME, duration)
    }

    const onRefresh = () => {
        props.onChange(constant.ACTION_REFRESH)
    }

    const renderRefresh = (order) => (
        <Box order={order}>
            <Grid container>
                <Tooltip title={<strong style={{ fontSize: 13 }}>Refresh</strong>} arrow>
                    <IconButton onClick={onRefresh}><RefreshIcon style={{ color: 'rgba(118, 255, 3, 0.7)' }} /></IconButton>
                </Tooltip>
                <Divider orientation="vertical" style={{ marginTop: 13, marginBottom: 13 }} flexItem />
                <MonitoringMenu showTick={true} data={constant.refreshRates} labelKey='label' onChange={onRefreshRateChange} icon={<ExpandMoreIcon style={{ color: lightGreen['A700'] }} />} value={refreshRange} tip={'Refresh Rate'} />
            </Grid>
        </Box>
    )

    const showSummary = () => {
        return parentId !== constant.PARENT_CLOUDLET
    }

    const showOrg = () => {
        return redux_org.isAdmin(orgInfo) && props.organizations.length > 0
    }

    const parentType = () => {
        if (redux_private.isPrivate(privateAccess)) {
            return constant.metricParentTypes().map(parent => {
                if(parent.id === constant.PARENT_APP_INST || parent.id === constant.PARENT_CLUSTER_INST )
                {
                    parent.role.push(constant.OPERATOR)    
                }
                return parent
            })
        }
        return constant.metricParentTypes()
    }
    return (
        // console.log(parentType(),"parentType")
        <Toolbar>
            <label className='monitoring-header'>Monitoring</label>
            {
                <div style={{ width: '100%' }}>
                    <Box display="flex" justifyContent="flex-end">
                        {showOrg() ? <MonitoringMenu order={1} data={props.organizations} labelKey={fields.organizationName} onChange={onOrgChange} placeHolder={'Select Org'} disableDefault={true} search={true} /> : null}
                        {props.selectedOrg || !redux_org.isAdmin(orgInfo) ? <React.Fragment>
                            <MexTimer order={2} onChange={onTimeRangeChange} onRelativeChange={onRelativeTimeChange} range={props.range} duration={props.duration} />
                            <MonitoringMenu order={3} data={parentType()} labelKey='label' onChange={onMetricParentTypeChange} default={props.filter.parent} />
                            <MonitoringMenu order={4} data={props.regions} default={props.filter.region} multiple={true} icon={<PublicOutlinedIcon style={{ color: 'rgba(118, 255, 3, 0.7)' }} />} onChange={onRegionChange} tip='Region' />
                            <MonitoringMenu order={5} data={constant.visibility(parentId)} default={props.filter.metricType} labelKey='header' multiple={true} field={'field'} type={'metricType'} icon={<VisibilityOutlinedIcon style={{ color: 'rgba(118, 255, 3, 0.7)' }} />} onChange={onMetricTypeChange} tip='Visibility' />
                            {showSummary() ? <MonitoringMenu order={6} data={constant.summaryList} labelKey='label' onChange={onSummaryChange} tip={'View aggregate utilization of resources between given start and end time'}/> : null}
                            {renderRefresh(7)}
                            {searchForm(8)}
                        </React.Fragment> : null}
                    </Box>
                </div>
            }
        </Toolbar>
    )

}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data,
        privateAccess: state.privateAccess.data,
    }
};

export default connect(mapStateToProps, null)(MexToolbar);