export const GRID_ITEM_TYPE = {
    LINE: 'LINE',
    BAR: 'BAR',
    COLUMN: 'COLUMN',
    BUBBLE: 'BUBBLE',
    MAP: 'MAP',
    TABLE: 'TABLE',
    DONUTS: 'DONUTS',
    CLUSTER_LIST: 'CLUSTER_LIST',
    CLUSTER_EVENTLOG_LIST: 'CLUSTER_EVENTLOG_LIST',
    APP_INST_EVENT_LOG: 'APP_INST_EVENT_LOG',
    PERFORMANCE_SUM: 'PERFORMANCE_SUM'
}
export const HARDWARE_TYPE_FOR_GRID = {
    MAP: 'MAP',
    DONUTS: 'DONUTS',
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
    DONUTS: 'DONUTS'
}

export const defaultLayoutForCloudlet = [
    {i: '1', x: 0, y: 0, w: 1, h: 1, "add": false},//vCPU
    {i: '2', x: 1, y: 0, w: 2, h: 2, "add": false, "static": false},//MAP
    {i: '3', x: 0, y: 1, w: 1, h: 1, "add": false},//MEM
    {i: '4', x: 3, y: 0, w: 1, h: 1, "add": false},//DISK
    {i: '5', x: 3, y: 1, w: 1, h: 1, "add": false},//DONUTS
    {i: '6', x: 0, y: 2, w: 4, h: 1, "add": false},//performance Grid
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
        hwType: HARDWARE_TYPE_FOR_GRID.vCpuUsed,
        graphType: CHART_TYPE.PIE,
    },
    {
        id: '6',
        hwType: GRID_ITEM_TYPE.PERFORMANCE_SUM,
        graphType: GRID_ITEM_TYPE.PERFORMANCE_SUM,
    },

];


export const defaultLayoutForCluster = [
    {i: '1', x: 0, y: 0, w: 1, h: 1, "add": false},//CPU
    {i: '2', x: 1, y: 0, w: 2, h: 2, "add": false, "static": false},//MAP
    {i: '3', x: 0, y: 1, w: 1, h: 1, "add": false},//MEM
    {i: '4', x: 3, y: 0, w: 1, h: 1, "add": false},//bubble
    {i: '5', x: 3, y: 1, w: 1, h: 1, "add": false},//appinst event log
    {i: '6', x: 0, y: 2, w: 4, h: 1, "add": false},//performance Grid
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


export const defaultLayoutXYPosForCloudlet = [
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 3, y: 0},
    {x: 0, y: 1},
    {x: 3, y: 1},
    {x: 0, y: 2},
    //////////// 4,5,6 row
    {x: 0, y: 3},
    {x: 1, y: 3},
    {x: 2, y: 3},
    {x: 3, y: 3},

    {x: 0, y: 4},
    {x: 1, y: 4},
    {x: 2, y: 4},
    {x: 3, y: 4},

    {x: 0, y: 5},
    {x: 1, y: 5},
    {x: 2, y: 5},
    {x: 3, y: 5},
    /////////// 7,8,9rd row
    {x: 0, y: 6},
    {x: 1, y: 6},
    {x: 2, y: 6},
    {x: 3, y: 6},

    {x: 0, y: 7},
    {x: 1, y: 7},
    {x: 2, y: 7},
    {x: 3, y: 7},

    {x: 0, y: 8},
    {x: 1, y: 8},
    {x: 2, y: 8},
    {x: 3, y: 8},
]

export const defaultLayoutXYPosForCluster = [
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 3, y: 0},
    {x: 0, y: 1},
    {x: 3, y: 1},
    {x: 0, y: 2},
    //////////// 4,5,6 row
    {x: 0, y: 3},
    {x: 1, y: 3},
    {x: 2, y: 3},
    {x: 3, y: 3},

    {x: 0, y: 4},
    {x: 1, y: 4},
    {x: 2, y: 4},
    {x: 3, y: 4},

    {x: 0, y: 5},
    {x: 1, y: 5},
    {x: 2, y: 5},
    {x: 3, y: 5},
    /////////// 7,8,9rd row
    {x: 0, y: 6},
    {x: 1, y: 6},
    {x: 2, y: 6},
    {x: 3, y: 6},

    {x: 0, y: 7},
    {x: 1, y: 7},
    {x: 2, y: 7},
    {x: 3, y: 7},

    {x: 0, y: 8},
    {x: 1, y: 8},
    {x: 2, y: 8},
    {x: 3, y: 8},
]

export const defaultLayoutXYPosForAppInst = [
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 3, y: 0},
    {x: 0, y: 1},
    {x: 3, y: 1},
    {x: 0, y: 2},
    //////////// 4,5,6 row
    {x: 0, y: 3},
    {x: 1, y: 3},
    {x: 2, y: 3},
    {x: 3, y: 3},

    {x: 0, y: 4},
    {x: 1, y: 4},
    {x: 2, y: 4},
    {x: 3, y: 4},

    {x: 0, y: 5},
    {x: 1, y: 5},
    {x: 2, y: 5},
    {x: 3, y: 5},
    /////////// 7,8,9rd row
    {x: 0, y: 6},
    {x: 1, y: 6},
    {x: 2, y: 6},
    {x: 3, y: 6},

    {x: 0, y: 7},
    {x: 1, y: 7},
    {x: 2, y: 7},
    {x: 3, y: 7},

    {x: 0, y: 8},
    {x: 1, y: 8},
    {x: 2, y: 8},
    {x: 3, y: 8},
]

export const CLOUDLET_LAYOUT_KEY = "_layout_cloudlet";
export const CLOUDLET_HW_MAPPER_KEY = "_layout_mapper_cloudlet";
export const CLUSTER_LAYOUT_KEY = "_layout";
export const CLUSTER_HW_MAPPER_KEY = "_layout_mapper";
export const APPINST_LAYOUT_KEY = "_layout2";
export const APPINST_HW_MAPPER_KEY = "_layout2_mapper";


