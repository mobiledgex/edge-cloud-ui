import React from 'react';
import { Card } from '@material-ui/core';

import '../styles.css';
import orderBy from "lodash/orderBy";
import { fields } from '../../services/model/format';
import * as serverData from '../../services/model/serverData';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import * as constant from '../../constant'

import MexToolbar, { ACTION_CLOSE, ACTION_REGION, ACTION_REFRESH, REGION_ALL, ACTION_NEW, ACTION_MAP, ACTION_SEARCH } from './MexToolbar';
import MexDetailViewer from '../../hoc/dataViewer/DetailViewer';
import MexListViewer from '../../hoc/listView/ListViewer';
import MexMessageStream, { CODE_FINISH } from '../../hoc/stepper/mexMessageStream';
import MexMultiStepper, { updateStepper } from '../../hoc/stepper/mexMessageMultiStream'
import MexMessageDialog from '../../hoc/dialog/mexWarningDialog'
import Map from "../../hoc/maps/MexMap";
import { roundOff } from '../../utils/math_util';

class MexListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newDataList:[],
            dataList: [],
            filterList: [],
            anchorEl: null,
            currentView: null,
            isDetail: false,
            multiStepsArray: [],
            selected: [],
            showMap: true,
            dialogMessageInfo: {},
            uuid: 0,
        };
        this.requestCount = 0;
        this.requestInfo = this.props.requestInfo
        this.keys = this.requestInfo.keys;
        this.selectedRow = {};
        this.sorting = false;
        this.selectedRegion = REGION_ALL
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.mapDetails = undefined
    }

    setSelected = (dataList) => {
        this.setState({ selected: dataList })
    }

    detailView = (data) => {
        let additionalDetail = this.requestInfo.additionalDetail
        this.props.handleViewMode(null)
        return (
            <Card style={{ height: 'calc(100% - 49px)', backgroundColor: '#292c33', borderRadius:5, overflowY: 'auto' }}>
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

    onDeleteWSResponse = (mcRequest) => {
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            let data = mcRequest.response.data
            let code = data.code
            let message = data.data.message
            mcRequest.wsObj.close()
            code === 200 ? this.dataFromServer(this.selectedRegion) : this.props.handleAlertInfo('error', message)
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
                let mcRequest = await serverData.sendRequest(this, action.onClick(data))
                if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
                    this.props.handleAlertInfo('success', `${mcRequest.request.success}`)
                    filterList.splice(filterList.indexOf(data), 1)
                    dataList.splice(dataList.indexOf(data), 1)
                    this.setState({ dataList: dataList, filterList: filterList })
                    valid = true;
                }
                if (action.onFinish) {
                    let error = undefined
                    if (mcRequest.error && mcRequest.error.response && mcRequest.error.response.data) {
                        error = mcRequest.error.response.data
                    }
                    action.onFinish(data, valid, error)
                }
            }
        }
    }

    onMultiResponse = (mcRequest) => {
        let orgData = mcRequest.request.orgData
        let data = orgData.data
        let action = orgData.action
        this.props.handleLoadingSpinner(false)
        if (mcRequest) {
            let responseData = undefined;
            if (mcRequest.response && mcRequest.response.data) {
                responseData = mcRequest.response.data;
            }
            let labels = action.multiStepperHeader
            this.setState({ multiStepsArray: updateStepper(this.state.multiStepsArray, labels, data, responseData, mcRequest.wsObj) })
        }
    }

    onDeleteMultiple = (action, data) => {
        this.props.handleLoadingSpinner(true)
        serverData.sendWSRequest(this, action.onClick(data), this.onMultiResponse, { action: action, data: data })
    }

    onUpdate = async (action, data, forceRefresh) => {
        if (forceRefresh || data[fields.updateAvailable]) {
            this.props.handleLoadingSpinner(true)
            serverData.sendWSRequest(this, action.onClick(data), this.onMultiResponse, { action: action, data: data })
        }
    }

    onPowerState = (action, data) => {
        let powerState = constant.PowerState(constant.POWER_STATE_POWER_STATE_UNKNOWN)
        switch (action.label) {
            case 'Power On':
                powerState = constant.PowerState(constant.POWER_STATE_POWER_ON)
                break;
            case 'Power Off':
                powerState = constant.PowerState(constant.POWER_STATE_POWER_OFF)
                break;
            case 'Reboot':
                powerState = constant.PowerState(constant.POWER_STATE_REBOOT)
                break;
        }
        data[fields.powerState] = powerState
        this.props.handleLoadingSpinner(true)
        serverData.sendWSRequest(this, action.onClick(data), this.onDeleteWSResponse, data)
    }

    onDialogClose = (valid) => {
        let action = this.state.dialogMessageInfo.action;
        let isMultiple = this.state.dialogMessageInfo.isMultiple;
        let data = this.state.dialogMessageInfo.data;
        this.setState({ dialogMessageInfo: {} })
        if (valid) {
            if (isMultiple) {
                data.map(item => {
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
                })
            }
            else {
                switch (action.label) {
                    case 'Delete':
                        this.onDelete(action, data)
                        break;
                    case 'Upgrade':
                        this.onUpdate(action, data)
                        break;
                    case 'Refresh':
                        this.onUpdate(action, data, true)
                        break;
                    case 'Power On':
                    case 'Power Off':
                    case 'Reboot':
                        this.onPowerState(action, data)
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
            switch (action.label) {
                case 'Delete':
                    this.onWarning(action, 'delete', false, data)
                    break
                case 'Upgrade':
                    this.onWarning(action, 'upgrade', false, data)
                    break;
                case 'Refresh':
                    this.onWarning(action, 'refresh', false, data)
                    break;
                case 'Power On':
                    this.onWarning(action, 'power on', false, data)
                    break;
                case 'Power Off':
                    this.onWarning(action, 'power off', false, data)
                    break;
                case 'Reboot':
                    this.onWarning(action, 'reboot', false, data)
                    break;
                default:
                    action.onClick(action, data)
            }
        }
    }

    onMapClick = (mapDataList) => {
        let filterList = this.onFilterValue()
        if (mapDataList) {
            this.mapDetails = mapDataList
            let coordinates = mapDataList.coordinates
            filterList = filterList.filter(data => {
                let cloudletLocation = data[fields.cloudletLocation]
                let lat = roundOff(cloudletLocation[fields.latitude])
                let lon = roundOff(cloudletLocation[fields.longitude])
                return mapDataList.name.includes(data[this.requestInfo.nameField]) && coordinates[0] === lat && coordinates[1] === lon
            })
        }
        this.setState({ filterList: filterList })
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
                        <Map dataList={this.state.filterList}
                             id={this.requestInfo.id}
                             onClick={this.onMapClick}
                             region={this.selectedRegion}
                             mapDetails={this.mapDetails}/>
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
                    groupActionClose={this.groupActionClose} />
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

    onFilterValue = (value) => {
        this.mapDetails = null
        let filterText = value ? value.toLowerCase() : ''
        let dataList = this.state.dataList
        let filterCount = 0
        let filterList = dataList.filter(data => {
            let valid = this.keys.map(key => {
                if (key.filter) {
                    filterCount = + 1
                    let tempData = data[key.field] ? data[key.field] : ''
                    return tempData.toLowerCase().includes(filterText)
                }
            })
            return filterCount === 0 || valid.includes(true)
        })
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

    render() {
        return (
            <Card style={{ width: '100%', height: '100%', backgroundColor: '#292c33', color: 'white', paddingTop:10 }}>
                <MexMessageDialog messageInfo={this.state.dialogMessageInfo} onClick={this.onDialogClose} />
                <MexMessageStream onClose={this.onCloseStepper} uuid={this.state.uuid} dataList={this.state.newDataList} dataFromServer={this.dataFromServer} streamType={this.requestInfo.streamType} region={this.selectedRegion} />
                <MexMultiStepper multiStepsArray={this.state.multiStepsArray} onClose={this.multiStepperClose} />
                <MexToolbar requestInfo={this.requestInfo} regions={this.regions} onAction={this.onToolbarAction} isDetail={this.state.isDetail}/>
                {this.state.currentView ? this.state.currentView : this.listView()}
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
        let requestInfo = this.requestInfo
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

        this.setState({
            dataList: Object.assign([], dataList),
            newDataList : newDataList
        })
        this.setState({ filterList: this.onFilterValue() })
        this.props.handleViewMode(this.requestInfo.viewMode);
    }

    dataFromServer = (region) => {
        this.setState({ dataList: [], filterList: [], selected: [], newDataList : [] })
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
        this.dataFromServer(REGION_ALL)
        this.props.handleViewMode(null)
    }
}

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MexListView));


