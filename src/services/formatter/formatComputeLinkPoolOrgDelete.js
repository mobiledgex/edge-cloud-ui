import {generateUniqueId} from '../serviceMC';

export const getKey = (data)=>
{
    const { CloudletPool, Org, Region } = data
    return ({
        region: Region,
        cloudletpool: CloudletPool,
        org: Org
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

    let newRegistKey = ['region', 'cloudletpool', 'org'];
    if(toJson && toJson.length){
        toJson.map((dataResult, i) => {
            if(dataResult.error || dataResult.message || !dataResult.data) {
                values.push({
                    Index:i,
                    Region:'',
                    Cloudletpool:'',
                    Org:''
                })
            } else {
                let Index = i;
                let Cloudletpool = dataResult.data.cloudlet_key.operator_key.name || '-';
                let Org = dataResult.data.pool_key.name || '-';
                let Region = body.region || '-';

                values.push({uuid:generateUniqueId(), Region:Region, Cloudletpool:Cloudletpool,  Org:Org})
            }

        })
    } else {
        values.push({Region:'',Cloudletpool:'', Org:''})
    }

    return values

}


