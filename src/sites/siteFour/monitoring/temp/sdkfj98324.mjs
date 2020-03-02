
let nameList=[
    "autoclusterbicapp\n[hamburg-stage]",
    "autoclusterbicapp\n[Rah123]",
    "autoclusterbicapp\n[frankfurt-eu]",
    "Rah-Clust-8\n[frankfurt-eu]"
]

let datetimeList2=[
    "08:53:00",
    "08:52:52",
    "08:52:44",
    "08:52:36",
    "08:52:28",
    "08:52:20",
    "08:52:12",
    "08:52:04",
    "08:51:56",
    "08:51:48"
]

let usageSetList2=[
    [
        0,
        0,
        0,
        0,
        29.999999994179234,
        0,
        25.423728815210573,
        0,
        1.639344262353743,
        0
    ],
    [
        0,
        39.99999999997726,
        0,
        0,
        0,
        0,
        3.278688524584054,
        0,
        0,
        0
    ],
    [
        8.47457626148795,
        0,
        0,
        0,
        0,
        0,
        0,
        29.508196703947725,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ]
]

let chartDataList=[]

let titleArray=[];

titleArray.push("time")

let newtitleArray= titleArray.concat(nameList)


let newChartDataList=[]

let pppData=[]
let newList=[]
usageSetList2.map((innerList, index)=>{

    console.log('usageOne===>', innerList);

    innerList.map((usageOne, innerIndex)=>{
        if(innerIndex===0){
            newList.push(usageOne);
        }
    })

})

console.log('sdlkfsldkflksdflksdlfk===>', newList);


let completeDataSet=newtitleArray.concat(newChartDataList)



console.log('newChartDataList===>', completeDataSet);

const data = [
    ["Year", "Sales", "Expenses"],
    ["2004", 1000, 400],
    ["2005", 1170, 460],
    ["2006", 660, 1120],
    ["2007", 1030, 540],
    ["2008", 1035, 545],
    ["2009", 1037, 518],
    ["2010", 1040, 550],
    ["2011", 1050, 570],
];
