import axios from "axios";
import type {TypeAppInst, TypeClientLocation, TypeCloudlet, TypeCluster} from "../../../../shared/Types";
import {SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLUSTER_INST} from "../../../../services/endPointTypes";
import {APP_INST_MATRIX_HW_USAGE_INDEX, RECENT_DATA_LIMIT_COUNT, USER_TYPE} from "../../../../shared/Constants";
import {sendSyncRequest, mcURL} from "../../../../services/serviceMC";
import {isEmpty, makeFormForCloudletLevelMatric, makeFormForClusterLevelMatric} from "./PageMonitoringCommonService";
import {makeFormForAppLevelUsageList} from "./PageAdmMonitoringService";
import PageDevMonitoring from "../view/PageDevOperMonitoringView";
import {
    APP_INST_EVENT_LOG_ENDPOINT,
    APP_INST_METRICS_ENDPOINT,
    CLOUDLET_EVENT_LOG_ENDPOINT,
    CLOUDLET_METRICS_ENDPOINT,
    CLUSTER_EVENT_LOG_ENDPOINT,
    CLUSTER_METRICS_ENDPOINT,
    SHOW_APP_INST_CLIENT_ENDPOINT, SHOW_METRICS_CLIENT_STATUS
} from "./PageMonitoringMetricEndPoint";

export const requestShowAppInstClientWS = (pCurrentAppInst, _this: PageDevMonitoring) => {
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

export const fetchAppInstList = async (pRegionList = localStorage.getItem('regions').split(","), type: string = '') => {
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
        return mergedAppInstanceList;
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
        let currentSelectedOrg = localStorage.getItem('selectOrg').toString().trim();


        //@todo: when oper role
        if (userType.includes(USER_TYPE.OPERATOR)) {
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
            return result;

        } else {
            return mergedCloudletList;
        }

        //return mergedCloudletList;

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


        let result = []
        if (localStorage.getItem('selectRole').includes('Oper')) {
            result = mergedClusterList;
        } else {
            //todo: Filter to fetch only those belonging to the current organization
            mergedClusterList.map(item => {
                if (item.OrganizationName === localStorage.selectOrg) {
                    result.push(item)
                }
            })
        }
        return result;
    } catch (e) {

    }
}


export const getCloudletListAll = async () => {
    try {

        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        let regionList = localStorage.getItem('regions').split(",");

        let promiseList = []
        for (let i in regionList) {
            let requestData = {showSpinner: false, token: token, method: SHOW_CLOUDLET, data: {region: regionList[i]}}
            promiseList.push(sendSyncRequest(this, requestData))
        }
        let cloudletList = await Promise.all(promiseList);
        let mergedCloudletList = [];
        cloudletList.map(item => {
            //@todo : null check
            if (item.response.data["0"].Region !== '') {
                let cloudletList = item.response.data;
                cloudletList.map(item => {
                    mergedCloudletList.push(item);
                })
            }
        })


        return mergedCloudletList;
    } catch (e) {

    }
}


