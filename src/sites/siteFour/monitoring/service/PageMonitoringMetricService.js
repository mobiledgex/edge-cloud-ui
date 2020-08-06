import axios from "axios";
import type {TypeAppInst, TypeClientLocation, TypeCloudlet, TypeCluster} from "../../../../shared/Types";
import {SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLUSTER_INST} from "../../../../services/endPointTypes";
import {
    APP_INST_MATRIX_HW_USAGE_INDEX,
    CLOUDLET_METRIC_COLUMN,
    FULFILLED,
    METRIC_DATA_FETCH_TIMEOUT,
    MEX_PROMETHEUS_APPNAME,
    USER_TYPE,
    USER_TYPE_SHORT
} from "../../../../shared/Constants";
import {mcURL, sendSyncRequest} from "../../../../services/serviceMC";
import {isEmpty, makeFormForCloudletLevelMatric, makeFormForClusterLevelMatric, showToast} from "./PageMonitoringCommonService";
import PageMonitoringView, {source} from "../view/PageMonitoringView";
import {
    APP_INST_EVENT_LOG_ENDPOINT,
    APP_INST_METRICS_ENDPOINT,
    CLOUDLET_EVENT_LOG_ENDPOINT,
    CLOUDLET_METRICS_ENDPOINT,
    CLUSTER_EVENT_LOG_ENDPOINT,
    CLUSTER_METRICS_ENDPOINT,
    SHOW_APP_INST_CLIENT_ENDPOINT,
    SHOW_METRICS_CLIENT_STATUS
} from "./PageMonitoringMetricEndPoint";
import {makeCompleteDateTime, makeFormForAppLevelUsageList} from "./PageMonitoringService";
import {graphDataCount} from "../common/PageMonitoringProps";
import * as dateUtil from "../../../../utils/date_util";

export const requestShowAppInstClientWS = (pCurrentAppInst, _this: PageMonitoringView) => {
    try {

        let AppName = pCurrentAppInst.split('|')[0].trim()
        let Cloudlet = pCurrentAppInst.split('|')[1].trim()
        let ClusterInst = pCurrentAppInst.split('|')[2].trim()
        let Version = pCurrentAppInst.split('|')[3].trim()
        let Region = pCurrentAppInst.split('|')[4].trim()
        let HealthCheck = pCurrentAppInst.split('|')[5].trim()
        let Operator = pCurrentAppInst.split('|')[6].trim()
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        let organization = localStorage.selectOrg.toString()

        const webSocket = new WebSocket(`${mcURL(true)}/ws${SHOW_APP_INST_CLIENT_ENDPOINT}`)
        let showAppInstClientRequestForm = {
            "Region": Region,
            "AppInstClientKey": {
                "key": {
                    "app_key": {
                        "name": AppName,
                        "organization": organization,
                        "version": Version,
                    },
                    "cluster_inst_key": {
                        "cluster_key": {
                            "name": ClusterInst,
                        },
                        "organization": organization,
                        "cloudlet_key": {
                            "name": Cloudlet,
                            "organization": Operator
                        }
                    }
                }
            }
        }


        webSocket.onopen = () => {
            try {
                _this.props.toggleLoading(false)

                webSocket.send(JSON.stringify({
                    token: token,
                }))
                webSocket.send(JSON.stringify(showAppInstClientRequestForm))
            } catch (e) {
                //alert(e.toString())
            }
        }


        let appInstCount = 0;
        let interval = null;
        webSocket.onmessage = async (event) => {
            try {

                _this.props.toggleLoading(true)
                appInstCount++;

                let data = JSON.parse(event.data);
                let uniqueId = data.data.client_key.unique_id;
                let unique_id_type = data.data.client_key.unique_id_type;
                if (data.code === 200) {
                    _this.setState({
                        loading: true,
                    })
                }
                let clientLocationOne: TypeClientLocation = data.data.location;
                if (!isEmpty(uniqueId)) {
                    clientLocationOne.uuid = uniqueId;
                    clientLocationOne.unique_id_type = unique_id_type;
                    let serverLocation = pCurrentAppInst.split('|')[7].trim()
                    clientLocationOne.serverLocInfo = JSON.parse(serverLocation)
                }

                _this.setState({
                    selectedClientLocationListOnAppInst: _this.state.selectedClientLocationListOnAppInst.concat(clientLocationOne),
                }, () => {
                });

                setTimeout(() => {
                    _this.setState({
                        loading: false,
                    })
                    _this.props.toggleLoading(false)
                }, 20)

            } catch (e) {
            }
        }


        webSocket.onerror = (event) => {
            setTimeout(() => {
                _this.setState({
                    loading: false,
                })
                _this.props.toggleLoading(false)
            }, 15)
        };

        webSocket.onclose = function (event) {
            _this.props.toggleLoading(false)
        };

        return webSocket;
    } catch (e) {

    }

}


/**
 *
 * @param pRegionList
 * @param _this
 * @returns {Promise<[]>}
 */
