
import React, { useEffect } from 'react'
import { useSelector } from "react-redux";
import { Box, Toolbar, Typography, Grid, Divider } from '@material-ui/core';
import { lightGreen } from '@material-ui/core/colors';
import SearchFilter from '../../../../hoc/filter/SearchFilter';
import * as dateUtil from '../../../../utils/date_util'
import { refreshRates, relativeTimeRanges, visibility } from '../helper/constant';
import { redux_org } from '../../../../helper/reduxData'
import { DEVELOPER, PARENT_APP_INST, PARENT_CLOUDLET, PARENT_CLUSTER_INST } from '../../../../helper/constant/perpetual';
import { IconButton, Icon } from '../../../../hoc/mexui';

import PublicOutlinedIcon from '@material-ui/icons/PublicOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';

import MonitoringMenu from './MonitoringMenu'
import MexTimer from '../common/picker/MexTimer'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { fields } from '../../../../services/model/format';

const timeRangeInMin = (range) => {
    let endtime = dateUtil.currentUTCTime()
    let starttime = dateUtil.subtractMins(range, endtime).valueOf()
    starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
    endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
    return { starttime, endtime }
}

/********
* Refresh
********/
const Refresh = (props) => {
    const { onUpdate, value, refreshRange, setRefreshRange } = props

    var refreshId = undefined
    const onRefreshRateChange = (rate) => {
        setRefreshRange(rate)
        let interval = rate.duration
        if (refreshId) {
            clearInterval(refreshId)
        }
        if (interval > 0) {
            refreshId = setInterval(() => {
                onUpdate({ range: timeRangeInMin(value.duration.duration) })
            }, interval * 1000);
        }
    }

    return (
        <Grid container>
            <IconButton onClick={() => { onUpdate({ range: timeRangeInMin(value.duration.duration) }) }}><Icon style={{ color: lightGreen['A700'] }}>refresh</Icon></IconButton>
            <Divider orientation="vertical" style={{ marginTop: 13, marginBottom: 13 }} flexItem />
            <MonitoringMenu showTick={true} data={refreshRates} labelKey='label' onChange={onRefreshRateChange} icon={<ExpandMoreIcon style={{ color: lightGreen['A700'] }} />} value={refreshRange} tip={'Refresh Rate'} />
        </Grid>
    )
}

/********
* Date Time Picker
********/
const DateTimePicker = (props) => {
    const { onUpdate, value, setRefreshRange } = props

    const onTimeRangeChange = (from, to) => {
        setRefreshRange(refreshRates[0])
        onUpdate({ range: { starttime: from, endtime: to } })
    }

    const onRelativeChange = (duration) => {
        onUpdate({ duration, range: timeRangeInMin(duration.duration) })
    }

    return (
        <MexTimer onChange={onTimeRangeChange} onRelativeChange={onRelativeChange} range={value.range} duration={value.duration} />
    )
}

/********
* Module
********/
const Module = (props) => {
    const { order, value, onUpdate } = props
    const orgInfo = useSelector(state => state.organizationInfo.data)
    const dataList = ['App Inst', 'Cluster Inst']

    const onValueChange = () => {
        let data = value.moduleId === PARENT_APP_INST ? dataList[0] : dataList[1]
        data = value.moduleId === PARENT_CLOUDLET ? dataList[2] : data
        return data
    }


    if (redux_org.isOperator(orgInfo) || redux_org.isAdmin(orgInfo)) {
        dataList.push('Cloudlet')
    }

    const onChange = (value) => {
        let moduleId = value === 'App Inst' ? PARENT_APP_INST : PARENT_CLOUDLET
        moduleId = value === 'Cluster Inst' ? PARENT_CLUSTER_INST : moduleId
        onUpdate({ moduleId })
    }

    return (
        <MonitoringMenu order={order} data={dataList} onChange={onChange} value={onValueChange()} />
    )
}

