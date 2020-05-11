import axios from "axios";
import type {TypeClientLocation, TypeCloudlet, TypeCluster} from "../../../shared/Types";
import {SHOW_CLOUDLET, SHOW_CLUSTER_INST} from "../../../services/endPointTypes";
import {APP_INST_MATRIX_HW_USAGE_INDEX, RECENT_DATA_LIMIT_COUNT, USER_TYPE} from "../../../shared/Constants";
import {sendSyncRequest} from "../../../services/serviceMC";
import {isEmpty, makeFormForCloudletLevelMatric, makeFormForClusterLevelMatric, showToast} from "./PageMonitoringCommonService";
import {formatData} from "../../../services/formatter/formatComputeInstance";
import {makeFormForAppLevelUsageList} from "./admin/PageAdminMonitoringService";
import PageDevMonitoring from "./dev/PageDevMonitoring";


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


        let prefixUrl = (process.env.REACT_APP_API_ENDPOINT).replace('http', 'ws');
        const webSocket = new WebSocket(`${prefixUrl}/ws/api/v1/auth/ctrl/ShowAppInstClient`)
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
                })

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

export const getAppInstList = async (pArrayRegion = localStorage.getItem('regions').split(","), type: string = '') => {

    try {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let mergedAppInstanceList = [];

        for (let index = 0; index < pArrayRegion.length; index++) {
            let serviceBody = {
                "token": store.userToken,
                "params": {
                    "region": pArrayRegion[index],
                    "appinst": {
                        "key": {
                            "app_key": {
                                "organization": localStorage.selectOrg,
                            }
                        }
                    }
                }
            }


            let responseResult = await axios({
                url: '/api/v1/auth/ctrl/ShowAppInst',
                method: 'post',
                data: serviceBody['params'],
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + store.userToken
                },
                timeout: 15 * 1000
            }).then(async response => {
                let parseData = JSON.parse(JSON.stringify(response));

                if (parseData.data === '') {
                    return null;
                } else {
                    let finalizedJSON = formatData(parseData, serviceBody)
                    return finalizedJSON;
                }

            }).catch(e => {
                //showToast(e.toString())
            }).finally(() => {

            })

            if (responseResult !== null) {
                let mergedList = mergedAppInstanceList.concat(responseResult);
                mergedAppInstanceList = mergedList;
            }

        }

        if (type === USER_TYPE.ADMIN) {
            let appInstListWithVersion = []
            mergedAppInstanceList.map(item => {
                item.AppName = item.AppName + "[" + item.ClusterInst + "]";
                item.appName = item.AppName + "[" + item.ClusterInst + "]";
                appInstListWithVersion.push(item);
            })
            return appInstListWithVersion;
        } else {

        }
        return mergedAppInstanceList


    } catch (e) {
        //throw new Error(e)
    }
}


export const getClusterList = async () => {
    try {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        let regionList = localStorage.getItem('regions').split(",");
        let promiseList = []
        for (let i in regionList) {
            let requestData = {showSpinner: false, token: token, method: SHOW_CLUSTER_INST, data: {region: regionList[i]}}
            promiseList.push(sendSyncRequest(this, requestData))
        }

        let showClusterList = await Promise.all(promiseList);
        let mergedClusterList = [];
        showClusterList.map(item => {
            //@todo : null check
            if (item && item.response && item.response.data && item.response.data.length !== 0) {
                let clusterList = item.response.data;
                clusterList.map(item => {
                    mergedClusterList.push(item);
                })
            }
        })

        //todo: Filter to fetch only those belonging to the current organization
        let orgClusterList = []
        mergedClusterList.map(item => {
            if (item.OrganizationName === localStorage.selectOrg) {
                orgClusterList.push(item)
            }
        })


        return orgClusterList;
    } catch (e) {

    }
}

