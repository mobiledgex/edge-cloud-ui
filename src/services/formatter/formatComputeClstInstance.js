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
    console.log('format data clusterinst - ', datas)
    let result = datas;
    let values = [];
    //20190409 transition string to json
    let toArray = datas.data.split('\n')
    let toJson = toArray.map((str)=>(JSON.parse(str)))
    console.log("clusterinst tojson!!",toJson)
    if(toJson){
        toJson.map((dataResult, i) => {
            if(dataResult.message) {

            } else {
                let Index = i;
                let ClusterName = dataResult.key.cluster_key.name  || '-';
                let DeveloperName = '-';
                let Operator = dataResult.key.cloudlet_key.operator_key.name  || '-';
                let Cloudlet = dataResult.key.cloudlet_key.name  || '-';
                let ClusterFlavor = dataResult.flavor.name || '-';
                let IPAccess = dataResult.ip_access || '-';
                let CloudletLocation = '-';

                let newRegistKey = ['ClusterName', 'DeveloperName', 'Operator', 'Cloudlet', 'ClusterFlavor', 'IPAccess', 'CloudletLocation'];
                values.push({ClusterName:ClusterName, Operator:Operator, Cloudlet:Cloudlet, ClusterFlavor:ClusterFlavor, IPAccess:IPAccess, CloudletLocation:CloudletLocation, Edit:newRegistKey})
            }
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
const FormatComputeClstInst = (props) => (
    generateData(props)
)

export default FormatComputeClstInst;
