import {convertToMegaGigaForNumber} from "../sites/siteFour/monitoring/service/PageMonitoringCommonService";
import randomColor from 'randomcolor'

let moreColors = randomColor({
    count: 500,
});
export const RECENT_DATA_LIMIT_COUNT = 10

export const CHART_COLOR_LIST = ['#DE0000', '#FF9600', '#FFF600', '#5BCB00', '#0096FF', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)
export const CHART_COLOR_LIST2 = ['#65DEF1', '#A8DCD1', '#DCE2C8', '#F96900', '#F17F29', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)
export const CHART_COLOR_LIST3 = ['#008000', '#d7fff1', '#556B2F', '#32CD32', '#8cd790', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)
export const CHART_COLOR_LIST4 = ['#FF0000', '#FFBDAA', '#D4826A', '#802D15', '#551300', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)
export const CHART_COLOR_MONOKAI = ['#F92672', '#FD971F', '#A6E22E', '#E6DB74', '#A6E22E', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)
export const CHART_COLOR_APPLE = ['#0A84FF', '#30D158', '#FF453A', '#FF9F0A', '#FF375F', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)
export const CHART_COLOR_EXOTIC_ORCHIDS = ['#72a2c0', '#00743f', '#f2a104', '#192e5b', '#1d65a6', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)
export const CHART_COLOR_URBAN_SKYLINE = ['#522E75', '#7e7d7b', '#52591F', '#A3765D', '#714E3D', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)
export const CHART_COLOR_BERRIES_GALORE = ['#777CA8', '#BB1924', '#EE6C81', '#F092A5', '#AFBADC', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)
export const CHART_COLOR_BRIGHT_AND_ENERGETIC = ['#F14D49', '#002485', '#118C8B', '#BCA18D', '#F2746B', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)
export const CHART_COLOR_EARTHY_AND_NATURAL = ['#E4EBF2', '#52733B', '#84A45A', '#818A6F', '#715E4E', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)
export const CHART_COLOR_JAZZ_NIGHT = ['#C59CDB', '#DFD0F1', '#A67B04', '#F3EED6', '#701B05', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)
export const CHART_COLOR_BLUE_MOUNTAIN_PEAKS_AND_CLOUDS = ['#A4A4BF', '#16235A', '#2A3457', '#888C46', '#F2EAED', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)
export const CHART_COLOR_BRIGHT_AND_FRUITY = ['#D9DCD8', '#9BA747', '#F29D4B', '#D57030', '#8B281F', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'].concat(moreColors)

export const DARK_LINE_COLOR = '#fffc51'
export const DARK_CLOUTLET_ICON_COLOR = 'green'
export const WHITE_LINE_COLOR = 'black'
export const WHITE_CLOUTLET_ICON_COLOR = 'blue'

export const GLOBE_THEME = {
    DEFAULT: 'DEFAULT',
    DARK: "DARK",
}

export const REGION = {
    ALL: 'ALL',
}

export const THEME_OPTIONS = {
    DEFAULT: 'DEFAULT',
    BLUE: "BLUE",
    GREEN: 'GREEN',
    RED: 'RED',
    MONOKAI: 'MONOKAI',
    APPLE: 'APPLE',
    BRIGHT_AND_ENERGETIC: 'BRIGHT_AND_ENERGETIC',
    BERRIES_GALORE: 'BERRIES_GALORE',
    EARTHY_AND_NATURAL: 'EARTHY_AND_NATURAL',
    EXOTIC_ORCHIDS: 'EXOTIC_ORCHIDS',
    URBAN_SKYLINE: 'URBAN_SKYLINE',
    JAZZ_NIGHT: 'JAZZ_NIGHT',
    BLUE_MOUNTAIN_PEAKS_AND_CLOUDS: 'BLUE_MOUNTAIN_PEAKS_AND_CLOUDS',
    BRIGHT_AND_FRUITY: 'BRIGHT_AND_FRUITY',
}

export const THEME_OPTIONS_LIST = [
    {value: 'DEFAULT', text: 'DEFAULT'},
    {value: 'BLUE', text: 'BLUE'},
    {value: 'GREEN', text: 'GREEN'},
    {value: 'RED', text: 'RED'},
    {value: 'MONOKAI', text: 'MONOKAI'},
    {value: 'APPLE', text: 'APPLE'},
    {value: 'BRIGHT_AND_ENERGETIC', text: 'BRIGHT AND ENERGETIC'},
    {value: 'BERRIES_GALORE', text: 'BERRIES GALORE'},
    {value: 'EARTHY_AND_NATURAL', text: 'EARTHY AND NATURAL'},
    {value: 'EXOTIC_ORCHIDS', text: 'EXOTIC ORCHIDS'},
    {value: 'URBAN_SKYLINE', text: 'URBAN SKYLINE'},
    {value: 'JAZZ_NIGHT', text: 'JAZZ NIGHT'},
    {value: 'BLUE_MOUNTAIN_PEAKS_AND_CLOUDS', text: 'BLUE MOUNTAIN PEAKS AND CLOUDS'},
    {value: 'BRIGHT_AND_FRUITY', text: 'BRIGHT AND FRUITY'},
]

export const ITEM_TYPE = [
    {text: 'LINE_CHART', value: 'LINE_CHART'},
    {text: 'BAR_CHART', value: 'BAR_CHART'},
    {text: 'COLUMN_CHART', value: 'COLUMN_CHART'},
    {text: 'EVENT_LOG', value: 'EVENT_LOG'},
    {text: 'MAP', value: 'MAP'},
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
                callback(value, index, label) {
                    return convertToMegaGigaForNumber(value);

                },
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
    VERSION: 'Version',
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
    /*
       /*
        0: "time"
        1: "app"
        2: "ver"
        3: "cluster"
        4: "clusterorg"
        5: "cloudlet"
        6: "cloudletorg"
        7: "apporg"
        8: "pod_1"
        9: "cpu"
        10: "mem"
        11: "disk"
        12: "sendBytes"
        13: "recvBytes"
        14: "port"
        15: "active"
        16: "handled"
        17: "accepts"
        18: "bytesSent"
        19: "bytesRecvd"
        20: "P0"
        21: "P25"
        22: "P50"
        23: "P75"
        24: "P90"
        25: "P95"
        26: "P99"
        27: "P99.5"
        28: "P99.9"
        29: "P100"
     */
    TIME: 0,
    APP: 1,
    VERSION: 2,
    CLUSTER: 3,
    DEV: 4,
    CLOUDLET: 5,
    OPERATOR: 6,
    CPU: 9,
    MEM: 10,
    DISK: 11,
    SENDBYTES: 12,
    RECVBYTES: 13,
    PORT: 14,
    ACTIVE: 15,
    HANDLED: 16,
    ACCEPTS: 17,
    BYTESSENT: 18,
    BYTESRECVD: 19,
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

export const USER_TYPE = {
    OPERATOR: 'operator',
    DEVELOPER: 'developer',
    AMDIN: 'admin',

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
    DONUTS: 'DONUTS',
    CLUSTER_LIST: 'CLUSTER_LIST',
    CLUSTER_EVENTLOG_LIST: 'CLUSTER_EVENTLOG_LIST',
    APP_INST_EVENT_LOG: 'APP_INST_EVENT_LOG',
    PERFORMANCE_SUM: 'PERFORMANCE_SUM',
    METHOD_USAGE_COUNT: 'METHOD_USAGE_COUNT',
}
export const ADD_ITEM_LIST = [
    {text: 'MAP', value: 'MAP'},
    //{text: 'TAG_CLOUD', value: 'TAG_CLOUD'},
    {text: 'BUBBLE', value: 'BUBBLE'},
    {text: 'PERFORMANCE SUM', value: 'PERFORMANCE_SUM'},
    {text: 'CLUSTER EVENT LOG', value: 'CLUSTER_EVENTLOG_LIST'},
    {text: 'APP INST EVENT LOG', value: 'APP_INST_EVENT_LOG'},
]

export const EVENT_LOG_ITEM_LIST = [
    {text: 'PERFORMANCE SUM', value: 'PERFORMANCE_SUM'},
    //{text: 'CLUSTER EVENT LOG', value: 'CLUSTER_EVENTLOG_LIST'},
    {text: 'APP INST EVENT LOG', value: 'APP_INST_EVENT_LOG'},
]

export const MAP_ITEM_LIST = [
    {text: 'MAP', value: 'MAP'},
    {text: 'BUBBLE', value: 'BUBBLE'},
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
    {text: 'RECV BYTES', value: 'RECVBYTES'},
    {text: 'SEND BYTES', value: 'SENDBYTES'},
    {text: 'ACTIVE CONNECTION', value: 'ACTIVE'},
    {text: 'HANDLED CONNECTION', value: 'HANDLED'},
    {text: 'ACCEPTS CONNECTION', value: 'ACCEPTS'},
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
    {text: 'RECV BYTES', value: 'RECVBYTES'},
    {text: 'SEND BYTES', value: 'SENDBYTES'},
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
    ALL: 'ALL',

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
    ACTIVE_CONNECTION: 'ACTIVE',//12
    HANDLED_CONNECTION: 'HANDLED',//13
    ACCEPTS_CONNECTION: 'ACCEPTS',//14 (index)
    //For Cloudlet
    VCPU_USED: 'vCpuUsed',
    MEM_USED: 'memUsed',
    DISK_USED: 'diskUsed',
    FLOATING_IP_USED: 'floatingIpsUsed',
    IPV4_USED: 'ipv4Used',
    NETSEND: 'netSend',
    NETRECV: 'netRecv',

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


export const CLOUDLET_STATE = {
    0:  'UNKNOWN STATE',
    1:  'NOT_PRESENT',
    2:  'CREATE_REQUESTED',
    3:  'CREATING',
    4:  'CREATE_ERROR',
    5:  'READY',
    6:  'UPDATE_REQUESTED',
    7:  'UPDATING',
    8:  'UPDATE_ERROR',
    9:  'DELETE_REQUESTED',
    10: 'DELETING',
    11: 'DELETE_ERROR',
    12: 'DELETE_PREPARE',
    13: 'CRM_INITOK',
    14: 'CREATING_DEPENDENCIES',
}

