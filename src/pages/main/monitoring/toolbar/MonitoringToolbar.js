
import React, { useEffect } from 'react'
import { useSelector } from "react-redux";
import { Box, Toolbar, Typography, Grid, Divider } from '@material-ui/core';
import { lightGreen } from '@material-ui/core/colors';
import SearchFilter from '../../../../hoc/filter/SearchFilter';
import * as dateUtil from '../../../../utils/date_util'
import { refreshRates, relativeTimeRanges } from '../helper/montconstant';
import { IconButton, Icon } from '../../../../hoc/mexui';

import MonitoringMenu from './MonitoringMenu'
import MexTimer from '../helper/MexTimer'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const timeRangeInMin = (range) => {
    let endtime = dateUtil.currentUTCTime()
    let starttime = dateUtil.subtractMins(range, endtime).valueOf()
    starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
    endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
    // return { starttime: '2021-11-08T18:31:00+00:00', endtime: '2021-11-09T18:04:00+00:00' }
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
const MexToolbar = (props) => {
    const { onChange } = props
    const regions = useSelector(state => state.regionInfo.region)
    const [value, setValue] = React.useState({
        regions,
        range: timeRangeInMin(relativeTimeRanges[3].duration),
        duration: relativeTimeRanges[3],
        search: ''
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
                    <Box order={2} p={0.9}>
                        <SearchFilter onFilter={(value) => { onUpdate({ search: value }) }} compact={true} insensitive={true} />
                    </Box>
                    <Box order={3}>
                        <Refresh onUpdate={onUpdate} value={value} refreshRange={refreshRange} setRefreshRange={setRefreshRange} />
                    </Box>
                    <Box order={1} p={1.3}>
                        <DateTimePicker onUpdate={onUpdate} value={value} setRefreshRange={setRefreshRange}/>
                    </Box>
                </Box>
            </div>
        </Toolbar>
    )
}

export default MexToolbar