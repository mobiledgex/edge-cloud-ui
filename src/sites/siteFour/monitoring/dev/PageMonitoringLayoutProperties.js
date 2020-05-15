import PageDevMonitoring from "./PageDevMonitoring";
import {reactLocalStorage} from "reactjs-localstorage";
import {
    APPINST_HW_MAPPER_KEY,
    APPINST_LAYOUT_KEY, CLOUDLET_HW_MAPPER_KEY,
    CLOUDLET_LAYOUT_KEY,
    CLUSTER_HW_MAPPER_KEY,
    CLUSTER_LAYOUT_KEY
} from "./PageDevMonitoringProps";
import {showToast} from "../PageMonitoringCommonService";
import {getUserId} from "./PageDevMonitoringService";

export const GRID_ITEM_TYPE = {
    LINE: 'LINE',
    BAR: 'BAR',
    COLUMN: 'COLUMN',
    BUBBLE: 'BUBBLE',
    MAP: 'MAP',
    TABLE: 'TABLE',
    PIE: 'PIE',
    CLUSTER_LIST: 'CLUSTER_LIST',
    CLUSTER_EVENTLOG_LIST: 'CLUSTER_EVENTLOG_LIST',
    APP_INST_EVENT_LOG: 'APP_INST_EVENT_LOG',
    PERFORMANCE_SUM: 'PERFORMANCE_SUM'
}
export const HARDWARE_TYPE_FOR_GRID = {
    MAP: 'MAP',
    PIE: 'PIE',
    BUBBLE: 'BUBBLE',
    CLOUDLET_LIST: 'CLOUDLET_LIST',
    FLAVOR: 'FLAVOR',
    CPU: 'CPU',
    VCPU: 'vCPU',
    NET_SEND: 'NET_SEND',
    NET_RECV: 'NET_RECV',
    FLOATING_IPS: 'FLOATING_IPS',
    IPV4: 'IPV4',

    ////////////
    UDP: 'UDP',
    TCP: 'TCP',
    NETWORK: 'NETWORK',
    //UDP
    UDPSENT: 'UDPSENT',
    UDPRECV: 'UDPRECV',
    UDPRECVERR: 'UDPRECVERR',

    //TCP
    TCPCONNS: 'TCPCONNS',
    TCPRETRANS: 'TCPRETRANS',

    //NETWORK
    SENDBYTES: 'SEND_BYTES',
    RECVBYTES: 'RECV_BYTES',

    MEM: 'MEM',
    MEM2: 'MEM',
    RECV_BYTES: 'RECV_BYTES',
    SEND_BYTES: 'SEND_BYTES',
    DISK: 'DISK',
    CONNECTIONS: 'CONNECTIONS',
    ACTIVE_CONNECTION: 'ACTIVE_CONNECTION',//12
    HANDLED_CONNECTION: 'HANDLED_CONNECTION',//13
    ACCEPTS_CONNECTION: 'ACCEPTS_CONNECTION',//14 (index)

    vCpuUsed: 'vCpuUsed',
    memUsed: 'memUsed',
    diskUsed: 'diskUsed',
    floatingIpsUsed: 'floatingIpsUsed',
    ipv4Used: 'ipv4Used',
    netSend: 'netSend',
    netRecv: 'netRecv',

};

export const CHART_TYPE = {
    LINE: 'LINE',
    BAR: 'BAR',
    COLUMN: 'COLUMN',
}

export const defaultLayoutForCloudlet = [
    {i: '1', x: 0, y: 0, w: 1, h: 1, "add": false},//CPU
    {i: '2', x: 1, y: 0, w: 2, h: 2, "add": false, "static": false},//MAP
    {i: '3', x: 0, y: 1, w: 1, h: 1, "add": false},//MEM
    {i: '4', x: 3, y: 0, w: 1, h: 1, "add": false},//Disk


    {i: '5', x: 0, y: 2, w: 1, h: 1, "add": false},//ipv4Used
    {i: '6', x: 1, y: 2, w: 1, h: 1, "add": false},//1
    {i: '7', x: 2, y: 2, w: 1, h: 1, "add": false},//2
    {i: '8', x: 3, y: 2, w: 1, h: 1, "add": false},//3


];


export const defaultLayoutMapperForCloudlet = [
    {
        id: '1',
        hwType: HARDWARE_TYPE_FOR_GRID.vCpuUsed,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '2',
        hwType: HARDWARE_TYPE_FOR_GRID.MAP,
        graphType: HARDWARE_TYPE_FOR_GRID.MAP,
    },

    {
        id: '3',
        hwType: HARDWARE_TYPE_FOR_GRID.memUsed,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '4',
        hwType: HARDWARE_TYPE_FOR_GRID.diskUsed,
        graphType: CHART_TYPE.LINE,
    },
    ////////////////////////////
    {
        id: '5',
        hwType: HARDWARE_TYPE_FOR_GRID.netSend,
        graphType: CHART_TYPE.LINE,
    },

    {
        id: '6',
        hwType: HARDWARE_TYPE_FOR_GRID.netRecv,
        graphType: CHART_TYPE.LINE,
    },

    {
        id: '7',
        hwType: HARDWARE_TYPE_FOR_GRID.ipv4Used,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '8',
        hwType: HARDWARE_TYPE_FOR_GRID.floatingIpsUsed,
        graphType: CHART_TYPE.LINE,
    },

];


