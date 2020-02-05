export type TypeUtilization = {
    "time": string,
    "cloudlet": string,
    "diskMax": number,
    "diskUsed": number,
    "memMax": number,
    "memUsed": number,
    "operator": string,
    "vCpuMax": number,
    "vCpuUsed": number,
}

export type TypeGridInstanceList = {
    sumAcceptsConnection: number;
    sumActiveConnection: number;
    sumHandledConnection: number;
    "instance": any,
    "sumCpuUsage": number,
    "sumMemUsage": number,
    "sumRecvBytes": number,
    "sumSendBytes": number,
}

export type TypeCloudletUsageList = {
    avgVCpuUsed: number,
    avgVCpuMax: number,
    avgMemUsed: number,
    avgMemMax: number,
    avgDiskUsed: number,
    avgDiskMax: number,
    avgNetSend: number,
    avgNetRecv: number,
    avgFloatingIpsUsed: number,
    avgFloatingIpsMax: number,
    avgIpv4Used: number,
    avgIpv4Max: number,
    columns: Array,
    series: Array,
    cloudlet: string,
    operator: string,
}

export type TypeClusterUsageList = {
    uuid: string,
    Region: string,
    cluster: string,
    OrganizationName: string,
    Operator: string,
    cloudlet: string,
    Flavor: string,
    IpAccess: number,
    CloudletLocation: string,
    State: number,
    Progress: string,
    sumCpuUsage: number,
    sumMemUsage: number,
    sumDiskUsage: number,
    sumRecvBytes: number,
    sumSendBytes: number,
    sumUdpSent: number,
    sumUdpRecv: number,
    sumUdpRecvErr: number,
    sumTcpConns: number,
    sumTcpRetrans: number,

}
export type TypeAppInstance = {
    "Region": string,
    "OrganizationName": string,
    "AppName": string,
    "Version": string,
    "Operator": string,
    "Cloudlet": string,
    "ClusterInst": string,
    "CloudletLocation": {
        "latitude": number,
        "longitude": number,
    },
    "URI": string,
    "Liveness": number,
    "Mapped_port": any,
    "Flavor": string,
    "State": number,
    "Error": any,
    "Runtime": any,
    "Created": string,
    "Progress": string,
    "Edit": any,
    "Status": any,
    "Revision": number,
}

export type TypeBarChartData = {
    chartDataList: string,
    hardwareType: string,
}

export type TypeLineChartData = {
    lineChartDataSet: string,
    levelTypeNameList: string,
    usageSetList: string,
    newDateTimeList: string,
    hardwareType: string,
}

/*{
    "Region": "EU",
    "OrganizationName": "MobiledgeX",
    "AppName": "MEXPrometheusAppName",
    "Version": "1.0",
    "Operator": "TDG",
    "Cloudlet": "frankfurt-eu",
    "ClusterInst": "kkkkkkk",
    "CloudletLocation": {
    "latitude": 50.110924,
        "longitude": 8.682127
},
    "URI": "kkkkkkk.frankfurt-eu.tdg.mobiledgex.net",
    "Liveness": 1,
    "Mapped_port": [
    {
        "proto": 1,
        "internal_port": 9090,
        "public_port": 9090
    }
],
    "Flavor": "x1.medium",
    "State": 8,
    "Error": [
    "Update App Inst failed: UpdateAppInst not supported for deployment: helm"
],
    "Runtime": {},
    "Created": "seconds : 1570417526",
    "Progress": "",
    "Edit": [
    "Region",
    "DeveloperName",
    "AppName",
    "Version",
    "Operator",
    "Cloudlet",
    "ClusterInst",
    "CloudletLocation",
    "State",
    "Editable"
],
    "Status": {},
    "Revision": 1
}
*/
