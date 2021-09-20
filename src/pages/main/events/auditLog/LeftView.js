import React from 'react'
import { Box, Divider, Grid, Tooltip } from '@material-ui/core';
import * as dateUtil from '../../../../utils/date_util'
import { FixedSizeList, VariableSizeList } from 'react-window';
import { Icon } from '../../../../hoc/mexui';
import Toolbar, { ACION_SEARCH, ACTION_CLOSE, ACTION_PICKER, ACTION_REFRESH } from '../helper/toolbar/Toolbar';
import { timeRangeInMin } from '../../../../hoc/mexui/Picker';
import { auditKeys, DEFAULT_DURATION_MINUTES, eventKeys } from '../helper/constant';
import { NoData } from '../../../../helper/formatter/ui';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import { AUDIT } from '../../../../helper/constant/perpetual';
import { fields } from '../../../../services/model/format';
import AuditView from './AuditView';
import EventView from './EventView';
import ServerFilter, { ACTION_FILTER } from './ServerFilter';
import { toFirstUpperCase } from '../../../../utils/string_utils';
import uuid from 'uuid'
import { removeObject } from '../../../../helper/ls';

const tip = [
    <p>By default audit/event log provides current logs with default limit of 25</p>,
    <p>Click on <FilterListRoundedIcon style={{ verticalAlign: -6 }} />  icon to apply additional filters</p>
]

const formatURL = (logName) => {
    let item = '';
    try {
        let nameArray = logName.substring(1).split("/").filter(name => name != 'ws');

        if (nameArray[2] === 'login') {
            item = nameArray[2]
        } else if (nameArray[2] === 'auth') {
            if (nameArray[3] === 'ctrl') {
                item = nameArray[4]
            } else if (nameArray[3] === 'restricted') {
                item = nameArray[3] + nameArray[4].charAt(0).toUpperCase() + nameArray[4].slice(1) + nameArray[5].charAt(0).toUpperCase() + nameArray[5].slice(1)
            } else {
                item = nameArray[3] + nameArray[4].charAt(0).toUpperCase() + nameArray[4].slice(1)
            }
        } else {
            item = nameArray[2]
        }
        item = item.charAt(0).toUpperCase() + item.slice(1)
    }
    catch (e) {

    }
    return item
}

