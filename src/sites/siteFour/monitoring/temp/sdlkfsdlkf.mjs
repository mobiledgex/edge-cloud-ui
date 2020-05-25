let data = [
    {
        "AppNames": "AutoProvAppK8S1590069514 | k8sreservable | EU | undefined | v1 | TDG , dockerapp2 | dockershared | EU | 3 | v1 | TDG , AutoProvAppK8S1590097495 | k8sreservable1590092598 | EU | undefined | v1 | TDG , dockerapp1 | dockerdedicated | EU | undefined | v1 | TDG , dockerapp2 | dockershared | EU | 2 | v2 | TDG",
        "CloudletLocation": {
            "latitude": 51.2277,
            "longitude": 6.7735
        },
        "strCloudletLocation": "51.2277_6.7735",
        "Cloudlet": "automationDusseldorfCloudlet",
        "isShow": false,
        "isShowCircle": false
    },
    {
        "AppNames": "iperf4 | autoclusteriperf4 | EU | undefined | v1 | TDG",
        "CloudletLocation": {
            "latitude": 1,
            "longitude": 1,
            "timestamp": {}
        },
        "strCloudletLocation": "1_1",
        "Cloudlet": "andycloud",
        "isShow": false,
        "isShowCircle": false
    },
    {
        "AppNames": "app-us-k8s | k8sdedicated | US | undefined | v1 | packet , app-us | packetdocker | US | undefined | v1 | packet",
        "CloudletLocation": {
            "latitude": 1,
            "longitude": 1
        },
        "strCloudletLocation": "1_1",
        "Cloudlet": "packetcloudlet",
        "isShow": false,
        "isShowCircle": false
    }
]

/*data.map((item, index) => {
    console.log(`sdlkflskdfkl====>`, item);

})*/
const listGroupByKey = (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
);


let locationGrpList = listGroupByKey(data, 'strCloudletLocation')
let keys = Object.keys(locationGrpList);

let newNewCloudlet=[]
keys.map(item => {
    //console.log(`cloudLocGrp====>`, item);
    let AppNames = '';
    let CloudletLocation = '';
    let strCloudletLocation = '';
    let Cloudlet = '';
    locationGrpList[item].map((innerItem, index) => {
        //console.log(`innerItem====>`, innerItem);
        if (index === locationGrpList[item].length - 1) {
            AppNames += innerItem.AppNames
            Cloudlet += innerItem.Cloudlet
        } else {
            AppNames += innerItem.AppNames + ", "
            Cloudlet += innerItem.Cloudlet + ", "
        }

        CloudletLocation = innerItem.CloudletLocation;
        strCloudletLocation = innerItem.strCloudletLocation;
    })

    let CloudletGrpOne = {
        AppNames,
        CloudletLocation,
        strCloudletLocation,
        Cloudlet,
    }

    newNewCloudlet.push(CloudletGrpOne)
})


console.log(`sdlkflskdfkl====>`, newNewCloudlet);
