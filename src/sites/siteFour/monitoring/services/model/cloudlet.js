import _ from "lodash";
import * as serverData from "../../../../../services/model/serverData";
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

/*******************************************************
 * START GET LIST
 * If you want get list to like that 'getCloudletList()'
 
 *******************************************************/
export const getCloudletList = (self, param) => {
    _self = self;
    dataFromServer(REGION_ALL, _self, param.method);
};
