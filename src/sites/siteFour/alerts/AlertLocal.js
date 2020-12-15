import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Chip, Collapse, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { PAGE_ALERTS, formatData, regions } from '../../../constant';
import { showAlertKeys } from '../../../services/model/alerts'
import * as actions from '../../../actions';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { fields } from '../../../services/model/format';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import DoneAllIcon from '@material-ui/icons/DoneAll';

class AlertLocal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expand: -1
        }
        this.regions = regions()
    }

    renderAlertPreferences = () => {
        this.props.handleClose()
        this.props.handlePageRedirect(PAGE_ALERTS)
    }

    renderToolbar = () => (
        <div className="alert-toolbar ">
            <div className="alert-toolbar-left">
                <Typography variant="h6">Alerts</Typography>
            </div>
            <div className="alert-toolbar-right">
                <IconButton size="small" onClick={this.renderAlertPreferences}><SettingsOutlinedIcon /></IconButton>
            </div>
        </div>
    )

    expandMenu = (id) => {
        this.setState(prevState => ({ expand: prevState.expand === id ? -1 : id }))
    }

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
            <div style={{width:500}}>
                <h4><b>{data[fields.alertname]}</b>{this.renderState(data)}</h4>
                <div style={{ marginTop: 5 }}></div>
                <Chip component="div" variant="outlined" size="small" label={`Region: ${data[fields.region]}`} style={{ marginBottom: 5, marginRight: 5 }} />
                {data[fields.appDeveloper] ? <Chip component="div" variant="outlined" size="small" label={`Developer: ${data[fields.appDeveloper]}`} style={{ marginBottom: 5, marginRight: 5 }} /> : null}
                {data[fields.appName] ? <Chip variant="outlined" size="small" label={`App: ${data[fields.appName]} [${data[fields.version] ? data[fields.version] : 'NA'}]`} style={{ marginBottom: 5, marginRight: 5 }} /> : null}
                {data[fields.clusterName] ? <Chip variant="outlined" size="small" label={`Cluster: ${data[fields.clusterName]}`} style={{ marginBottom: 5, marginRight: 5 }} /> : null}
                {data[fields.cloudletName] ? <Chip variant="outlined" size="small" label={`Cloudlet: ${data[fields.cloudletName]}`} style={{ marginBottom: 5, marginRight: 5 }} /> : null}
                {data[fields.operatorName] ? <Chip variant="outlined" size="small" label={`Operator: ${data[fields.operatorName]}`} style={{ marginBottom: 5, marginRight: 5 }} /> : null}
            </div>
        )
    }

    renderList = () => {
        const { data } = this.props
        const { expand } = this.state
        return (
            <List dense={false} >
                {Object.keys(data).map(region => {
                    return data[region].map((item, i) => {
                        return (
                            <React.Fragment key={i}>
                                <ListItem key={i} onClick={() => this.expandMenu(i)}>
                                    <ListItemText id="switch-list-label-wifi" primary={data['name']} />
                                    {this.header(item)}
                                    {expand === i ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </ListItem>
                                <Collapse in={expand === i} timeout="auto" unmountOnExit>
                                    <List component="div" dense={true} style={{ marginLeft: 4 }}>
                                        {showAlertKeys().map((key, j) => {
                                            let value = item[key.field]
                                            if (key.summary && value) {
                                                return <ListItem key={j}><ListItemText primary={<p><b>{key.label}</b> {`: ${formatData(key, value)}`}</p>} /></ListItem>
                                            }
                                        })}
                                    </List>
                                </Collapse>
                                <Divider component="li" />
                            </React.Fragment>)
                    })
                })}
            </List>
        )
    }

    render() {
        return (
            <React.Fragment>
                {this.renderToolbar()}
                <br />
                <div className='alert-local-list'>
                    {this.renderList()}
                </div>
            </React.Fragment>
        )
    }

    componentDidMount() {
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handlePageRedirect: (mode, msg) => { dispatch(actions.redirectPage(mode, msg)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(AlertLocal));