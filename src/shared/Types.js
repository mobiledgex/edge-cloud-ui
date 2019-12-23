

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
