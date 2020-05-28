import _ from "lodash";
import * as serverData from "../../../../../services/model/serverData";
import {
    showCloudlets,
    streamCloudlet
} from "../../../../../services/model/cloudlet";
import { fields } from "../../../../../services/model/format";
import { showCloudletInfos } from "../../../../../services/model/cloudletInfo";
import * as ChartType from "../../formatter/chartType";

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

const dataFromServer = async (regions, self, method) => {
    dataList = [];
    filterList = [];
    selected = [];
    let requestInfo = _requestInfo;
    if (requestInfo) {
        let filterList = getFilterInfo(requestInfo(), regions);
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

const VCPU = "vCpuUsed"
const VCPUMAX = "vCpuMax"
const MEM = "memUsed"
const MEMMAX = "memMax"
const DISK = "diskUsed"
const DISKMAX = "diskMax"
const IP = "floatingIpsUsed"
const IPMAX = "floatingIpsMax"
const IPV4 = "ipv4Used"
const IPV4MAX = "ipv4Max"

interface eventData {
    time: string;
    cloudlet: string;
    cloudletorg: string;
    event: string;
    status: number;
}
function createData(time: string, cloudlet: string, cloudletorg: string, event: string, status: number): eventData {
    return { time, cloudlet, cloudletorg, event, status };
}
function createDataUtilization() {

}
const setdataPart = (data, name, columns) => {
    let setted = {};
    let seriesX = [];
    let seriesY = [];
    data.map((item, i) => {
        seriesX.push(item[0]);
        seriesY.push(item[columns.indexOf(name)])
    })
    let array =
    {
        x: seriesX,
        y: seriesY,
        max: [],
        mode: 'lines',
        name: 'Solid',
        line: {
            dash: 'solid',
            width: 1
        }
    }


    return setted[data[0][1] + "_" + data[0][2]] = array;

}
const createTime = (resSeries_utilize) => {
    let times = [];
    resSeries_utilize.map((value, i) => {
        times.push(value[0]);
    })
    return times;
}
const createMethods = (type, resSeries_utilize) => {
    let method = [];
    resSeries_utilize.map((value, i) => {
        method.push(type);
    })
    return method;
}

const parseData = (response, type) => {
    let resData = [];
    let times = [];
    let methods = [];
    let resData_util = {};
    let resData_ip = {};
    let resultParse = [];
    if (response && response.response && response.response.data.data) {
        response.response.data.data.map((data, i) => {

            const resSeries_utilize = (data.Series) ? data.Series[0] : null;
            const resSeries_ipuse = (data.Series) ? data.Series[1] : null;
            const columns_utilize = (data.Series) ? data.Series[0].columns : null;
            const columns_ipus = (data.Series) ? data.Series[1].columns : null;

            if (data.Series && data.Series.length > 0) {
                /** metrics of the cloudlets */

                times.push(resSeries_utilize ? createTime(resSeries_utilize.values) : null);
                methods.push(resSeries_utilize ? createMethods(type, resSeries_utilize.values) : null);

                const pathOneIdx = resSeries_utilize.columns.indexOf("cloudletorg");
                const pathTwoIdx = resSeries_utilize.columns.indexOf("cloudlet");

                let resultParse = {
                    path: resSeries_utilize.values[0][pathOneIdx] + "/" + resSeries_utilize.values[0][pathTwoIdx],
                    methods: methods,
                    times: times,
                    resData_util: [
                        {
                            [VCPU]: setdataPart(resSeries_utilize.values, VCPU, columns_utilize),
                            [MEM]: setdataPart(resSeries_utilize.values, MEM, columns_utilize),
                            [DISK]: setdataPart(resSeries_utilize.values, DISK, columns_utilize)
                        }
                    ],
                    resData_ip: [
                        {
                            [IP]: setdataPart(resSeries_ipuse.values, IP, columns_ipus),
                            [IPV4]: setdataPart(resSeries_ipuse.values, IPV4, columns_ipus)
                        }
                    ]
                }

                resData.push(resultParse);
            } else {
                console.log("ERROR ::: ", data);
            }


        })

    } else {
        console.log(" ERROR ::::::::::::::: Faile to request data")
        return resData;
    }

    return resData;
};
const metricFromServer = async (self, data) => {
    const requestData = {
        token: data.token,
        method: data.method,
        data: {
            region: data.pRegion,
            cloudlet: {
                organization: data.selectOrg,
                name: data.cloudletSelectedOne
            },
            last: data.last,
            selector: "*"
        }
    };
    const response = await serverData.sendRequest(self, requestData);
    return parseData(response, data.selectOrg + "/" + data.cloudletSelectedOne);
};

/** *****************************************************
 * START GET LIST
 ** **************************************************** */
export const getCloudletList = (self, param) => {
    if (!_self) _self = self;
    dataFromServer(REGION_ALL, _self, param.method);
};

export const getCloudletMetrics = async (self, params) => {
    if (!_self) _self = self;
    return await metricFromServer(_self, params);
};
