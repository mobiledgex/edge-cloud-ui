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
    if (datas.data) {
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

        /*
        pool_key: {name: "cloudletPool_bictest_1223-01"}
        cloudlet_key:
            operator_key:
            name: "TDG"
        name: "automationBerlinCloudletStage"
         */
        let newRegistKey = ['Region', 'PoolName', 'OperatorName'];
        if (toJson && toJson.length) {
            toJson.map((dataResult, i) => {
                if (dataResult.error || dataResult.message || !dataResult.data) {
                    values.push({
                        Index: i,
                        Operator: '',
                        PoolName: '',
                        Clouldet: ''
                    })
                } else {
                    let Index = i;
                    let Operator = dataResult.data.cloudlet_key.operator_key.name || '-';
                    let PoolName = dataResult.data.pool_key.name || '-';
                    let Cloudlet = dataResult.data.cloudlet_key.name || '-';
                    let Region = body.region || '-';

                    values.push({ uuid: generateUniqueId(), Region: Region, Operator: Operator, PoolName: PoolName, Cloudlet: Cloudlet })
                }

            })
        } else {
            values.push({ Operator: '', PoolName: '', Cloudlet: '' })
        }
    }
    return values

}