export const fetchAppInstList = async (pRegionList: string[] = localStorage.getItem('regions').split(","), _this: PageMonitoringView) => {
    try {
        let promiseList = []
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        for (let index = 0; index < pRegionList.length; index++) {
            let requestData = {
                showSpinner: false,
                token: store.userToken,
                method: SHOW_APP_INST,
                data: {region: pRegionList[index]}
            }
            promiseList.push(sendSyncRequest(this, requestData))
        }

        let promisedShowAppInstList = await Promise.all(promiseList);

        let mergedAppInstanceList = [];
        promisedShowAppInstList.map((item, index) => {
            let listOne = item.response.data;
            let mergedList = mergedAppInstanceList.concat(listOne);
            mergedAppInstanceList = mergedList;
        })


        let filteredAppInstList = []
        if (_this.state.userType.includes(USER_TYPE_SHORT.ADMIN)) {
            filteredAppInstList = mergedAppInstanceList;
        } else {//todo: DEV, OPER
            filteredAppInstList = mergedAppInstanceList.filter((item: TypeAppInst, index) => {
                return item.AppName !== MEX_PROMETHEUS_APPNAME
            })
        }

        let resultWithColorCode = []
        filteredAppInstList.map((item, index) => {
            item.colorCodeIndex = index;
            resultWithColorCode.push(item)
        })


        return resultWithColorCode;
    } catch (e) {
        //throw new Error(e)
    }
}


export const fetchCloudletList = async () => {
    try {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        let regionList = localStorage.getItem('regions').split(",");

        let promiseList = []
        for (let i in regionList) {
            let requestData = {showSpinner: false, token: token, method: SHOW_CLOUDLET, data: {region: regionList[i]}}
            promiseList.push(sendSyncRequest(this, requestData))
        }
        let orgCloudletList = await Promise.all(promiseList);
        let mergedCloudletList = [];
        orgCloudletList.map(item => {
            //@todo : null check
            if (item.response.data.length > 0) {
                let cloudletList = item.response.data;
                cloudletList.map(item => {
                    mergedCloudletList.push(item);
                })
            }
        })

        let userType = localStorage.getItem('selectRole').toString().toLowerCase();

        //@todo: when oper role
        if (userType.includes(USER_TYPE.OPERATOR)) {
            let currentSelectedOrg = localStorage.getItem('selectOrg').toString().trim();
            let result = mergedCloudletList.filter((item: TypeCloudlet, index) => {
                return item.Operator === currentSelectedOrg
            })
            result.sort((a: TypeCloudlet, b: TypeCloudlet) => {
                if (a.CloudletName < b.CloudletName) {
                    return -1;
                }
                if (a.CloudletName > b.CloudletName) {
                    return 1;
                }
                return 0;
            })


            let resultWithColorCode = []
            result.map((item, index) => {
                item.colorCodeIndex = index;
                resultWithColorCode.push(item)
            })

            return resultWithColorCode;

        } else {


            return mergedCloudletList;
        }


    } catch (e) {
        //showToast( e.toString())
    }
}


export const fetchClusterList = async () => {
    try {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        let regionList = localStorage.getItem('regions').split(",");
        let promiseList = []
        for (let i in regionList) {
            let requestData = {
                showSpinner: false,
                token: token,
                method: SHOW_CLUSTER_INST,
                data: {region: regionList[i]}
            }
            promiseList.push(sendSyncRequest(this, requestData))
        }

        let showClusterList = await Promise.all(promiseList);
        let mergedClusterList = [];
        showClusterList.map(item => {
            //@todo : null check
            if (!isEmpty(item.response.data)) {
                let clusterList = item.response.data;
                clusterList.map(item => {
                    mergedClusterList.push(item);
                })
            }
        })


        let finalResult = []

        if (localStorage.getItem('selectRole').includes('Admin')) {
            finalResult = mergedClusterList;
        } else if (localStorage.getItem('selectRole').includes('Oper')) {
            finalResult = mergedClusterList;
        } else {
            //todo: Filter to fetch only those belonging to the current organization
            mergedClusterList.map(item => {
                if (item.OrganizationName === localStorage.selectOrg) {
                    finalResult.push(item)
                }
            })
        }

        let resultWithColorCode = []
        finalResult.map((item, index) => {
            item.colorCodeIndex = index;
            resultWithColorCode.push(item)
        })

        return resultWithColorCode;
    } catch (e) {

    }
}


