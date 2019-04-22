
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

    //---------------

    let toArray = datas.data.split('\n')
    toArray.pop();

    let toJson = toArray.map((str)=>(JSON.parse(str)))

    if(toJson){
        toJson.map((dataResult, i) => {
            if(dataResult.message) {
                //{"key":{"operator_key":{"name":"TIP"},"name":"mpk-tip"},
                // "location":{"latitude":37.485,"longitude":-122.1475,"timestamp":{}},"ip_support":2,"num_dynamic_ips":5}

                // create
                //{"region":"local","cloudlet":{"key":{"operator_key":{"name":"bigwaves"},"name":"oceanview"},"location":{"latitude":1,"longitude":1,"timestamp":{}},"ip_support":2,"num_dynamic_ips":30}}
            } else {
                let Index = i;
                let CloudletName = dataResult.key.name || '-';
                let Operator = dataResult.key.operator_key.name || '-';
                let CloudletLocation = dataResult.location || '-';
                let Ip_support = dataResult.ip_support || '-';
                let Num_dynamic_ips = dataResult.num_dynamic_ips || '-';
                let newRegistKey = ['CloudletName', 'Operator', 'CloudletLocation', 'Region', 'Ip_support', 'Num_dynamic_ips'];

                values.push({ CloudletName:CloudletName, Operator:Operator, CloudletLocation:CloudletLocation, Ip_support:Ip_support, Num_dynamic_ips:Num_dynamic_ips, Edit:newRegistKey})
            }

        })
    } else {
        console.log('there is no result')
    }


    //----------------

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
const FormatComputeClouldlet = (props) => (
    generateData(props)
)

export default FormatComputeClouldlet;
