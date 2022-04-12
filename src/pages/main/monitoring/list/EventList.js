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
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { Collapse, Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import * as dateUtil from '../../../../utils/date_util'
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { VariableSizeList } from 'react-window';
import './style.css'

class Events extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expand: -1
        }
        this.list = null
    }

    expandMenu = (id) => {
        this.list.resetAfterIndex(0);
        this.setState(prevState => ({ expand: prevState.expand === id ? -1 : id }))
    }

    showEventLog = () => {
        this.props.handleShowAuditLog({ type: 'event' })
    }

    getItemSize = (index) => {
        let expand = this.state.expand
        return expand === index ? this.props.itemExpandSize : this.props.itemSize
    }

    renderRow = (virtualProps) => {
        const { data, index, style } = virtualProps;
        const { eventData, colors, keys } = this.props
        let expand = data.expand

        let event = eventData[index]
        let mtags = event['mtags']

        return (
            <div style={style}>
                    <React.Fragment>
                        <ListItem onClick={() => this.expandMenu(index)}>
                            <ListItemIcon>
                                <div style={{ width: 30, height: 30, borderRadius: 50, backgroundColor: colors[index], color: 'white', textAlign: 'center', padding: 6, fontWeight: 900 }}><b>{event['name'].charAt(0).toUpperCase()}</b></div>
                            </ListItemIcon>
                            <ListItemText id="switch-list-label-wifi" primary={event['name']} secondary={
                                <React.Fragment>
                                    {this.props.header(mtags)}
                                    <br />
                                    {dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, event['timestamp'])}
                                </React.Fragment>} />
                            {expand === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </ListItem>
                        <Collapse in={expand === index} timeout="auto" unmountOnExit>
                            <List component="div" style={{ marginLeft: 60 }} dense={true}>
                                {keys.map((key, j) => {
                                    let value = mtags[key.serverField]
                                    if (key.summary && value) {
                                        return <ListItem key={j}><ListItemText primary={`${key.label}: ${value}`} /></ListItem>
                                    }
                                })}
                            </List>
                        </Collapse>
                        <Divider component="li" />
                    </React.Fragment>
            </div>
        );
    }

    render() {
        const { expand } = this.state
        const { eventData, showMore } = this.props
        return (
            <div className="event-list-main" id="event-list">
                <div align="left" className="event-list-header">
                    <h3 className='chart-header'>Events</h3>
                </div>
                {
                    eventData.length > 0 ?
                        <div>
                            <div className='event-list-data'>
                                <List dense={false} >
                                    <VariableSizeList height={showMore ? 200 : 240} itemSize={this.getItemSize} itemCount={eventData.length} itemData={{ expand }}
                                        ref={ref => (this.list = ref)}>
                                        {this.renderRow}
                                    </VariableSizeList>
                                </List>
                            </div>
                        </div> :
                        <div align="center">
                            <h3 style={{ padding:'90px 0px' }}  className='chart-header'><b>No Data</b></h3>
                        </div>
                }
            </div>
        )
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleShowAuditLog: (data) => { dispatch(actions.showAuditLog(data)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(Events));