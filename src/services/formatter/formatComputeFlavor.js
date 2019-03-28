/*
{
            "result": {
                "fields": [],
                "key": {
                    "operator_key": {
                        "name": "TDG"
                    },
                    "name": "bonn-niantic"
                },
                "access_uri": "",
                "location": {
                    "latitude": 50.737,
                    "longitude": 7.098,
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
                "num_dynamic_ips": 5
            }
        }
//

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
    console.log('format data flavor- ', datas)
    let result = datas;
    let values = [];
    if(result){
        result.map((data, i) => {
            let dataResult = data.result || '-';
            let Index = i;
            let FlavorName = dataResult.key.name || '-';
            let RAM = dataResult.ram || '-';
            let VCPUS = dataResult.vcpus || '-';
            let DISK = dataResult.disk || '-';
            let newRegistKey = ['FlavorName', 'RAM', 'VCPUS', 'DISK'];

            values.push({FlavorName:FlavorName, RAM:RAM, VCPUS:VCPUS, DISK:DISK, Edit:newRegistKey})
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
const FormatComputeFlavor = (props) => (
    generateData(props)
)

export default FormatComputeFlavor;