export const getAppLevelUsageList = async (appInstanceList, pHardwareType, recentDataLimitCount, pStartTime = '', pEndTime = '', userType = '') => {
    try {

        let instanceBodyList = []
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null;
        for (let index = 0; index < appInstanceList.length; index++) {
            //todo: Create a data FORM format for requests
            let instanceInfoOneForm = makeFormForAppLevelUsageList(appInstanceList[index], pHardwareType, store.userToken, recentDataLimitCount, pStartTime, pEndTime)
            instanceBodyList.push(instanceInfoOneForm);
        }

        let promiseList = []
        for (let index = 0; index < instanceBodyList.length; index++) {
            promiseList.push(getAppLevelMetric(instanceBodyList[index]))
        }


        //todo: Bring health check list(cpu,mem,network,disk..) to the number of apps instance, by parallel request
        let appInstanceHwUsageList = []
        try {
            appInstanceHwUsageList = await Promise.all(promiseList);
        } catch (e) {
            //throw new Error(e)
        }

        let usageListForAllInstance = []
        appInstanceList.map((item, index) => {
            usageListForAllInstance.push({
                instanceData: appInstanceList[index],
                appInstanceHealth: appInstanceHwUsageList[index],
            });
        })


        let allUsageList = []
        usageListForAllInstance.map((item, index) => {
            let appName = item.instanceData.AppName

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


                    if (series["1"] !== undefined) {
                        let memSeries = series["1"]
                        columns = memSeries.columns;
                        memSeriesList = memSeries.values;
                        memSeries.values.map(item => {
                            let usageOne = item[APP_INST_MATRIX_HW_USAGE_INDEX.MEM];//memUsage..index
                            sumMemUsage += usageOne;
                        })
                    }


                    if (series["2"] !== undefined) {
                        let diskSeries = series["2"]
                        diskSeriesList = diskSeries.values;
                        diskSeries.values.map(item => {
                            let usageOne = item[APP_INST_MATRIX_HW_USAGE_INDEX.DISK];//diskUsage..index
                            sumDiskUsage += usageOne;
                        })
                    }

                    if (series["0"] !== undefined) {
                        let networkSeries = series["0"]
                        columns = networkSeries.columns;
                        networkSeriesList = networkSeries.values;
                        networkSeries.values.map(item => {
                            let sendBytesOne = item[APP_INST_MATRIX_HW_USAGE_INDEX.SENDBYTES];//sendBytesOne
                            sumSendBytes += sendBytesOne;
                            let recvBytesOne = item[APP_INST_MATRIX_HW_USAGE_INDEX.RECVBYTES];//recvBytesOne
                            sumRecvBytes += recvBytesOne;
                        })
                    }


                    if (series["4"] !== undefined) {
                        let connectionsSeries = series["4"]
                        columns = connectionsSeries.columns;
                        connectionsSeriesList = connectionsSeries.values;
                        connectionsSeries.values.map(item => {
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
                        appName: appName,
                        sumCpuUsage: sumCpuUsage / RECENT_DATA_LIMIT_COUNT,
                        sumMemUsage: Math.ceil(sumMemUsage / RECENT_DATA_LIMIT_COUNT),
                        sumDiskUsage: Math.ceil(sumDiskUsage / RECENT_DATA_LIMIT_COUNT),
                        sumRecvBytes: Math.ceil(sumRecvBytes / RECENT_DATA_LIMIT_COUNT),
                        sumSendBytes: Math.ceil(sumSendBytes / RECENT_DATA_LIMIT_COUNT),
                        sumActiveConnection: Math.ceil(sumActiveConnection / RECENT_DATA_LIMIT_COUNT),
                        sumHandledConnection: Math.ceil(sumHandledConnection / RECENT_DATA_LIMIT_COUNT),
                        sumAcceptsConnection: Math.ceil(sumAcceptsConnection / RECENT_DATA_LIMIT_COUNT),
                        cpuSeriesList,
                        memSeriesList,
                        diskSeriesList,
                        networkSeriesList,
                        connectionsSeriesList,

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
                        appName: appName,
                    })
                }
            }

        })


        return allUsageList;
    } catch (e) {
        //throw new Error(e.toString())
    }

}


/**
 *
 * @param clusterList
 * @param pHardwareType
 * @param recentDataLimitCount
 * @param pStartTime
 * @param pEndTime
 * @returns {Promise<[]|Array>}
 */
