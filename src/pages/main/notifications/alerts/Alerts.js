/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Chip, Divider, IconButton, List, ListItem, Typography, Tooltip } from '@material-ui/core'
import { showAlertKeys } from '../../../../services/modules/alerts';
import { Icon } from '../../../../hoc/mexui';
import { localFields } from '../../../../services/fields';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import NotificationImportantOutlinedIcon from '@material-ui/icons/NotificationImportantOutlined';
import { labelFormatter } from '../../../../helper/formatter';
import { FORMAT_FULL_DATE_TIME, time } from '../../../../utils/date_util';
import SearchFilter from '../../../../hoc/filter/SearchFilter';
import { FixedSizeList } from 'react-window';

const MChip = (props) => {
    const { icon, label, value } = props
    return (
        value ?
            <Chip component="div" variant="outlined" label={
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 900 }}>
                    {icon ? <Icon>{icon}</Icon> : `${label}:`}<span style={{ marginLeft: 3, fontWeight: 400 }}>{value}</span>
                </div>
            } style={{ marginBottom: 5, marginRight: 5 }} />
            : null
    )
}
class AlertLocal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataList: undefined
        }
        this.regions = props.regions
    }

    onClose = () => {
        this.props.handleClose()
    }

    renderToolbar = () => (
        <div className="alert-toolbar">
            <div className="alert-toolbar-left">
                <Typography>
                    <NotificationImportantOutlinedIcon style={{ position: 'relative', top: '5px', marginRight: 10 }} />
                    <strong>Alerts</strong>
                </Typography>
            </div>
            <div className="alert-toolbar-right">
                <IconButton size="small" onClick={this.onClose}><Icon>close</Icon></IconButton>
            </div>
        </div>
    )

    renderState = (data) => {
        let label = 'Firing'
        let icon = <WhatshotIcon />
        let color = '#FF7043'
        switch (data[localFields.state]) {
            case 'resolved':
                icon = <DoneAllIcon />
                color = '#66BB6A'
                label = 'Resolved'
                break;

        }
        return <Chip component="div" variant="outlined" size="small" icon={icon} label={label} style={{ marginLeft: 5, backgroundColor: color }} />
    }

    header = (data) => {
        return (
            <div style={{ width: 500 }}>
                <h4><b>{data[localFields.title] ? data[localFields.title] : data[localFields.alertname]}</b>{this.renderState(data)}</h4>
                <h5 style={{ color: '#A9A9A9', width: 440, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>{data[localFields.description]}</h5>
                <div style={{ marginTop: 10 }}></div>
                <MChip label={'Region'} value={data[localFields.region]} />
                <MChip icon='access_alarm' value={time(FORMAT_FULL_DATE_TIME, parseInt(data[localFields.activeAt] + '000'))} />
            </div>
        )
    }

    dataFormatter = (key, value) => {
        if (key.field === localFields.activeAt) {
            return time(FORMAT_FULL_DATE_TIME, parseInt(value[key.field] + '000'))
        }
        else if (key.field === localFields.status) {
            return labelFormatter.healthCheck(value[key.field])
        }
        else if (key.field === localFields.appName) {
            return `${value[localFields.appName]} - ${value[localFields.version]} [${value[localFields.appDeveloper]}]`
        }
        else if (key.field === localFields.cloudletName) {
            return `${value[localFields.cloudletName]} [${value[localFields.operatorName]}]`
        }
        else if (key.field === localFields.clusterName) {
            return `${value[localFields.clusterName]} [${value[localFields.clusterdeveloper]}]`
        }
    }


    renderMore = (item) => {
        return (
            <React.Fragment>
                {showAlertKeys().map((key, j) => {
                    let value = item[key.field]
                    if (key.summary && value) {
                        return (
                            <div key={j} style={{ lineHeight: 1.5, marginBottom: 5, fontSize: 13, whiteSpace: 'initial' }}>
                                <span key={j}><b>{`${key.label}:`}</b> {key.format ? this.dataFormatter(key, item) : value}</span>
                            </div>
                        )
                    }
                })}
            </React.Fragment>
        )
    }

    renderRow = (virtualProps) => {
        const { dataList } = this.state
        const { index, style } = virtualProps;
        let item = dataList[index]
        return (
            <div style={style}>
                {
                    <React.Fragment key={index}>
                        <Tooltip title={this.renderMore(item)} placement="left-start" arrow>
                            <ListItem>
                                {this.header(item)}
                            </ListItem>
                        </Tooltip>
                        <Divider component="li" />
                    </React.Fragment>
                }
            </div>
        );
    }

    renderList = () => {
        const { dataList } = this.state
        return (
            dataList && dataList.length > 0 ? <List dense={false} >
                <FixedSizeList height={350} itemSize={120} itemCount={dataList.length}>
                    {this.renderRow}
                </FixedSizeList>
            </List> : null
        )
    }

    filterData = (keys, dataList, filterText) => {
        let newData = []
        newData = dataList.filter(item => {
            let valid = keys.map((key, j) => {
                return key.filter && item[key.field] ? item[key.field].toLowerCase().includes(filterText) : false
            })
            return valid.includes(true)
        })
        this.setState({ dataList: newData })
    }

    onFilter = (value, clear) => {
        let filterText = clear ? '' : value.toLowerCase()
        const { data } = this.props
        this.filterData(showAlertKeys(), data, filterText)
    }

    render() {
        return (
            <React.Fragment>
                {this.renderToolbar()}
                <br />
                <div className='alert-search'>
                    <SearchFilter onFilter={this.onFilter} />
                </div>
                <div>
                    {this.renderList()}
                </div>
            </React.Fragment>
        )
    }

    componentDidMount() {
        this.setState({ dataList: this.props.data })
    }
}

const mapStateToProps = (state) => {
    return {
        regions: state.regionInfo.region
    }
};

export default withRouter(connect(mapStateToProps, null)(AlertLocal));