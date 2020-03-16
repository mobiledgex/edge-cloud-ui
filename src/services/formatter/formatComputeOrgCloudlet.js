import {generateUniqueId} from '../serviceMC';

export const getKey = (data)=>
{
    const { CloudletName, Operator, Region } = data
    return ({
        region: Region,
        cloudlet: {
            key: {
                organization: Operator ,
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
                    CloudletInfoState:4,
                    Edit:null
                })
            } else {
                let Region = body.region || '-';
                let CloudletName = dataResult.key.name || '-';
                let Operator = dataResult.key.organization || '-';
                let CloudletLocation = dataResult.location || '-';
                let Ip_support = dataResult.ip_support || '-';
                let Num_dynamic_ips = dataResult.num_dynamic_ips || '-';
                let Physical_name = dataResult.physical_name || '-';
                let Platform_type = dataResult.platform_type || '-';
                let State = dataResult.state || '-';
                let Status = dataResult.status;
                let CloudletInfoState  = 4;
                values.push({uuid:generateUniqueId(), CloudletInfoState:CloudletInfoState, Region:Region,  CloudletName:CloudletName, Operator:Operator, CloudletLocation:CloudletLocation, Ip_support:Ip_support, Num_dynamic_ips:Num_dynamic_ips, Physical_name:Physical_name, Platform_type:Platform_type, State:State, Progress:'', Status:Status, Edit:newRegistKey})
            }
        })
    }
    return values
}