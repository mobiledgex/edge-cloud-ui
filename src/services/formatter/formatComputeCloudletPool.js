import { generateUniqueId } from '../serviceMC';

export const getKey = (data) => {
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

        let newRegistKey = ['Region', 'PoolName', 'OperatorName'];
        if (toJson && toJson.length) {
            toJson.map((dataResult, i) => {
                if (dataResult.error || dataResult.message || !dataResult.data) {
                    values.push({
                        Region: '',
                        PoolName: '',
                        NumOfCloudlets: '',
                        NumOfOrganizations: '',
                        Edit: null
                    })
                } else {
                    let Index = i;
                    let Region = body.region || '-';
                    let PoolName = dataResult.data.key.name || '-';
                    let Cloudlets = dataResult.data.state || 0;
                    let Organizations = 0;
                    values.push({ uuid: generateUniqueId(), Region: Region, PoolName: PoolName, NumOfCloudlets: Cloudlets, NumOfOrganizations: Organizations, Edit: newRegistKey })
                }

            })
        } else {
            values.push({ Region: '', CloudletLocation: '' })
        }
    }
    return values
}
