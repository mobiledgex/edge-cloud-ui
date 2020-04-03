let clusterOriginList = [
    {
        "uuid": "5c402fbe-f09c-441e-9d48-5baf1cb15392",
        "Region": "EU",
        "ClusterName": "autoclusterbicapp",
        "OrganizationName": "WonhoOrg1",
        "Operator": "TDG",
        "Cloudlet": "Rah123",
        "Flavor": "m4.medium",
        "IpAccess": 1,
        "CloudletLocation": "-",
        "State": 5,
        "Progress": "",
        "Status": {},
        "Deployment": "docker",
        "Edit": [
            "Region",
            "ClusterName",
            "OrganizationName",
            "Operator",
            "Cloudlet",
            "Flavor",
            "IpAccess",
            "Number_of_Master",
            "Number_of_Node",
            "CloudletLocation"
        ]
    },
    {
        "uuid": "630dc3ad-910e-48ec-929f-29509b0dbf3f",
        "Region": "EU",
        "ClusterName": "autoclusterbicapp",
        "OrganizationName": "WonhoOrg1",
        "Operator": "TDG",
        "Cloudlet": "hamburg-stage",
        "Flavor": "m4.medium",
        "IpAccess": 1,
        "CloudletLocation": "-",
        "State": 5,
        "Progress": "",
        "Status": {},
        "Deployment": "docker",
        "Edit": [
            "Region",
            "ClusterName",
            "OrganizationName",
            "Operator",
            "Cloudlet",
            "Flavor",
            "IpAccess",
            "Number_of_Master",
            "Number_of_Node",
            "CloudletLocation"
        ]
    },
    {
        "uuid": "f1ec73f0-c507-4c92-b892-2c4d94fafa40",
        "Region": "EU",
        "ClusterName": "Rah-Clust-8",
        "OrganizationName": "WonhoOrg1",
        "Operator": "TDG",
        "Cloudlet": "frankfurt-eu",
        "Flavor": "m4.medium",
        "IpAccess": 1,
        "CloudletLocation": "-",
        "State": 5,
        "Progress": "",
        "Status": {},
        "Deployment": "docker",
        "Edit": [
            "Region",
            "ClusterName",
            "OrganizationName",
            "Operator",
            "Cloudlet",
            "Flavor",
            "IpAccess",
            "Number_of_Master",
            "Number_of_Node",
            "CloudletLocation"
        ]
    },
    {
        "uuid": "e79fb017-9ddd-4ca6-bae6-501c15cbfe4e",
        "Region": "EU",
        "ClusterName": "autoclusterbicapp",
        "OrganizationName": "WonhoOrg1",
        "Operator": "TDG",
        "Cloudlet": "frankfurt-eu",
        "Flavor": "m4.medium",
        "IpAccess": 1,
        "CloudletLocation": "-",
        "State": 5,
        "Progress": "",
        "Status": {},
        "Deployment": "docker",
        "Edit": [
            "Region",
            "ClusterName",
            "OrganizationName",
            "Operator",
            "Cloudlet",
            "Flavor",
            "IpAccess",
            "Number_of_Master",
            "Number_of_Node",
            "CloudletLocation"
        ]
    }
]

const treeData = [
    {
        title: 'Cluster1',
        value: '0-0',
        children: [
            {
                title: 'Cloudlet1',
                value: '0-0-1',
            },
            {
                title: 'Cloudlet1',
                value: '0-0-2',
            },
        ],
    },
    {
        title: 'Cluster2',
        value: '0-1',
    },
];

console.log("treeData===>", treeData);

let ClusterList = []
clusterOriginList.map(item => {
    console.log("Cloudlet===>", item.Cloudlet);
    console.log("ClusterName===>", item.ClusterName);
    ClusterList.push(item.ClusterName)
})


//console.log("ClusterList===>", ClusterList);

let uniqClusterList = [...new Set(ClusterList)];

//console.log("ClusterList===>", uniqClusterList);

let treeList = []
uniqClusterList.map(clusterOne => {

    console.log("sldkfldskflkdsf===>", clusterOne);


    let childrenCloudlets = []
    clusterOriginList.map(item => {
        if (item.ClusterName === clusterOne) {
            childrenCloudlets.push({
                title: item.Cloudlet,
                value: clusterOne + " | " + item.Cloudlet + " | " + item.Region,
            })
        }
    })

    let itemOne = {
        selectable: false,
        title: clusterOne,
        value: clusterOne,
        children: childrenCloudlets,
    };

    treeList.push(itemOne)

})


console.log("treeList===>", treeList);
