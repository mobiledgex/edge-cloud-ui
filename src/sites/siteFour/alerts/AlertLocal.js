import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { IconButton, Typography } from '@material-ui/core'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { PAGE_ALERTS } from '../../../constant';
import * as actions from '../../../actions';

class AlertLocal extends React.Component {
    constructor(props) {
        super(props)
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

    render() {
        return (
            <React.Fragment>
                {this.renderToolbar()}
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