export const GRID_ITEM_TYPE = {
    LINE: 'LINE',
    BAR: 'BAR',
    COLUMN: 'COLUMN',
    BUBBLE: 'BUBBLE',
    MAP: 'MAP',
    TABLE: 'TABLE',
    DONUTS: 'DONUTS',
    CLUSTER_LIST: 'CLUSTER_LIST',
    CLUSTER_EVENT_LOG: 'CLUSTER_EVENTLOG_LIST',
    CLOUDLET_EVENT_LOG: 'CLOUDLET_EVENT_LOG',

    APP_INST_EVENT_LOG: 'APP_INST_EVENT_LOG',
    PERFORMANCE_SUM: 'PERFORMANCE_SUM',
    CLIENT_STATUS_TABLE: 'CLIENT_STATUS_TABLE',
    MULTI_LINE_CHART: 'MULTI_CONNECTIONS',
    METHOD_USAGE_COUNT: 'METHOD_USAGE_COUNT',
}
export const HARDWARE_TYPE_FOR_GRID = {
    ETC: 'ETC',
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
    SENDBYTES: 'SENDBYTES',
    RECVBYTES: 'RECVBYTES',

    MEM: 'MEM',
    MEM2: 'MEM',
    RECV_BYTES: 'RECV_BYTES',
    SEND_BYTES: 'SEND_BYTES',
    DISK: 'DISK',
    CONNECTIONS: 'CONNECTIONS',
    ACTIVE_CONNECTION: 'ACTIVE_CONNECTION',//12
    HANDLED_CONNECTION: 'HANDLED_CONNECTION',//13
    ACCEPTS_CONNECTION: 'ACCEPTS_CONNECTION',//14 (index)
    //For Cloudlet
    vCpuUsed: 'vCpuUsed',
    memUsed: 'memUsed',
    diskUsed: 'diskUsed',
    floatingIpsUsed: 'floatingIpsUsed',
    ipv4Used: 'ipv4Used',
    netSend: 'netSend',
    netRecv: 'netRecv',
    methodUsageCount: 'methodUsageCount',

};

/*desc:#####################################
todo: Cloudlet  LAYOUT
desc:#######################################*/
export const defaultLayoutForCloudlet = [
    {i: '1', x: 0, y: 0, w: 1, h: 1, "add": false},//vCPU
    {i: '2', x: 1, y: 0, w: 2, h: 2, "add": false, "static": false},//MAP
    {i: '3', x: 0, y: 1, w: 1, h: 1, "add": false},//findCloudlet_widget
    {i: '4', x: 3, y: 0, w: 1, h: 1, "add": false},//DISK
    {i: '5', x: 3, y: 1, w: 1, h: 1, "add": false},//DONUTS
    {i: '6', x: 0, y: 2, w: 3, h: 1, "add": false},//
    {i: '7', x: 3, y: 2, w: 1, h: 1, "add": false}
    /*,{i: '8', x: 1, y: 3, w: 1, h: 1, "add": false},*/
];

export const defaultLayoutMapperForCloudlet = [
    {
        id: '1',
        hwType: HARDWARE_TYPE_FOR_GRID.vCpuUsed,
        graphType: GRID_ITEM_TYPE.BAR,
    },
    {
        id: '2',
        hwType: HARDWARE_TYPE_FOR_GRID.MAP,
        graphType: GRID_ITEM_TYPE.MAP,
    },

    {
        id: '3',
        hwType: HARDWARE_TYPE_FOR_GRID.memUsed,
        graphType: GRID_ITEM_TYPE.BAR,
    },
    {
        id: '4',
        hwType: undefined,
        graphType: GRID_ITEM_TYPE.METHOD_USAGE_COUNT,
    },
    {
        id: '5',
        hwType: HARDWARE_TYPE_FOR_GRID.diskUsed,
        graphType: GRID_ITEM_TYPE.BAR,
    },
    {
        id: '6',
        hwType: undefined,
        graphType: GRID_ITEM_TYPE.CLIENT_STATUS_TABLE,
    },
    {
        id: '7',
        hwType: undefined,
        graphType: GRID_ITEM_TYPE.CLOUDLET_EVENT_LOG,
    },
    /*  {
          id: '8',
          hwType: HARDWARE_TYPE_FOR_GRID.floatingIpsUsed,
          graphType: GRID_ITEM_TYPE.BAR,
      },*/
];


