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

export type TypeLineChartData2 = {
    levelTypeNameList: Array,
    usageSetList: Array,
    newDateTimeList: Array,
    hardwareType: string,

}

export type TypeClientLocation = {
    latitude: number,
    longitude: number,
    horizontal_accuracy: number,
    altitude: number,
    course: number,
    speed: number,
    timestamp: any,
    uuid: string,
    serverLocInfo: {
        lat: number,
        long: number,
    }
}


export type TypeCloudlet = {
    uuid: string,
    CloudletInfoState: number,
    Region: string,
    CloudletName: string,
    Operator: string,
    CloudletLocation: any,
    Ip_support: number,
    Num_dynamic_ips: number,
    Physical_name: string,
    Platform_type: number,
    State: number,
    Progress: string,
}

export type TypeCluster = {
    Cloudlet: string,
    CloudletLocation: string,
    ClusterName: string,
    Deployment: string,
    Edit: any,
    Flavor: string,
    IpAccess: number,
    Operator: string,
    OrganizationName: string,
    Progress: string,
    Region: string,
    Reservable: string,
    State: number,
    Status: any,
    uuid: string,
}

export type TypeAppInstanceUsage2 = {
    instance: any,
    columns: any,
    appName: string,
    sumCpuUsage: number,
    sumMemUsage: number,
    sumDiskUsage: number,
    sumRecvBytes: number,
    sumSendBytes: number,
    sumActiveConnection: number,
    sumHandledConnection: number,
    sumAcceptsConnection: number,
    cpuSeriesValue: any,
    memSeriesValue: any,
    diskSeriesValue: any,
    networkSeriesValue: any,
    connectionsSeriesValue: any,
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
    "HealthCheck": number,
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

export type TypeClusterEventLog = {
    "time": string,
    "cluster": string,
    "dev": string,
    "cloudlet": string,
    "operator": string,
    "flavor": string,
    "vcpu": number,
    "ram": number,
    "disk": number,
    "other": string,
    "event": string,
    "status": string,
}
