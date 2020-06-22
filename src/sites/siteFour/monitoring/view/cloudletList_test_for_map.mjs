import _ from "lodash";

let cloudletList = [
    {
        "uuid": "dd5971cd-6233-46f3-ab1e-78d79a38f38c",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592850511-301282",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "cluster1592850511-301282",
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
                "fqdn_prefix": "app1592850511-301282-tcp."
            },
            {
                "proto": 2,
                "internal_port": 2016,
                "public_port": 2016,
                "fqdn_prefix": "app1592850511-301282-udp."
            }
        ],
        "Flavor": "flavor1592850511-301282",
        "State": 5,
        "Error": "-",
        "Runtime": {
            "container_ids": [
                "app1592850511-301282-deployment-7cdd4c648b-frmq4"
            ]
        },
        "Created": "seconds : 1592850872",
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
        "uuid": "8abe8602-f8e1-4105-af67-9287bc443578",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592853296-7030034",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "dummycluster",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "URI": "mobiledgexapp1592853296-703003410.automationhamburgcloudlet.tdg.mobiledgex.net",
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
            },
            {
                "proto": 1,
                "internal_port": 8085,
                "public_port": 8085
            },
            {
                "proto": 1,
                "internal_port": 22,
                "public_port": 22
            }
        ],
        "Flavor": "flavor1592853296-7030034",
        "State": 5,
        "Error": "-",
        "Runtime": {},
        "Created": "seconds : 1592853467",
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
        "uuid": "177297a3-6637-4d35-8824-cfe410b552d6",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592864007-042548",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "autoclustercluster1592864007-042548",
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
                "public_port": 10000,
                "fqdn_prefix": "app1592864007-042548-tcp."
            },
            {
                "proto": 1,
                "internal_port": 2016,
                "public_port": 2016,
                "fqdn_prefix": "app1592864007-042548-tcp."
            },
            {
                "proto": 2,
                "internal_port": 2015,
                "public_port": 2015,
                "fqdn_prefix": "app1592864007-042548-udp."
            },
            {
                "proto": 2,
                "internal_port": 2016,
                "public_port": 10000,
                "fqdn_prefix": "app1592864007-042548-udp."
            }
        ],
        "Flavor": "flavor1592864007-042548",
        "State": 10,
        "Error": "-",
        "Runtime": {
            "container_ids": [
                "app1592864007-042548-deployment-598697447b-t54tg"
            ]
        },
        "Created": "seconds : 1592864553",
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
        "uuid": "2797c5c8-406c-4f98-b4e2-02ff7a7f1c86",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592849785-026928",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "cluster1592849785-026928",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "URI": "cluster1592849785-026928.automationhamburgcloudlet.tdg.mobiledgex.net",
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
        "Flavor": "flavor1592849785-026928",
        "State": 5,
        "Error": "-",
        "Runtime": {
            "container_ids": [
                "nginxapp1592849785-02692810",
                "envoyapp1592849785-02692810"
            ]
        },
        "Created": "seconds : 1592849911",
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
        "uuid": "6de46dd4-a8dd-4f57-b86d-303e84a7ec81",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592849902-93193",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "cluster1592849902-93193",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "URI": "mobiledgexapp1592849902-9319310.automationhamburgcloudlet.tdg.mobiledgex.net",
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
        "Flavor": "flavor1592849902-93193",
        "State": 5,
        "Error": "-",
        "Runtime": {},
        "Created": "seconds : 1592849907",
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
        "colorCodeIndex": 4
    },
    {
        "uuid": "1f1b0e34-08da-4eaa-8473-055f09d37a19",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592853094-6324654",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "dummycluster",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "URI": "mobiledgexapp1592853094-632465410.automationhamburgcloudlet.tdg.mobiledgex.net",
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
        "Flavor": "flavor1592853094-6324654",
        "State": 5,
        "Error": "-",
        "Runtime": {},
        "Created": "seconds : 1592853101",
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
        "uuid": "1173d514-3bc7-41c2-92de-0daf5f34057a",
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
        "colorCodeIndex": 6
    },
    {
        "uuid": "031f73aa-fda6-407e-a99a-af2712956c19",
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
        "colorCodeIndex": 7
    },
    {
        "uuid": "75869feb-3164-4477-9092-fcf61e987c7e",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592853552-5388653",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "dummycluster",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "URI": "mobiledgexapp1592853552-538865310.automationhamburgcloudlet.tdg.mobiledgex.net",
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
        "Flavor": "flavor1592853552-5388653",
        "State": 5,
        "Error": "-",
        "Runtime": {},
        "Created": "seconds : 1592853556",
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
        "uuid": "79698c4d-d82a-4d23-9321-c3fe39433fbe",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592857274-3159716",
        "Version": "1.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "autoclusterapp1592857274-3159716",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "URI": "autoclusterapp1592857274-3159716.automationhamburgcloudlet.tdg.mobiledgex.net",
        "Liveness": 1,
        "Mapped_port": [
            {
                "proto": 1,
                "internal_port": 2015,
                "public_port": 2015
            },
            {
                "proto": 1,
                "internal_port": 2016,
                "public_port": 2016
            },
            {
                "proto": 2,
                "internal_port": 2015,
                "public_port": 2015
            },
            {
                "proto": 2,
                "internal_port": 2016,
                "public_port": 2016
            },
            {
                "proto": 1,
                "internal_port": 8085,
                "public_port": 8085
            }
        ],
        "Flavor": "flavor1592857274-3159716",
        "State": 5,
        "Error": "-",
        "Runtime": {
            "container_ids": [
                "nginxapp1592857274-315971610",
                "envoyapp1592857274-315971610"
            ]
        },
        "Created": "seconds : 1592858469",
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
        "colorCodeIndex": 9
    },
    {
        "uuid": "6ecc0dba-07dd-4637-9d59-f84df88c5160",
        "Region": "EU",
        "OrganizationName": "MobiledgeX",
        "AppName": "app1592849785-026928",
        "Version": "2.0",
        "Operator": "TDG",
        "Cloudlet": "automationHamburgCloudlet",
        "ClusterInst": "cluster1592849785-026928",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "URI": "cluster1592849785-026928.automationhamburgcloudlet.tdg.mobiledgex.net",
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
        "Flavor": "flavor1592849785-026928",
        "State": 5,
        "Error": "-",
        "Runtime": {
            "container_ids": [
                "nginxapp1592849785-02692820",
                "envoyapp1592849785-02692820",
                "nginxapp1592849785-02692810",
                "envoyapp1592849785-02692810"
            ]
        },
        "Created": "seconds : 1592850005",
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
        "colorCodeIndex": 10
    },
    {
        "uuid": "00ab65a8-266b-450e-a6e7-33102f2a030f",
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
        "Created": "seconds : 1592848159",
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
        "colorCodeIndex": 11
    },
    {
        "uuid": "c12fd5a7-4f77-4226-85a1-b089d5baa47f",
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
        "uuid": "4f7aead5-9688-4f1e-8e7b-1805dee22a35",
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
        "colorCodeIndex": 13
    },
    {
        "uuid": "8bbf332b-cb8e-4df1-9651-c9be0c4f0498",
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
        "colorCodeIndex": 14
    },
    {
        "uuid": "6aadeff0-aafd-416c-8ca3-53f8caeaab30",
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
        "colorCodeIndex": 15
    },
    {
        "uuid": "6b2d93bb-217f-4d40-88e9-e1b5e3b5e029",
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
        "colorCodeIndex": 16
    }
]



