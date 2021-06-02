import React from 'react'
import * as constant from '../../../constant';
import { ACTION_DELETE, ACTION_UPDATE } from '../../../constant/actions';
import DataView from '../../../container/DataView';
import { fields } from '../../../services/model/format';
import { keys, showReporter, deleteReporter } from '../../../services/model/reporter';
import Reg from './ReporterReg'

class Reporter extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            currentView: undefined
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
            this.updateState({ currentView: <Reg onClose={this.resetView} data={data} id={id}/> })
        }
    }

    actionMenu = () => ([
        { id: ACTION_UPDATE, label: 'Update', onClick: this.onReg, type: 'Edit' },
        { id: ACTION_DELETE, label: 'Delete', onClick: deleteReporter, type: 'Edit' }
    ])

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
        const { currentView } = this.state
        return (
            <DataView id={constant.PAGE_REPORTER} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} />
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