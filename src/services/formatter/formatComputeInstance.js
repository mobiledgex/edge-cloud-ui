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
{
  "data": {
    "key": {
      "app_key": {
        "developer_key": {
          "name": "MobiledgeX"
        },
        "name": "MEXPrometheusAppName",
        "version": "1.0"
      },
      "cluster_inst_key": {
        "cluster_key": {
          "name": "bickh123"
        },
        "cloudlet_key": {
          "operator_key": {
            "name": "TDG"
          },
          "name": "mexplat-stage-hamburg-cloudlet"
        },
        "developer": "MobiledgeX"
      }
    },
    "cloudlet_loc": {
      "latitude": 55,
      "longitude": 44,
      "timestamp": {}
    },
    "uri": "bickh123.mexplat-stage-hamburg-cloudlet.tdg.mobiledgex.net",
    "liveness": "LivenessStatic",
    "mapped_ports": null,
    "flavor": {
      "name": "x1.medium"
    },
    "state": "DeleteError",
    "errors": [
      "Delete App Inst failed: error deleting helm chart, KUBECONFIG=bickh123.TDG.kubeconfig helm delete --purge mexprometheusappname, Error: release: \"mexprometheusappname\" not found, Process exited with status 1"
    ],
    "runtime_info": {},
    "created_at": {
      "seconds": 1558940545,
      "nanos": 950911983
    }
  }
}
 */

let generateData = (datas,body) => {
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
        toJson.push((datas.data)?datas.data:{})
    }

    let newRegistKey = [
        'Region',
        'DeveloperName',
        'AppName',
        'Version',
        'Operator',
        'Cloudlet',
        'ClusterInst',
        'CloudletLocation',
        'State',
        'Editable'
    ];
    if(toJson && toJson.length){
        toJson.map((dataResult, i) => {

            if(dataResult.error || dataResult.message || !dataResult.data) {
                values.push({
                    Region:'',
                    OrganizationName:'',
                    AppName:'',
                    Version:'',
                    Operator:'',
                    Cloudlet:'',
                    ClusterInst:'',
                    CloudletLocation:'',
                    URI:'',
                    Liveness:'',
                    Mapped_port:'',
                    Flavor:'',
                    State:'',
                    Error:'',
                    Runtime:'',
                    Created:'',
                    Progress:'',
                    Edit:null,
                    Status:''
                })
            } else {
                let Index = i;
                let Region = body.region || body.params.region || '-';
                let DeveloperName = dataResult.data.key.app_key.developer_key.name  || '-';
                let AppName = dataResult.data.key.app_key.name  || '-';
                let Version = dataResult.data.key.app_key.version  || '-';
                let Operator = dataResult.data.key.cluster_inst_key.cloudlet_key.operator_key.name  || '-';
                let Cloudlet = dataResult.data.key.cluster_inst_key.cloudlet_key.name  || '-';
                let CloudletLocation = dataResult.data.cloudlet_loc || '-';
                let ClusterInst = dataResult.data.key.cluster_inst_key.cluster_key.name || '-';
                let URI = dataResult.data.uri || '-';
                let liveness = dataResult.data.liveness || '-';
                let mapped_ports= dataResult.data.mapped_ports || '-';
                let flavor = dataResult.data.flavor.name || '-';
                let state = dataResult.data.state || '-';
                let error = dataResult.data.errors || '-';
                let runtime = dataResult.data.runtime_info || '-';
                let created = "seconds : "+dataResult.data.created_at.seconds  || '-' + "     nanos : "+dataResult.data.created_at.nanos || '-';
                let Status = dataResult.data.status




                values.push({
                    Region:Region,
                    OrganizationName:DeveloperName,
                    AppName:AppName,
                    Version:Version,
                    Operator:Operator,
                    Cloudlet:Cloudlet,
                    ClusterInst:ClusterInst,
                    CloudletLocation:CloudletLocation,
                    URI:URI,
                    Liveness:liveness,
                    Mapped_port:mapped_ports,
                    Flavor:flavor,
                    State:state,
                    Error:error,
                    Runtime:runtime,
                    Created:created,
                    Progress:'',
                    Edit:newRegistKey,
                    Status:Status
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