export const getClusterLevelUsageList = async (clusterList, pHardwareType, recentDataLimitCount, pStartTime = '', pEndTime = '') => {
    try {
        let instanceBodyList = []
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';

        for (let index = 0; index < clusterList.length; index++) {
            let instanceInfoOneForm = makeFormForClusterLevelMatric(clusterList[index], pHardwareType, token, recentDataLimitCount, pStartTime, pEndTime)
            instanceBodyList.push(instanceInfoOneForm);
        }

        let promiseList = []
        for (let index = 0; index < instanceBodyList.length; index++) {
            promiseList.push(getClusterLevelMatric(instanceBodyList[index], token))
        }
        let clusterLevelUsageList = await Promise.all(promiseList);


        let newClusterLevelUsageList = []
        clusterLevelUsageList.map((item, index) => {

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

            if (item.data["0"].Series !== null) {

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
                    sumUdpSent: sumUdpSent / RECENT_DATA_LIMIT_COUNT,
                    sumUdpRecv: sumUdpRecv / RECENT_DATA_LIMIT_COUNT,
                    sumUdpRecvErr: sumUdpRecvErr / RECENT_DATA_LIMIT_COUNT,
                    sumTcpConns: sumTcpConns / RECENT_DATA_LIMIT_COUNT,
                    sumTcpRetrans: sumTcpRetrans / RECENT_DATA_LIMIT_COUNT,
                    sumSendBytes: sumSendBytes / RECENT_DATA_LIMIT_COUNT,
                    sumRecvBytes: sumRecvBytes / RECENT_DATA_LIMIT_COUNT,
                    sumMemUsage: sumMemUsage / RECENT_DATA_LIMIT_COUNT,
                    sumDiskUsage: sumDiskUsage / RECENT_DATA_LIMIT_COUNT,
                    sumCpuUsage: sumCpuUsage / RECENT_DATA_LIMIT_COUNT,
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

        return newClusterLevelUsageList;
    } catch (e) {
        return [];
    }
}

let CLOUDLET_USAGE_INDEX = {
    "time": 0,
    "cloudlet": 1,
    "cloudletorg": 2,
    "netSend": 3,
    "netRecv": 4,
    "vCpuUsed": 5,
    "vCpuMax": 6,
    "memUsed": 7,
    "memMax": 8,
    "diskUsed": 9,
    "diskMax": 10,
    "floatingIpsUsed": 11,
    "floatingIpsMax": 12,
    "ipv4Used": 13,
    "ipv4Max": 14,
}

/**
 *
 * @param cloudletList
 * @param pHardwareType
 * @param recentDataLimitCount
 * @param pStartTime
 * @param pEndTime
 * @returns {Promise<[]>}
 */
export const getCloudletUsageList = async (cloudletList: TypeCloudlet, pHardwareType, recentDataLimitCount, pStartTime = '', pEndTime = '') => {

    try {
        let instanceBodyList = []
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        for (let index = 0; index < cloudletList.length; index++) {
            let instanceInfoOneForm = makeFormForCloudletLevelMatric(cloudletList[index], pHardwareType, token, recentDataLimitCount, pStartTime, pEndTime)
            instanceBodyList.push(instanceInfoOneForm);
        }

        let promiseList = []
        for (let index = 0; index < instanceBodyList.length; index++) {
            promiseList.push(getCloudletLevelMetric(instanceBodyList[index], token))
        }

        let cloudletLevelMatricUsageList = await Promise.all(promiseList);


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

        let usageList = []
        cloudletLevelMatricUsageList.map((item, index) => {
            if (!isEmpty(item) && !isEmpty(item.data["0"].Series)) {
                Region = cloudletList[index].Region
                let series = item.data["0"].Series["0"].values
                let columns = item.data["0"].Series["0"].columns


                //////////////////////////////////////////
                let netSendSeriesOne = series["0"][CLOUDLET_USAGE_INDEX.netSend]
                let netRecvSeriesOne = series["0"][CLOUDLET_USAGE_INDEX.netRecv]
                let vCpuSeriesOne = series["0"][CLOUDLET_USAGE_INDEX.vCpuUsed]
                let memSeriesOne = series["0"][CLOUDLET_USAGE_INDEX.memUsed]
                let diskSeriesOne = series["0"][CLOUDLET_USAGE_INDEX.diskUsed]
                let floatingIpsSeriesOne = series["0"][CLOUDLET_USAGE_INDEX.floatingIpsUsed]
                let ipv4UsedSeriesOne = series["0"][CLOUDLET_USAGE_INDEX.ipv4Used]

                netSendSeriesList.push(netSendSeriesOne)
                netRecvSeriesList.push(netRecvSeriesOne)
                vCpuSeriesList.push(vCpuSeriesOne)
                memSeriesList.push(memSeriesOne)
                diskSeriesList.push(diskSeriesOne)
                floatingIpsSeriesList.push(floatingIpsSeriesOne)
                ipv4UsedSeriesList.push(ipv4UsedSeriesOne)

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

                series.map(item => {
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
                    sumFloatingIpsUsed += item["11"];
                    sumFloatingIpsMax += item["12"];
                    //todo: IPV4
                    sumIpv4Used += item["13"];
                    sumIpv4Max += item["14"];

                })

                usageList.push({
                    usedVCpuCount: sumVirtualCpuUsed / RECENT_DATA_LIMIT_COUNT,
                    usedMemUsage: sumMemUsed / RECENT_DATA_LIMIT_COUNT,
                    usedDiskUsage: sumDiskUsed / RECENT_DATA_LIMIT_COUNT,
                    usedRecvBytes: sumNetRecv / RECENT_DATA_LIMIT_COUNT,
                    usedSendBytes: sumNetSend / RECENT_DATA_LIMIT_COUNT,
                    usedFloatingIpsUsage: sumFloatingIpsUsed / RECENT_DATA_LIMIT_COUNT,
                    usedIpv4Usage: sumIpv4Used / RECENT_DATA_LIMIT_COUNT,
                    maxVCpuCount: sumvCpuMax / RECENT_DATA_LIMIT_COUNT,
                    maxMemUsage: sumMemMax / RECENT_DATA_LIMIT_COUNT,
                    maxDiskUsage: sumDiskMax / RECENT_DATA_LIMIT_COUNT,
                    columns: columns,
                    series: series,
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
            } else {//Seires is null
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
        return usageList;
    } catch (e) {
    }

}


export const getCloudletLevelMetric = async (serviceBody: any, pToken: string) => {
    console.log('token===>', pToken);
    return await axios({
        url: mcURL() + CLOUDLET_METRICS_ENDPOINT,
        method: 'post',
        data: serviceBody['params'],
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + pToken
        },
        timeout: 30 * 1000
    }).then(async response => {
        return response.data;
    }).catch(e => {
        let tempArray = []
        return tempArray;
    })
}

export const getAppLevelMetric = async (serviceBodyForAppInstanceOneInfo: any) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    let result = await axios({
        url: mcURL() + APP_INST_METRICS_ENDPOINT,
        method: 'post',
        data: serviceBodyForAppInstanceOneInfo['params'],
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.userToken
        },
        timeout: 30 * 1000
    }).then(async response => {
        return response.data;
    }).catch(e => {
        //throw new Error(e)
    })
    return result;
}


export const getClusterLevelMatric = async (serviceBody: any, pToken: string) => {
    try {
        console.log('token===>', pToken);
        let result = await axios({
            url: mcURL() + CLUSTER_METRICS_ENDPOINT,
            method: 'post',
            data: serviceBody['params'],
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + pToken
            },
            timeout: 30 * 1000
        }).then(async response => {
            return response.data;
        }).catch(e => {
            //showToast(e.toString())
        })
        return result;
    } catch (e) {
        throw new Error(e)
    }
}


export const getCloudletEventLog = async (cloudletSelectedOne, pRegion) => {
    try {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        let selectOrg = localStorage.getItem('selectOrg')

        let result = await axios({
            url: mcURL() + CLOUDLET_EVENT_LOG_ENDPOINT,
            method: 'post',
            data: {
                "region": pRegion,
                "cloudlet": {
                    "organization": selectOrg,
                    "name": cloudletSelectedOne
                },
                "last": 10
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            timeout: 30 * 1000
        }).then(async response => {
            if (response.data.data["0"].Series !== null) {
                let values = response.data.data["0"].Series["0"].values
                return values;
            } else {
                return [];
            }
        }).catch(e => {
            // showToast(e.toString())
        })
        return result;
    } catch (e) {
        throw new Error(e)
    }
}


export const getAllCloudletEventLogs = async (cloudletList) => {

    try {
        let promiseList = []
        cloudletList.map((cloudletOne: TypeCloudlet, index) => {
            promiseList.push(getCloudletEventLog(cloudletOne.CloudletName, cloudletOne.Region))
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
export const getAllClusterEventLogList = async (clusterList) => {
    try {
        let clusterPromiseList = []
        clusterList.map((clusterOne: TypeCluster, index) => {
            clusterPromiseList.push(getClusterEventLogListOne(clusterOne))
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
        //showToast(e.toString())
    }
}

export const getClusterEventLogListOne = async (clusterItemOne: TypeCluster) => {
    try {
        let selectOrg = localStorage.getItem('selectOrg')
        let Cloudlet = clusterItemOne.Cloudlet;
        let ClusterName = clusterItemOne.ClusterName;
        let Region = clusterItemOne.Region;
        let Operator = clusterItemOne.Operator;

        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

        let form = {
            "region": Region,
            "clusterinst": {
                "cluster_key": {
                    "name": ClusterName
                },
                "cloudlet_key": {
                    "name": Cloudlet,
                    "organization": Operator,

                },
                "organization": selectOrg
            },
            //"last": 10
        }


        let result = await axios({
            url: mcURL() + CLUSTER_EVENT_LOG_ENDPOINT,
            method: 'post',
            data: form,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + store.userToken
            },
            timeout: 30 * 1000
        }).then(async response => {

            return response.data.data[0];
        }).catch(e => {
            //throw new Error(e)
            //showToast(e.toString())
        })
        return result;
    } catch (e) {
        //throw new Error(e)
    }
}

export const getAppInstEventLogByRegion = async (region = 'EU') => {
    try {

        let selectOrg = localStorage.getItem('selectOrg')

        let form = {
            "region": region,
            "appinst": {
                "app_key": {
                    "organization": selectOrg
                },
                "cluster_inst_key": {
                    "cluster_key": {
                        "name": ""
                    },
                    "cloudlet_key": {
                        "name": "",
                        "organization": ""
                    }
                }
            }


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
            timeout: 30 * 1000
        }).then(async response => {


            if (isEmpty(response.data.data[0].Series)) {
                return [];
            } else {
                return response.data.data[0];
            }

        }).catch(e => {
            //throw new Error(e)
            //showToast(e.toString())
        })
    } catch (e) {
        // showToast(e.toString())
    }

}

export const getAllAppInstEventLogs = async () => {
    try {

        let regionList = localStorage.getItem('regions').split(",");
        let promiseList = []
        for (let i in regionList) {
            promiseList.push(getAppInstEventLogByRegion(regionList[i]))
        }

        let allAppInstEventLogList = await Promise.all(promiseList);

        let completedEventLogList = []
        allAppInstEventLogList.map((item, index) => {

            if (!isEmpty(item)) {
                if (item.Series !== null) {
                    let eventLogList = item.Series["0"].values;
                    eventLogList.map(item => {
                        completedEventLogList.push(item)
                    })
                }
            }


        })

        return completedEventLogList;
    } catch (e) {
        // showToast(e.toString())
    }
}


/**
 * @desc : Inquire the status of the client attached to AppInstOne
 * @param appInst
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getClientStateOne = async (appInst: TypeAppInst) => {
    let store = JSON.parse(localStorage.PROJECT_INIT);
    let token = store ? store.userToken : 'null';
    return await axios({
        url: mcURL() + SHOW_METRICS_CLIENT_STATUS,
        method: 'post',
        data: {
            "region": appInst.Region,
            "appinst": {
                "app_key": {
                    "organization": appInst.OrganizationName,
                    "name": appInst.AppName,
                    "version": appInst.Version,
                }
            },
            "selector": "api",
            //'last': 100
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        timeout: 15 * 1000
    }).then(async response => {
        if (response.data.data[0].Series !== null) {
            let seriesValues = response.data.data[0].Series[0].values
            let clientMatricSumDataOne = makeClientMatricSumDataOne(seriesValues)
            return clientMatricSumDataOne;
        } else {
            return undefined
        }

    })
}

export function makeClientMatricSumDataOne(seriesValues) {
    let column = ["time", "100ms", "10ms", "25ms", "50ms", "5ms", "app", "apporg", "cellID", "cloudlet", "cloudletorg", "dev", "errs", "foundCloudlet", "foundOperator", "id", "inf", "method", "oper", "reqs", "ver",]
    let RegisterClientCount = 0;
    let FindCloudletCount = 0;
    let VerifyLocationCount = 0
    let app = '';
    let apporg = '';
    let cellID = '';
    let cloudlet = '';
    let cloudletorg = '';
    let ver = ''

    seriesValues.map(item => {
        let methodType = item[17];
        if (methodType === "RegisterClient") {
            RegisterClientCount++;
        }
        if (methodType === "FindCloudlet") {
            FindCloudletCount++;
        }
        if (methodType === "VerifyLocation") {
            FindCloudletCount++;
        }

        app = item[6]//app
        apporg = item[7]//apporg
        cellID = item[8]//cellID
        cloudlet = item[9]//cloudlet
        cloudletorg = item[10]//cloudletorg
        ver = item[20]//ver
    })

    let metricSumDataOne = {
        RegisterClientCount,
        FindCloudletCount,
        VerifyLocationCount,
        app,
        apporg,
        cellID,
        cloudlet,
        cloudletorg,
        ver,
    }

    return metricSumDataOne;

}


export const getClientStatusList = async (appInstList) => {
    let promiseList = []
    appInstList.map((appInstOne: TypeCloudlet, index) => {
        promiseList.push(getClientStateOne(appInstOne))
    })
    let newPromiseList = await Promise.all(promiseList);

    let mergedClientStatusList = []
    newPromiseList.map((item, index) => {
        if (item !== undefined) {
            mergedClientStatusList.push(item)
        }
    })

    return mergedClientStatusList;

}
