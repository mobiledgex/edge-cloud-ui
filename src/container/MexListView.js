import React from 'react';
import { Card } from '@material-ui/core';

import './styles.css';
import orderBy from "lodash/orderBy";
import { fields } from '../services/model/format';
import * as serverData from '../services/model/serverData';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as constant from '../constant'

import MexToolbar, { ACTION_CLOSE, ACTION_REGION, ACTION_REFRESH, REGION_ALL, ACTION_NEW, ACTION_MAP, ACTION_SEARCH } from './MexToolbar';
import MexDetailViewer from '../hoc/dataViewer/DetailViewer';
import MexListViewer from '../hoc/listView/ListViewer';
import MexMessageStream from '../hoc/stepper/mexMessageStream';
import MexMessageMultiNorm from '../hoc/stepper/mexMessageMultiNormal';
import MexMultiStepper, { updateStepper } from '../hoc/stepper/mexMessageMultiStream'
import { prefixSearchPref, showMapPref } from '../utils/sharedPreferences_util';
import MexMessageDialog from '../hoc/dialog/mexWarningDialog'
import ListMexMap from './map/ListMexMap'
import cloneDeep from 'lodash/cloneDeep';
import { ACTION_DELETE, ACTION_EDGE_BOX_ENABLE, ACTION_POWER_OFF, ACTION_POWER_ON, ACTION_REBOOT, ACTION_UPDATE, ACTION_UPGRADE, ACTION_WARNING, ACTION_POOL_ACCESS_DEVELOPER } from './Actions';

