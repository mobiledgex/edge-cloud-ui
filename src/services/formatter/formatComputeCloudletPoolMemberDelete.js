import {generateUniqueId} from '../serviceMC';

export const getKey = (data)=>
{
    const { PoolName, Cloudlet, Operator, Region } = data
    return ({
        region: Region,
        cloudletpoolmember: {
            cloudlet_key: {
                organization: Operator,
                name: Cloudlet
            },
            pool_key: {
                name: PoolName
            }
        }
    })
}

export const formatData = (datas,body) => {
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
    /*
    pool_key: {name: "cloudletPool_bictest_1223-01"}
    cloudlet_key:
        organization:"TDG"
    name: "automationBerlinCloudletStage"
     */
    let newRegistKey = ['Region', 'PoolName', 'OperatorName'];
    if(toJson && toJson.length){
        toJson.map((dataResult, i) => {
            if(dataResult.error || dataResult.message || !dataResult.data) {
                values.push({
                    Index:i,
                    Operator:'',
                    PoolName:'',
                    Clouldet:''
                })
            } else {
                let Index = i;
                let Operator = dataResult.data.cloudlet_key.organization || '-';
                let PoolName = dataResult.data.pool_key.name || '-';
                let Cloudlet = dataResult.data.cloudlet_key.name || '-';
                let Region = body.region || '-';

                values.push({uuid:generateUniqueId(), Region:Region, Operator:Operator,  PoolName:PoolName, Cloudlet:Cloudlet})
            }

        })
    } else {
        values.push({Operator:'',PoolName:'', Cloudlet:''})
    }

    return values

}


