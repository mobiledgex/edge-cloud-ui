import React from 'react'
import { connect } from 'react-redux';
import { perpetual } from '../../../helper/constant';
import DataView from '../../../hoc/datagrid/DataView';
import { localFields } from '../../../services/fields';
import { keys, showReporter, deleteReporter } from '../../../services/modules/reporter';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import { Box } from '@material-ui/core';
import Reg from './Reg'
import Generated from './Generated';
import Generator from './Generator';
import { lightGreen } from '@material-ui/core/colors';
import { IconButton } from '../../../hoc/mexui'
import { dateFormatter, uiFormatter } from '../../../helper/formatter';
import { redux_org } from '../../../helper/reduxData';
import { showOrganizations } from '../../../services/modules/organization';
import LogoSpinner from '../../../hoc/loader/LogoSpinner'
import { service } from '../../../services';
import { FORMAT_FULL_DATE } from '../../../utils/date_util';
import { responseValid } from '../../../services/config';

class Reporter extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            currentView: undefined,
            open: false,
            orgList: [],
            loading:true
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
        { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onReg, type: 'Edit' },
        { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteReporter, type: 'Edit' }
    ])

    customToolbar = () => {
        const { orgList } = this.state
        return (
            <Generator orgList={orgList} />
        )
    }

    toolbarAction = () => {
        return (
            <Box style={{display: 'flex', alignItems: 'center' }}>
                <IconButton tooltip='History' style={{ marginTop: -2 }} onClick={() => { this.updateState({ open: true }) }}><ListAltOutlinedIcon style={{ color: lightGreen['A700'] }} /></IconButton>
            </Box>
        )
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === localFields.status) {
            return uiFormatter.reporterStatus(key, data, isDetail)
        }
        else if (key.field === localFields.startdate || key.field === localFields.nextDate) {
            return dateFormatter.formatDate(FORMAT_FULL_DATE, data[key.field], data[localFields.timezone])
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_REPORTER,
            headerLabel: 'Report Scheduler',
            nameField: localFields.name,
            requestType: [showReporter],
            sortBy: [localFields.name],
            onAdd: this.onReg,
            keys: this.keys,
            formatData: this.dataFormatter
        })
    }

    skel = () => {
        <React.Fragment>
            <Skeleton animation="wave" variant="rect" />
        </React.Fragment>
    }

    render() {
        const { currentView, open, orgList, loading } = this.state
        return (
            (
                redux_org.isOperator(this) || !loading) ?
                <React.Fragment>
                    <DataView id={perpetual.PAGE_REPORTER} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} actionRoles={[perpetual.ADMIN_MANAGER, perpetual.OPERATOR_MANAGER]} requestInfo={this.requestInfo} toolbarAction={this.toolbarAction} customToolbar={this.customToolbar} tableHeight={263} />
                    <Generated open={open} orgList={orgList} close={() => { this.updateState({ open: false }) }} />
                </React.Fragment> : <LogoSpinner />
        )
    }

    fetchOrgs = async () => {
        let mc = await service.authSyncRequest(this, showOrganizations(this, { type: perpetual.OPERATOR }))
        if (responseValid(mc)) {
            const dataList = mc.response.data
            const orgList = dataList.map(data => (data[localFields.organizationName]))
            this.updateState({ orgList, loading: false })
        }
    }

    componentDidMount() {
        this._isMounted = true
        if (redux_org.isAdmin(this)) {
            this.fetchOrgs()
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default connect(mapStateToProps, null)(Reporter);