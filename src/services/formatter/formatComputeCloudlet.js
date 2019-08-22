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

let generateData = (datas,body) => {
    let values = [];
    let toArray = null;
    let toJson = [];
    if(datas.data) {
        if(typeof datas.data === 'object') {
            if(datas.data == null) {
                toJson = null;
            } else {
                toJson.push((datas.data)?datas.data:{});
            }
        } else {
            toArray = datas.data.split('\n')
            toArray.pop();
            toJson = toArray.map((str)=>(JSON.parse(str)))
        }
    }else {
        toJson = null;
    }
    let newRegistKey = ['Region', 'CloudletName', 'OperatorName', 'CloudletLocation', 'Ip_support', 'Num_dynamic_ips'];
    if(toJson && toJson.length){
        toJson.map((dataResult, i) => {
            if(dataResult.error || dataResult.message || !dataResult.data) {
                values.push({
                    Region:'',
                    CloudletName:'',
                    Operator:'',
                    CloudletLocation:'',
                    Ip_support:'',
                    Num_dynamic_ips:'',
                    Edit:null
                })
            } else {
                let Index = i;
                let Region = body.region || '-';
                let CloudletName = dataResult.data.key.name || '-';
                let Operator = dataResult.data.key.operator_key.name || '-';
                let CloudletLocation = dataResult.data.location || '-';
                let Ip_support = dataResult.data.ip_support || '-';
                let Num_dynamic_ips = dataResult.data.num_dynamic_ips || '-';


                values.push({Region:Region,  CloudletName:CloudletName, Operator:Operator, CloudletLocation:CloudletLocation, Ip_support:Ip_support, Num_dynamic_ips:Num_dynamic_ips, Edit:newRegistKey})
            }

        })
    } else {
        values.push({Region:'',CloudletLocation:''})
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
const FormatComputeClouldlet = (props,body) => (
    generateData(props,body)
)

export default FormatComputeClouldlet;
