
import React from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { TextField, Button, Grid, Accordion, AccordionSummary, AccordionDetails, IconButton, Typography, Box, Divider } from '@material-ui/core';
import * as dateUtil from '../../../../utils/date_util'
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import CloseIcon from '@material-ui/icons/CloseRounded';
import Tags from './Tags'
import uuid from 'uuid'
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import ReplayOutlinedIcon from '@material-ui/icons/ReplayOutlined';
import moment from 'moment'
import Help from './Help'

const endDate = dateUtil.currentTimeInMilli()
const startDate = dateUtil.subtractMonth(1).valueOf()

const defaultState = () => {
    return {
        selectedDate: new Date(dateUtil.currentTime(dateUtil.FORMAT_FULL_T)),
        starttime: new Date(dateUtil.currentTime(dateUtil.FORMAT_FULL_T)),
        endtime: new Date(dateUtil.currentTime(dateUtil.FORMAT_FULL_T)),
        limit: 25,
        renderTags: [],
        hideFilter: false,
        tags: {},
        help: false
    }
}
class MaterialUIPickers extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            ...defaultState(),
            expanded: false
        }
    }

    handleExpandChange = () => {
        this.setState(prevState => {
            let expanded = !prevState.expanded
            return { expanded, hideFilter: false }
        }, () => {
            this.props.onExpand(this.state.expanded)
        })
    };

    handleDateChange = (selectedDate) => {
        this.setState({ selectedDate });
    };

    handleStartime = (starttime) => {
        this.setState({ starttime });
    };

    handleEndtime = (endtime) => {
        this.setState({ endtime });
    };

    handleLimit = (e) => {
        let limit = e.target.value.trim()
        this.setState({ limit });
    };

    onSubmit = () => {
        const { selectedDate, starttime, endtime, limit, tags } = this.state
        let date = moment(selectedDate).format(dateUtil.FORMAT_FULL_DATE)
        let st = date + ' ' + moment(starttime).format(dateUtil.FORMAT_TIME_HH_mm) + ':00'
        let et = date + ' ' + moment(endtime).format(dateUtil.FORMAT_TIME_HH_mm) + ':59'

        if (dateUtil.isAfter(st, et)) {
            et, st = st, et
            st = dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, dateUtil.subtractDays(1, st))
        }


        let utcst = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, st)
        let utcet = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, et)

        let filter = { starttime: utcst, endtime: utcet, limit: limit.length > 0 ? limit : 25 }

        let tagIdList = Object.keys(tags)
        if (tagIdList.length > 0) {
            let customTags = {}
            tagIdList.map(id => {
                if (tags[id]) {
                    customTags[tags[id]['key']] = tags[id]['value']
                }
            })
            filter['tags'] = customTags
        }
        this.onHideFilter(true)
        this.props.onSelectedDate(`${dateUtil.time(dateUtil.FORMAT_DATE_24_HH_mm, st)} - ${dateUtil.time(dateUtil.FORMAT_DATE_24_HH_mm, et)}`)
        this.props.onFilter(filter)
    }

    onClose = (e) => {
        this.props.onClose()
        e.stopPropagation();
    }

    disableDates = (date) => {
        let time = date.getTime()
        return time < startDate || time > endDate
    }

    onTagsChange = (uuid, key, value) => {
        if (key) {
            this.setState(prevState => {
                let tags = prevState.tags
                tags[uuid] = { key, value }
                return { tags }
            })
        }
    }

    onDelete = (uuid) => {
        this.setState(prevState => {
            let tags = prevState.tags
            let renderTags = prevState.renderTags
            tags[uuid] = undefined
            renderTags = renderTags.filter(tag => {
                return tag !== uuid
            })
            return { tags, renderTags }
        })
    }

    setTagForms = () => {
        this.setState(prevState => {
            let renderTags = prevState.renderTags
            renderTags.push(uuid())
            return { renderTags }
        })
    }

    onHideFilter = (flag) => {
        this.setState(prevState => ({ hideFilter: flag ? flag : !prevState.hideFilter }), () => {
            this.props.onHideFilter(this.state.hideFilter)
        })
    }

    onReset = () => {
        this.setState(defaultState())
    }

    render() {
        const { selectedDate, starttime, endtime, expanded, limit, renderTags, tags, hideFilter, help } = this.state
        const { isOrg } = this.props
        return (
            <React.Fragment>
                <Accordion expanded={expanded}>
                    <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        {isOrg ? null : <div style={{ position: 'absolute', left: 0, width: 100 }}>
                            <IconButton onClick={this.handleExpandChange}>
                                <FilterListRoundedIcon />
                            </IconButton>
                            <button size='small' style={{ backgroundColor: `${expanded ? '#BFC0C2' : '#388E3C'}`, borderRadius: 5, border: 'none', fontSize: 10, padding: '5px 10px 5px 10px' }}>LIVE</button>
                        </div>}
                        <div onClick={(e) => { e.stopPropagation() }} align={'center'} style={{ width: '100%', height: 50 }}>
                            <div style={{ position: 'absolute', right: 0, top: 2 }}>
                                <Help />
                                <IconButton onClick={this.onClose}>
                                    <CloseIcon fontSize={'small'} />
                                </IconButton>
                            </div>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails style={{ backgroundColor: '#292C33' }}>
                        <div style={{ backgroundColor: '#1E2123', borderRadius: 5, marginTop: 5 }}>
                            <Box display="flex">
                                <Box p={1.5} flexGrow={1}>
                                    <Typography>Filter</Typography>
                                </Box>
                                <Box >
                                    <IconButton onClick={this.onReset}>
                                        <ReplayOutlinedIcon />
                                    </IconButton>
                                </Box>
                                <Box >
                                    <IconButton onClick={() => { this.onHideFilter() }}>
                                        {hideFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                </Box>
                            </Box>
                            {hideFilter ? null : <React.Fragment>
                                <Grid container justify="space-around">
                                    <div style={{ width: 150 }}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                format={"MM/dd/yyyy"}
                                                margin="normal"
                                                id="date-picker-inline"
                                                label="Date"
                                                autoOk={true}
                                                value={selectedDate}
                                                //shouldDisableDate={disableDates}
                                                onChange={this.handleDateChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </div>
                                    <div style={{ width: 150, marginTop: 15 }}>
                                        <TextField
                                            label="Limit"
                                            fullWidth
                                            type="number"
                                            value={limit}
                                            onChange={this.handleLimit}
                                            placeholder={'Search'} />
                                    </div>
                                </Grid>
                                <Grid container justify="space-around">
                                    <div style={{ width: 150 }}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardTimePicker
                                                margin="normal"
                                                id="time-picker"
                                                variant="inline"
                                                label="Start Time"
                                                autoOk={true}
                                                value={starttime}
                                                onChange={this.handleStartime}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </div>
                                    <div style={{ width: 150 }}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardTimePicker
                                                margin="normal"
                                                id="time-picker"
                                                variant="inline"
                                                label="End Time"
                                                autoOk={true}
                                                value={endtime}
                                                onChange={this.handleEndtime}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </div>
                                </Grid>
                                <Box display="flex" p={1}>
                                    <Box p={1.5} flexGrow={1}>
                                        <Typography>Tags</Typography>
                                    </Box>
                                    <Box >
                                        <IconButton onClick={this.setTagForms}>
                                            <AddOutlinedIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Divider style={{ marginTop: -15, marginLeft: 15, marginRight: 15 }} />
                                <Grid container justify="space-around" style={{ marginTop: 15 }}>
                                    {renderTags.map((id) => {
                                        return (
                                            <Tags key={id} onChange={this.onTagsChange} uuid={id} onDelete={this.onDelete} data={tags[id]} />
                                        )
                                    })}
                                </Grid>
                                <br />
                                <div align={'right'} style={{ marginRight: 20, marginBottom: 10 }}>
                                    <Button onClick={this.onSubmit}>Fetch</Button>
                                </div>
                            </React.Fragment>}
                        </div>

                    </AccordionDetails>
                </Accordion>
            </React.Fragment>
        )
    };
}

export default MaterialUIPickers