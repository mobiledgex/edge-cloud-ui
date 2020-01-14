export const API_ENDPOINT_PREFIX = '/api/v1/';


//rgb(255,0,10)

export const BORDER_CHART_COLOR_LIST = ["rgb(112,0,28)", "rgb(255,94,29)", "rgb(227,220,57)", "rgb(18,135,2)", "rgb(28,34,255)"]

export const CHART_COLOR_LIST = ['rgb(222,0,0)', 'rgb(255,150,0)', 'rgb(255,246,0)', 'rgb(91,203,0)', 'rgb(0,150,255)']
//export const CHART_COLOR_LIST = ["rgb(112,0,28)", "rgb(255,94,29)", "rgb(227,220,57)", "rgb(18,135,2)", "rgb(28,34,255)"]

export const CHART_COLOR_LIST2 = ["rgba(112,0,28, 0.25)", "rgba(255,94,29,0.25)", "rgba(227,220,57,0.25)", "rgba(18,135,2,0.25)", "rgba(28,34,255,0.25)"]

export const GRAPH_HEIGHT = 300

export const REGION = {
    ALL: 'ALL',
    US: "US",
    EU: 'EU',
}

export const USAGE_TYPE = {
    SUM_CPU_USAGE: 'sumCpuUsage',
    SUM_MEM_USAGE: 'sumMemUsage',
    SUM_RECV_BYTES: 'sumRecvBytes',
    SUM_DISK_USAGE: 'sumDiskUsage',
}

export const CLASSIFICATION = {
    CLOUDLET: 'Cloudlet',
    APP_NAME: 'AppName',
    CLUSTER_INST: 'ClusterInst',
}

export const RECENT_DATA_LIMIT_COUNT = 100

export const APP_PERFORMANCE_VALUES = {
    M4_MEDIUM: {
        KEY: 'm4.medium',
        VALUE: 1,
    },
    X1_MEDIUM: {
        KEY: 'x1.medium',
        VALUE: 2,
    },
    X1_LARGE: {
        KEY: 'x1.large',
        VALUE: 3,
    },
}

export const REGIONS_OPTIONS = [
    {value: 'ALL', text: 'ALL'},
    {value: 'EU', text: 'EU'},
    {value: 'US', text: 'US'},

]

export const NETWORK_OPTIONS = [
    {text: 'RECV_BYTE', value: 'recv_bytes'},
    {text: 'SEND_BYTE', value: 'send_bytes'},
]

export const NETWORK_TYPE = {
    RECV_BYTES: 'recv_bytes',
    SEND_BYTES: 'send_bytes',
}


export const HARDWARE_OPTIONS = [
    {text: 'FAVOR', value: 'favor'},
    {text: 'CPU', value: 'cpu'},
    {text: 'MEM', value: 'mem'},
    {text: 'DISK', value: 'disk'},
    {text: 'RECV_BYTES', value: 'recv_bytes'},
    {text: 'SEND_BYTES', value: 'send_bytes'},
]

export const HARDWARE_TYPE = {
    FAVOR: 'favor',
    CPU: 'cpu',
    MEM: 'mem',
    RECV_BYTE: 'recv_bytes',
    SEND_BYTE: 'send_bytes',
    DISK: 'disk',

}


export const MOINTORING_FILTER_ITEM_TYPE = {
    REGION: "Region",
    APP_INST: "AppName",
    CLOUDLET: "Cloudlet",
    CLUSTERINST: "ClusterInst",
}

export const SELECT_TYPE_ENUM = "Region" | "AppName" | "Cloudlet" | "ClusterInst"


export const MONITORING_CATE_SELECT_TYPE = {
    REGION: 'Region',
    APPNAME: 'AppName',
    CLOUDLET: 'Cloudlet',
    CLUSTERINST: 'ClusterInst',

}

export const APPINSTANCE_INIT_VALUE = {
    "Region": "",
    "OrganizationName": "",
    "AppName": "",
    "Version": "",
    "Operator": "",
    "Cloudlet": "",
    "ClusterInst": "",
    "CloudletLocation": {
        "latitude": 0,
        "longitude": 0,
    },
    "URI": "",
    "Liveness": "",
    "Mapped_port": "",
    "Flavor": "",
    "State": 0,
    "Error": "",
    "Runtime": "",
    "Created": "",
    "Progress": "",
    "Edit": "",
    "Status": "",
    "Revision": 0,
}


