import React from 'react';
import { Table } from 'semantic-ui-react';
import { IconButton, Grow, Popper, Paper, ClickAwayListener, MenuList, Card } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import ListIcon from '@material-ui/icons/List';

import './styles.css';
import _ from "lodash";
import { fields } from '../services/model/format';
import * as serverData from '../services/model/serverData';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import MexToolbar, { ACTION_CLOSE, ACTION_REGION, ACTION_REFRESH, REGION_ALL, ACTION_NEW, ACTION_MAP } from './MexToolbar';
import MexDetailViewer from '../hoc/dataViewer/DetailViewer';
import MexMessageStream, { CODE_FINISH } from '../hoc/stepper/mexMessageStream';
import { getUserRole } from '../services/model/format';
import MexMessageDialog from '../hoc/dialog/mexWarningDialog'
import Map from '../libs/simpleMaps/with-react-motion/index_clusters';



class MexListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            anchorEl: null,
            currentView: null,
            isDetail: false,
            stepsArray: [],
            showMap: true,
            dialogMessageInfo: {},
            uuid: 0,
            refresh: true,
        };
        this.requestCount = 0;
        this.keys = props.requestInfo.keys;
        this.selectedRowIndex = {};
        this.sorting = false;
        this.selectedRegion = REGION_ALL


        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
    }



    handleSort = clickedColumn => (a) => {

        this.sorting = true;
        const { column, dataList, direction } = this.state
        if ((column !== clickedColumn) && dataList) {
            let sorted = _.sortBy(dataList, [clm => typeof clm[clickedColumn] === 'string' ? String(clm[clickedColumn]).toLowerCase() : clm[clickedColumn]])
            this.setState({
                column: clickedColumn,
                dataList: sorted,
                direction: 'ascending',
            })
            return
        } else {
            let reverse = dataList.reverse()
            this.setState({
                dataList: reverse,
                direction: direction === 'ascending' ? 'descending' : 'ascending',
            })
        }
    }

    checkRole = (form) => {
        let roles = form.roles
        if (roles) {
            let visible  = false
            form.detailView = false
            for (let i = 0; i < roles.length; i++) {
                let role = roles[i]
                if (role === getUserRole()) {
                    visible = true
                    form.detailView = true
                    break;
                }
            }
            form.visible = form.visible ? visible : form.visible
        }
    }

    makeHeader() {
        const { column, direction } = this.state
        return this.keys.map((header, i) => {
            this.checkRole(header)
            if (header.visible) {
                return (
                    <Table.HeaderCell key={i} className={header.sortable ? '' : 'unsortable'} textAlign='center' sorted={column === header.field ? direction : null} onClick={header.sortable ? this.handleSort(header.field) : null}>
                        {header.label}
                    </Table.HeaderCell>)
            }
        })
    }

    detailView = (data) => {
        let additionalDetail = this.props.requestInfo.additionalDetail
        return (
            <Card style={{ height: '90%', backgroundColor: '#2A2C33', overflowY: 'auto' }}>
                <MexDetailViewer detailData={data} keys={this.keys} />
                {additionalDetail ? additionalDetail(data) : null}
            </Card>
        )
    }

    getCellClick = (key, rowIndex) => {
        this.selectedRowIndex = rowIndex
        let data = this.state.dataList[this.selectedRowIndex]

        if (key.field === fields.state) {
            this.onProgress(data)
        }
        else if (key.clickable) {
            if (this.props.onClick) {
                this.props.onClick(key, data)
            }
        }
        else {
            this.setState(
                {
                    isDetail: true,
                    currentView: this.detailView(data)
                }
            )
        }
    }

    onDeleteWSResponse = (mcRequest) => {
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            let data = mcRequest.response.data
            let code = data.code
            let message = data.data.message
            code === 200 && message === 'Deleting' ? this.dataFromServer(this.selectedRegion) : this.props.handleAlertInfo('error', message)
        }
        this.props.handleLoadingSpinner(false)
    }

    onDelete = async (action) => {
        let dataList = this.state.dataList
        let data = dataList[this.selectedRowIndex]
        if (data) {
            if (action.ws) {
                this.props.handleLoadingSpinner(true);
                serverData.sendWSRequest(this, action.onClick(data), this.onDeleteWSResponse)
            }
            else {
                let valid = false
                let mcRequest = await serverData.sendRequest(this, action.onClick(data))
                if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
                    this.props.handleAlertInfo('success', `${mcRequest.request.success} deleted successfully`)
                    dataList.splice(this.selectedRowIndex, 1)
                    this.setState({ dataList: dataList })
                    valid = true;
                }
                if(action.onFinish)
                {
                    action.onFinish(data, valid)
                }
            }
        }
    }

    onDialogClose = (valid) => {
        let action = this.state.dialogMessageInfo.action;
        this.setState({ dialogMessageInfo: {} })
        if (valid) {
            this.onDelete(action)
        }
    }

    onDeleteWarning = async (action, data) => {
        this.setState({ dialogMessageInfo: { message: `Are you sure you want to delete ${data[this.props.requestInfo.nameField]}?`, action: action } });
    }

    /***Action Block */
    onActionClose = (action) => {
        this.setState({
            anchorEl: null
        })
        let data = this.state.dataList[this.selectedRowIndex];
        switch (action.label) {
            case 'Delete':
                this.onDeleteWarning(action, data)
                break;
            default:
                action.onClick(action, data)
        }
    }




    /*Action Block*/

    getAction = (item) => {
        return (
            <IconButton aria-label="Action" onClick={e => this.setState({ anchorEl: e.currentTarget })}>
                <ListIcon style={{ color: '#76ff03' }} />
            </IconButton>
        )
    }

    makeBody(i, item) {
        return this.keys.map((header, j) => {
            this.checkRole(header)
            if (header.visible) {
                let field = header.field;
                return <Table.Cell key={j} className="table_actions" textAlign='center' onClick={() => this.getCellClick(header, i)} style={(this.state.selectedItem == i) ? { background: '#444', cursor: 'pointer',height:50 } : { cursor: 'pointer', height: 50}}>
                    {
                        field === fields.actions ? this.getAction(item)
                            :
                            <div style={{ wordBreak: 'break-all' }}>
                                {header.customizedData ? header.customizedData(item) : item[field]}
                            </div>
                    }</Table.Cell>
            }
        })
    }

    getHeight = () => {
        return window.innerHeight - 204
    }

    listView = () => {
        let isMap = this.props.requestInfo.isMap && this.state.showMap
        return (
            <div className="mexListView">
                {isMap ?
                    <div className='panel_worldmap' style={{ height: 300 }}>
                        <Map dataList={this.state.dataList} id={this.props.requestInfo.id} />
                    </div> : null}
                <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing style={{ height: isMap ?  'calc(100% - 312px)' : '100%' }}>
                    <Table.Header>
                        <Table.Row>
                            {this.makeHeader()}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body style={{ overflow: "auto", height: '100%' }}>
                        {
                            this.state.dataList.map((item, i) => (
                                <Table.Row key={i}>
                                    {this.makeBody(i, item)}
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table> </div>)
    }

    getActionMenu = () => {
        return (
            this.props.actionMenu ?
                <Popper open={Boolean(this.state.anchorEl)} anchorEl={this.state.anchorEl} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center right' }}
                        >
                            <Paper style={{ backgroundColor: '#212121', color: 'white' }}>
                                <ClickAwayListener onClickAway={() => this.setState({ anchorEl: null })}>
                                    <MenuList autoFocusItem={Boolean(this.state.anchorEl)} id="menu-list-grow" >
                                        {this.props.actionMenu.map((action, i) => {
                                            let visible = action.visible ? action.visible(this.state.dataList[this.selectedRowIndex]) : true
                                            return visible ? <MenuItem key={i} onClick={(e) => { this.onActionClose(action) }}>{action.label}</MenuItem> : null
                                        })}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper> : null
        )
    }

    /*
    Stepper Block
    Todo: Move to separate file
    */

    requestLastResponse = (data) => {
        if (this.state.uuid === 0) {
            let type = 'error'
            if (data.code === 200) {
                type = 'success'
            }
            this.props.handleAlertInfo(type, data.message)
        }
    }

    streamProgress = (dataList) => {
        let stream = this.props.requestInfo.streamType;
        if (stream) {
            for (let i = 0; i < dataList.length; i++) {
                let data = dataList[i];
                if (data[fields.state] !== 5) {
                    this.sendWSRequest(data)
                }
            }
        }
    }

    sendWSRequest = (data) => {
        let stream = this.props.requestInfo.streamType;
        if (stream) {
            let state = data[fields.state];
            if (state === 2 || state === 3 || state === 6 || state === 7 || state === 9 || state === 10 || state === 12 || state === 14) {
                serverData.sendWSRequest(this, stream(data), this.requestResponse)
            }
        }
    }

    requestResponse = (mcRequest) => {
        let request = mcRequest.request;
        let responseData = null;
        let stepsArray = this.state.stepsArray;
        if (stepsArray && stepsArray.length > 0) {
            stepsArray = stepsArray.filter((item) => {
                if (request.uuid === item.uuid) {
                    if (mcRequest.response) {
                        responseData = item;
                        return item
                    }
                    else {
                        if (item.steps && item.steps.length > 1) {
                            this.requestLastResponse(item.steps[item.steps.length - 1]);
                        }
                        if (item.steps.length >= 1 && item.steps[0].code === 200) {
                            item.steps.push({ code: CODE_FINISH })
                            this.dataFromServer(this.selectedRegion)
                        }

                        if (this.state.uuid !== 0) {
                            return item
                        }
                    }
                }
                return item
            })

        }

        if (mcRequest.response) {
            let response = mcRequest.response.data
            let step = { code: response.code, message: response.data.message }
            if (responseData === null) {
                stepsArray.push({ uuid: request.uuid, steps: [step] })
            }
            else {
                stepsArray.map((item, i) => {
                    if (request.uuid === item.uuid) {
                        item.steps.push(step)
                    }
                })
            }
        }

        this.setState({
            stepsArray: stepsArray
        })
    }

    onCloseStepper = () => {
        this.state.stepsArray.map((item, i) => {
            item.steps.map(step => {
                if (step.code === CODE_FINISH) {
                    this.state.stepsArray.splice(i, 1)
                }
            })
        })
        this.setState({
            uuid: 0
        })
    }

    onProgress(data) {
        this.setState({
            uuid: data.uuid
        })

        if (data[fields.state] === 5) {
            this.setState({
                stepsArray: [{ uuid: data.uuid, steps: [{ message: 'Created successfully', code: CODE_FINISH }] }]
            })
        }
    }
    /*
      Stepper Block
      Todo: Move to separate file
      */



    static getDerivedStateFromProps(props, state) {
        if (props.refreshToggle !== state.refresh) {
            return { refresh: props.refreshToggle, dataList: state.dataList }
        }
        return null
    }

    render() {
        return (
            <Card style={{ width: '100%', height: '100%', backgroundColor: '#292c33', padding: 10, color: 'white' }}>
                <MexMessageDialog messageInfo={this.state.dialogMessageInfo} onClick={this.onDialogClose} />
                <MexMessageStream onClose={this.onCloseStepper} uuid={this.state.uuid} stepsArray={this.state.stepsArray} />
                <MexToolbar requestInfo={this.props.requestInfo} onAction={this.onToolbarAction} isDetail={this.state.isDetail} />
                {this.state.currentView ? this.state.currentView : this.listView()}
                {this.getActionMenu()}
            </Card>
        );

    }

    onToolbarAction = (type, data) => {
        switch (type) {
            case ACTION_REGION:
                this.selectedRegion = data;
                this.dataFromServer(this.selectedRegion)
                break;
            case ACTION_REFRESH:
                this.dataFromServer(this.selectedRegion)
                break;
            case ACTION_NEW:
                this.props.requestInfo.onAdd()
                break;
            case ACTION_MAP:
                this.setState({ showMap: data })
                break;
            case ACTION_CLOSE:
                this.setState({ isDetail: false, currentView: null })
                break;
            default:

        }
    }

    getFilterInfo = (requestInfo, region) => {
        let filterList = [];
        if (requestInfo.isRegion) {
            if (region === REGION_ALL) {
                for (let i = 0; i < this.regions.length; i++) {
                    region = this.regions[i];
                    let filter = requestInfo.filter === undefined ? {} : requestInfo.filter;
                    filter[fields.region] = region;
                    filterList.push(filter)
                }
            }
            else {
                let filter = requestInfo.filter === undefined ? {} : requestInfo.filter;
                filter[fields.region] = region;
                filterList.push(filter)
            }
        }
        else {
            let filter = requestInfo.filter === undefined ? {} : requestInfo.filter;
            filterList.push(filter)
        }
        return filterList;
    }



    onServerResponse = (mcRequestList) => {
        this.requestCount -= 1
        let requestInfo = this.props.requestInfo
        let newDataList = []

        if (mcRequestList && mcRequestList.length > 0) {
            if (this.props.multiDataRequest) {
                newDataList = this.props.multiDataRequest(requestInfo.keys, mcRequestList)
            }
            else {
                let mcRequest = mcRequestList[0]
                if (mcRequest.response && mcRequest.response.data) {
                    newDataList = mcRequest.response.data
                }
            }

        }

        let dataList = this.state.dataList
        if (mcRequestList && mcRequestList.length > 0 && dataList.length > 0) {
            let requestData = mcRequestList[0].request.data
            if(requestData.region)
            {
                dataList = dataList.filter(function( obj ) {
                    return obj[fields.region] !== requestData.region;
                });
            }
        }

        if(newDataList.length > 0)
        {
            newDataList = _.orderBy(newDataList, requestInfo.sortBy)
            this.streamProgress(newDataList)
            dataList = [...dataList, ...newDataList]
        }
        
        if (this.requestCount === 0 && dataList.length === 0) {
            this.props.handleAlertInfo('error', 'Requested data is empty')
        }
        this.setState({
            dataList: dataList
        })
    }

    dataFromServer = (region) => {
        this.setState({ dataList: [] })
        let requestInfo = this.props.requestInfo
        if (requestInfo) {
            let filterList = this.getFilterInfo(requestInfo, region)
            this.requestCount = filterList.length;
            if (filterList && filterList.length > 0) {
                for (let i = 0; i < filterList.length; i++) {
                    let filter = filterList[i];
                    serverData.showMultiDataFromServer(this, requestInfo.requestType, filter, this.onServerResponse)
                }
            }
            else {
                serverData.showMultiDataFromServer(this, requestInfo.requestType, this.onServerResponse)
            }
        }
    }


    componentDidMount() {
        this.dataFromServer(REGION_ALL)
    }
}

const mapStateToProps = (state) => {
    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    return {
        getRegion: (state.getRegion) ? state.getRegion.region : null,
        regionInfo: regionInfo,
        region: region,
        changeRegion: state.changeRegion ? state.changeRegion.region : null,
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MexListView));


