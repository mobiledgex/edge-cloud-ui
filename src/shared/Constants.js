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
    SUM_TCP_CONNS: 'sumTcpConns'

  /*  sumUdpSent: 6827
    sumUdpRecv: 1087
    sumUdpRecvErr: 0
    sumTcpConns: 196
    sumTcpRetrans: 865
    sumSendBytes: 435582.3
    sumRecvBytes: 136609.3
    sumMemUsage: 29.078074012239632
    sumDiskUsage: 10.561762070574607
    sumCpuUsage: 4.878710078764074*/

}

export const CLASSIFICATION = {
    CLOUDLET: 'Cloudlet',
    APP_NAME: 'AppName',
    APPNAME: 'AppName',
    APPINST: 'AppInst',
    CLUSTER_INST: 'ClusterInst',
    CLUSTER: 'Cluster',
}



export const RECENT_DATA_LIMIT_COUNT = 10

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
    {text: 'RECV BYTES', value: 'RECV_BYTES'},
    {text: 'SEND BYTES', value: 'SEND_BYTES'},
]

export const NETWORK_OPTIONS2 = [
    {text: 'NET_SEND', value: 'NET_SEND'},
    {text: 'NET_RECV', value: 'NET_RECV'},
]


export const USAGE_INDEX = {
    TIME: 0,
    CLOUDLET: 1,
    OPERATOR: 2,
    NETSEND: 3,
    NETRECV: 4,
    VCPUUSED: 5,
    VCPUMAX: 6,
    MEMUSED: 7,
    MEMMAX: 8,
    DISKUSED: 9,
    DISKMAX: 10,
    FLOATINGIPSUSED: 11,
    FLOATINGIPSMAX: 12,
    IPV4USED: 13,
    IPV4MAX: 14,
}

export const USAGE_INDEX_FOR_CLUSTER = {
    TIME: 0,
    CLUSTER: 1,
    DEV: 2,
    CLOUDLET: 3,
    OPERATOR: 4,
    CPU: 5,
    MEM: 6,
    DISK: 7,
    SENDBYTES: 8,
    RECVBYTES: 9,
    TCPCONNS: 10,
    TCPRETRANS: 11,
    UDPSENT: 12,
    UDPRECV: 13,
    UDPRECVERR: 14,
}


export const NETWORK_TYPE = {
    RECV_BYTES: 'RECV_BYTES',
    SEND_BYTES: 'SEND_BYTES',
    NET_SEND: 'NET_SEND',
    NET_RECV: 'NET_RECV',
}


export const HARDWARE_OPTIONS = [
    {text: 'FLAVOR', value: 'FLAVOR'},
    {text: 'CPU', value: 'CPU'},
    {text: 'MEM', value: 'MEM'},
    {text: 'DISK', value: 'DISK'},
    {text: 'RECV_BYTES', value: 'RECV_BYTES'},
    {text: 'SEND_BYTES', value: 'SEND_BYTES'},
]


export const HARDWARE_OPTIONS_FOR_CLOUDLET = [
    {text: 'vCPU', value: 'vCPU'},
    {text: 'MEM', value: 'MEM'},
    {text: 'DISK', value: 'DISK'},
    {text: 'RECV BYTES', value: 'RECV_BYTES'},
    {text: 'SEND BYTES', value: 'SEND_BYTES'},
    {text: 'FLOATING_IPS', value: 'FLOATING_IPS'},
    {text: 'IPV4', value: 'IPV4'},
]


export const HARDWARE_OPTIONS_FOR_CLUSTER= [
    {text: 'CPU', value: 'CPU'},
    {text: 'MEM', value: 'MEM'},
    {text: 'DISK', value: 'DISK'},
    {text: 'RECV BYTES', value: 'RECV_BYTES'},
    {text: 'SEND BYTES', value: 'SEND_BYTES'},
    {text: 'UDP_SENT', value: 'UDPSENT'},
    {text: 'UDP_RECVERR', value: 'UDPRECVERR'},
    {text: 'TCP_CONNS', value: 'TCPCONNS'},
    {text: 'TCP_RETRANS', value: 'TCPRETRANS'},

]


export const INSTANCE_TEST_OPTIONS= [
    {text: 'redhong_inst', value: 'redhong_inst'},
    {text: 'asbdsf_inst', value: 'asbdsf_inst'},
    {text: '123241__inst', value: '123241__inst'},
    {text: 'kyungjoon_inst', value: 'kyungjoon_inst'},
    {text: 'sdfkjh__inst', value: 'sdfkjh__inst'},
    {text: 'inki__inst', value: 'inki__inst'},


]

export const HARDWARE_TYPE_FOR_CLOUDLET = {
    vCPU : 'vCPU',
    MEM: 'MEM',
    DISK: 'DISK',
    RECV_BYTES : 'RECV_BYTES',
    SEND_BYTES : 'SEND_BYTES',
    FLOATING_IPS: 'FLOATING_IPS',
    IPV4: 'IPV4',
}

export const HARDWARE_TYPE = {
    FLAVOR: 'FLAVOR',
    CPU: 'CPU',
    VCPU: 'vCPU',
    VCPU_MAX: 'VCPU_MAX',
    NET_SEND: 'NET_SEND',
    NET_RECV: 'NET_RECV',
    VCPU_USED: 'VCPU_USED',

    MEM_USED: 'MEM_USED',
    MEM_MAX: 'MEM_MAX',
    DISK_USED: 'DISK_USED',
    DISK_MAX: 'DISK_MAX',
    FLOATING_IPS_USED: 'FLOATING_IPS_USED',
    FLOATING_IPS_MAX: 'FLOATING_IPS_MAX',
    FLOATING_IPS: 'FLOATING_IPS',
    IPV4_USED: 'IPV4_USED',
    IPV4_MAX: 'IPV4_MAX',
    IPV4: 'IPV4',

    UDP: 'UDP',
    TCP: 'TCP',
    NETWORK: 'NETWORK',
    /////////////////////////
    UDPSENT: 'UDPSENT',
    UDPRECV: 'UDPRECV',
    UDPRECVERR: 'UDPRECVERR',
    TCPCONNS: 'TCPCONNS',
    TCPRETRANS: 'TCPRETRANS',
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

}

export const CONNECTIONS_OPTIONS = [
    {text: 'ACTIVE CONN', value: 'ACTIVE_CONNECTION'},
    {text: 'HANDLED CONN', value: 'HANDLED_CONNECTION'},
    {text: 'ACCEPTS CONN', value: 'ACCEPTS_CONNECTION'},
    //ACCEPTS_CONNECTION
]


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
    APPINST: 'AppInst',
}

export const USER_ROLE = {
    ADMIN_MANAGER: 'AdminManager',
    OPERATOR_MANAGER: 'OperatorManager',
    //ADMIN_MANAGER : 'AdminManager',
}

export const USER_TYPE = {
    DEV: 'dev',
    OPER: 'oper',
    ADMIN: 'admin'
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


