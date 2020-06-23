let data = [
    {
        "uuid": "909d0aef-c49e-4c30-8356-4877fad3546a",
        "Region": "EU",
        "OrganizationName": "testmonitor",
        "AppName": "dockerapp1",
        "Version": "v1",
        "Operator": "TDG",
        "Cloudlet": "automationFrankfurtCloudlet",
        "ClusterInst": "angshudemocluster",
        "CloudletLocation": {
            "latitude": 50.110922,
            "longitude": 8.682127
        },
        "URI": "angshudemocluster.automationfrankfurtcloudlet.tdg.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 8080,
                "public_port": 8080
            }
        ],
        "Flavor": "automation_api_flavor",
        "State": 5,
        "Error": "-",
        "Runtime": {
            "container_ids": [
                "envoydockerapp1v1"
            ]
        },
        "Created": "seconds : 1592480294",
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
        "Revision": "-",
        "colorCodeIndex": 0
    },
    {
        "uuid": "547fb7bc-0052-4d6a-b2cf-e81141088159",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592737413-0976868",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "cluster1592737413-0976868",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "URI": "cluster1592737413-0976868.automationhamburgcloudlet.tdg.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 2015,
                "public_port": 2015
            },
            {
                "proto": 2,
                "internal_port": 2016,
                "public_port": 2016
            }
        ],
        "Flavor": "flavor1592737413-0976868",
        "State": 5,
        "Error": "-",
        "Runtime": {
            "container_ids": [
                "nginxapp1592737413-097686810",
                "envoyapp1592737413-097686810"
            ]
        },
        "Created": "seconds : 1592737542",
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
        "Revision": "-",
        "colorCodeIndex": 1
    },
    {
        "uuid": "dfe4375e-bb82-49b3-9367-94f26c504f4c",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592738117-5973449",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "cluster1592738117-5973449",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "URI": "automationhamburgcloudlet.tdg.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 2015,
                "public_port": 2015,
                "fqdn_prefix": "app1592738117-5973449-tcp."
            },
            {
                "proto": 2,
                "internal_port": 2016,
                "public_port": 2016,
                "fqdn_prefix": "app1592738117-5973449-udp."
            }
        ],
        "Flavor": "flavor1592738117-5973449",
        "State": 5,
        "Error": "-",
        "Runtime": {
            "container_ids": [
                "app1592738117-5973449-deployment-67d686c57d-g75fs"
            ]
        },
        "Created": "seconds : 1592738362",
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
        "Revision": "-",
        "colorCodeIndex": 2
    },
    {
        "uuid": "b289a0d0-5c85-48e3-aa2d-848149ff6c7b",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592742427-2629006",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "dummycluster",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "URI": "mobiledgexapp1592742427-262900610.automationhamburgcloudlet.tdg.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 1,
                "public_port": 1,
                "end_port": 2016
            },
            {
                "proto": 2,
                "internal_port": 2015,
                "public_port": 2015,
                "end_port": 40000
            }
        ],
        "Flavor": "flavor1592742427-2629006",
        "State": 5,
        "Error": "-",
        "Runtime": {},
        "Created": "seconds : 1592742691",
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
        "Revision": "-",
        "colorCodeIndex": 3
    },
    {
        "uuid": "8e4eab3f-073a-4561-8e04-47eb9a046cf2",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "automation_api_app",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationFrankfurtCloudlet",
        "ClusterInst": "angshukubetest",
        "CloudletLocation": {
            "latitude": 50.110922,
            "longitude": 8.682127
        },
        "URI": "angshukubetest.automationfrankfurtcloudlet.tdg.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 8085,
                "public_port": 8085,
                "fqdn_prefix": "automation-api-app-tcp."
            },
            {
                "proto": 2,
                "internal_port": 2016,
                "public_port": 2016,
                "fqdn_prefix": "automation-api-app-udp."
            },
            {
                "proto": 1,
                "internal_port": 2015,
                "public_port": 2015,
                "fqdn_prefix": "automation-api-app-tcp."
            }
        ],
        "Flavor": "automation_api_flavor",
        "State": 5,
        "Error": "-",
        "Runtime": {
            "container_ids": [
                "automation-api-app-deployment-979bc4d59-bltkr"
            ]
        },
        "Created": "seconds : 1592810206",
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
        "Revision": "2020-04-29T191444",
        "colorCodeIndex": 4
    },
    {
        "uuid": "d6cee5c1-2902-43c1-a4b6-fc412db7efb8",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592737413-0976868",
        "Version": "2.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "cluster1592737413-0976868",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "URI": "cluster1592737413-0976868.automationhamburgcloudlet.tdg.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 2017,
                "public_port": 2017
            },
            {
                "proto": 2,
                "internal_port": 2018,
                "public_port": 2018
            }
        ],
        "Flavor": "flavor1592737413-0976868",
        "State": 5,
        "Error": "-",
        "Runtime": {
            "container_ids": [
                "nginxapp1592737413-097686820",
                "envoyapp1592737413-097686820",
                "nginxapp1592737413-097686810",
                "envoyapp1592737413-097686810"
            ]
        },
        "Created": "seconds : 1592737644",
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
        "Revision": "-",
        "colorCodeIndex": 5
    },
    {
        "uuid": "48b4872e-56d1-4b77-8112-f1829cd7a00f",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592738775-5409563",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "cluster1592738775-5409563",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "URI": "mobiledgexapp1592738775-540956310.automationhamburgcloudlet.tdg.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 8008,
                "public_port": 8008
            },
            {
                "proto": 1,
                "internal_port": 8011,
                "public_port": 8011
            },
            {
                "proto": 1,
                "internal_port": 22,
                "public_port": 22
            }
        ],
        "Flavor": "flavor1592738775-5409563",
        "State": 5,
        "Error": "-",
        "Runtime": {},
        "Created": "seconds : 1592738779",
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
        "Revision": "-",
        "colorCodeIndex": 6
    },
    {
        "uuid": "a6ee8cd1-e993-4fdf-ad66-fd3e3a09263f",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592740076-6476738",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "dummycluster",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "URI": "mobiledgexapp1592740076-647673810.automationhamburgcloudlet.tdg.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 2016,
                "public_port": 2016
            },
            {
                "proto": 2,
                "internal_port": 2015,
                "public_port": 2015
            }
        ],
        "Flavor": "flavor1592740076-6476738",
        "State": 5,
        "Error": "-",
        "Runtime": {},
        "Created": "seconds : 1592740083",
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
        "Revision": "-",
        "colorCodeIndex": 7
    },
    {
        "uuid": "69250573-8d96-43b9-8ed9-8b631bff5fa6",
        "Region": "US",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592589952-579864",
        "Version": "1.0",
        "Operator": "gcp",
        "Cloudlet": "gcpcloud-11592589952",
        "ClusterInst": "autocluster",
        "CloudletLocation": {
            "latitude": 36,
            "longitude": -95
        },
        "URI": "mobiledgexapp1592589952-57986410.autocluster.gcpcloud-11592589952.gcp.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 1,
                "public_port": 1,
                "fqdn_prefix": "app1592589952-579864-tcp."
            }
        ],
        "Flavor": "flavor1592589952-579864",
        "State": 9,
        "Error": "-",
        "Runtime": {},
        "Created": "seconds : 1592589956",
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
        "Revision": "-",
        "colorCodeIndex": 8
    },
    {
        "uuid": "155020b6-3e19-43e1-8051-e0fb69b38771",
        "Region": "US",
        "OrganizationName": "MobiledgeX",
        "AppName": "automation_api_app",
        "Version": "1.0",
        "Operator": "tmus",
        "Cloudlet": "tmocloud-1",
        "ClusterInst": "autoclusterautomation",
        "CloudletLocation": {
            "latitude": 31,
            "longitude": -91
        },
        "URI": "tmocloud-1.tmus.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 1234,
                "public_port": 1234,
                "fqdn_prefix": "automation-api-app-tcp."
            }
        ],
        "Flavor": "automation_api_flavor",
        "State": 5,
        "Error": "-",
        "Runtime": {},
        "Created": "seconds : 1592735899",
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
        "Revision": "2020-05-19T210428",
        "colorCodeIndex": 9
    },
    {
        "uuid": "1c238437-9904-4a5e-ae22-96d251358a22",
        "Region": "US",
        "OrganizationName": "testmonitor",
        "AppName": "app-us",
        "Version": "v1",
        "Operator": "packet",
        "Cloudlet": "packetcloudlet",
        "ClusterInst": "packetdocker",
        "CloudletLocation": {
            "latitude": 1,
            "longitude": 1
        },
        "URI": "packetdocker.packetcloudlet.packet.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 8080,
                "public_port": 8080
            }
        ],
        "Flavor": "automation_api_flavor",
        "State": 5,
        "Error": "-",
        "Runtime": {
            "container_ids": [
                "envoyapp-usv1",
                "app-usv1"
            ]
        },
        "Created": "seconds : 1589584036",
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
        "Revision": "2020-05-15T230653",
        "colorCodeIndex": 10
    },
    {
        "uuid": "6b2e3b9e-b5cc-4eb8-8d6e-4e45082f9643",
        "Region": "US",
        "OrganizationName": "MobiledgeX",
        "AppName": "vmapp",
        "Version": "test",
        "Operator": "Packet",
        "Cloudlet": "QA",
        "ClusterInst": "DefaultVMCluster",
        "CloudletLocation": {
            "latitude": 32.7767,
            "longitude": -96.797
        },
        "URI": "mobiledgexvmapptest.qa.packet.mobiledgex.net",
        "Liveness": 2,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 443,
                "public_port": 443
            }
        ],
        "Flavor": "m4.medium",
        "State": 11,
        "Error": [
            "Delete App Inst failed: DeleteVMAppInst error: terraform apply for delete failed: exit status 1"
        ],
        "Runtime": {},
        "Created": "seconds : 1592504924",
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
        "Revision": "-",
        "colorCodeIndex": 11
    },
    {
        "uuid": "99344cd3-4428-40a5-a494-a4d1a0ff64e7",
        "Region": "US",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592592515-337451",
        "Version": "1.0",
        "Operator": "gcp",
        "Cloudlet": "gcpcloud-11592592515",
        "ClusterInst": "autocluster",
        "CloudletLocation": {
            "latitude": 36,
            "longitude": -95
        },
        "URI": "mobiledgexapp1592592515-33745110.autocluster.gcpcloud-11592592515.gcp.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 1,
                "public_port": 1,
                "fqdn_prefix": "app1592592515-337451-tcp."
            }
        ],
        "Flavor": "flavor1592592515-337451",
        "State": 9,
        "Error": "-",
        "Runtime": {},
        "Created": "seconds : 1592592519",
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
        "Revision": "-",
        "colorCodeIndex": 12
    },
    {
        "uuid": "5fe0f42c-5fef-4ce8-8006-2ba77778b153",
        "Region": "US",
        "OrganizationName": "testmonitor",
        "AppName": "app-us-k8s",
        "Version": "v1",
        "Operator": "packet",
        "Cloudlet": "packetcloudlet",
        "ClusterInst": "k8sdedicated",
        "CloudletLocation": {
            "latitude": 1,
            "longitude": 1
        },
        "URI": "k8sdedicated.packetcloudlet.packet.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 8080,
                "public_port": 8080,
                "fqdn_prefix": "app-us-k8s-tcp."
            }
        ],
        "Flavor": "automation_api_flavor",
        "State": 5,
        "Error": "-",
        "Runtime": {
            "container_ids": [
                "app-us-k8s-deployment-655c466b4-fkq2c"
            ]
        },
        "Created": "seconds : 1589580392",
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
        "Revision": "2020-05-15T220541",
        "colorCodeIndex": 13
    }
]


