let data=[
    {
        "name": "clusterinst",
        "columns": [
            "time",
            "cluster",
            "dev",
            "cloudlet",
            "operator",
            "flavor",
            "vcpu",
            "ram",
            "disk",
            "other",
            "event",
            "status"
        ],
        "values": [
            [
                "2020-02-18T18:46:49.130047031Z",
                "autoclusterfacedetectiondemo",
                "MobiledgeX",
                "ssss",
                "TDG",
                "m4.large",
                4,
                8192,
                80,
                "map[]",
                "CREATED",
                "UP"
            ]
        ]
    }
]


//console.log("sldkflsdkfldskf===>", data);


//console.log("sldkflsdkfldskf===>", data["0"].values);

let eventLogList = data["0"].values;

eventLogList.map(item=>{
    console.log("sldkflsdkfldskf===>", item);
})
