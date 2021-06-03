import React from 'react'
import * as constant from '../../../constant';
import { ACTION_DELETE, ACTION_UPDATE } from '../../../constant/actions';
import DataView from '../../../container/DataView';
import { fields } from '../../../services/model/format';
import { keys, showReporter, deleteReporter } from '../../../services/model/reporter';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import { Box } from '@material-ui/core';
import Reg from './ReporterReg'
import Generated from './Generated';
import { lightGreen } from '@material-ui/core/colors';
import { IconButton } from '../../../hoc/mexui'

class Reporter extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            currentView: undefined,
            open: false
        }
        this._isMounted = false
        this.keys = keys()
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    resetView = () => {
        if (this._isMounted) {
            this.updateState({ currentView: undefined })
        }
    }

    onReg = (action, data) => {
        if (this._isMounted) {
            const id = action ? action.id : undefined
            this.updateState({ currentView: <Reg onClose={this.resetView} data={data} id={id} /> })
        }
    }

    actionMenu = () => ([
        { id: ACTION_UPDATE, label: 'Update', onClick: this.onReg, type: 'Edit' },
        { id: ACTION_DELETE, label: 'Delete', onClick: deleteReporter, type: 'Edit' }
    ])

    toolbarAction = () => {
        return (
            <Box>
                <IconButton tooltip='History' style={{ marginTop: -11 }} onClick={() => { this.updateState({ open: true }) }}><ListAltOutlinedIcon style={{ color: lightGreen['A700'] }} /></IconButton>
            </Box>)
    }

    requestInfo = () => {
        return ({
            id: constant.PAGE_REPORTER,
            headerLabel: 'Report Scheduler',
            nameField: fields.name,
            requestType: [showReporter],
            sortBy: [fields.name],
            onAdd: this.onReg,
            keys: this.keys
        })
    }

    render() {
        const { currentView, open } = this.state
        return (
            <React.Fragment>
                <DataView id={constant.PAGE_REPORTER} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} toolbarAction={this.toolbarAction} />
                <Generated open={open} close={() => { this.updateState({ open: false }) }} />
            </React.Fragment>
        )
    }

    componentDidUpdate(preProps, preState) {

    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}


export default Reporter