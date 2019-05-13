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
/*
{"key":{"cluster_key":{"name":"macrometa"},"cloudlet_key":{"operator_key":{"name":"TDG"},"name":"bonn-mexdemo"},"developer":"bicinkiOrg"},"flavor":{"name":"x1.medium"},"liveness":1,"state":5,"ip_access":3,"node_flavor":"m4.small","master_flavor":"m4.small"}
{
    "key":
    {
        "cluster_key":{"name":"biccluster"},
        "cloudlet_key":{"operator_key":{"name":"TDG"},"name":"bonn-mexdemo"},
        "developer":"bicinkiOrg"
    },
    "flavor":{"name":"x1.medium"},
    "liveness":1,
    "state":5,
    "ip_access":3,
    "node_flavor":"m4.small",
    "master_flavor":"m4.small"
}
 */
let generateData = (datas,body) => {
    console.log('format data clusterinst - ', datas)
    let values = [];
    let toArray = null;
    let toJson = [];
    let ipaccessArr = ['IpAccessUnknown','IpAccessDedicated','IpAccessDedicatedOrShared','IpAccessShared'];
    if(datas.data) {
        if(typeof datas.data === 'object') {
            console.log("datas.data@@@",datas.data)
            toJson.push((datas.data)?datas.data:{});
        } else {
            toArray = datas.data.split('\n')
            toArray.pop();
            toJson = toArray.map((str)=>(JSON.parse(str)))
        }
    }else {
        toJson = null;
    }
    //20190409 transition string to json
    
    console.log("clusterinst tojson!!",toJson)
    if(toJson){
        toJson.map((dataResult, i) => {
            if(dataResult.message) {

            } else {
                let Index = i;
                let Region = body.region || '-';
                let ClusterName = dataResult.data.key.cluster_key.name  || '-';
                let DeveloperName = dataResult.data.key.developer || '-';
                let Operator = dataResult.data.key.cloudlet_key.operator_key.name  || '-';
                let Cloudlet = dataResult.data.key.cloudlet_key.name  || '-';
                let Flavor = dataResult.data.flavor.name || '-';
                let NodeFlavor = dataResult.data.node_flavor || '';
                let MasterFlavor = dataResult.data.master_flavor || '';
                let IpAccess = ipaccessArr[dataResult.data.ip_access] || '-';
                let CloudletLocation = '-';

                let newRegistKey = ['Region', 'ClusterName', 'OrganizationName', 'Operator', 'Cloudlet', 'Flavor', 'IpAccess', 'NumberOfMaster', 'NumberOfNode', 'CloudletLocation'];
                values.push({Region:Region, ClusterName:ClusterName, OrganizationName:DeveloperName, Operator:Operator, Cloudlet:Cloudlet, Flavor:Flavor, IpAccess:IpAccess, CloudletLocation:CloudletLocation, Edit:newRegistKey})
            }
        })
    } else {
        let newRegistKey = ['Region', 'ClusterName', 'OrganizationName', 'Operator', 'Cloudlet', 'Flavor', 'IpAccess', 'NumberOfMaster', 'NumberOfNode', 'CloudletLocation'];
        //values.push({Edit:newRegistKey})
        values.push({Region:'', ClusterName:'', OrganizationName:'', Operator:'', Cloudlet:'', Flavor:'', IpAccess:'', CloudletLocation:'', Edit:newRegistKey})
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
const FormatComputeClstInst = (props,body) => (
    generateData(props,body)
)

export default FormatComputeClstInst;
