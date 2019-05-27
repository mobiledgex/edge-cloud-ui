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
    console.log('format data appinst- ', datas)
    let result = datas;
    let values = [];
    //20190409 transition string to json
    let toArray = null;
    let toJson = null;
    if(typeof datas.data === 'object'){

    } else {
        toArray = datas.data.split('\n')
        toArray.pop();
    }
    if(toArray) {
        toJson = toArray.map((str)=>(JSON.parse(str)))
    } else {
        toJson = [];
        toJson.push(datas.data)
    }
    console.log("tojson!!",toJson)
    if(toJson){
        toJson.map((dataResult, i) => {
            if(dataResult.message) {

            } else {
                let Index = i;
                let Region = body.region || '-';
                let DeveloperName = dataResult.data.key.app_key.developer_key.name  || '-';
                let AppName = dataResult.data.key.app_key.name  || '-';
                let Version = dataResult.data.key.app_key.version  || '-';
                let Operator = dataResult.data.key.cluster_inst_key.cloudlet_key.operator_key.name  || '-';
                let Cloudlet = dataResult.data.key.cluster_inst_key.cloudlet_key.name  || '-';
                let ClusterInst = dataResult.data.key.cluster_inst_key.cluster_key.name || '-';

                let CloudletLocation=dataResult.data.cloudlet_loc || '-';
                //let State = dataResult.uri || '-';
                let URI = dataResult.uri || '-';
                let Mapped_ports= dataResult.mapped_ports || '-';

                let newRegistKey = [
                    'Region',
                    'DeveloperName',
                    'AppName',
                    'Version',
                    'Operator',
                    'Cloudlet',
                    'ClusterInst',
                    'CloudletLocation'
                ];

                values.push({
                    Region:Region,
                    OrganizationName:DeveloperName,
                    AppName:AppName,
                    Version:Version,
                    Operator:Operator,
                    Cloudlet:Cloudlet,
                    ClusterInst:ClusterInst,
                    CloudletLocation:CloudletLocation,
                    Edit:newRegistKey
                })
            }
        })
    } else {
        let newRegistKey = [
            'Region',
            'DeveloperName',
            'AppName',
            'Version',
            'Operator',
            'Cloudlet',
            'ClusterInst',
            'CloudletLocation'
        ];
        values.push({
            Region:'',
            OrganizationName:'',
            AppName:'',
            Version:'',
            Operator:'',
            Cloudlet:'',
            ClusterInst:'',
            CloudletLocation:'',
            Edit:newRegistKey
        })
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
const FormatComputeInst = (props,body) => (
    generateData(props,body)
)

export default FormatComputeInst;