export const getAppInstLevelUsageList = async (appInstanceList, pHardwareType, dataLimitCount, pStartTime = '', pEndTime = '', userType = '') => {
    try {
        let instanceBodyList = []
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null;
        for (let index = 0; index < appInstanceList.length; index++) {
            //todo: Create a data FORM format for requests
            let instanceInfoOneForm = makeFormForAppLevelUsageList(appInstanceList[index], pHardwareType, store.userToken, dataLimitCount, pStartTime, pEndTime)
            instanceBodyList.push(instanceInfoOneForm);
        }

        let promiseList = []
        for (let index = 0; index < instanceBodyList.length; index++) {
            promiseList.push(getAppInstLevelMetric(instanceBodyList[index]))
        }


        //todo: Bring health check list(cpu,mem,network,disk..) to the number of apps instance, by parallel request
        let appInstanceHwUsageList = []
        appInstanceHwUsageList = await Promise.allSettled(promiseList);

        let usageListForAllInstance = []
        appInstanceList.map((item, index) => {
            usageListForAllInstance.push({
                instanceData: appInstanceList[index],
                appInstanceHealth: appInstanceHwUsageList[index].value,
            });
        })


        let allUsageList = []
        usageListForAllInstance.map((item, index) => {
            let appName = item.instanceData.AppName
            let Cloudlet = item.instanceData.Cloudlet
            let ClusterInst = item.instanceData.ClusterInst

            let sumMemUsage = 0;
            let sumDiskUsage = 0;
            let sumRecvBytes = 0;
            let sumSendBytes = 0;
            let sumCpuUsage = 0;
            let sumActiveConnection = 0;
            let sumHandledConnection = 0
            let sumAcceptsConnection = 0
            let columns = []
            let cpuSeriesList = []
            let memSeriesList = []
            let diskSeriesList = []
            let networkSeriesList = []
            let connectionsSeriesList = []

            if (item.appInstanceHealth !== undefined) {
                let series = item.appInstanceHealth.data["0"].Series;
                if (series !== null) {
                    if (series["3"] !== undefined) {
                        let cpuSeries = series["3"]
                        columns = cpuSeries.columns;
                        cpuSeriesList = cpuSeries.values;
                        cpuSeries.values.map(item => {
                            let cpuUsage = item[APP_INST_MATRIX_HW_USAGE_INDEX.CPU];//cpuUsage..index
                            sumCpuUsage += cpuUsage;
                        })
                    }

                    //todo:MEM
                    if (series["1"] !== undefined) {
                        let memSeries = series["1"]
                        columns = memSeries.columns;
                        memSeriesList = memSeries.values;
                        memSeries.values.map(item => {
                            let usageOne = item[APP_INST_MATRIX_HW_USAGE_INDEX.MEM];//memUsage..index
                            sumMemUsage += usageOne;
                        })
                    }

                    //todo:DISK
                    if (series["2"] !== undefined) {
                        let diskSeries = series["2"]
                        diskSeriesList = diskSeries.values;
                        diskSeries.values.map(item => {
                            let usageOne = item[APP_INST_MATRIX_HW_USAGE_INDEX.DISK];//diskUsage..index
                            sumDiskUsage += usageOne;
                        })
                    }

                    //todo: SENDBYTES, RECVBYTES , CONNECTION
                    if (series["4"] !== undefined) {
                        let networkSeries = series["4"]
                        columns = networkSeries.columns;
                        networkSeriesList = networkSeries.values;
                        networkSeries.values.map(item => {
                            let sendBytesOne = item[APP_INST_MATRIX_HW_USAGE_INDEX.BYTESSENT];//sentBytesOne
                            sumSendBytes += sendBytesOne;
                            let recvBytesOne = item[APP_INST_MATRIX_HW_USAGE_INDEX.BYTESRECVD];//recvBytesOne
                            sumRecvBytes += recvBytesOne;
                            let connection1One = item[APP_INST_MATRIX_HW_USAGE_INDEX.ACTIVE];//1
                            sumActiveConnection += connection1One;
                            let connection2One = item[APP_INST_MATRIX_HW_USAGE_INDEX.HANDLED];//2
                            sumHandledConnection += connection2One;
                            let connection3One = item[APP_INST_MATRIX_HW_USAGE_INDEX.ACCEPTS];//3
                            sumAcceptsConnection += connection3One;
                        })
                    }

                    allUsageList.push({
                        instance: item.instanceData,
                        columns: columns,
                        sumCpuUsage: sumCpuUsage / dataLimitCount,
                        sumMemUsage: Math.ceil(sumMemUsage / dataLimitCount),
                        sumDiskUsage: Math.ceil(sumDiskUsage / dataLimitCount),
                        sumRecvBytes: Math.ceil(sumRecvBytes / dataLimitCount),
                        sumSendBytes: Math.ceil(sumSendBytes / dataLimitCount),
                        sumActiveConnection: Math.ceil(sumActiveConnection / dataLimitCount),
                        sumHandledConnection: Math.ceil(sumHandledConnection / dataLimitCount),
                        sumAcceptsConnection: Math.ceil(sumAcceptsConnection / dataLimitCount),
                        cpuSeriesList,
                        memSeriesList,
                        diskSeriesList,
                        networkSeriesList,
                        appName,
                        Cloudlet,
                        ClusterInst,
                    })

                } else {//@todo: If series data is null
                    allUsageList.push({
                        instance: item.instanceData,
                        columns: "",
                        sumCpuUsage: 0,
                        sumMemUsage: 0,
                        sumDiskUsage: 0,
                        sumRecvBytes: 0,
                        sumSendBytes: 0,
                        sumActiveConnection: 0,
                        sumHandledConnection: 0,
                        sumAcceptsConnection: 0,
                        values: [],
                        appName,
                        Cloudlet,
                        ClusterInst,
                    })
                }
            }

        })


        let resultWithColorCode = []
        allUsageList.map((item, index) => {
            item.colorCodeIndex = index;
            resultWithColorCode.push(item)
        })


        return resultWithColorCode;
    } catch (e) {
    }

}


