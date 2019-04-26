
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
    console.log('format data cloudlet@@ - ', datas)
    let values = [];
    let toArray = null;
    let toJson = [];
    if(datas.data) {
        if(typeof datas.data === 'object') {
            toJson.push((datas.data)?datas.data:{});
        } else {
            toArray = datas.data.split('\n')
            toArray.pop();
            toJson = toArray.map((str)=>(JSON.parse(str)))
        }
    }else {
        toJson = null;
    }
    console.log("cloudlet tojson!!",toJson)
    if(toJson){
        toJson.map((dataResult, i) => {
            if(dataResult.message) {
                
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
        let newRegistKey = ['CloudletName', 'Operator', 'CloudletLocation', 'Region', 'Ip_support', 'Num_dynamic_ips'];
        values.push({CloudletName:'', Operator:'', CloudletLocation:'', Ip_support:'', Num_dynamic_ips:'', Edit:newRegistKey})
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
