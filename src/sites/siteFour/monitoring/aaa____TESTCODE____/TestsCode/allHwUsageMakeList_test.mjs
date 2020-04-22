let data = [
    {
        "levelTypeNameList": [
            "MEXPrometheusAppName"
        ],
        "usageSetList": [
            [
                0.02832379505432948,
                0.0006474993918989971,
                0.004680628960413891,
                0.0010171339227037232,
                0.00432205809897109,
                0.0008044342272852825,
                0.027821684210930106,
                0.0006892991990023067,
                0.022260878018243935,
                0.0005958577722563643
            ]
        ],
        "newDateTimeList": [
            "19:37:22",
            "19:37:22",
            "19:37:22",
            "19:37:22",
            "19:37:14",
            "19:37:14",
            "19:37:14",
            "19:37:14",
            "19:36:57",
            "19:36:57"
        ],
        "hardwareType": "CPU"
    },
    {
        "levelTypeNameList": [
            "MEXPrometheusAppName"
        ],
        "usageSetList": [
            [
                635109376,
                11829248,
                13811712,
                29601792,
                13811712,
                29601792,
                634781696,
                11829248,
                634605568,
                11698176
            ]
        ],
        "newDateTimeList": [
            "19:37:39",
            "19:37:39",
            "19:37:39",
            "19:37:39",
            "19:37:30",
            "19:37:30",
            "19:37:30",
            "19:37:30",
            "19:36:58",
            "19:36:58"
        ],
        "hardwareType": "MEM"
    },
    {
        "levelTypeNameList": [
            "MEXPrometheusAppName"
        ],
        "usageSetList": [
            [
                21303296,
                94208,
                114688,
                155648,
                114688,
                155648,
                21303296,
                94208,
                21303296,
                94208
            ]
        ],
        "newDateTimeList": [
            "19:37:31",
            "19:37:31",
            "19:37:31",
            "19:37:31",
            "19:37:22",
            "19:37:22",
            "19:37:22",
            "19:37:22",
            "19:37:14",
            "19:37:14"
        ],
        "hardwareType": "DISK"
    }
]


let newDataSet = []
let newLevelTypeNameList = []
let newDateTimeList = []
let newUsageSetList = []
let newHWTypeList = []
data.map(item => {
    let newLevelTypeNameOne = item.levelTypeNameList["0"] + "[" + item.hardwareType + "]"

    let usageSetListOne = item.usageSetList
    newLevelTypeNameList.push(newLevelTypeNameOne)
    newUsageSetList.push(usageSetListOne[0]);
    newDateTimeList = item.newDateTimeList;
    newHWTypeList.push(item.hardwareType);

})

console.log("newLevelTypeNameList===>", newLevelTypeNameList);
console.log("newUsageSetList===>", newUsageSetList);
console.log("newDateTimeList===>", newDateTimeList);
console.log("newHWTypeList===>", newHWTypeList);

let chartDataSets = {
    hardwareType: newHWTypeList.toString(),
    levelTypeNameList: newLevelTypeNameList,
    usageSetList: newUsageSetList,
    newDateTimeList: newDateTimeList,
}


console.log("chartDataSets===>", chartDataSets);