/**
 *
 * @param clusterList
 * @param pHardwareType
 * @param pStartTime
 * @param pEndTime
 * @returns {Promise<[]|Array>}
 */
export const getClusterLevelUsageList = async (clusterList, pHardwareType, dataLimitCount, pStartTime = '', pEndTime = '', _this: PageMonitoringView) => {
    try {
        let instanceBodyList = []
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';

        for (let index = 0; index < clusterList.length; index++) {
            let instanceInfoOneForm = makeFormForClusterLevelMatric(clusterList[index], pHardwareType, token, dataLimitCount, pStartTime, pEndTime)
            instanceBodyList.push(instanceInfoOneForm);
        }

        let promiseList = []
        for (let index = 0; index < instanceBodyList.length; index++) {
            promiseList.push(getClusterLevelMatric(instanceBodyList[index], token))
        }
        let promiseClusterLevelUsageList = await Promise.allSettled(promiseList);

        let newClusterLevelUsageList = []
        promiseClusterLevelUsageList.map((itemOne, index) => {
            let item = itemOne.value
            let status = itemOne.status

            let sumSendBytes = 0;
            let sumRecvBytes = 0;
            let sumUdpSent = 0;
            let sumUdpRecv = 0;
            let sumUdpRecvErr = 0;
            let sumTcpConns = 0;
            let sumTcpRetrans = 0;
            let sumMemUsage = 0;
            let sumDiskUsage = 0;
            let sumCpuUsage = 0;
            let columns = []
            let cluster = ''
            let dev = '';
            let cloudlet = '';
            let operator = '';

            if (item.data["0"].Series !== null && status === FULFILLED) {

                columns = item.data["0"].Series["0"].columns
                let udpSeriesList = item.data["0"].Series["0"].values
                let tcpSeriesList = item.data["0"].Series["1"].values
                let networkSeriesList = item.data["0"].Series["2"].values
                let memSeriesList = item.data["0"].Series["3"].values
                let diskSeriesList = item.data["0"].Series["4"].values
                let cpuSeriesList = item.data["0"].Series["5"].values
                udpSeriesList.map(item => {
                    sumUdpSent += item[12];
                    sumUdpRecv += item[13];
                    sumUdpRecvErr += item[14];
                })

                tcpSeriesList.map(item => {
                    sumTcpConns += item[10]
                    sumTcpRetrans += item[11]
                })

                networkSeriesList.map(item => {
                    sumSendBytes += item[8]
                    sumRecvBytes += item[9]
                })

                memSeriesList.map(item => {
                    sumMemUsage += item[6]
                })

                diskSeriesList.map(item => {
                    sumDiskUsage += item[7]
                })

                cpuSeriesList.map(item => {
                    sumCpuUsage += item[5]
                })

                newClusterLevelUsageList.push({
                    cluster: clusterList[index].ClusterName,
                    cloudletLocation: clusterList[index].CloudletLocation,
                    dev: clusterList[index].Region,
                    cloudlet: clusterList[index].Cloudlet,
                    operator: clusterList[index].Operator,
                    sumUdpSent: sumUdpSent / dataLimitCount,
                    sumUdpRecv: sumUdpRecv / dataLimitCount,
                    sumUdpRecvErr: sumUdpRecvErr / dataLimitCount,
                    sumTcpConns: sumTcpConns / dataLimitCount,
                    sumTcpRetrans: sumTcpRetrans / dataLimitCount,
                    sumSendBytes: sumSendBytes / dataLimitCount,
                    sumRecvBytes: sumRecvBytes / dataLimitCount,
                    sumMemUsage: sumMemUsage / dataLimitCount,
                    sumDiskUsage: sumDiskUsage / dataLimitCount,
                    sumCpuUsage: sumCpuUsage / dataLimitCount,
                    columns: columns,
                    udpSeriesList,
                    tcpSeriesList,
                    networkSeriesList: networkSeriesList,
                    memSeriesList,
                    diskSeriesList,
                    cpuSeriesList,

                })

            } else {//Seires is null
                newClusterLevelUsageList.push({
                    cluster: clusterList[index].ClusterName,
                    cloudletLocation: clusterList[index].CloudletLocation,
                    dev: clusterList[index].Region,
                    cloudlet: clusterList[index].Cloudlet,
                    operator: clusterList[index].Operator,
                    sumUdpSent: 0,
                    sumUdpRecv: 0,
                    sumUdpRecvErr: 0,
                    sumTcpConns: 0,
                    sumTcpRetrans: 0,
                    sumSendBytes: 0,
                    sumRecvBytes: 0,
                    sumMemUsage: 0,
                    sumDiskUsage: 0,
                    sumCpuUsage: 0,
                    columns: 0,
                    udpSeriesList: [],
                    tcpSeriesList: [],
                    networkSeriesList: [],
                    memSeriesList: [],
                    diskSeriesList: [],
                    cpuSeriesList: [],
                })
            }

        })

        let newClusterUsageListWithColorCode = []
        newClusterLevelUsageList.map((item, index) => {
            item.colorCodeIndex = clusterList[index].colorCodeIndex;
            newClusterUsageListWithColorCode.push(item)
        })

        return newClusterUsageListWithColorCode;
    } catch (e) {
        return [];
    }
}