let selectCloudletCluster = [
    "cluster1592737413-0976868 | automationHamburgCloudlet",
    "cluster1592738117-5973449 | automationHamburgCloudlet",
    "dummycluster | automationHamburgCloudlet"
]

/*
{
    "uuid": "909d0aef-c49e-4c30-8356-4877fad3546a",
    "Region": "EU",
    "OrganizationName": "testmonitor",
    "AppName": "dockerapp1",
    "Version": "v1",
    "Operator": "TDG",
    "Cloudlet": "automationFrankfurtCloudlet",
    "ClusterInst": "angshudemocluster",
    "CloudletLocation": {
    "latitude": 50.110922,
        "longitude": 8.682127
},
    "URI": "angshudemocluster.automationfrankfurtcloudlet.tdg.mobiledgex.net",
    "Liveness": 1,
    "Mapped_port": [
    {
        "proto": 1,
        "internal_port": 8080,
        "public_port": 8080
    }
],
    "Flavor": "automation_api_flavor",
    "State": 5,
    "Error": "-",
    "Runtime": {
    "container_ids": [
        "envoydockerapp1v1"
    ]
},
    "Created": "seconds : 1592480294",
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
    "Revision": "-",
    "colorCodeIndex": 0
     "Cloudlet": "automationFrankfurtCloudlet",
    "ClusterInst": "angshudemocluster",
}*/

let filteredAppInstList = []
data.map(item => {

    selectCloudletCluster.map(innerItem => {
        let cluster = innerItem.toString().split(" | ")[0]
        let cloudlet = innerItem.toString().split(" | ")[1]
        if (item.Cloudlet === cloudlet && item.ClusterInst === cluster) {
            filteredAppInstList.push(item)
        }
    })
})

console.log('filteredAppInstList====>', filteredAppInstList);

