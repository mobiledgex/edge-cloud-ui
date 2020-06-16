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

const dataList = [];
const filterList = [];
const selected = [];
let _self = null;
const REGION_ALL = 1;
const requestCount = 2;
const regions = localStorage.regions ? localStorage.regions.split(",") : [];

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

const TCP = "tcp";
const UDP = "udp";
const NETWORK = "network";
const CPU = "cpu";
const DISK = "disk";
const MEM = "mem";
const metricsKey = [TCP, UDP, CPU, DISK, MEM];

const setdataPart = (data, name, max, columns) => {
    const setted = {};
    const seriesX = [];
    const seriesY = [];
    const seriesMax = [];
    data.map((item, i) => {
        seriesX.push(item[0]);
        seriesY.push(item[columns.indexOf(name)]);
        seriesMax.push(item[columns.indexOf(max)]);
    });
    const array = {
        x: seriesX,
        y: seriesY,
        max: seriesMax,
        mode: "lines",
        name: "Solid",
        line: {
            dash: "solid",
            width: 1
        }
    };


    return setted[data[0][1] + "_" + data[0][2]] = array;
};
const createTime = resSeries_utilize => {
    const times = [];
    resSeries_utilize.map((value, i) => {
        times.push(value[0]);
    });
    return times;
};
const createMethods = (type, resSeries_utilize) => {
    const method = [];
    resSeries_utilize.map((value, i) => {
        method.push(type);
    });
    return method;
};

const makeData = (key, cluster, i) => {
    let keyValue = null;

    if (key && key.values) {
        key.values.map(value => {
            if (value[i] === cluster) {
                keyValue = value;
                // console.log('20200612 data true', keyValue);
            }
        });
    }

    return keyValue;
};

const parseData = (response, type, clusterName) => {
    const resData = [];
    const times = [];
    const methods = [];

    if (response && response.response && response.response.data.data) {
        response.response.data.data.map((data, i) => {
            let tcp = null;
            let udp = null;
            let network = null;
            let cpu = null;
            let mem = null;
            let disk = null;

            if (data.Series && data.Series.length > 0) {
                metricsKey.map(id => {
                    if (id === TCP) {
                        const index = (data.Series) ? data.Series.findIndex(g => g.name === "cluster-" + id) : 0;
                        tcp = (data.Series) ? data.Series[index] : null;
                    }
                    if (id === UDP) {
                        const index = (data.Series) ? data.Series.findIndex(g => g.name === "cluster-" + id) : 0;
                        udp = (data.Series) ? data.Series[index] : null;
                    }
                    if (id === NETWORK) {
                        const index = (data.Series) ? data.Series.findIndex(g => g.name === "cluster-" + id) : 0;
                        network = (data.Series) ? data.Series[index] : null;
                    }
                    if (id === MEM) {
                        const index = (data.Series) ? data.Series.findIndex(g => g.name === "cluster-" + id) : 0;
                        mem = (data.Series) ? data.Series[index] : null;
                    }
                    if (id === DISK) {
                        const index = (data.Series) ? data.Series.findIndex(g => g.name === "cluster-" + id) : 0;
                        disk = (data.Series) ? data.Series[index] : null;
                    }
                    if (id === CPU) {
                        const index = (data.Series) ? data.Series.findIndex(g => g.name === "cluster-" + id) : 0;
                        cpu = (data.Series) ? data.Series[index] : null;
                    }
                });

                console.log("20200612 data", tcp, udp, network, cpu, mem, disk);

                // let keys = (data.Series && data.Series[0].columns) ? data.Series[0].columns : []

                const findCluster = data.Series[0].columns.findIndex(x => x === "cluster");
                const findCpu = cpu.columns.findIndex(x => x === CPU);
                const findMem = disk.columns.findIndex(x => x === MEM);
                const findDisk = mem.columns.findIndex(x => x === DISK);

                // let cpuValue = cpu? makeData(cpu, clusterName, findCluster) : null;
                // let memValue = mem? makeData(mem, clusterName, findCluster) : null;
                // let diskValue = disk? makeData(disk, clusterName, findCluster) : null;
                //
                const tcpValue = tcp ? tcp.values[0] : null;
                const udpValue = udp ? udp.values[0] : null;
                const networkValue = network ? network.values[0] : null;
                const cpuValue = cpu ? cpu.values[0] : null;
                const memValue = mem ? mem.values[0] : null;
                const diskValue = disk ? disk.values[0] : null;

                console.log("20200612 res", tcpValue, udpValue, networkValue, cpuValue, memValue, diskValue);

                // let dataForm = {cluster: clusterName, cpu: cpuValue[findCpu], mem: memValue[findMem], diskValue: diskValue[findDisk]}
                const pathOneIdx = data.Series[0].columns.findIndex(x => x === "cluster");
                const pathTwoIdx = data.Series[0].columns.findIndex(x => x === "cloudlet");

                const resultParse = {
                    path: data.Series[0].values[0][pathOneIdx] + "/" + data.Series[0].values[0][pathTwoIdx],
                    methods,
                    resData_util: [
                        {
                            [CPU]: cpuValue[findCpu],
                            [MEM]: memValue[findMem],
                            [DISK]: diskValue[findDisk]
                        }
                    ],
                    resData_network: [
                        {
                            [TCP]: null,
                            [UDP]: null,
                            [NETWORK]: null
                        }
                    ]
                };


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
    return parseData(response, data.selectOrg + "/" + data.clusterSelectedOne, data.clusterSelectedOne);
};

export const getClusterMetrics = async (self, params) => {
    if (!_self) _self = self;
    return await metricFromServer(_self, params);
};