/**
 *
 * @param cloudletList
 * @param pHardwareType
 * @param pStartTime
 * @param pEndTime
 * @returns {Promise<[]>}
 */
export const getCloudletUsageList = async (cloudletList: TypeCloudlet, pHardwareType, dataLimitCount, pStartTime = '', pEndTime = '') => {

    try {
        let instanceBodyList = []
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        for (let index = 0; index < cloudletList.length; index++) {
            let instanceInfoOneForm = makeFormForCloudletLevelMatric(cloudletList[index], pHardwareType, token, dataLimitCount, pStartTime, pEndTime)
            instanceBodyList.push(instanceInfoOneForm);
        }

        let promiseList = []
        for (let index = 0; index < instanceBodyList.length; index++) {
            promiseList.push(getCloudletLevelMetric(instanceBodyList[index], token))
        }

        let cloudletLevelMatricUsageList = await Promise.allSettled(promiseList);
        let netSendSeriesList = [];
        let netRecvSeriesList = [];
        let vCpuSeriesList = [];
        let memSeriesList = [];
        let diskSeriesList = [];
        let floatingIpsSeriesList = [];
        let ipv4UsedSeriesList = [];
        let cloudlet = "";
        let operator = "";
        let Region = '';
        let columns = [];

        let usageList = []
        cloudletLevelMatricUsageList.map((itemOne, index) => {
            let item = itemOne.value
            let status = itemOne.status

            if (!isEmpty(item) && !isEmpty(item.data["0"].Series) && status === FULFILLED) {
                Region = cloudletList[index].Region
                let series = item.data["0"].Series["0"].values
                let ipSeries = item.data["0"].Series["1"].values
                columns = item.data["0"].Series["0"].columns

                let sumVirtualCpuUsed = 0;
                let sumvCpuMax = 0;
                let sumMemUsed = 0;
                let sumMemMax = 0;
                let sumDiskUsed = 0;
                let sumDiskMax = 0;
                let sumNetSend = 0;
                let sumNetRecv = 0;
                let sumFloatingIpsUsed = 0;
                let sumFloatingIpsMax = 0
                let sumIpv4Used = 0;
                let sumIpv4Max = 0;
                series.map((item, innerIndex) => {

                    let netSendSeriesOne = item[getIndex(columns, CLOUDLET_METRIC_COLUMN.netSend)]
                    let netRecvSeriesOne = item[getIndex(columns, CLOUDLET_METRIC_COLUMN.netRecv)]
                    let vCpuSeriesOne = item[getIndex(columns, CLOUDLET_METRIC_COLUMN.vCpuUsed)]
                    let memSeriesOne = item[getIndex(columns, CLOUDLET_METRIC_COLUMN.memUsed)]
                    let diskSeriesOne = item[getIndex(columns, CLOUDLET_METRIC_COLUMN.diskUsed)]
                    let floatingIpsSeriesOne = item[getIndex(columns, CLOUDLET_METRIC_COLUMN.floatingIpsUsed)]
                    let ipv4UsedSeriesOne = item[getIndex(columns, CLOUDLET_METRIC_COLUMN.ipv4Used)]

                    netSendSeriesList.push(netSendSeriesOne)
                    netRecvSeriesList.push(netRecvSeriesOne)
                    vCpuSeriesList.push(vCpuSeriesOne)
                    memSeriesList.push(memSeriesOne)
                    diskSeriesList.push(diskSeriesOne)
                    floatingIpsSeriesList.push(floatingIpsSeriesOne)
                    ipv4UsedSeriesList.push(ipv4UsedSeriesOne)

                    cloudlet = item[1]
                    operator = item[2]

                    //todo: CPU
                    let vCpuUsed = item["5"];
                    let vCpuMax = item["6"];
                    sumVirtualCpuUsed += vCpuUsed;
                    sumvCpuMax += vCpuMax;

                    //todo: MEM
                    sumMemUsed += item["7"];
                    sumMemMax += item["8"];

                    //todo: DISK
                    sumDiskUsed += item["9"];
                    sumDiskMax += item["10"];

                    //todo: NETWORK(RECV,SEND)
                    sumNetSend += item["3"];
                    sumNetRecv += item["4"];

                    //todo: FLOATIP
                    sumFloatingIpsUsed += ipSeries[innerIndex]["11"];
                    sumFloatingIpsMax += ipSeries[innerIndex]["12"];
                    //todo: IPV4
                    sumIpv4Used += ipSeries[innerIndex]["13"];
                    sumIpv4Max += ipSeries[innerIndex]["14"];

                })

                usageList.push({
                    usedVCpuCount: sumVirtualCpuUsed / dataLimitCount,
                    usedMemUsage: sumMemUsed / dataLimitCount,
                    usedDiskUsage: sumDiskUsed / dataLimitCount,
                    usedRecvBytes: sumNetRecv / dataLimitCount,
                    usedSendBytes: sumNetSend / dataLimitCount,
                    usedFloatingIpsUsage: sumFloatingIpsUsed / dataLimitCount,
                    usedIpv4Usage: sumIpv4Used / dataLimitCount,
                    maxVCpuCount: sumvCpuMax / dataLimitCount,
                    maxMemUsage: sumMemMax / dataLimitCount,
                    maxDiskUsage: sumDiskMax / dataLimitCount,
                    columns: columns,
                    series: series,
                    ipSeries: ipSeries,
                    cloudlet: cloudlet,
                    operator: operator,
                    Region: Region,
                    netSendSeriesList,
                    netRecvSeriesList,
                    vCpuSeriesList,
                    memSeriesList,
                    diskSeriesList,
                    floatingIpsSeriesList,
                    ipv4UsedSeriesList,
                })
            } else {//series is null
                usageList.push({
                    usedVCpuCount: 0,
                    usedMemUsage: 0,
                    usedDiskUsage: 0,
                    usedRecvBytes: 0,
                    usedSendBytes: 0,
                    usedFloatingIpsUsage: 0,
                    usedIpv4Usage: 0,
                    maxVCpuCount: 0,
                    maxMemUsage: 0,
                    maxDiskUsage: 0,
                    columns: [],
                    series: [],
                    cloudlet: cloudletList[index].CloudletName,
                    operator: cloudletList[index].Operator,
                    Region: cloudletList[index].Region,
                    netSendSeriesList: [],
                    netRecvSeriesList: [],
                    vCpuSeriesList: [],
                    memSeriesList: [],
                    diskSeriesList: [],
                    floatingIpsSeriesList: [],
                    ipv4UsedSeriesList: [],
                })
            }

        });

        let usageListWithColorCode = []
        usageList.map((item, index) => {
            item.colorCodeIndex = index;
            usageListWithColorCode.push(item)
        })

        return usageListWithColorCode;
    } catch (e) {
    }

}


