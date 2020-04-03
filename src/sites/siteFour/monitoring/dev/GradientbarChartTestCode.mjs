let data = {
    "chartDataList": [
        [
            "Element",
            "DISK USAGE",
            {
                "role": "style"
            },
            {
                "role": "annotation"
            }
        ],
        [
            "autoclusterbicapp\n[frankfurt-eu]",
            9.783656507264991,
            "#DE0000",
            "9.78 %"
        ],
        [
            "autoclusterbicapp\n[hamburg-stage]",
            9.569136693193471,
            "#FF9600",
            "9.57 %"
        ],
        [
            "autoclusterbicapp\n[Rah123]",
            9.07898214283426,
            "#FFF600",
            "9.08 %"
        ],
        [
            "Rah-Clust-8\n[frankfurt-eu]",
            7.203711117076129,
            "#5BCB00",
            "7.20 %"
        ]
    ],
    "hardwareType": "DISK"
}

let CHARTCOLORLIST = ['#DE0000', '#FF9600', '#FFF600', '#5BCB00', '#0096FF',];
let chartDatas = data.chartDataList
let labelList = [];
let graphDatas = [];
chartDatas.map((item, index) => {

    if (index > 0) {
        console.log("item===>", item);

        labelList.push(item[0]);
    }

})

chartDatas.map((item, index) => {

    if (index > 0) {
        console.log("value===>", item[3]);

        graphDatas.push(item[3]);
    }

})

console.log("labelList===>", labelList);

let dataSets = [
    {
        label: 'My First dataset',
        backgroundColor: CHARTCOLORLIST,
        borderColor: CHARTCOLORLIST,
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: graphDatas
    }
]

console.log("dataSets===>", dataSets);
let completeData = {
    labels: labelList,
    datasets: dataSets
}
