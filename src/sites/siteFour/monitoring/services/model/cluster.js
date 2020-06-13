import moment from "moment";
import orderBy from "lodash/orderBy";
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

const oneHourWithCurrent = moment().subtract(1, "minutes").toString();

const makeUTC = time => moment(time).utc();
const rangeTime = range => {
    let time = null;
    if (range === "start") {
        time = makeUTC(oneHourWithCurrent);
    } else {
        time = makeUTC(moment());
    }
    return time;
};


// TODO: 클라우드렛 당 메트릭스 데이터 가져오기, 모든 region에 모든 cloudlet에 대한 메트릭스 데이터 
// 한번에 하나씩 가져와 쌓는 구조, 로딩 속도 문제 해결 방안

const CPU = "cpu"
const DISK = "disk"
const MEM = "mem"
const metricsKey = [CPU, DISK, MEM]

const setdataPart = (data, name, max, columns) => {
    let setted = {};
    let seriesX = [];
    let seriesY = [];
    let seriesMax = [];
    data.map((item, i) => {
        seriesX.push(item[0]);
        seriesY.push(item[columns.indexOf(name)]);
        seriesMax.push(item[columns.indexOf(max)]);
    })
    let array =
    {
        x: seriesX,
        y: seriesY,
        max: seriesMax,
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

    if (response && response.response && response.response.data.data) {
        response.response.data.data.map((data, i) => {
            let udp = null;
            let tcp = null;
            let mem = null;
            let disk = null;
            let cpu = null;
            metricsKey.map((id) => {
                const index = (data.Series) ? data.Series.findIndex(g => g.name === "cluster-"+id) : 0;
                if(id = "udp") {
                    udp = (data.Series) ? data.Series[index] : null;
                }
                if(id = "tcp") {
                    tcp = (data.Series) ? data.Series[index] : null;
                }
                if(id = "mem") {
                    mem = (data.Series) ? data.Series[index] : null;
                }
                if(id = "disk") {
                    disk = (data.Series) ? data.Series[index] : null;
                }
                if(id = "cpu") {
                    cpu = (data.Series) ? data.Series[index] : null;
                }
            })

            console.log('20200612 data', cpu, disk, mem)



            const resSeries_utilize = (data.Series) ? data.Series[0] : null;
            const resSeries_ipuse = (data.Series) ? data.Series[1] : null;
            const columns_utilize = (data.Series) ? data.Series[0].columns : null;
            const columns_ipus = (data.Series) ? data.Series[1].columns : null;

            if (data.Series && data.Series.length > 0) {


                return resData;

            } else {
                console.log("ERROR ::: ", data);
            }


        })
        return resData;

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
            clusterInst: {
                organization: data.selectOrg,
                name: data.clusterSelectedOne
            },
            starttime: rangeTime("start"),
            endtime: rangeTime("end"),
            // last: data.last,
            selector: "*"
        }
    };
    const response = await serverData.sendRequest(self, requestData);
    return parseData(response, data.selectOrg + "/" + data.clusterSelectedOne);
};

export const getClusterMetrics = async (self, params) => {
    if (!_self) _self = self;
    return await metricFromServer(_self, params);
};