export const getCloudletLevelMetric = async (serviceBody: any, pToken: string) => {
    return await axios({
        url: mcURL() + CLOUDLET_METRICS_ENDPOINT,
        method: 'post',
        data: serviceBody['params'],
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + pToken
        },
        timeout: METRIC_DATA_FETCH_TIMEOUT
    }).then(async response => {
        return response.data;
    }).catch(e => {

        let tempArray = []
        return tempArray;
    })
}

export const getAppInstLevelMetric = async (serviceBodyForAppInstanceOneInfo: any) => {


    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    let result = await axios({
        url: mcURL() + APP_INST_METRICS_ENDPOINT,
        method: 'post',
        data: serviceBodyForAppInstanceOneInfo['params'],
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.userToken
        },
        timeout: METRIC_DATA_FETCH_TIMEOUT
    }).then(async response => {
        return response.data;
    }).catch(e => {
        //throw new Error(e)
    })
    return result;
}


export const getClusterLevelMatric = async (serviceBody: any, pToken: string) => {
    try {
        let result = await axios({
            url: mcURL() + CLUSTER_METRICS_ENDPOINT,
            method: 'post',
            data: serviceBody['params'],
            cancelToken: source.token,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + pToken
            },
            timeout: METRIC_DATA_FETCH_TIMEOUT
        }).then(async response => {
            return response.data;
        }).catch(e => {
            if (axios.isCancel(e)) {
            } else {
            }
        })
        return result;
    } catch (e) {
        throw new Error(e)
    }
}


export const getCloudletEventLog = async (cloudletMapOne: TypeCloudlet, startTime = '', endTime = '') => {
    try {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        let dataBody = {}
        dataBody = {
            "region": cloudletMapOne.Region,
            "cloudlet": {
                "organization": cloudletMapOne.Operator,
                "name": cloudletMapOne.CloudletName
            },
            //"last": 100
            "starttime": startTime,
            "endtime": endTime
        }

        let result = await axios({
            url: mcURL() + CLOUDLET_EVENT_LOG_ENDPOINT,
            method: 'post',
            data: dataBody,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            timeout: METRIC_DATA_FETCH_TIMEOUT
        }).then(async response => {
            if (response.data.data["0"].Series !== null) {
                let values = response.data.data["0"].Series["0"].values
                let columns = response.data.data["0"].Series["0"].columns

                return values;
            } else {
                return [];
            }
        }).catch(e => {
            throw new Error(e.toString())
        })
        return result;
    } catch (e) {
        throw new Error(e)
    }
}


