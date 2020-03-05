import {convertByteToMegaByte} from "../sites/siteFour/monitoring/PageMonitoringCommonService";

export const API_ENDPOINT_PREFIX = '/api/v1/';
export const BORDER_CHART_COLOR_LIST = ["#70001C", "#FF5E1D", "#E3DC39", "#128702", "#1C22FF",'#66D9EF', '#272822', '#75715E',]
export const CHART_COLOR_LIST = ['#DE0000', '#FF9600', '#FFF600', '#5BCB00', '#0096FF','#66D9EF', '#272822', '#75715E',]
export const CHART_COLOR_LIST2 = ['#65DEF1', '#A8DCD1', '#DCE2C8', '#F96900', '#F17F29','#66D9EF', '#272822', '#75715E',]

export const CHART_COLOR_LIST3 = ['#008000', '#d7fff1', '#556B2F', '#32CD32', '#8cd790','#66D9EF', '#272822', '#75715E',]

export const CHART_COLOR_LIST4 = ['#FF0000', '#FFBDAA', '#D4826A', '#802D15', '#551300','#66D9EF', '#272822', '#75715E',]

export const CHART_COLOR_MONOKAI = ['#F92672', '#FD971F', '#A6E22E', '#E6DB74', '#A6E22E','#66D9EF', '#272822', '#75715E',]




export const CHART_COLOR_APPLE = ['#0A84FF', '#30D158', '#FF453A', '#FF9F0A', '#FF375F','#66D9EF', '#272822', '#75715E',]

export const CHART_COLOR_LIST5 = ['#609732', '#6EDC12', '#69BA27', '#527536', '#405330']
export const CHART_COLOR_LIST6 = ['#AA5939', '#F75514', '#D15A2B', '#83513C', '#5D4136']
export const CHART_COLOR_LIST7 = ['#6F256F', '#A10DA1', '#881C88', '#552755', '#3C233C']


export const GRAPH_HEIGHT = 300
export const REGION = {
    ALL: 'ALL',
    US: "US",
    EU: 'EU',
}

export const THEME_OPTIONS = {
    EUNDEW: 'EUNDEW',
    BLUE: "BLUE",
    GREEN: 'GREEN',
    RED: 'RED',
    MONOKAI: 'MONOKAI',
    APPLE: 'APPLE',
}

export const THEME_OPTIONS_LIST = [
    {value: 'EUNDEW', text: 'EUNDEW'},
    {value: 'BLUE', text: 'BLUE'},
    {value: 'GREEN', text: 'GREEN'},
    {value: 'RED', text: 'RED'},
    {value: 'MONOKAI', text: 'MONOKAI'},
    {value: 'APPLE', text: 'APPLE'},
    //CHART_COLOR_APPLE
]


export const lineGraphOptions = {
    animation: {
        duration: 1000
    },
    datasetStrokeWidth: 3,
    pointDotStrokeWidth: 4,
    legend: {
        position: 'top',
        labels: {
            boxWidth: 10,
            fontColor: 'white'
        }
    },
    scales: {
        yAxes: [{

            ticks: {
                beginAtZero: true,
                min: 0,
                //max: 100,
                fontColor: 'white',
            },
            gridLines: {
                color: "#505050",
            },
            stacked: true

        }],
        xAxes: [{
            /*ticks: {
                fontColor: 'white'
            },*/
            gridLines: {
                color: "#505050",
            },
            ticks: {
                fontSize: 14,
                fontColor: 'white',
                //maxRotation: 0.05,
                //autoSkip: true,
                maxRotation: 45,
                minRotation: 45,
                padding: 10,
                labelOffset: 0,
                callback(value, index, label) {
                    return value;

                },
            },
            beginAtZero: false,
            /* gridLines: {
                 drawTicks: true,
             },*/
        }],
        backgroundColor: {
            fill: "#1e2124"
        },
    }

}

export const USAGE_TYPE = {
    SUM_CPU_USAGE: 'sumCpuUsage',
    SUM_MEM_USAGE: 'sumMemUsage',
    SUM_SEND_BYTES: 'sumSendBytes',
    SUM_RECV_BYTES: 'sumRecvBytes',
    SUM_DISK_USAGE: 'sumDiskUsage',
    SUM_UDP_SENT: 'sumUdpSent',
    SUM_UDP_RECV: 'sumUdpRecv',
    SUM_TCP_CONNS: 'sumTcpConns',
    SUM_TCP_RETRANS: 'sumTcpRetrans',

}

export const CLASSIFICATION = {
    CLOUDLET: 'Cloudlet',
    CloudletName: 'CloudletName',
    cloudlet: 'cloudlet',
    APP_NAME: 'AppName',
    appName: 'appName',
    APPNAME: 'AppName',
    APPINST: 'AppInst',
    CLUSTER_INST: 'ClusterInst',
    CLUSTER: 'Cluster',
    REGION: 'Region',
}

