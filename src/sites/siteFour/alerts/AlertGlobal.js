import React from 'react';
import { withRouter } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import { Badge, IconButton } from '@material-ui/core';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { showAlerts, sendRequest } from '../../../services/model/alerts'
import * as constant from '../../../constant'
import AlertLocal from './AlertLocal'
import './style.css'

class AlertGlobal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null,
            dataList: []
        }
        this.regions = constant.regions()
    }

    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget })
    };

    handleClose = () => {
        this.setState({ anchorEl: null })
    };

    render() {
        const { anchorEl, dataList} = this.state
        return (
            <div style={{ marginTop: 5 }}>
                <IconButton onClick={this.handleClick}>
                    <Badge color="secondary" variant="dot">
                        <NotificationsNoneIcon />
                    </Badge>
                </IconButton>
                <Popover
                    id={'Alert Receiver'}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <div style={{ width: 400, height: 500 }}>
                        <AlertLocal data={dataList} handleClose={this.handleClose}/>
                    </div>
                </Popover>
            </div>
        );
    }

    serverResponse = (mc) => {
        if (mc && mc.response && mc.response.status === 200) {
            let data = mc.response.data
            this.setState(prevState => {
                let dataList = prevState.dataList
                dataList = [...dataList, ...data]
                return { dataList }
            })
        }
    }

    componentDidMount() {
        this.regions.map(region => {
            sendRequest(showAlerts({ region }), this.serverResponse)
        })
    }
}

export default withRouter(AlertGlobal)