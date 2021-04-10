
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../../../../actions';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
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
        startDate: dateUtil.currentDate(),
        endDate: dateUtil.currentDate(),
        limit: 25,
        renderTags: [],
        hideFilter: false,
        tags: {},
        help: false
    }
}

const auditHelp = [
    <p>By default audit/event log provides current logs with default limit of 25 which is refreshed at a fixed interval</p>,
    <p>Click on <FilterListRoundedIcon style={{ verticalAlign: -6 }} />  icon to fetch specific data</p>,
    <p>Maximum 24 hours data can be fetched</p>
]
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

    handleStartDate = (startDate) => {
        this.setState({ startDate });
    };

    handleEndDate = (endDate) => {
        this.setState({ endDate });
    };

    handleLimit = (e) => {
        let limit = e.target.value.trim()
        this.setState({ limit });
    };

    onSubmit = () => {
        const { startDate, endDate, limit, tags } = this.state
        let st = moment(startDate).format(dateUtil.FORMAT_DATE_24_HH_mm) + ':00'
        let et = moment(endDate).format(dateUtil.FORMAT_DATE_24_HH_mm) + ':59'

        if (dateUtil.isAfter(st, et)) {
            this.props.handleAlertInfo('error', 'Start date cannot be greater than end date')
        }
        else if(dateUtil.diff(st, et) > dateUtil.ONE_DAY){
            this.props.handleAlertInfo('error', 'Date difference cannot be greater than one day')
        }
        else {

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
        const { startDate, endDate, expanded, limit, renderTags, tags, hideFilter, help } = this.state
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
                                <Help data={auditHelp} />
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
                                    <div style={{ width: 170 }}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDateTimePicker
                                                value={startDate}
                                                disableFuture
                                                variant="inline"
                                                onChange={(date) => { this.handleStartDate(date) }}
                                                label="From"
                                                format='yyyy/MM/dd HH:mm'
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change from date',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </div>
                                    <div style={{ width: 170 }}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDateTimePicker
                                                value={endDate}
                                                disableFuture
                                                variant="inline"
                                                onChange={(date) => { this.handleEndDate(date) }}
                                                label="To"
                                                format='yyyy/MM/dd HH:mm'
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change to date',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </div>
                                </Grid>
                                <Grid container justify="space-around">
                                    <div style={{ width: 170, marginTop: 15 }}>
                                        <TextField
                                            label="Limit"
                                            fullWidth
                                            type="number"
                                            value={limit}
                                            onChange={this.handleLimit}
                                            placeholder={'Search'} />
                                    </div>
                                    <div style={{ width: 160 }}>

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

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(MaterialUIPickers));