export const APP_INST_USAGE_TYPE_INDEX = {
    TIME: 0,
    APP: 1,
    CLUSTER: 2,
    DEV: 3,
    CLOUDLET: 4,
    OPERATOR: 5,
    CPU: 6,
    MEM: 7,
    DISK: 8,
    SENDBYTES: 9,
    RECVBYTES: 10,
    PORT: 11,
    ACTIVE: 12,
    HANDLED: 13,
    ACCEPTS: 14,
    BYTESSENT: 15,
    BYTESRECVD: 16,
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

export const TCP_OPTIONS = [
    {text: 'TCP CONNS', value: 'TCPCONNS'},
    {text: 'TCP RETRANS', value: 'TCPRETRANS'},
]

export const UDP_OPTIONS = [
    {text: 'UDP RECV', value: 'UDPRECV'},
    {text: 'UDP SENT', value: 'UDPSENT'},
    //{text: 'UDPRECVERR', value: 'UDPRECVERR'},

]

export const NETWORK_OPTIONS2 = [
    {text: 'NET_SEND', value: 'NET_SEND'},
    {text: 'NET_RECV', value: 'NET_RECV'},
]

export const APP_INST_MATRIX_HW_USAGE_INDEX = {
    TIME: 0,
    APP: 1,
    CLUSTER: 2,
    DEV: 3,
    CLOUDLET: 4,
    OPERATOR: 5,
    CPU: 6,
    MEM: 7,
    DISK: 8,
    SENDBYTES: 9,
    RECVBYTES: 10,
    PORT: 11,
    ACTIVE: 12,
    HANDLED: 13,
    ACCEPTS: 14,
    BYTESSENT: 15,
    BYTESRECVD: 16,
}

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
}

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
    //TAG_CLOUD: 'TAG_CLOUD',
}

export const ADD_ITEM_LIST = [
    {text: 'MAP', value: 'MAP'},
    //{text: 'TAG_CLOUD', value: 'TAG_CLOUD'},
    {text: 'BUBBLE', value: 'BUBBLE'},
    {text: 'PERFORMANCE SUM', value: 'CLUSTER_LIST'},
    {text: 'CLUSTER EVENT LOG', value: 'CLUSTER_EVENTLOG_LIST'},
]


export const HARDWARE_OPTIONS = [
    {text: 'FLAVOR', value: 'FLAVOR'},
    {text: 'CPU', value: 'CPU'},
    {text: 'MEM', value: 'MEM'},
    {text: 'DISK', value: 'DISK'},
    {text: 'RECV_BYTES', value: 'RECV_BYTES'},
    {text: 'SEND_BYTES', value: 'SEND_BYTES'},
]

export const HARDWARE_OPTIONS_FOR_APPINST = [
    //{text: 'ALL', value: 'ALL'},
    {text: 'CPU', value: 'CPU'},
    {text: 'MEM', value: 'MEM'},
    {text: 'DISK', value: 'DISK'},
    {text: 'RECV BYTES', value: 'RECV_BYTES'},
    {text: 'SEND BYTES', value: 'SEND_BYTES'},
    {text: 'ACTIVE CONNECTION', value: 'ACTIVE_CONNECTION'},
    {text: 'HANDLED CONNECTION', value: 'HANDLED_CONNECTION'},
    {text: 'ACCEPTS CONNECTION', value: 'ACCEPTS_CONNECTION'},
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


export const HARDWARE_OPTIONS_FOR_CLUSTER = [
    {text: 'CPU', value: 'CPU'},
    {text: 'MEM', value: 'MEM'},
    {text: 'DISK', value: 'DISK'},
    {text: 'TCP CONNS', value: 'TCPCONNS'},
    {text: 'TCP RETRANS', value: 'TCPRETRANS'},
    {text: 'UDP RECV', value: 'UDPRECV'},
    {text: 'UDP SENT', value: 'UDPSENT'},
    {text: 'RECV BYTES', value: 'RECV_BYTES'},
    {text: 'SEND BYTES', value: 'SEND_BYTES'},
]


export const INSTANCE_TEST_OPTIONS = [
    {text: 'redhong_inst', value: 'redhong_inst'},
    {text: 'asbdsf_inst', value: 'asbdsf_inst'},
    {text: '123241__inst', value: '123241__inst'},
    {text: 'kyungjoon_inst', value: 'kyungjoon_inst'},
    {text: 'sdfkjh__inst', value: 'sdfkjh__inst'},
    {text: 'inki__inst', value: 'inki__inst'},


]

export const HARDWARE_TYPE_FOR_CLOUDLET = {
    vCPU: 'vCPU',
    MEM: 'MEM',
    DISK: 'DISK',
    RECV_BYTES: 'RECV_BYTES',
    SEND_BYTES: 'SEND_BYTES',
    FLOATING_IPS: 'FLOATING_IPS',
    IPV4: 'IPV4',
}

export const HARDWARE_TYPE = {
    ALL:'ALL',

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


