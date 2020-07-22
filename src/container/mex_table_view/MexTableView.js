import React, { Component } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import * as serverData from '../../services/model/serverData';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import {tableIcons} from './MexTableIcon'


class MexTableView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataList : []
        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : null;
        this.requestInfo = props.requestInfo
        //Component customization
        this.components = {
            Toolbar: props => {
                return(
                <div style={{ backgroundColor: '#292C33', paddingTop: 10, marginBottom: 10 }}>
                    <MTableToolbar {...props} />
                </div>
            )}
        }
    }

    /***Data From Server */
    requestLastResponse = (data) => {
        if (this.state.uuid === 0) {
            let type = 'error'
            if (data.code === 200) {
                type = 'success'
            }
            if (data.message !== `Key doesn't exist`) {
                this.props.handleAlertInfo(type, data.message)
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

    sendWSRequest = (data) => {
        let stream = this.props.requestInfo.streamType;
        if (stream) {
            let valid = false
            let state = data[fields.state];
            if (state === 2 || state === 3 || state === 6 || state === 7 || state === 9 || state === 10 || state === 12 || state === 13 || state === 14) {
                valid = true
            }
            else if (data[fields.powerState]) {
                let powerState = data[fields.powerState];
                if (powerState !== 0 && powerState !== 3 && powerState !== 6 && powerState !== 9 && powerState !== 10) {
                    valid = true
                }
            }
            if (valid) {
                serverData.sendWSRequest(this, stream(data), this.requestResponse)
            }
        }
    }

    streamProgress = (dataList) => {
        let stream = this.requestInfo.streamType;
        if (stream) {
            for (let i = 0; i < dataList.length; i++) {
                let data = dataList[i];
                if (data[fields.state] !== 5) {
                    this.sendWSRequest(data)
                }
            }
        }
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
            if (requestData.region) {
                dataList = dataList.filter(function (obj) {
                    return obj[fields.region] !== requestData.region;
                });
            }
        }

        if (newDataList.length > 0) {
            newDataList = orderBy(newDataList, requestInfo.sortBy)
            this.streamProgress(newDataList)
            dataList = [...dataList, ...newDataList]
        }

        this.setState({
            dataList: Object.assign([], dataList)
        })
        this.props.handleViewMode(this.props.requestInfo.viewMode);
    }

    dataFromServer = (region) => {
        this.setState({ dataList: []})
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

    render() {
        return (
            <div style={{ maxWidth: "100%" }}>
                <MaterialTable
                    icons={tableIcons}
                    components={this.components}
                />
            </div>
        )
    }

    componentDidMount() {
        //this.dataFromServer(REGION_ALL)
        //this.props.handleViewMode(null)
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(MexTableView));