class MexListView extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false
        this.state = {
            newDataList: [],
            dataList: [],
            filterList: [],
            anchorEl: null,
            currentView: null,
            isDetail: false,
            multiStepsArray: [],
            selected: [],
            showMap: showMapPref(),
            dialogMessageInfo: {},
            uuid: 0,
            dropList: [],
            resetStream: false,
            deleteMultiple: []
        };
        this.filterText = prefixSearchPref()
        this.requestCount = 0;
        this.requestInfo = this.props.requestInfo
        this.keys = this.requestInfo.keys;
        this.selectedRow = {};
        this.sorting = false;
        this.selectedRegion = REGION_ALL
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }

    setSelected = (dataList) => {
        this.setState({ selected: dataList })
    }

    detailView = (data) => {
        let additionalDetail = this.requestInfo.additionalDetail
        this.props.handleViewMode(null)
        return (
            <Card style={{ height: 'calc(100vh - 116px)', backgroundColor: '#292c33', borderRadius: 5, overflowY: 'auto' }}>
                <MexDetailViewer detailData={data} keys={this.keys} />
                {additionalDetail ? additionalDetail(data) : null}
            </Card>
        )
    }

    getCellClick = (key, row) => {
        this.selectedRow = row
        let data = row

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

    onDeleteWSResponse = (mc) => {
        if (mc && mc.response && mc.response.data) {
            let data = mc.response.data
            let code = data.code
            let message = data.data.message
            mc.wsObj.close()
            code === 200 ? this.specificDataFromServer(mc.request) : this.props.handleAlertInfo('error', message)
        }
        this.props.handleLoadingSpinner(false)
    }

    onDelete = async (action, data) => {
        let filterList = this.state.filterList
        let dataList = this.state.dataList
        if (data) {
            if (action.ws) {
                this.props.handleLoadingSpinner(true);
                serverData.sendWSRequest(this, action.onClick(data), this.onDeleteWSResponse, data)
            }
            else {
                let valid = false
                let mc = await serverData.sendRequest(this, action.onClick(data))
                if (mc && mc.response && mc.response.status === 200) {
                    this.props.handleAlertInfo('success', `${mc.request.success}`)
                    filterList.splice(filterList.indexOf(data), 1)
                    dataList.splice(dataList.indexOf(data), 1)
                    if (this._isMounted) {
                        this.setState({ dataList: dataList, filterList: filterList })
                    }
                    valid = true;
                }
                if (action.onFinish) {
                    let error = undefined
                    if (mc.error && mc.error.response && mc.error.response.data) {
                        error = mc.error.response.data
                    }
                    action.onFinish(data, valid, error)
                }
            }
        }
    }

    onMultiResponse = (mc) => {
        let orgData = mc.request.orgData
        let data = orgData.data
        let action = orgData.action
        this.props.handleLoadingSpinner(false)
        if (mc) {
            let responseData = undefined;
            if (mc.response && mc.response.data) {
                responseData = mc.response.data;
            }
            let labels = action.multiStepperHeader
            if (this._isMounted) {
                this.setState({ multiStepsArray: updateStepper(this.state.multiStepsArray, labels, data, responseData, mc.wsObj) })
            }
        }
    }

    onDeleteMulClose = () => {
        if (this._isMounted) {
            this.setState(prevState => {
                let filterList = prevState.filterList
                let dataList = prevState.dataList
                let deleteMultiple = prevState.deleteMultiple
                deleteMultiple.map(mul => {
                    if (mul.code === 200) {
                        filterList.splice(filterList.indexOf(mul.data), 1)
                        dataList.splice(dataList.indexOf(mul.data), 1)
                    }
                })
                return { dataList, filterList, deleteMultiple: [] }
            })
        }
    }

    onDeleteMultiple = async (action, data) => {
        if (action.ws) {
            this.props.handleLoadingSpinner(true)
            serverData.sendWSRequest(this, action.onClick(data), this.onMultiResponse, { action: action, data: data })
        }
        else {
            let mc = await serverData.sendRequest(this, action.onClick(data))
            let message = ''
            let code = 404
            if (mc && mc.response && mc.response.status === 200) {
                code = mc.response.status
                message = mc.request.success
            }
            else if (mc && mc.error && mc.error.response) {
                code = mc.error.response.status
                message = mc.error.response.data.message
            }
            this.setState(prevState => {
                let deleteMultiple = prevState.deleteMultiple
                deleteMultiple.push({ data, message, code })
                return { deleteMultiple }
            })
        }
    }


    onUpdate = async (action, data, forceRefresh) => {
        if (forceRefresh || data[fields.updateAvailable]) {
            this.props.handleLoadingSpinner(true)
            serverData.sendWSRequest(this, action.onClick(data), this.onMultiResponse, { action: action, data: data })
        }
    }

    onDialogClose = async (valid) => {
        let action = this.state.dialogMessageInfo.action;
        let isMultiple = this.state.dialogMessageInfo.isMultiple;
        let data = this.state.dialogMessageInfo.data;
        this.setState({ dialogMessageInfo: {} })
        if (valid) {
            if (isMultiple) {
                this.setState({ selected: [] })
                this.state.filterList.map(item => {
                    if (data.includes(item.uuid)) {
                        switch (action.label) {
                            case 'Upgrade':
                                this.onUpdate(action, item)
                                break;
                            case 'Refresh':
                                this.onUpdate(action, item, true)
                                break;
                            case 'Delete':
                                this.onDeleteMultiple(action, item)
                                break;

                        }
                    }
                })
            }
            else {
                let id = action.id ? action.id : action.label
                switch (id) {
                    case ACTION_DELETE:
                        this.onDelete(action, data)
                        break;
                    case ACTION_UPGRADE:
                        this.onUpdate(action, data)
                        break;
                    case ACTION_REFRESH:
                        this.onUpdate(action, data, true)
                        break;
                    case ACTION_POWER_ON:
                    case ACTION_POWER_OFF:
                    case ACTION_REBOOT:
                        action.onClick(action, data, this.onDeleteWSResponse)
                        break;
                    case ACTION_POOL_ACCESS_DEVELOPER:
                    case ACTION_EDGE_BOX_ENABLE:
                        action.onClick(action, data, ()=>{this.dataFromServer(this.selectedRegion)})
                        break;
                }
            }
        }
    }

    onWarning = async (action, actionLabel, isMultiple, data) => {
        let message = action.dialogMessage ? action.dialogMessage(action, data) : undefined
        this.setState({ dialogMessageInfo: { message: message ? message : `Are you sure you want to ${actionLabel} ${isMultiple ? '' : data[this.requestInfo.nameField]}?`, action: action, isMultiple: isMultiple, data: data } });
    }

    /***Action Block */
    /*Todo this is temporary we can't hardocode Action type in mexlistview 
    will be changed to make it more generalize*/
    onActionClose = (action) => {
        let data = this.selectedRow;
        let valid = action.onClickInterept ? action.onClickInterept(action, data) : true
        if (valid) {
            if (action.warning) {
                let warning = typeof action.warning === 'function' ? action.warning(ACTION_WARNING, action, data) : action.warning
                this.onWarning(action, warning, false, data)
            }
            else {
                let id = action.id ? action.id : action.label
                switch (id) {
                    case ACTION_DELETE:
                        this.onWarning(action, 'delete', false, data)
                        break
                    default:
                        action.onClick(action, data)
                }
            }
        }
    }

    onMapMarkerClick = (mapDataList) => {
        let filterList = this.onFilterValue(undefined)
        if (mapDataList) {
            filterList = mapDataList
        }
        this.setState({ filterList })
    }

    groupActionClose = (action, dataList) => {
        this.onWarning(action, action.warning, true, dataList)
    }

    /*Action Block*/
    listView = () => {
        let isMap = this.requestInfo.isMap && this.state.showMap
        return (
            <div className="mexListView">
                {isMap ?
                    <div className='panel_worldmap' style={{ height: 400 }}>
                        <ListMexMap onClick={this.onMapMarkerClick} id={this.requestInfo.id} dataList={this.state.filterList} region={this.selectedRegion} />
                    </div> : null
                }
                <MexListViewer keys={this.keys} dataList={this.state.filterList}
                    selected={this.state.selected}
                    setSelected={this.setSelected}
                    actionMenu={this.props.actionMenu}
                    cellClick={this.getCellClick}
                    actionClose={this.onActionClose}
                    isMap={isMap} requestInfo={this.requestInfo}
                    groupActionMenu={this.props.groupActionMenu}
                    groupActionClose={this.groupActionClose}
                    dropList={this.state.dropList}
                    isDropped={this.isDropped}
                    viewerEdit={this.requestInfo.viewerEdit}
                    tableHeight={this.props.tableHeight} />
            </div>)
    }


    onCloseStepper = () => {
        this.setState({
            uuid: 0
        })
    }

    multiStepperClose = () => {
        this.state.multiStepsArray.map(item => {
            item.wsObj.close()
        })
        this.setState({
            multiStepsArray: []
        })
        this.dataFromServer(this.selectedRegion)
    }

    onProgress(data) {
        if (this._isMounted) {
            this.setState({
                uuid: data.uuid
            })
        }
    }

    onFilterValue = (value) => {
        if (value !== undefined && value.length >= 0) {
            this.filterText = prefixSearchPref() + value.toLowerCase()
        }

        let dataList = cloneDeep(this.state.dataList)
        let filterCount = 0
        let filterList = this.filterText.length > 0 ? dataList.filter(data => {
            let valid = this.keys.map(key => {
                if (key.filter) {
                    filterCount = + 1
                    let tempData = data[key.field] ? data[key.field] : ''
                    return tempData.toLowerCase().includes(this.filterText)
                }
            })
            return filterCount === 0 || valid.includes(true)
        }) : dataList
        if (value !== undefined) {
            this.setState({ filterList: filterList })
        }
        return filterList
    }

    static getDerivedStateFromProps(props, state) {
        if (props.refreshToggle !== state.refresh) {
            return { refresh: props.refreshToggle, dataList: state.dataList }
        }
        return null
    }

    onRemoveDropItem = (item) => {
        this.setState({ dropList: [] })
    }

    isDropped = (item) => {
        this.setState({ dropList: [item] })
    }

    specificResponse = (mcList) => {
        if (mcList && mcList.length > 0) {
            let uuid = mcList[0].request.data.uuid
            this.setState(prevState => {
                let dataList = prevState.dataList
                let newDataList = []
                for (let i = 0; i < dataList.length; i++) {
                    let data = dataList[i]
                    if (data.uuid === uuid) {
                        let newData = this.props.multiDataRequest(this.requestInfo.keys, { new: mcList, old: data }, true)
                        if (newData) {
                            dataList[i] = newData
                            newDataList.push(newData)
                        }
                        else {
                            dataList.splice(i, 1)
                        }
                        break;
                    }
                }
                return { dataList, newDataList }
            }, () => {
                this.onFilterValue(this.filterText)
            })
        }
    }

    specificDataFromServer = (request) => {
        let uuid = request.uuid
        let data = request.data
        let requestType = this.requestInfo.requestType
        data.uuid = uuid
        let requestList = []
        if (this.requestInfo.id === constant.PAGE_CLOUDLETS) {
            requestType.map(request => {
                requestList.push(request(data, true))
            })
        }
        else {
            requestList.push(requestType[0](data, true))
        }
        serverData.sendMultiRequest(this, requestList, this.specificResponse)
    }

    render() {
        const { resetStream, deleteMultiple, showMap } = this.state
        return (
            <Card style={{ width: '100%', height: '100%', backgroundColor: '#292c33', color: 'white', paddingTop: 10 }}>
                <MexMessageDialog messageInfo={this.state.dialogMessageInfo} onClick={this.onDialogClose} />
                <MexMessageStream onClose={this.onCloseStepper} uuid={this.state.uuid} dataList={this.state.newDataList} dataFromServer={this.specificDataFromServer} streamType={this.requestInfo.streamType} customStream={this.requestInfo.customStream} region={this.selectedRegion} resetStream={resetStream} />
                <MexMultiStepper multiStepsArray={this.state.multiStepsArray} onClose={this.multiStepperClose} />
                <MexToolbar requestInfo={this.requestInfo} regions={this.regions} onAction={this.onToolbarAction} isDetail={this.state.isDetail} dropList={this.state.dropList} onRemoveDropItem={this.onRemoveDropItem} showMap={showMap} />
                {this.props.customToolbar && !this.state.isDetail ? this.props.customToolbar() : null}
                {this.state.currentView ? this.state.currentView : this.listView()}
                <MexMessageMultiNorm data={deleteMultiple} close={this.onDeleteMulClose} />
            </Card>
        );

    }

    onToolbarAction = (type, value) => {
        switch (type) {
            case ACTION_REGION:
                this.selectedRegion = value;
                this.dataFromServer(this.selectedRegion)
                break;
            case ACTION_REFRESH:
                this.dataFromServer(this.selectedRegion)
                break;
            case ACTION_NEW:
                this.requestInfo.onAdd()
                break;
            case ACTION_MAP:
                this.setState({ showMap: value })
                break;
            case ACTION_CLOSE:
                this.setState({ isDetail: false, currentView: null })
                this.props.handleViewMode(this.requestInfo.viewMode)
                break;
            case ACTION_SEARCH:
                this.onFilterValue(value)
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
                    filterList.push(Object.assign({}, filter))
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

    onServerResponse = (mcList) => {
        this.requestCount -= 1
        let requestInfo = this.requestInfo
        let newDataList = []

        if (mcList && mcList.length > 0) {
            if (this.props.multiDataRequest) {
                newDataList = this.props.multiDataRequest(requestInfo.keys, mcList)
            }
            else {
                let mc = mcList[0]
                if (mc.response && mc.response.data) {
                    newDataList = mc.response.data
                }
            }

        }

        let dataList = cloneDeep(this.state.dataList)
        if (mcList && mcList.length > 0 && dataList.length > 0) {
            let requestData = mcList[0].request.data
            if (requestData.region) {
                dataList = dataList.filter(function (obj) {
                    return obj[fields.region] !== requestData.region;
                });
            }
        }

        if (newDataList.length > 0) {
            newDataList = orderBy(newDataList, requestInfo.sortBy)
            dataList = [...dataList, ...newDataList]
        }

        if (this._isMounted) {
            this.setState({
                dataList,
                newDataList
            })
            this.setState({ filterList: this.onFilterValue(undefined) })
        }
    }

    dataFromServer = (region) => {
        if (this._isMounted) {
            this.setState(prevState => ({ dataList: [], filterList: [], selected: [], newDataList: [], resetStream: !prevState.resetStream }))
        }
        let requestInfo = this.requestInfo
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
        this._isMounted = true
        this.dataFromServer(REGION_ALL)
        this.props.handleViewMode(this.requestInfo.viewMode);
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(MexListView));