export const getCloudletList = async () => {
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

        return mergedCloudletList;
    } catch (e) {
        //showToast( e.toString())
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
        let orgCloudletList = await Promise.all(promiseList);
        let mergedCloudletList = [];
        orgCloudletList.map(item => {
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
            promiseList.push(getAppLevelMetrics(instanceBodyList[index]))
        }


        //todo: Bring health check list(cpu,mem,network,disk..) to the number of apps instance, by parallel request
        let appInstanceHealthCheckList = []
        try {
            appInstanceHealthCheckList = await Promise.all(promiseList);
        } catch (e) {
            //throw new Error(e)
        }

        let usageListForAllInstance = []
        appInstanceList.map((item, index) => {
            usageListForAllInstance.push({
                instanceData: appInstanceList[index],
                appInstanceHealth: appInstanceHealthCheckList[index],
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
            let cpuSeriesValue = []
            let memSeriesValue = []
            let diskSeriesValue = []
            let networkSeriesValue = []
            let connectionsSeriesValue = []

            if (item.appInstanceHealth !== undefined) {
                let series = item.appInstanceHealth.data["0"].Series;
                if (series !== null) {
                    if (series["3"] !== undefined) {
                        let cpuSeries = series["3"]
                        columns = cpuSeries.columns;
                        cpuSeriesValue = cpuSeries.values;
                        cpuSeries.values.map(item => {
                            let cpuUsage = item[APP_INST_MATRIX_HW_USAGE_INDEX.CPU];//cpuUsage..index
                            sumCpuUsage += cpuUsage;
                        })
                    }


                    if (series["1"] !== undefined) {
                        let memSeries = series["1"]
                        columns = memSeries.columns;
                        memSeriesValue = memSeries.values;
                        memSeries.values.map(item => {
                            let usageOne = item[APP_INST_MATRIX_HW_USAGE_INDEX.MEM];//memUsage..index
                            sumMemUsage += usageOne;
                        })
                    }


                    if (series["2"] !== undefined) {
                        let diskSeries = series["2"]
                        diskSeriesValue = diskSeries.values;
                        diskSeries.values.map(item => {
                            let usageOne = item[APP_INST_MATRIX_HW_USAGE_INDEX.DISK];//diskUsage..index
                            sumDiskUsage += usageOne;
                        })
                    }

                    if (series["0"] !== undefined) {
                        let networkSeries = series["0"]
                        columns = networkSeries.columns;
                        networkSeriesValue = networkSeries.values;
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
                        connectionsSeriesValue = connectionsSeries.values;
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
                        cpuSeriesValue: cpuSeriesValue,
                        memSeriesValue: memSeriesValue,
                        diskSeriesValue: diskSeriesValue,
                        networkSeriesValue: networkSeriesValue,
                        connectionsSeriesValue: connectionsSeriesValue,

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


export const getCloudletLevelUsageList = async (cloudletList, pHardwareType, recentDataLimitCount, pStartTime = '', pEndTime = '') => {

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
            promiseList.push(getCloudletLevelMatric(instanceBodyList[index], token))
        }

        let cloudletLevelMatricUsageList = await Promise.all(promiseList);


        //todo: check undefined element.
        let newCloutletMetric = []
        cloudletLevelMatricUsageList.map(item => {
            if (item !== undefined) {
                newCloutletMetric.push(item)
            }
        })

        let usageList = []
        newCloutletMetric.map((item, index) => {

            if (item !== undefined) {
                let Region = cloudletList[index].Region
                if (item.data["0"] !== undefined && item.data["0"].Series !== null) {
                    let series = item.data["0"].Series["0"].values
                    let columns = item.data["0"].Series["0"].columns

                    let sumVirtualCpuUsed = 0;
                    let sumVirtualCpuMax = 0;
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

                    let cloudlet = "";
                    let operator = "";
                    series.map(item => {
                        cloudlet = item[1]
                        operator = item[2]

                        //todo: CPU
                        let vCpuUsed = item["5"];
                        let vCpuMax = item["6"];
                        sumVirtualCpuUsed += vCpuUsed;
                        sumVirtualCpuMax += vCpuMax;

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
                        sumVCpuUsage: sumVirtualCpuUsed / RECENT_DATA_LIMIT_COUNT,
                        sumMemUsage: sumMemUsed / RECENT_DATA_LIMIT_COUNT,
                        sumDiskUsage: sumDiskUsed / RECENT_DATA_LIMIT_COUNT,
                        sumRecvBytes: sumNetRecv / RECENT_DATA_LIMIT_COUNT,
                        sumSendBytes: sumNetSend / RECENT_DATA_LIMIT_COUNT,
                        sumFloatingIpsUsage: sumFloatingIpsUsed / RECENT_DATA_LIMIT_COUNT,
                        sumIpv4Usage: sumIpv4Used / RECENT_DATA_LIMIT_COUNT,
                        columns: columns,
                        series: series,
                        cloudlet: cloudlet,
                        operator: operator,
                        Region: Region,

                    })
                }
            }

        })

        return usageList;
    } catch (e) {
        //throw new Error(e)
    }

}

export const getCloudletLevelMatric = async (serviceBody: any, pToken: string) => {
    console.log('token2===>', pToken);
    let result = await axios({
        url: '/api/v1/auth/metrics/cloudlet',
        method: 'post',
        data: serviceBody['params'],
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + pToken
        },
        timeout: 15 * 1000
    }).then(async response => {
        return response.data;
    }).catch(e => {
        //showToast(e.toString())
    })
    return result;
}


export const getAppLevelMetrics = async (serviceBodyForAppInstanceOneInfo: any) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    let result = await axios({
        url: '/api/v1/auth/metrics/app',
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
        console.log('token2===>', pToken);
        let result = await axios({
            url: '/api/v1/auth/metrics/cluster',
            method: 'post',
            data: serviceBody['params'],
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + pToken
            },
            timeout: 15 * 1000
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
            url: '/api/v1/auth/events/cloudlet',
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
            timeout: 15 * 1000
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
        //todo: 모든 클러스터에 대한 이벤트 로그를 요청 비동기식 promiseList
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
        showToast(e.toString())
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
            url: '/api/v1/auth/events/cluster',
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
            url: '/api/v1/auth/events/app',
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

