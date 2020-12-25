import React from 'react'
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { Collapse, Divider, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core'
import * as dateUtil from '../../../../utils/date_util'
import './style.css'
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { VariableSizeList } from 'react-window';

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


    searchFilterValid = (mtags, filter) => {
        let search = filter.search
        let valid = []
        this.props.keys.map(key => {
            if (key.filter && mtags[key.serverField]) {
                valid.push(mtags[key.serverField].toLowerCase().includes(search.toLowerCase()))
            }
        })
        return valid.includes(true)
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
        const { eventData, filter, colors, keys } = this.props
        let expand = data.expand

        let event = eventData[index]
        let mtags = event['mtags']

        return (
            <div style={style}>
                {this.searchFilterValid(mtags, filter) ?
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
                    </React.Fragment> : null}
            </div>
        );
    }

    render() {
        const { expand } = this.state
        const { eventData } = this.props
        return (
            <div className="event-list-main" id="event-list">
                <div align="left" className="event-list-header">
                    <h3>Events</h3>
                </div>
                {
                    eventData.length > 0 ?
                        <div>
                            <div className='event-list-data'>
                                <List dense={false} >
                                    <VariableSizeList height={300} itemSize={this.getItemSize} itemCount={eventData.length} itemData={{ expand }}
                                        ref={ref => (this.list = ref)}>
                                        {this.renderRow}
                                    </VariableSizeList>
                                </List>
                            </div>
                        </div> :
                        <div align="center">
                            <h3 style={{ marginTop: '8vh' }}><b>No Data</b></h3>
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