/*desc:#####################################
todo: Cluster   LAYOUT
desc:#######################################*/
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
        graphType: GRID_ITEM_TYPE.LINE,
    },
    {
        id: '2',
        hwType: HARDWARE_TYPE_FOR_GRID.MAP,
        graphType: GRID_ITEM_TYPE.MAP,
    },

    {
        id: '3',
        hwType: HARDWARE_TYPE_FOR_GRID.MEM,
        graphType: GRID_ITEM_TYPE.LINE,
    },
    {
        id: '4',
        hwType: HARDWARE_TYPE_FOR_GRID.BUBBLE,
        graphType: GRID_ITEM_TYPE.BUBBLE,
    },
    {
        id: '5',
        hwType: undefined,
        graphType: GRID_ITEM_TYPE.CLUSTER_EVENT_LOG,
    },
    {
        id: '6',
        hwType: undefined,
        graphType: GRID_ITEM_TYPE.PERFORMANCE_SUM,
    },

];
/*todo:#####################################
  todo: Default Admin (AppInst)
  todo:#######################################*/
export const defaultLayoutForAdmin = [

    {i: '1', x: 0, y: 0, w: 1, h: 1, "add": false},//CPU
    {i: '2', x: 1, y: 0, w: 2, h: 2, "add": false, "static": false},//MAP
    {i: '3', x: 0, y: 1, w: 1, h: 1, "add": false},//MEM
    {i: '4', x: 3, y: 0, w: 1, h: 1, "add": false},//DISK
    {i: '5', x: 3, y: 1, w: 1, h: 1, "add": false},
    {i: '6', x: 0, y: 2, w: 3, h: 1, "add": false},//performance Grid
    {i: '7', x: 3, y: 2, w: 1, h: 1, "add": false}
];

export const defaultHwMapperListForAdmin = [
    {
        id: '1',
        hwType: HARDWARE_TYPE_FOR_GRID.CPU,
        graphType: GRID_ITEM_TYPE.LINE,
    },
    {
        id: '2',
        hwType: HARDWARE_TYPE_FOR_GRID.MAP,
        graphType: HARDWARE_TYPE_FOR_GRID.MAP,
    },

    {
        id: '3',
        hwType: HARDWARE_TYPE_FOR_GRID.MEM,
        graphType: GRID_ITEM_TYPE.LINE,
    },
    {
        id: '4',
        hwType: HARDWARE_TYPE_FOR_GRID.DISK,
        graphType: GRID_ITEM_TYPE.LINE,
    },
    {
        id: '5',
        hwType: HARDWARE_TYPE_FOR_GRID.DISK,
        graphType: GRID_ITEM_TYPE.LINE,
    },

    {
        id: '6',
        hwType: GRID_ITEM_TYPE.CLIENT_STATUS_TABLE,
        graphType: GRID_ITEM_TYPE.CLIENT_STATUS_TABLE,
    },

    {
        id: '7',
        hwType: undefined,
        graphType: GRID_ITEM_TYPE.METHOD_USAGE_COUNT,
    },
];

/*todo:#####################################
  todo: Default Admin (Cluster)
  todo:#######################################*/
export const defaultLayoutForAdminCluster = [
    {i: '1', x: 0, y: 0, w: 1, h: 1, "add": false},//CPU
    {i: '2', x: 1, y: 0, w: 2, h: 2, "add": false, "static": false},//MAP
    {i: '3', x: 0, y: 1, w: 1, h: 1, "add": false},//MEM
    {i: '4', x: 3, y: 0, w: 1, h: 1, "add": false},//DISK
    {i: '5', x: 3, y: 1, w: 1, h: 1, "add": false},
    {i: '6', x: 0, y: 2, w: 3, h: 1, "add": false},//performance Grid
    {i: '7', x: 3, y: 2, w: 1, h: 1, "add": false}
];

export const defaultHwMapperListForAdminCluster = [
    {
        id: '1',
        hwType: HARDWARE_TYPE_FOR_GRID.CPU,
        graphType: GRID_ITEM_TYPE.LINE,
    },
    {
        id: '2',
        hwType: HARDWARE_TYPE_FOR_GRID.MAP,
        graphType: GRID_ITEM_TYPE.MAP,
    },

    {
        id: '3',
        hwType: HARDWARE_TYPE_FOR_GRID.MEM,
        graphType: GRID_ITEM_TYPE.LINE,
    },
    {
        id: '4',
        hwType: HARDWARE_TYPE_FOR_GRID.BUBBLE,
        graphType: GRID_ITEM_TYPE.BUBBLE,
    },
    {
        id: '5',

        hwType: HARDWARE_TYPE_FOR_GRID.DISK,
        graphType: GRID_ITEM_TYPE.LINE,
    },
    {
        id: '6',
        hwType: undefined,
        graphType: GRID_ITEM_TYPE.PERFORMANCE_SUM,
    },
    {
        id: '7',
        hwType: undefined,
        graphType: GRID_ITEM_TYPE.CLUSTER_EVENT_LOG,
    },
];

