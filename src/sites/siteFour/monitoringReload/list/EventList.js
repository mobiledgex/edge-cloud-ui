import React from 'react'
import {  Collapse, Divider, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core'
import * as dateUtil from '../../../../utils/date_util'
import './style.css'
import { Icon } from 'semantic-ui-react';

const filters = ['app', 'cluster', 'cloudlet', 'cloudletorg', 'clusterorg', 'apporg']
class Events extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expand: -1
        }
    }

    keys = [
        { serverField: 'mtags' },
        { serverField: 'name' },
        { serverField: 'org' },
        { serverField: 'type' },
        { serverField: 'region' },
        { serverField: 'timestamp' },
        { serverField: 'type' },
    ]

    expandMenu = (id) => {
        this.setState(prevState => ({ expand: prevState.expand === id ? -1 : id }))
    }

    
    searchFilterValid = (mtags, filter)=>{
        let search  = filter.search
        let valid = []
        filters.map(filter => {
            if (mtags[filter]) {
                valid.push(mtags[filter].toLowerCase().includes(search.toLowerCase()))
            }
        })
        return valid.includes(true)
    }

    render() {
        const { header, eventData, filter, colors} = this.props
        const { expand } = this.state
        return (
            <div className="event-list-main">
                <div align="left" className="event-list-header">
                    <h3>{header}</h3>
                </div>
                <div style={{ height: 'calc(33vh - 0px)', overflow: 'auto' }}>
                    <List dense={false} >
                        {eventData.map((data, i) => {
                            let mtags = data['mtags']
                            return (
                                this.searchFilterValid(mtags, filter) ? <React.Fragment key={i}>
                                    <ListItem key={i} onClick={() => this.expandMenu(i)}>
                                        <ListItemIcon>
                                            <div style={{ width: 30, height: 30, borderRadius: 50, backgroundColor: colors[i], color: 'white', textAlign: 'center', padding: 6, fontWeight: 900 }}><b>{data['name'].charAt(0).toUpperCase()}</b></div>
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-wifi" secondary={`${mtags['app']} [${mtags['appver']}]`} primary={data['name']} />
                                        <ListItemSecondaryAction>
                                            <code style={{ marginRight: 15, marginBottom: 15 }}>{dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, data['timestamp'])}</code>
                                            <Icon name={expand === i ? "chevron down" : "chevron up"} />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Collapse in={expand === i} timeout="auto" unmountOnExit>
                                        <List component="div" style={{ marginLeft: 0 }}>
                                            <ListItem><ListItemText primary={`Hostname: ${mtags['hostname']}`} /></ListItem>
                                            <ListItem><ListItemText primary={`Line no: ${mtags['lineno']}`} /></ListItem>
                                            <ListItem> <ListItemText primary={`Span ID: ${mtags['spanid']}`} /></ListItem>
                                            <ListItem> <ListItemText primary={`State: ${mtags['state']}`} /></ListItem>
                                            <ListItem> <ListItemText primary={`Trace ID: ${mtags['traceid']}`} /></ListItem>
                                        </List>
                                    </Collapse>
                                    <Divider component="li" />
                                </React.Fragment> : null)
                        })}
                    </List>
                </div>
            </div>
        )
    }
}

export default Events