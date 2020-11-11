import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Collapse, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { PAGE_ALERTS } from '../../../constant';
import {showAlertKeys} from '../../../services/model/alerts'
import * as actions from '../../../actions';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class AlertLocal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expand: -1
        }
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

    header = (data) => {
        let alertName = data['alertname']
        return ( 
            <React.Fragment>
                {showAlertKeys().map(key=>{
                    return key.visible ? data[key.field] : null
                })}
            </React.Fragment>
        )
    }

    renderList = () => {
        const { data } = this.props
        const { expand } = this.state
        return (
            <List dense={false} >
                {data.map((item, i) => {
                    return (
                        <React.Fragment key={i}>
                            <ListItem key={i} onClick={() => this.expandMenu(i)}>
                                {/* <ListItemIcon>
                                    <div style={{ width: 30, height: 30, borderRadius: 50, backgroundColor: colors[i], color: 'white', textAlign: 'center', padding: 6, fontWeight: 900 }}><b>{data['name'].charAt(0).toUpperCase()}</b></div>
                                </ListItemIcon> */}
                                <ListItemText id="switch-list-label-wifi" primary={data['name']} secondary={
                                    <React.Fragment>
                                        {this.header(item)}
                                    </React.Fragment>} />
                                {expand === i ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ListItem>
                            <Collapse in={expand === i} timeout="auto" unmountOnExit>
                                <List component="div" dense={true}>
                                    {showAlertKeys().map((key, j) => {
                                        let value = item[key.field]
                                        if (key.summary && value) {
                                            return <ListItem key={j}><ListItemText primary={`${key.label}: ${value}`} /></ListItem>
                                        }
                                    })}
                                </List>
                            </Collapse>
                            <Divider component="li" />
                        </React.Fragment>)
                })}
            </List>
        )
    }

    render() {
        return (
            <React.Fragment>
                {this.renderToolbar()}
                <br/>
                {this.renderList()}
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