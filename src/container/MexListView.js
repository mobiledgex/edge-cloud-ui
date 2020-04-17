import React from 'react';
import { Card } from '@material-ui/core';

import './styles.css';
import _ from "lodash";
import { fields } from '../services/model/format';
import * as serverData from '../services/model/serverData';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import MexToolbar, { ACTION_CLOSE, ACTION_REGION, ACTION_REFRESH, REGION_ALL, ACTION_NEW, ACTION_MAP } from './MexToolbar';
import MexDetailViewer from '../hoc/dataViewer/DetailViewer';
import MexListViewer from '../hoc/listView/ListViewer';
import MexMessageStream, { CODE_FINISH } from '../hoc/stepper/mexMessageStream';
import MexMultiStepper, { updateStepper } from '../hoc/stepper/mexMessageMultiStream'
import { getUserRole } from '../services/model/format';
import MexMessageDialog from '../hoc/dialog/mexWarningDialog'
import Map from '../libs/simpleMaps/with-react-motion/index_clusters';



class MexListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            filterList: [],
            anchorEl: null,
            currentView: null,
            isDetail: false,
            stepsArray: [],
            multiStepsArray:[],
            showMap: true,
            dialogMessageInfo: {},
            uuid: 0,
            refresh: true,
        };
        this.requestCount = 0;
        this.keys = props.requestInfo.keys;
        this.selectedRow = {};
        this.sorting = false;
        this.selectedRegion = REGION_ALL
        let savedRegion = localStorage.regions ? localStorage.regions.split(",") : null;
        this.regions = props.regionInfo.region.length > 0 ? props.regionInfo.region : savedRegion
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

    detailView = (data) => {
        let additionalDetail = this.props.requestInfo.additionalDetail
        return (
            <Card style={{ height: '95%', backgroundColor: '#2A2C33', overflowY: 'auto' }}>
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

    onDelete = async (action) => {
        let filterList = this.state.filterList
        let dataList = this.state.dataList
        let data = this.selectedRow
        if (data) {
            if (action.ws) {
                this.props.handleLoadingSpinner(true);
                serverData.sendWSRequest(this, action.onClick(data), this.onDeleteWSResponse, data)
            }
            else {
                let valid = false
                let mcRequest = await serverData.sendRequest(this, action.onClick(data))
                if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
                    this.props.handleAlertInfo('success', `${mcRequest.request.success} deleted successfully`)
                    filterList.splice(filterList.indexOf(data), 1)
                    dataList.splice(dataList.indexOf(data), 1)
                    this.setState({ dataList:dataList, filterList: filterList})
                    valid = true;
                }
                if(action.onFinish)
                {
                    action.onFinish(data, valid)
                }
            }
        }
    }

    onUpdateResponse = (mcRequest) =>
    {
        let data =mcRequest.request.orgData
        this.props.handleLoadingSpinner(false)
        if (mcRequest) {
            let responseData = undefined;
            if (mcRequest.response && mcRequest.response.data) {
                responseData = mcRequest.response.data;
            }
            this.setState({ multiStepsArray: updateStepper(this.state.multiStepsArray, data[fields.uuid], responseData, data[this.props.requestInfo.nameField], mcRequest.wsObj) })
        }
    }
    
    onUpdate = async (action, data) =>
    { 
        if(data[fields.updateAvailable])
        {
            this.props.handleLoadingSpinner(true)
            serverData.sendWSRequest(this, action.onClick(data), this.onUpdateResponse, data)
        }
    }

    onDialogClose = (valid) => {
        let action = this.state.dialogMessageInfo.action;
        this.setState({ dialogMessageInfo: {} })
        if (valid) {
            switch (action.label) {
                case 'Delete':
                    this.onDelete(action)
                    break;
                case 'Upgrade':
                    let data = this.selectedRow
                    this.onUpdate(action, data)
                    break;

            }
        }
    }

    onWarning = async (action, data, actionLabel) => {
        this.setState({ dialogMessageInfo: { message: `Are you sure you want to ${actionLabel} ${data[this.props.requestInfo.nameField]}?`, action: action } });
    }

    /***Action Block */
    onActionClose = (action) => {
        let data = this.selectedRow;
        switch (action.label) {
            case 'Delete':
                this.onWarning(action, data, 'delete')
                break
            case 'Upgrade':
                this.onWarning(action, data, 'upgrade')
                break;
            default:
                action.onClick(action, data)
        }
    }

    groupActionClose = (action, dataList) => {
        let data = this.selectedRow;
        switch (action.label) {
            case 'Upgrade':
                dataList.map(data=>{
                    this.onUpdate(action, data)
                })
                break;
        }
    }
    /*Action Block*/
    listView = () => {
        let isMap = this.props.requestInfo.isMap && this.state.showMap
        return (
            <div className="mexListView">
                {isMap ?
                    <div className='panel_worldmap' style={{ height: 300 }}>
                        <Map dataList={this.state.filterList} id={this.props.requestInfo.id} />
                    </div> : null}
                <MexListViewer keys={this.keys} dataList={this.state.filterList} 
                    actionMenu={this.props.actionMenu} 
                    cellClick={this.getCellClick} 
                    actionClose={this.onActionClose} 
                    isMap={isMap} requestInfo={this.props.requestInfo} 
                    groupActionMenu={this.props.groupActionMenu}
                    groupActionClose={this.groupActionClose} />
            </div>)
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

    multiStepperClose = () => {
        this.state.multiStepsArray.map(item=>{
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

     onFilterValue = (e) => {
        let dataList = this.state.dataList
        let filterCount = 0
        let filterList = dataList.filter(data=>{
            let valid = this.keys.map(key=>{
                if(key.filter)
                {   
                    filterCount =+ 1
                    let tempData = data[key.field] ? data[key.field] : ''
                    return tempData.toLowerCase().includes(e.target.value.toLowerCase()) 
                }
            })
            return filterCount === 0 || valid.includes(true)
        })
        this.setState({filterList:filterList})
    }

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
                <MexMultiStepper multiStepsArray={this.state.multiStepsArray} onClose={this.multiStepperClose} header='App' />
                <MexToolbar requestInfo={this.props.requestInfo} onAction={this.onToolbarAction} isDetail={this.state.isDetail} onFilterValue={this.onFilterValue}/>
                {this.state.currentView ? this.state.currentView : this.listView()}
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
            dataList: dataList,
            filterList:dataList
        })
    }

    dataFromServer = (region) => {
        this.setState({ dataList: [], filterList:[] })
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