/********
* Statistics
********/
const Statistics = (props) => {
    const { order, value, onUpdate } = props
    const dataList = ['max', 'avg', 'min']

    const onChange = (value) => {
        onUpdate({ stats: value })
    }

    return (
        value.moduleId !== PARENT_CLOUDLET ? <MonitoringMenu order={order} data={dataList} onChange={onChange} default={dataList[0]} allCaps={true} /> : null
    )
}

/********
* Region
********/
const Region = (props) => {
    const { order, onUpdate, value } = props
    const regions = useSelector(state => state.regionInfo.region)

    const onChange = (value) => {
        onUpdate({ regions: value })
    }

    return (
        <MonitoringMenu order={order} data={regions} default={value.regions} onChange={onChange} multiple={true} icon={<PublicOutlinedIcon style={{ color: 'rgba(118, 255, 3, 0.7)' }} />} />
    )

}

const Visibility = (props) => {
    const { order, onUpdate, value } = props
    const onChange = (value) => {

    }
    return (
        <MonitoringMenu order={order} data={visibility(value.moduleId)} labelKey='header' multiple={true} field={'field'} type={'metricType'} icon={<VisibilityOutlinedIcon style={{ color: 'rgba(118, 255, 3, 0.7)' }} />} onChange={onChange} tip='Visibility' />
    )
}

const Organization = (props) => {
    const { order, dataList, onUpdate } = props
    const orgInfo = useSelector(state => state.organizationInfo.data)

    useEffect(() => {
        onChange(orgInfo)
    }, [orgInfo]);


    const onChange = (value) => {
        let moduleId = value[fields.type] === DEVELOPER ? PARENT_APP_INST : PARENT_CLOUDLET
        onUpdate({ organization: value, moduleId })
    }

    return (
        dataList.length > 0 ? <MonitoringMenu order={order} data={dataList} onChange={onChange} labelKey={fields.organizationName} placeHolder={'Select Org'} disableDefault={true} search={true} large={true} /> : null
    )
}

const MexToolbar = (props) => {
    const { onChange, organizations } = props
    const regions = useSelector(state => state.regionInfo.region)
    const orgInfo = useSelector(state => state.organizationInfo.data)
    const [value, setValue] = React.useState({
        regions,
        range: timeRangeInMin(relativeTimeRanges[3].duration),
        duration: relativeTimeRanges[3],
        search: '',
        organization: redux_org.nonAdminOrg(orgInfo),
        moduleId: redux_org.isDeveloper(orgInfo) ? PARENT_APP_INST : PARENT_CLOUDLET,
        stats: 'max'
    })
    const [refreshRange, setRefreshRange] = React.useState(refreshRates[0])

    useEffect(() => {
        onChange(value)
    }, [value]);

    const onUpdate = (out) => {
        setValue({ ...value, ...out })
    }

    return (
        <Toolbar>
            <Typography variant={'h5'} className='monitoring-header'>Monitoring</Typography>
            <div style={{ width: '100%' }}>
                <Box display="flex" justifyContent="flex-end">
                    {value.organization ?
                        <React.Fragment>
                            <Box order={8}>
                                <Refresh onUpdate={onUpdate} value={value} refreshRange={refreshRange} setRefreshRange={setRefreshRange} />
                            </Box>
                            <Box order={7} p={0.9}>
                                <SearchFilter onFilter={(value) => { onUpdate({ search: value }) }} compact={true} insensitive={true} />
                            </Box>
                            <Visibility order={6} value={value} onUpdate={onUpdate} />
                            <Region order={5} value={value} onUpdate={onUpdate} />
                            <Box order={4} p={1.2}>
                                <DateTimePicker onUpdate={onUpdate} value={value} setRefreshRange={setRefreshRange} />
                            </Box>
                            <Statistics order={3} value={value} onUpdate={onUpdate} />
                            <Module order={2} value={value} onUpdate={onUpdate} />
                        </React.Fragment> : null}
                        <Organization order={1} dataList={organizations} onUpdate={onUpdate} />
                </Box>
            </div>
        </Toolbar>
    )
}

export default MexToolbar