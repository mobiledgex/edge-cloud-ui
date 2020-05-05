import _ from "lodash";
import * as serverData from "../../../../../services/model/serverData";
import * as serviceMC from "../../../../../services/model/serviceMC";
import {
    showCloudlets,
    streamCloudlet
} from "../../../../../services/model/cloudlet";
import { fields } from "../../../../../services/model/format";
import { showCloudletInfos } from "../../../../../services/model/cloudletInfo";

let dataList = [];
let filterList = [];
let selected = [];
let _self = null;
const REGION_ALL = 1;
let requestCount = 2;
let regions = localStorage.regions ? localStorage.regions.split(",") : [];

const _requestInfo = () => {
    return {
        id: "Cloudlets",
        headerLabel: "Cloudlets",
        nameField: fields.cloudletName,
        requestType: [showCloudlets, showCloudletInfos],
        streamType: streamCloudlet,
        isRegion: true,
        isMap: true,
        sortBy: [fields.region, fields.cloudletName]
    };
};

const getFilterInfo = (requestInfo, region) => {
    let filterList = [];
    if (requestInfo.isRegion) {
        if (region === REGION_ALL) {
            for (let i = 0; i < regions.length; i++) {
                region = regions[i];
                let filter =
                    requestInfo.filter === undefined ? {} : requestInfo.filter;
                filter[fields.region] = region;
                filterList.push(filter);
            }
        } else {
            let filter =
                requestInfo.filter === undefined ? {} : requestInfo.filter;
            filter[fields.region] = region;
            filterList.push(filter);
        }
    } else {
        let filter = requestInfo.filter === undefined ? {} : requestInfo.filter;
        filterList.push(filter);
    }
    return filterList;
};

const onServerResponse = mcRequestList => {
    requestCount -= 1;
    let requestInfo = _requestInfo();
    let newDataList = [];
    if (mcRequestList && mcRequestList.length > 0) {
        let mcRequest = mcRequestList[0];
        if (mcRequest.response && mcRequest.response.data) {
            newDataList = mcRequest.response.data;
        }
    }
    if (newDataList.length > 0) {
        newDataList = _.orderBy(newDataList, requestInfo.sortBy);
        dataList = [...dataList, ...newDataList];

        _self.props.onLoadComplete({ [requestInfo.id]: dataList });
    }
    if (requestCount === 0 && dataList.length === 0) {
        if (_self) {
            //_self.props.handleLoadingSpinner(false);
            _self.props.handleAlertInfo("error", "Requested data is empty");
        }
    }

    return new Promise((resolve, reject) => {
        resolve(dataList);
    });
};

const dataFromServer = async (region, self, method) => {
    dataList = [];
    filterList = [];
    selected = [];
    let requestInfo = _requestInfo;
    if (requestInfo) {
        let filterList = getFilterInfo(requestInfo(), region);
        requestCount = filterList.length;
        if (filterList && filterList.length > 0) {
            //self.props.handleLoadingSpinner(true);
            for (let i = 0; i < filterList.length; i++) {
                let filter = filterList[i];
                serverData.showMultiDataFromServer(
                    self,
                    requestInfo().requestType,
                    filter,
                    onServerResponse
                );
            }
        } else {
            // serverData.showMultiDataFromServer(
            //     self,
            //     requestInfo().requestType,
            //     onServerResponse
            // );
        }
    }
};

// TODO: 클라우드렛 당 메트릭스 데이터 가져오기, 모든 region에 모든 cloudlet에 대한 메트릭스 데이터 
// 한번에 하나씩 가져와 쌓는 구조, 로딩 속도 문제 해결 방안
const metricFromServer = async (region, self, method) => {
    let requestData = { region: "" };
    let response = await serverData.sendRequest(
        self,
        makeFormForCloudletLevelMatric(requestData)
    );
    _self.props.onLoadComplete(response);
};
const makeFormForCloudletLevelMatric = (dataOne, valid = "*", token, fetchingDataNo = 20, pStartTime = "", pEndTime = "") => {
    let formBody = {
        token: token,
        params: {
            region: dataOne.Region,
            cloudlet: {
                organization: dataOne.Operator,
                name: dataOne.CloudletName
            },
            last: fetchingDataNo,
            selector: "*"
        }
    };

    return formBody;
};
/*******************************************************
 * START GET LIST
 * 
 
 *******************************************************/
export const getCloudletList = (self, param) => {
    if (!_self) _self = self;
    dataFromServer(REGION_ALL, _self, param.method);
};

export const getCloudletMetrics = (self, param) => {
    console.log("20200504 get cloudlet metrics.. ", param);
    if (!_self) _self = self;
    metricFromServer(REGION_ALL, _self, param.method);
};
