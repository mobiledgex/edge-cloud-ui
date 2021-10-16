import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Chip, Divider, IconButton, List, ListItem, Typography, Tooltip } from '@material-ui/core'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { regions } from '../../../../constant';
import { showAlertKeys } from '../../../../services/modules/alerts';
import { Icon } from '../../../../hoc/mexui';
import { fields } from '../../../../services/model/format';
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
            <Chip component="div" variant="outlined"  label={
                <div style={{ display: 'flex', alignItems: 'center', fontSize:13, fontWeight:900 }}>
                    {icon ? <Icon>{icon}</Icon> : `${label}:`}<span style={{ marginLeft: 3, fontWeight:400  }}>{value}</span>
                </div>
            } style={{ marginBottom: 5, marginRight: 5 }} />
            : null
    )
}
class AlertLocal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expand: -1,
            dataList: undefined
        }
        this.typingTimeout = undefined
        this.regions = regions()
    }

    renderAlertPreferences = () => {
        this.props.handleClose()
        this.props.history.push('/main/alerts')
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
                <IconButton size="small" onClick={this.renderAlertPreferences}><SettingsOutlinedIcon /></IconButton>
            </div>
        </div>
    )

    renderState = (data) => {
        let label = 'Firing'
        let icon = <WhatshotIcon />
        let color = '#FF7043'
        switch (data[fields.state]) {
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
                <h4><b>{data[fields.title] ? data[fields.title] : data[fields.alertname]}</b>{this.renderState(data)}</h4>
                <h5 style={{ color: '#A9A9A9', width: 440, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>{data[fields.description]}</h5>
                <div style={{ marginTop: 10 }}></div>
                <MChip label={'Region'} value={data[fields.region]} />
                <MChip icon='access_alarm' value={time(FORMAT_FULL_DATE_TIME, parseInt(data[fields.activeAt] + '000'))} />
            </div>
        )
    }

    dataFormatter = (key, value) => {
        if (key.field === fields.activeAt) {
            return time(FORMAT_FULL_DATE_TIME, parseInt(value[key.field] + '000'))
        }
        else if (key.field === fields.status) {
            return labelFormatter.healthCheck(value[key.field])
        }
        else if (key.field === fields.appName) {
            return `${value[fields.appName]} - ${value[fields.version]} [${value[fields.appDeveloper]}]`
        }
        else if (key.field === fields.cloudletName) {
            return `${value[fields.cloudletName]} [${value[fields.operatorName]}]`
        }
        else if (key.field === fields.clusterName) {
            return `${value[fields.clusterName]} [${value[fields.clusterdeveloper]}]`
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
        const { expand, dataList } = this.state
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
                <FixedSizeList height={300} itemSize={120} itemCount={dataList.length}>
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
        this.typingTimeout = undefined
        this.setState({ dataList: newData })
    }

    onFilter = (value, clear) => {
        let filterText = clear ? '' : value.toLowerCase()
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
            this.typingTimeout = undefined
        }
        this.typingTimeout = setTimeout(() => {
            const { data } = this.props
            this.filterData(showAlertKeys(), data, filterText)
        }, 500)
    }

    render() {
        return (
            <React.Fragment>
                {this.renderToolbar()}
                <br />

                <div className='alert-search'>
                    <SearchFilter onFilter={this.onFilter} />
                </div>
                <div className='alert-local-list'>
                    {this.renderList()}
                </div>
            </React.Fragment>
        )
    }

    componentDidMount() {
        this.setState({ dataList: this.props.data })
    }
}

export default withRouter(connect(null, null)(AlertLocal));