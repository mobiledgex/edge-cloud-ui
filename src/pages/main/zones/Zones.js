import React from "react";
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import DataView from '../../../container/DataView';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields } from '../../../services/model/format';
import { Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
//model
import { HELP_ZONES_LIST } from "../../../tutorial";
import { perpetual } from "../../../helper/constant";
import ZoneReg from "./Reg"
import { codeHighLighter } from '../../../hoc/highLighter/highLighter';
import { showSelfZone, keys, showSelfFederatorZone } from "../../../services/modules/zones"
import { deleteSelfZone } from "../../../services/modules/zones/zones";

class ZoneList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null,
            open: false,
        },
            this.keys = keys()
        this.apiKey = undefined
    }

    resetView = () => {
        if (this._isMounted) {
            this.updateState({ currentView: null })
        }
    }

    onRegClose = (isEdited) => {
        this.resetView()
    }
    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_ZONES,
            headerLabel: 'Zones',
            requestType: [showSelfZone, showSelfFederatorZone],
            sortBy: [fields.region],
            isRegion: true,
            keys: this.keys,
            onAdd: this.onAdd,
            nameField: fields.zoneId,
            viewMode: HELP_ZONES_LIST,
            grouping: true
        })
    }

    onAdd = (type) => {
        this.updateState({ currentView: <ZoneReg onClose={this.onRegClose} /> });
    }

    handleClose = () => {
        this.updateState({
            open: false
        })
        this.apiKey = undefined // to reset when there is no page reload
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteSelfZone, type: 'Delete' },
        ]
    }

    render() {
        const { tableHeight, currentView, open } = this.state
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <DataView id={perpetual.PAGE_ZONES} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} onClick={this.onListViewClick} tableHeight={tableHeight} handleListViewClick={this.handleListViewClick} />
                <Dialog open={open} onClose={this.onClose} aria-labelledby="profile" disableEscapeKeyDown={true}>
                    <DialogTitle id="profile">
                        <div style={{ float: "left", display: 'inline-block' }}>
                            <h3 style={{ fontWeight: 700 }}>API Key</h3>
                        </div>
                    </DialogTitle>
                    <DialogContent style={{ width: 600 }}>
                        <div style={{ display: 'inline' }}>{codeHighLighter(this.apiKey)}</div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} style={{ backgroundColor: 'rgba(118, 255, 3, 0.7)' }} size='small'>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    componentDidMount() {
        this._isMounted = true
        this.props.handleViewMode(HELP_ZONES_LIST)
    }

};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ZoneList));