export const defaultLayoutForCluster = [
    {i: '1', x: 0, y: 0, w: 1, h: 1, "add": false},//CPU
    {i: '2', x: 1, y: 0, w: 2, h: 2, "add": false, "static": false},//MAP
    {i: '3', x: 0, y: 1, w: 1, h: 1, "add": false},//MEM
    {i: '4', x: 3, y: 0, w: 1, h: 1, "add": false},//bubble
    {i: '5', x: 3, y: 1, w: 1, h: 1, "add": false},//appinst event log
];


export const defaultHwMapperListForCluster = [
    {
        id: '1',
        hwType: HARDWARE_TYPE_FOR_GRID.CPU,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '2',
        hwType: HARDWARE_TYPE_FOR_GRID.MAP,
        graphType: HARDWARE_TYPE_FOR_GRID.MAP,
    },

    {
        id: '3',
        hwType: HARDWARE_TYPE_FOR_GRID.MEM,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '4',
        hwType: HARDWARE_TYPE_FOR_GRID.BUBBLE,
        graphType: HARDWARE_TYPE_FOR_GRID.BUBBLE,
    },
    {
        id: '5',
        hwType: GRID_ITEM_TYPE.APP_INST_EVENT_LOG,
        graphType: GRID_ITEM_TYPE.APP_INST_EVENT_LOG,
    },
    {
        id: '6',
        hwType: GRID_ITEM_TYPE.PERFORMANCE_SUM,
        graphType: GRID_ITEM_TYPE.PERFORMANCE_SUM,
    },

];


/*
desc:#####################################
desc:defaultLayoutForAppInst
desc:#######################################
 */
export const defaultLayoutForAppInst = [

    {i: '1', x: 0, y: 0, w: 1, h: 1, "add": false},//CPU
    {i: '2', x: 1, y: 0, w: 2, h: 2, "add": false, "static": false},//MAP
    {i: '3', x: 0, y: 1, w: 1, h: 1, "add": false},//MEM
    {i: '4', x: 3, y: 0, w: 1, h: 1, "add": false},//DISK
    {i: '5', x: 3, y: 1, w: 1, h: 1, "add": false},
    {i: '6', x: 0, y: 2, w: 4, h: 1, "add": false},//performance Grid
];

export const defaultLayoutMapperForAppInst = [
    {
        id: '1',
        hwType: HARDWARE_TYPE_FOR_GRID.CPU,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '2',
        hwType: HARDWARE_TYPE_FOR_GRID.MAP,
        graphType: HARDWARE_TYPE_FOR_GRID.MAP,
    },

    {
        id: '3',
        hwType: HARDWARE_TYPE_FOR_GRID.MEM,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '4',
        hwType: HARDWARE_TYPE_FOR_GRID.DISK,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '5',
        hwType: GRID_ITEM_TYPE.APP_INST_EVENT_LOG,
        graphType: GRID_ITEM_TYPE.APP_INST_EVENT_LOG,
    },
    {
        id: '6',
        hwType: GRID_ITEM_TYPE.PERFORMANCE_SUM,
        graphType: GRID_ITEM_TYPE.PERFORMANCE_SUM,
    },
];

export const revertToDefaultLayout = async (_this: PageDevMonitoring) => {
    try {
        reactLocalStorage.remove(getUserId() + CLUSTER_LAYOUT_KEY)
        reactLocalStorage.remove(getUserId() + CLOUDLET_LAYOUT_KEY)
        reactLocalStorage.remove(getUserId() + APPINST_LAYOUT_KEY)
        reactLocalStorage.remove(getUserId() + CLUSTER_HW_MAPPER_KEY)
        reactLocalStorage.remove(getUserId() + CLOUDLET_HW_MAPPER_KEY)
        reactLocalStorage.remove(getUserId() + APPINST_HW_MAPPER_KEY)

        await _this.setState({
            layoutForCluster: [],
            layoutMapperForCluster: [],
            layoutForCloudlet: [],
            layoutMapperForCloudlet: [],
            layoutForAppInst: [],
            layoutMapperForAppInst: [],
        });

        await _this.setState({
            layoutForCluster: defaultLayoutForCluster,
            layoutMapperForCluster: defaultHwMapperListForCluster,
            layoutForCloudlet: defaultLayoutForCloudlet,
            layoutMapperForCloudlet: defaultLayoutMapperForCloudlet,
            layoutForAppInst: defaultLayoutForAppInst,
            layoutMapperForAppInst: defaultLayoutMapperForAppInst,
        })


    } catch (e) {
        showToast(e.toString())
    }

}