let uniqueOnlyCloudletList = []
cloudletList.map(item => {
    uniqueOnlyCloudletList.push({
        Cloudlet: item.Cloudlet,
        CloudletLocation: JSON.stringify(item.CloudletLocation),
    })
})

let cloudletLocList = _.uniqBy(uniqueOnlyCloudletList, "CloudletLocation")
let uniqCloudletList = _.uniqBy(uniqueOnlyCloudletList, "Cloudlet")

let cloudletNames = []
cloudletLocList.map(item => {
    let locSameCloudletList = []
    uniqCloudletList.map(cloudletNameOne => {
        if (cloudletNameOne.CloudletLocation === item.CloudletLocation) {
            locSameCloudletList.push(cloudletNameOne.Cloudlet)
        }
    })
    cloudletNames.push({
        CloudletLocation: JSON.parse(item.CloudletLocation),
        CloudletLocationStr: item.CloudletLocation,
        CloudletNames: locSameCloudletList,
    })
})


let newCloudletList = []
cloudletNames.map((clouletLocOne, index) => {

    let appInstList = []
    cloudletList.map(innerItem => {
        if (clouletLocOne.CloudletLocationStr === JSON.stringify(innerItem.CloudletLocation)) {
            appInstList.push(innerItem)
        }
    })
    newCloudletList.push({
        CloudletNames: clouletLocOne.CloudletNames,
        CloudletLocation: clouletLocOne.CloudletLocation,
        appInstList: appInstList,
    })
})


console.log('newCloudletList===>', newCloudletList);

console.log('newCloudletList===>', newCloudletList);
console.log('newCloudletList===>', newCloudletList);