/**
 *
 * @param cloudletList
 * @param startTime
 * @param endTime
 * @returns {Promise<[]>}
 */
export const getAllCloudletEventLogs = async (cloudletList, startTime = '', endTime = '', dataLimitCount) => {
    try {
        let promiseList = []

        let range = getTimeRange(dataLimitCount)
        let periodStartTime = range[0]
        let periodEndTime = range[1]

        cloudletList.map((cloudletOne: TypeCloudlet, index) => {
            promiseList.push(getCloudletEventLog(cloudletOne, periodStartTime, periodEndTime))
        })

        let allCloudletEventLogList = await Promise.all(promiseList);

        let newAllCloudletEventLogList = []
        allCloudletEventLogList.map(listOne => {
            listOne.map(item => {
                newAllCloudletEventLogList.push(item)
            })

        })

        return newAllCloudletEventLogList;
    } catch (e) {
        throw new Error(e)
    }

}

/**
 *
 * @param clusterList
 * @returns {Promise<[]>}
 */
export const getAllClusterEventLogList = async (clusterList, userType = USER_TYPE_SHORT.DEV, dataLimitCount) => {

    try {
        let clusterPromiseList = []
        clusterList.map((clusterOne: TypeCluster, index) => {
            clusterPromiseList.push(getClusterEventLogListOne(clusterOne, userType, dataLimitCount))
        })

        let allClusterEventLogs = await Promise.all(clusterPromiseList);
        let completedEventLogList = []
        allClusterEventLogs.map((item, index) => {

            if (item.Series !== null) {
                let eventLogList = item.Series["0"].values;
                eventLogList.map(item => {
                    completedEventLogList.push(item)
                })
            }
        })

        return completedEventLogList;
    } catch (e) {
        return null;
    }
}

export const getClusterEventLogListOne = async (clusterItemOne: TypeCluster, userType, dataLimitCount) => {

    //todo: only 60min of eventlogs
    let date = [dateUtil.utcTime(dateUtil.FORMAT_DATE_24_HH_mm, dateUtil.subtractMins(parseInt(60))), dateUtil.utcTime(dateUtil.FORMAT_DATE_24_HH_mm, dateUtil.subtractMins(0))]
    let periodStartTime = makeCompleteDateTime(date[0]);
    let periodEndTime = makeCompleteDateTime(date[1]);

    let selectOrg = undefined
    let form = {};
    try {
        let Cloudlet = clusterItemOne.Cloudlet;
        let ClusterName = clusterItemOne.ClusterName;
        let Region = clusterItemOne.Region;
        let Operator = clusterItemOne.Operator;
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        selectOrg = localStorage.getItem('selectOrg')
        form = {
            "region": Region,
            "clusterinst": {
                "cluster_key": {
                    "name": ClusterName
                },
                "cloudlet_key": {
                    "name": Cloudlet,
                    "organization": Operator,

                },
                "organization": userType.toString().includes(USER_TYPE_SHORT.DEV) ? selectOrg : clusterItemOne.OrganizationName
            },
            "starttime": periodStartTime,
            "endtime": periodEndTime,
            //"last": 40
        }

        let result = await axios({
            url: mcURL() + CLUSTER_EVENT_LOG_ENDPOINT,
            method: 'post',
            data: form,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + store.userToken
            },
            timeout: METRIC_DATA_FETCH_TIMEOUT
        }).then(async response => {

            return response.data.data[0];
        }).catch(e => {
            return null;
        })
        return result;
    } catch (e) {
        return null;
    }
}


export const getAppInstEventLogsForOneAppInst = async (fullAppInst = undefined, dataLimitCount = 20) => {
    try {

        let selectOrg = localStorage.getItem('selectOrg')
        let AppName = fullAppInst.split('|')[0].trim()
        let Cloudlet = fullAppInst.split('|')[1].trim()
        let ClusterInst = fullAppInst.split('|')[2].trim()
        let Version = fullAppInst.split('|')[3].trim()
        let Region = fullAppInst.split('|')[4].trim()
        let Organization = fullAppInst.split('|')[6].trim()

        let form = {
            "region": Region,
            "appinst": {
                "app_key": {
                    "organization": selectOrg
                },
                "cluster_inst_key": {
                    "cluster_key": {
                        "name": ClusterInst
                    },
                    "cloudlet_key": {
                        "name": Cloudlet,
                        "organization": Organization
                    }
                }
            },
            "last": dataLimitCount,
        }

        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        return await axios({
            url: mcURL() + APP_INST_EVENT_LOG_ENDPOINT,
            method: 'post',
            data: form,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + store.userToken
            },
            timeout: METRIC_DATA_FETCH_TIMEOUT
        }).then(async response => {
            if (isEmpty(response.data.data[0].Series)) {
                return [];
            } else {
                return response.data.data[0];
            }

        }).catch(e => {
            throw new Error(e.toString())

        })
    } catch (e) {
        throw new Error(e.toString())
    }

}