class AuditLogView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataList: props.dataList,
            activeIndex: 0,
            infiniteHeight: 200,
            filterText: '',
            reactWindowId: uuid(),
            refreshToolbar:false
        }
        this._isMounted = false
        this.isAudit = props.type === AUDIT
        this.filter = { range: timeRangeInMin(DEFAULT_DURATION_MINUTES), limit: 25 }
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    onFilter = (filterText) => {
        const keys = this.isAudit ? auditKeys : eventKeys
        filterText = filterText ? filterText.toLowerCase() : this.state.filterText
        let dataList = this.props.dataList.filter(data => {
            let valid = false
            let filterCount = 0
            for (const key of keys) {
                if (key.filter) {
                    const value = key.mtags ? data.mtags[key.field] : data[key.field]
                    filterCount++
                    if (value) {
                        valid = value.toLowerCase().includes(filterText)
                    }
                    if (valid) {
                        break;
                    }
                }
            }
            return filterCount === 0 || valid
        })
        this.updateState({ dataList, filterText, activeIndex: 0, reactWindowId: uuid() })
    }

    onAuditClick = (activeIndex) => {
        this.updateState({ activeIndex: activeIndex })
    }

    formatData = (key, values, mtags) => {
        const value = key.mtags ? mtags[key.field] : values[key.field]
        if (value) {
            if (key.format) {
                switch (key.field) {
                    case 'timestamp':
                        return dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, value)
                    case 'app':
                        return `${value} [${mtags['appver']}]`
                    case 'cluster':
                        return `${value} [${mtags['clusterorg']}]`
                    case 'cloudlet':
                        return `${value} [${mtags['cloudletorg']}]`
                    case fields.name:
                        return formatURL(value)
                }
            }
            return value
        }
    }

    renderRow = (virtualProps) => {
        const { data, index, style } = virtualProps;
        const { height } = style
        const { keys, dataList } = data
        const values = dataList[index]
        const mtags = values.mtags
        return (
            <div key={index} style={style}>
                <Grid container style={{ cursor: 'pointer', borderRadius: 5, padding: 10, backgroundColor: this.state.activeIndex === index ? '#1E2123' : 'transparent' }} onClick={() => this.onAuditClick(index)}>
                    <Grid item xs={11}>
                        {
                            keys.map((key, i) => {
                                if (key && key.visible) {
                                    const value = this.formatData(key, values, mtags)
                                    return (
                                        value ? <React.Fragment key={i}>
                                            <div style={{ fontSize: 14, height: 25, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                <strong>{`${key.detailedView && key.visible ? 'Current' : ''} ${key.label}`}</strong>
                                                <Tooltip title={<strong style={{ fontSize: 13 }}>{value}</strong>}>
                                                    <span style={{ fontWeight: 500 }}>{`: ${value}`}</span>
                                                </Tooltip>
                                            </div>
                                        </React.Fragment> : null)
                                }
                            })
                        }
                    </Grid>
                    <Grid item xs={1}>
                        {this.state.activeIndex === index ? <div style={{ position: 'absolute', top: height / 2.5, right: 10 }} align='right'>
                            <Icon>arrow_forward_ios</Icon>
                        </div> : null}
                    </Grid>
                </Grid>
                <Divider />
            </div>
        );
    }

    auditView = (dataList) => {
        if (dataList.length > 0) {
            return (
                <FixedSizeList className={'no-scrollbars'} height={this.state.infiniteHeight} itemSize={172} itemCount={dataList.length} itemData={{ keys: auditKeys, dataList }}>
                    {this.renderRow}
                </FixedSizeList>
            )
        }
    }

    eventView = (dataList) => {
        if (dataList.length > 0) {
            const keys = eventKeys
            const getItemSize = index => {
                let values = dataList[index]
                let length = 1
                keys.map(key => {
                    if (key.visible) {
                        const value = key.mtags ? values.mtags[key.field] : values[key.field]
                        if (value) {
                            length++
                        }
                    }
                })
                return (
                    length * 24.5
                )
            };
            return (
                <VariableSizeList key={this.state.reactWindowId}  className={'no-scrollbars'} height={this.state.infiniteHeight} itemSize={getItemSize} itemCount={dataList.length} itemData={{ keys, dataList }}>
                    {this.renderRow}
                </VariableSizeList>
            )
        }
    }

    onToolbarChange = (action, value) => {
        const { refreshToolbar } = this.state
        switch (action) {
            case ACION_SEARCH:
                this.onFilter(value)
                break;
            case ACTION_REFRESH:
                this.filter.range = timeRangeInMin(this.filter.range.duration)
                this.props.fetchData({ range: this.filter.range  })
                this.setState({ refreshToolbar: !refreshToolbar })
                break;
            case ACTION_CLOSE:
                this.props.close()
                break;
            case ACTION_PICKER:
                this.filter.range = value
                this.props.fetchData({ range: value })
                this.setState({ refreshToolbar: !refreshToolbar })
                break;
            case ACTION_FILTER:
                this.filter = value
                this.props.fetchData(value)
                this.setState({ refreshToolbar: !refreshToolbar })
                break;

        }
    }

    render() {
        const { activeIndex, dataList } = this.state
        const { endtime, loading, type, orgList, handleError } = this.props
        return (
            <React.Fragment>
                <Toolbar type={type} header={`${toFirstUpperCase(type)} Logs`} tip={tip} onChange={this.onToolbarChange} loading={loading} filter={this.filter}>
                    <Box>
                        <ServerFilter type={type} onChange={this.onToolbarChange} orgList={orgList} filter={this.filter} error={handleError} />
                    </Box>
                </Toolbar>
                <div style={{ height: 'calc(100vh - 50px)' }} id='event_log'>
                    {dataList.length > 0 ? <Grid container>
                        <Grid item xs={3} style={{ display: 'inline-block', height: '100%', backgroundColor: '#292C33', verticalAlign: 'top', overflow: 'auto' }}>
                            {type === AUDIT ? this.auditView(dataList) : this.eventView(dataList)}
                            <div style={{ paddingLeft: 20, position: 'absolute', bottom: 5 }} align="left">
                                <p style={{ fontSize: 14 }}><strong>Last Requested</strong>{`: ${dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, endtime)}`}</p>
                            </div>
                        </Grid>
                        <Grid item xs={9} style={{ height: 'calc(100vh - 50px)', display: 'inline-block', backgroundColor: '#1E2123', paddingLeft: 2 }}>
                            {this.isAudit ? <AuditView data={dataList[activeIndex]} /> : <EventView data={dataList[activeIndex]} />}
                        </Grid>
                    </Grid> : <NoData />
                    }
                </div>
            </React.Fragment>
        )
    }

    updateHeight = () => {
        let element = document.getElementById('event_log')
        if (element) {
            this.updateState({ infiniteHeight: document.getElementById('event_log').clientHeight - 43 })
        }
    }

    componentDidUpdate(preProps, preState) {
        const { toggle } = this.props
        if (toggle !== preProps.toggle) {
            this.onFilter()
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.updateHeight()
        window.addEventListener("resize", this.updateHeight)
    }

    componentWillUnmount() {
        removeObject(`${this.props.type}_logs`)
        this._isMounted = false
    }
}

export default AuditLogView;