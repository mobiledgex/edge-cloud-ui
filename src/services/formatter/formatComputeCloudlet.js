/*

{
            "result": {
                "fields": [],
                "key": {
                    "operator_key": {
                        "name": "azure"
                    },
                    "name": "westus2-mexdemo"
                },
                "access_uri": "",
                "location": {
                    "latitude": 47.6062,
                    "longitude": -122.332,
                    "horizontal_accuracy": 0,
                    "vertical_accuracy": 0,
                    "altitude": 0,
                    "course": 0,
                    "speed": 0,
                    "timestamp": {
                        "seconds": "0",
                        "nanos": 0
                    }
                },
                "ip_support": "IpSupportDynamic",
                "static_ips": "",
                "num_dynamic_ips": 10
            }
        }

this.dummyData = [[
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo1",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"},
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo2",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"},
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo3",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"},
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo4",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"},
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo5",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"},
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo6",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"},
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo7",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"}

        ]
 */


import * as moment from 'moment';
let trimData = (datas) => {
    let newData = datas.splice(0,1);
    return datas ;
}
const week_kr = ["월","화","수","목","금","토","일"]
let week = moment().format('E');
let getWeek = week_kr[(week-1)];
const numberDes =(a,b)=> (
    b-a
)

let generateData = (datas) => {
    console.log('format data - ', datas)
    let result = datas;
    let values = [];
    if(result){
        result.map((data, i) => {
            let Index = i;
            let CloudletName = data.result.key.name || '-';
            let Operator = data.result.key.operator_key.name || '-';
            let CloudletLocation = data.result.location || '-';
            //let Ip_support = data.result.ip_support || '-';

            values.push({Index:Index, CloudletName:CloudletName, Operator:Operator, CloudletLocation:CloudletLocation, Edit:''})
        })
    } else {
        console.log('there is no result')
    }

    //ascending or descending

    //values.sort(numberDes);
    //values.reverse();

    return values

}
const retunDate = (str) => {
    var year = str.substring(0, 4);
    var month = str.substring(4, 6);
    var day = str.substring(6, 8);
    var hour = str.substring(8, 10);
    var minute = str.substring(10, 12);
    //var second = str.substring(12, 14);
    var date = new Date(year, month-1, day, hour, minute);
    return moment(date).format('hh:mm');
}
const formatComputeClouldlet = (props) => (
    generateData(props)
)

export default formatComputeClouldlet;
