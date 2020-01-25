import { generateUniqueId } from '../serviceMC';

export const getKey = (data) => {
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

export const formatData = (datas, body) => {
    let values = [];
    if (datas.data && datas.data.length) {
        let toArray = null;
        let toJson = [];

        if (typeof datas.data === 'object') {
            if (datas.data == null) {
                toJson = null;
            } else {
                toJson.push((datas.data) ? datas.data : {});
            }
        } else {
            toArray = datas.data.split('\n')
            toArray.pop();
            toJson = toArray.map((str) => (JSON.parse(str)))
        }

        let newRegistKey = ['Region', 'PoolName', 'OperatorName'];
        if (toJson && toJson.length) {
            toJson.map((dataResult, i) => {
                if (dataResult.error || dataResult.message || !dataResult.data) {
                    values.push({
                        Region: '',
                        PoolName: '',
                        Cloudlets: '',
                        Organizations: '',
                        Edit: null
                    })
                } else {
                    let Index = i;
                    let Region = body.region || '-';
                    let PoolName = dataResult.data.key.name || '-';
                    let Cloudlets = dataResult.data.state || 0;
                    let Organizations = 0;
                    values.push({ uuid: generateUniqueId(), Region: Region, PoolName: PoolName, Cloudlets: Cloudlets, Organizations: Organizations, Edit: newRegistKey })
                }

            })
        } else {
            values.push({ Region: '', CloudletLocation: '' })
        }
    }
    return values

}


/*

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