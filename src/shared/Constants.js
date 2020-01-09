export const API_ENDPOINT_PREFIX = '/api/v1/';


export const HARDWARE_TYPE = {

    CPU: "cpu",
    MEM: "mem",
    NETWORK: "network",
    DISK: "disk"

}
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

export const RECENT_DATA_LIMIT_COUNT = 5

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

/*"AppName": "MEXPrometheusAppName",
    "Cloudlet": "frankfurt-eu",
    "ClusterInst": "kkkkkkk",*/
export const MOINTORING_FILTER_ITEM_TYPE = {
    REGION: "Region",
    APP_INST: "AppName",
    CLOUDLET: "Cloudlet",
    CLUSTERINST: "ClusterInst",
}

export const SELECT_TYPE_ENUM = "Region" | "AppName" | "Cloudlet" | "ClusterInst"

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


