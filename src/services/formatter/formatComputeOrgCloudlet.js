import {generateUniqueId} from '../serviceMC';

export const getKey = (data)=>
{
    const { CloudletName, Operator, Region } = data
    return ({
        region: Region,
        cloudlet: {
            key: {
                operator_key: { name: Operator },
                name: CloudletName
            }
        }
    })
}

export const formatData  = (datas,body) => {
    let values = [];
    let toArray = null;
    let toJson = [];
    if(datas.data) {
        if(typeof datas.data === 'object') {
            if(datas.data == null) {
                toJson = null;
            } else {
                toJson = (datas.data)?datas.data:[];
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
        toJson.map((dataResult) => {
            if(dataResult.error || dataResult.message || !dataResult.key) {
                values.push({
                    Region:'',
                    CloudletName:'',
                    Operator:'',
                    CloudletLocation:'',
                    Ip_support:'',
                    Num_dynamic_ips:'',
                    Physical_name:'',
                    Platform_type:'',
                    State:'',
                    Progress:'',
                    Status:'',
                    Edit:null
                })
            } else {
                let Region = body.region || '-';
                let CloudletName = dataResult.key.name || '-';
                let Operator = dataResult.key.operator_key.name || '-';
                let CloudletLocation = dataResult.location || '-';
                let Ip_support = dataResult.ip_support || '-';
                let Num_dynamic_ips = dataResult.num_dynamic_ips || '-';
                let Physical_name = dataResult.physical_name || '-';
                let Platform_type = dataResult.platform_type || '-';
                let State = dataResult.state || '-';
                let Status = dataResult.status;
                values.push({uuid:generateUniqueId(), Region:Region,  CloudletName:CloudletName, Operator:Operator, CloudletLocation:CloudletLocation, Ip_support:Ip_support, Num_dynamic_ips:Num_dynamic_ips, Physical_name:Physical_name, Platform_type:Platform_type, State:State, Progress:'', Status:Status, Edit:newRegistKey})
            }
        })
    } else {
        values.push({Region:'',CloudletLocation:''})
    }
    return values
}


/**
 {
        "config": {}, 
        "flavor": {}, 
        "ip_support": 2, 
        "key": {
            "name": "mexplat-stage-hamburg-cloudlet", 
            "operator_key": {
                "name": "TDG"
            }
        }, 
        "location": {
            "latitude": 55, 
            "longitude": 44, 
            "timestamp": {}
        }, 
        "num_dynamic_ips": 5, 
        "state": 13, 
        "status": {}, 
        "time_limits": {
            "create_app_inst_timeout": 1800000000000, 
            "create_cluster_inst_timeout": 1800000000000, 
            "delete_app_inst_timeout": 1200000000000, 
            "delete_cluster_inst_timeout": 1200000000000, 
            "update_app_inst_timeout": 1200000000000, 
            "update_cluster_inst_timeout": 1200000000000
        }
    }
 */

