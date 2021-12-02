import React from 'react';
import { Card } from '@material-ui/core';

import './styles.css';
import { fields } from '../services/model/format';
import * as serverData from '../services/model/serverData';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import MexToolbar, { ACTION_CLOSE, ACTION_REGION, ACTION_REFRESH, REGION_ALL, ACTION_NEW, ACTION_MAP, ACTION_SEARCH, ACTION_GROUP, ACTION_PICKER } from './MexToolbar';
import MexDetailViewer from './detail/DetailViewer';
import MexListViewer from '../hoc/listView/ListViewer';
import MexMessageStream from '../hoc/stepper/mexMessageStream';
import MexMessageMultiNorm from '../hoc/stepper/mexMessageMultiNormal';
import MexMultiStepper, { updateStepper } from '../hoc/stepper/mexMessageMultiStream'
import { prefixSearchPref, showMapPref } from '../utils/sharedPreferences_util';
import MexMessageDialog from '../hoc/dialog/mexWarningDialog'
import ListMexMap from './map/ListMexMap'
import cloneDeep from 'lodash/cloneDeep';
import { operators, shared, perpetual } from '../helper/constant';
import { fetchDataFromServer } from './service';
import { service } from '../services';
import { timeRangeInMin } from '../hoc/mexui/Picker';
import { HELP_ORG_LIST } from "../tutorial";
class MexListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newDataList: [],
            dataList: [],
            filterList: [],
            currentView: null,
            isDetail: false,
            multiStepsArray: [],
            selected: [],
            showMap: showMapPref(),
            dialogMessageInfo: {},
            uuid: 0,
            dropList: [],
            resetStream: false,
            deleteMultiple: [],
            iconKeys: undefined,
            loading: false
        };
        this._isMounted = false
        this.filterText = prefixSearchPref()
        this.requestCount = 0;
        this.requestInfo = this.props.requestInfo
        this.keys = this.requestInfo.keys;
        this.selectedRow = {};
        this.sorting = false;
        this.selectedRegion = REGION_ALL
        this.range = timeRangeInMin()
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    setSelected = (dataList) => {
        this.updateState({ selected: dataList })
    }

    detailView = (data) => {
        const { detailAction } = this.props
        let additionalDetail = this.requestInfo.additionalDetail
        this.props.handleViewMode(null)
        return (
            <Card style={{ height: 'calc(100vh - 116px)', backgroundColor: '#292c33', borderRadius: 5, overflowY: 'auto' }}>
                <MexDetailViewer detailData={data} keys={this.keys} formatData={this.requestInfo.formatData} detailAction={detailAction} />
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
            this.updateState(
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
        if (data) {
            if (action.ws) {
                this.props.handleLoadingSpinner(true);
                serverData.sendWSRequest(this, action.onClick(this, data), this.onDeleteWSResponse, data)
            }
            else {
                let valid = false
                let mc = await service.authSyncRequest(this, action.onClick(this, data))
                if (mc && mc.response && mc.response.status === 200) {
                    this.props.handleAlertInfo('success', `${mc.request.success}`)
                    if (this._isMounted) {
                        this.setState(prevState => {
                            let filterList = prevState.filterList
                            let dataList = prevState.dataList
                            filterList = filterList.filter(item => { return !operators.equal(item, data) })
                            dataList = dataList.filter(item => { return !operators.equal(item, data) })
                            return { dataList, filterList }
                        })
                    }
                    if (this.requestInfo.viewMode === HELP_ORG_LIST) {
                        this.updateRolesInfo(data)
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

    updateRolesInfo = (data) => {
        const roles = this.props.roleInfo.filter((role) => role[fields.organizationName] !== data[fields.organizationName])
        this.props.handleRoleInfo(roles)
        this.props.organizationInfo[fields.organizationName] === data[fields.organizationName] ? this.props.handleOrganizationInfo(undefined) : null
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
            this.updateState({ multiStepsArray: updateStepper(this.state.multiStepsArray, labels, data, responseData, mc.wsObj) })
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
                        filterList = filterList.filter(item => { return !operators.equal(item, mul.data) })
                        dataList = dataList.filter(item => { return !operators.equal(item, mul.data) })
                    }
                })
                return { dataList, filterList, deleteMultiple: [] }
            })
        }
    }

    onDeleteMultiple = async (action, data) => {
        if (action.ws) {
            this.props.handleLoadingSpinner(true)
            serverData.sendWSRequest(this, action.onClick(this, data), this.onMultiResponse, { action: action, data: data })
        }
        else {
            let mc = await service.authSyncRequest(this, action.onClick(this, data))
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
            if (this._isMounted) {
                this.setState(prevState => {
                    let deleteMultiple = prevState.deleteMultiple
                    deleteMultiple.push({ data, message, code })
                    return { deleteMultiple }
                })
            }
        }
    }


    onUpdate = async (action, data) => {
        if (data[fields.forceupdate] || data[fields.updateAvailable]) {
            this.props.handleLoadingSpinner(true)
            serverData.sendWSRequest(this, action.onClick(data), this.onMultiResponse, { action: action, data: data })
        }
    }

    onDialogClose = async (valid) => {
        let action = this.state.dialogMessageInfo.action;
        let isMultiple = this.state.dialogMessageInfo.isMultiple;
        let data = this.state.dialogMessageInfo.data;
        this.updateState({ dialogMessageInfo: {} })
        if (valid) {
            if (isMultiple) {
                this.updateState({ selected: [] })
                this.state.filterList.map(item => {
                    if (data.includes(item.uuid)) {
                        switch (action.label) {
                            case 'Upgrade':
                                this.onUpdate(action, item)
                                break;
                            case 'Refresh':
                                this.onUpdate(action, { ...item, forceupdate: true })
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
                    case perpetual.ACTION_DELETE:
                        this.onDelete(action, data)
                        break;
                    case perpetual.ACTION_UPGRADE:
                        this.onUpdate(action, data)
                        break;
                    case perpetual.ACTION_REFRESH:
                        this.onUpdate(action, { ...data, forceupdate: true })
                        break;
                    case perpetual.ACTION_POWER_ON:
                    case perpetual.ACTION_POWER_OFF:
                    case perpetual.ACTION_REBOOT:
                        action.onClick(action, data, this.onDeleteWSResponse)
                        break;
                    case perpetual.ACTION_POOL_ACCESS_DEVELOPER:
                    case perpetual.ACTION_POOL_ACCESS_DEVELOPER_REJECT:
                    case perpetual.ACTION_EDGE_BOX_ENABLE:
                        action.onClick(action, data, () => { this.dataFromServer(this.selectedRegion) })
                        break;
                }
            }
        }
    }

    onWarning = async (action, actionLabel, isMultiple, data) => {
        let message = action.dialogMessage ? action.dialogMessage(action, data) : undefined
        this.updateState({ dialogMessageInfo: { message: message ? message : `Are you sure you want to ${actionLabel} ${isMultiple ? '' : data[this.requestInfo.nameField]}?`, action: action, isMultiple: isMultiple, data: data } });
    }

    /***Action Block */
    /*Todo this is temporary we can't hardocode Action type in mexlistview 
    will be changed to make it more generalize*/
    onActionClose = (action, dataList) => {
        let data = dataList ? dataList : this.selectedRow;
        let valid = action.onClickInterept ? action.onClickInterept(action, data) : true
        if (valid) {
            if (action.warning) {
                let warning = typeof action.warning === 'function' ? action.warning(perpetual.ACTION_WARNING, action, data) : action.warning
                this.onWarning(action, warning, false, data)
            }
            else {
                let id = action.id ? action.id : action.label
                switch (id) {
                    case perpetual.ACTION_DELETE:
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
        this.updateState({ filterList })
    }

    groupActionClose = (action, dataList) => {
        this.onWarning(action, action.warning, true, dataList)
    }

    onIconFilter = (iconKeys) => {
        this.setState({ iconKeys }, () => {
            this.onFilterValue()
        })
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
                    loading={this.state.loading}
                    selected={this.state.selected}
                    setSelected={this.setSelected}
                    actionMenu={this.props.actionMenu}
                    cellClick={this.getCellClick}
                    actionClose={this.onActionClose}
                    isMap={isMap} requestInfo={this.requestInfo}
                    groupActionMenu={this.props.groupActionMenu}
                    groupActionClose={this.groupActionClose}
                    dropList={this.state.dropList}
                    iconKeys={this.state.iconKeys}
                    onIconFilter={this.onIconFilter}
                    viewerEdit={this.requestInfo.viewerEdit}
                    tableHeight={this.props.tableHeight}
                    searchValue={this.filterText}
                />
            </div>)
    }


    onCloseStepper = () => {
        this.updateState({
            uuid: 0
        })
    }

    multiStepperClose = () => {
        this.state.multiStepsArray.map(item => {
            item.wsObj.close()
        })
        this.updateState({
            multiStepsArray: []
        })
        this.dataFromServer(this.selectedRegion)
    }

    onProgress(data) {
        if (this._isMounted) {
            this.updateState({
                uuid: data.uuid
            })
        }
    }

    onFilterValue = (value) => {
        if (value !== undefined && value.length >= 0) {
            this.filterText = value.toLowerCase()
        }

        let dataList = cloneDeep(this.state.dataList)
        let filterCount = 0
        let filterList = dataList.filter(data => {
            let valid = this.filterText.length > 0 ? this.keys.map(key => {
                if (key.filter) {
                    filterCount = + 1
                    let tempData = data[key.field] ? data[key.field] : ''
                    if (typeof tempData === 'string') {
                        return tempData.toLowerCase().includes(this.filterText)
                    }
                }
            }) : [true]
            valid = filterCount === 0 || valid.includes(true)
            if (valid) {
                this.state.iconKeys && this.state.iconKeys.forEach(icon => {
                    if (valid && icon.clicked) {
                        valid = Boolean(data[icon.field])
                    }
                })
            }
            return valid
        })

        this.updateState({ filterList })

        return filterList
    }

    static getDerivedStateFromProps(props, state) {
        if (props.refreshToggle !== state.refresh) {
            return { refresh: props.refreshToggle, dataList: state.dataList }
        }
        return null
    }

    onRemoveDropItem = (item) => {
        this.updateState({ dropList: [] })
    }

    specificResponse = (mcList) => {
        if (mcList && mcList.length > 0) {
            let uuid = mcList[0].request.data.uuid
            if (this._isMounted) {
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
    }

    specificDataFromServer = (request) => {
        let uuid = request.uuid
        let data = request.data
        let requestType = this.requestInfo.requestType
        data.uuid = uuid
        let requestList = []
        if (this.requestInfo.id === perpetual.PAGE_CLOUDLETS) {
            requestType.map(request => {
                requestList.push(request(this, data, true))
            })
        }
        else {
            requestList.push(requestType[0](this, data, true))
        }
        service.multiAuthRequest(this, requestList, this.specificResponse)
    }

    render() {
        const { resetStream, deleteMultiple, showMap } = this.state
        const { regions, toolbarAction } = this.props
        return (
            <Card style={{ width: '100%', height: 'calc(100vh - 55px)', backgroundColor: '#292c33', color: 'white', paddingTop: 10 }}>
                <MexMessageDialog messageInfo={this.state.dialogMessageInfo} onClick={this.onDialogClose} />
                <MexMessageStream onClose={this.onCloseStepper} uuid={this.state.uuid} dataList={this.state.newDataList} dataFromServer={this.specificDataFromServer} streamType={this.requestInfo.streamType} customStream={this.requestInfo.customStream} region={this.selectedRegion} resetStream={resetStream} />
                <MexMultiStepper multiStepsArray={this.state.multiStepsArray} onClose={this.multiStepperClose} uuid={this.state.uuid} />
                <MexToolbar requestInfo={this.requestInfo} regions={regions} onAction={this.onToolbarAction} isDetail={this.state.isDetail} dropList={this.state.dropList} onRemoveDropItem={this.onRemoveDropItem} showMap={showMap} toolbarAction={toolbarAction} />
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
                this.dataFromServer(this.selectedRegion, type)
                break;
            case ACTION_NEW:
                this.requestInfo.onAdd()
                break;
            case ACTION_MAP:
                this.updateState({ showMap: value })
                break;
            case ACTION_CLOSE:
                this.updateState({ isDetail: false, currentView: null })
                this.props.handleViewMode(this.requestInfo.viewMode)
                break;
            case ACTION_SEARCH:
                this.onFilterValue(value)
                break;
            case ACTION_GROUP:
                this.setState({ dropList: value })
            case ACTION_PICKER:
                this.range = value
                this.dataFromServer(this.selectedRegion)
            default:
        }
    }

    getFilterInfo = (requestInfo, region) => {
        const { regions } = this.props
        let filterList = [];
        if (requestInfo.isRegion) {
            if (region === REGION_ALL) {
                for (let i = 0; i < regions.length; i++) {
                    region = regions[i];
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

    onServerResponse = (mcList, type) => {
        const { handleListViewClick } = this.props
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
            newDataList = operators._orderBy(newDataList, requestInfo.sortBy)
            dataList = [...dataList, ...newDataList]
        }

        if (this._isMounted) {
            this.setState({
                dataList,
                newDataList
            }, () => {
                this.updateState({ filterList: this.onFilterValue(undefined), loading: false })
            })
        }
        if (handleListViewClick && type === ACTION_REFRESH) {
            handleListViewClick({ type, data: newDataList })
        }
    }

    dataFromServer = async (region, type) => {
        if (this._isMounted) {
            this.setState(prevState => ({ dataList: [], filterList: [], selected: [], newDataList: [], resetStream: !prevState.resetStream, loading: true }))
        }
        let requestInfo = this.requestInfo
        if (requestInfo) {
            let filterList = this.getFilterInfo(requestInfo, region)
            if (requestInfo.picker && this.range) {
                if (filterList.length > 0) {
                    filterList = filterList.map(filter => {
                        filter.startdate = this.range.from
                        filter.enddate = this.range.to
                        return filter
                    })
                }
                else {
                    filterList = [{ startdate: this.range.from, enddate: this.range.to }]
                }
            }

            this.requestCount = filterList.length;
            let mcList = []
            if (filterList && filterList.length > 0) {
                for (let i = 0; i < filterList.length; i++) {
                    let filter = filterList[i];
                    mcList = await fetchDataFromServer(this, requestInfo.requestType, filter)
                }
            }
            else {
                mcList = await fetchDataFromServer(this, requestInfo.requestType)
            }
            if (mcList && mcList.length > 0) {
                this.onServerResponse(mcList, type)
            }
        }

    }

    componentDidUpdate(preProps, preState) {
        if (!operators.equal(this.props.organizationInfo, preProps.organizationInfo)) {
            if (!shared.isPathOrg(this)) {
                this.dataFromServer(this.selectedRegion)
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

const mapStateToProps = (state) => {
    return {
        regions: state.regionInfo.region,
        organizationInfo: state.organizationInfo.data,
        roleInfo: state.roleInfo.role
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) },
        handleRoleInfo: (data) => { dispatch(actions.roleInfo(data)) },
        handleOrganizationInfo: (data) => { dispatch(actions.organizationInfo(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MexListView));