export const getAllAppInstEventLogs = async (fullCurrentAppInst = undefined, dataLimitCount) => {
    try {

        let appInstEventLogList = await getAppInstEventLogsForOneAppInst(fullCurrentAppInst, dataLimitCount)

        let completedEventLogList = []
        if (!isEmpty(appInstEventLogList)) {
            if (appInstEventLogList.Series !== null) {
                let eventLogList = appInstEventLogList.Series["0"].values;
                eventLogList.map(item => {
                    completedEventLogList.push(item)
                })
            }
        }

        return completedEventLogList;
    } catch (e) {
        return [];
    }
}


/**
 *
 * @param appInst
 * @param startTime
 * @param endTime
 * @returns {Promise<{VerifyLocationCount: number, app: string, ver, FoundOperatorCount: number, apporg: string, cloudlet: string, RegisterClientCount: number, cloudletorg, FindCloudletCount: number}>}
 */
export const getClientStateOne = async (appInst: TypeAppInst, startTime = '', endTime = '') => {
    let store = JSON.parse(localStorage.PROJECT_INIT);
    let token = store ? store.userToken : 'null';

    let data = {
        "region": appInst.Region,
        "appinst": {
            "app_key": {
                "organization": appInst.OrganizationName,
                "name": appInst.AppName,
                "version": appInst.Version,
            }
        },
        "selector": "api",
        //"last": 20,
        "starttime": startTime,
        "endtime": endTime,
    }


    return await axios({
        url: mcURL() + SHOW_METRICS_CLIENT_STATUS,
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        timeout: METRIC_DATA_FETCH_TIMEOUT
    }).then(async response => {

        let seriesValues = []
        let column = []
        if (response.data.data[0].Series !== null) {
            seriesValues = response.data.data[0].Series[0].values
            column = response.data.data[0].Series[0].columns

        } else {
            //showToast('null')
        }

        let clientMatricSumDataOne = makeClientMatricSumDataOne(seriesValues, column, appInst)
        return clientMatricSumDataOne;

    }).catch(e => {
        showToast(e.toString())
    })
}


/**
 *
 * @param columns
 * @param searchValue
 * @returns {number}
 */
export function getIndex(columns, searchValue) {
    let foundIndex = 0;
    columns.filter((item, index) => {
        if (item === searchValue) {
            foundIndex = index
            return true;
        }
    })
    return foundIndex;
}

export function makeClientMatricSumDataOne(seriesValues, columns, appInst: TypeAppInst) {

    let RegisterClientCount = 0;
    let FindCloudletCount = 0;
    let VerifyLocationCount = 0
    let FoundOperatorCount = 0;

    let app = appInst.AppName
    let apporg = appInst.OrganizationName
    let cloudlet = appInst.Cloudlet
    let cloudletorg = appInst.OrganizationName
    let ver = appInst.Version


    seriesValues.map(item => {

        let methodType = item[16];

        if (methodType === "RegisterClient") {
            RegisterClientCount++;
        }
        if (methodType === "FindCloudlet") {
            FindCloudletCount++;
        }
        if (methodType === "VerifyLocation") {
            FindCloudletCount++;
        }
        if (methodType === "foundOperator") {
            FoundOperatorCount++;
        }
    })

    let metricSumDataOne = {
        RegisterClientCount,
        FindCloudletCount,
        VerifyLocationCount,
        FoundOperatorCount,
        app,
        apporg,
        cloudlet,
        cloudletorg,
        ver,
    }

    return metricSumDataOne;

}

export const getClientStatusList = async (appInstList, startTime, endTime, dataLimitCount) => {
    try {
        let promiseList = []

        let range = getTimeRange(dataLimitCount)
        let periodStartTime = range[0]
        let periodEndTime = range[1]

        appInstList.map((appInstOne: TypeCloudlet, index) => {
            promiseList.push(getClientStateOne(appInstOne, periodStartTime, periodEndTime))
        })
        let newPromiseList = await Promise.allSettled(promiseList);

        let mergedClientStatusList = []
        newPromiseList.map((item, index) => {
            if (item.value !== undefined) {
                mergedClientStatusList.push(item.value)
            }
        })
        return mergedClientStatusList;
    } catch (e) {
        showToast(e.toString())
    }

}

export function convertDataCountToMins(dateLimitCount) {
    let dateOne = graphDataCount.filter(item => {
        return item.value === dateLimitCount
    })
    return dateOne[0].text.split(" ")[0]
}

export const getTimeRange = (dataLimitCount) => {
    dataLimitCount = dataLimitCount ? dataLimitCount : 20
    let periodMins = convertDataCountToMins(dataLimitCount)
    let date = [dateUtil.utcTime(dateUtil.FORMAT_DATE_24_HH_mm, dateUtil.subtractMins(parseInt(periodMins))), dateUtil.utcTime(dateUtil.FORMAT_DATE_24_HH_mm, dateUtil.subtractMins(0))]
    let periodStartTime = makeCompleteDateTime(date[0]);
    let periodEndTime = makeCompleteDateTime(date[1]);
    return [periodStartTime, periodEndTime]
}