/*todo:#####################################
  todo:  Default Admin (Cloudlet)
  todo:#######################################*/
export const defaultLayoutForAdminCloudlet = [

    {i: '1', x: 0, y: 0, w: 1, h: 1, "add": false},//vCPU
    {i: '2', x: 1, y: 0, w: 2, h: 2, "add": false, "static": false},//MAP
    {i: '3', x: 0, y: 1, w: 1, h: 1, "add": false},//findCloudlet_widget
    {i: '4', x: 3, y: 0, w: 1, h: 1, "add": false},//DISK
    {i: '5', x: 3, y: 1, w: 1, h: 1, "add": false},//DONUTS
    {i: '6', x: 0, y: 2, w: 3, h: 1, "add": false},//
    {i: '7', x: 3, y: 2, w: 1, h: 1, "add": false}
];

export const defaultHwMapperListForAdminCloudlet = [
    {
        id: '1',
        hwType: HARDWARE_TYPE_FOR_GRID.vCpuUsed,
        graphType: GRID_ITEM_TYPE.LINE,
    },
    {
        id: '2',
        hwType: HARDWARE_TYPE_FOR_GRID.MAP,
        graphType: GRID_ITEM_TYPE.MAP,
    },

    {
        id: '3',
        hwType: HARDWARE_TYPE_FOR_GRID.memUsed,
        graphType: GRID_ITEM_TYPE.LINE,
    },
    {
        id: '4',
        hwType: undefined,
        graphType: GRID_ITEM_TYPE.METHOD_USAGE_COUNT,
    },
    {
        id: '5',
        hwType: HARDWARE_TYPE_FOR_GRID.diskUsed,
        graphType: GRID_ITEM_TYPE.LINE,
    },
    {
        id: '6',
        hwType: undefined,
        graphType: GRID_ITEM_TYPE.CLIENT_STATUS_TABLE,
    },
    {
        id: '7',
        hwType: undefined,
        graphType: GRID_ITEM_TYPE.CLOUDLET_EVENT_LOG,
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
    {i: '6', x: 0, y: 2, w: 3, h: 1, "add": false},//performance Grid
];

export const defaultLayoutMapperForAppInst = [
    {
        id: '1',
        hwType: HARDWARE_TYPE_FOR_GRID.CPU,
        graphType: GRID_ITEM_TYPE.LINE,
    },
    {
        id: '2',
        hwType: HARDWARE_TYPE_FOR_GRID.MAP,
        graphType: HARDWARE_TYPE_FOR_GRID.MAP,
    },

    {
        id: '3',
        hwType: HARDWARE_TYPE_FOR_GRID.MEM,
        graphType: GRID_ITEM_TYPE.LINE,
    },
    {
        id: '4',
        hwType: HARDWARE_TYPE_FOR_GRID.DISK,
        graphType: GRID_ITEM_TYPE.LINE,
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


export const defaultLayoutXYPosForClusterForOper = [
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

export const defaultLayoutXYPosForAdmin = [
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


export const defaultLayoutXYPosForCloudletAdmin = [
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

export const defaultLayoutXYPosForClusterAdmin = [
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

//todo : for real
export const ADMIN_CLOUDLET_LAYOUT_KEY = "_layout_admin_cloudlet";
export const ADMIN_CLOUDLET_HW_MAPPER_KEY = "_layout_mapper_admin_cloudlet";
export const ADMIN_CLUSTER_LAYOUT_KEY = "_layout_admin_cluster";
export const ADMIN_CLUSTER_HW_MAPPER_KEY = "_layout_mapper_admin_cluster";
export const ADMIN_LAYOUT_KEY = "_layout_admin";
export const ADMIN_HW_MAPPER_KEY = "_layout_mapper_admin";


//todo : for test
/*export const ADMIN_CLOUDLET_LAYOUT_KEY = "_layout_admin_cloudlet2";
export const ADMIN_CLOUDLET_HW_MAPPER_KEY = "_layout_mapper_admin_cloudlet2";
export const ADMIN_CLUSTER_LAYOUT_KEY = "_layout_admin_cluster2";
export const ADMIN_CLUSTER_HW_MAPPER_KEY = "_layout_mapper_admin_cluster2";
export const ADMIN_LAYOUT_KEY = "_layout_admin2";
export const ADMIN_HW_MAPPER_KEY = "_layout_mapper_admin2";*/
