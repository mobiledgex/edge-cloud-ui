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
    if (datas.data && datas.data.length > 0) {
        let toArray = null;
        let toJson = [];
        if (datas.data) {
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
        } else {
            toJson = null;
        }
        let newRegistKey = ['Region', 'CloudletName', 'OperatorName', 'CloudletLocation', 'Ip_support', 'Num_dynamic_ips'];
        if (toJson && toJson.length) {
            toJson.map((dataResult) => {
                if (dataResult.error || dataResult.message || !dataResult.data) {
                    values.push({
                        Region: '',
                        CloudletName: '',
                        Operator: '',
                        CloudletLocation: '',
                        Ip_support: '',
                        Num_dynamic_ips: '',
                        Physical_name: '',
                        Platform_type: '',
                        State: '',
                        Progress: '',
                        Status: '',
                        Edit: null
                    })
                } else {
                    let Region = body.region || '-';
                    let CloudletName = dataResult.data.key.name || '-';
                    let Operator = dataResult.data.key.operator_key.name || '-';
                    let CloudletLocation = dataResult.data.location || '-';
                    let Ip_support = dataResult.data.ip_support || '-';
                    let Num_dynamic_ips = dataResult.data.num_dynamic_ips || '-';
                    let Physical_name = dataResult.data.physical_name || '-';
                    let Platform_type = dataResult.data.platform_type || '-';
                    let State = dataResult.data.state || '-';
                    let Status = dataResult.data.status;
                    values.push({ uuid: generateUniqueId(), Region: Region, CloudletName: CloudletName, Operator: Operator, CloudletLocation: CloudletLocation, Ip_support: Ip_support, Num_dynamic_ips: Num_dynamic_ips, Physical_name: Physical_name, Platform_type: Platform_type, State: State, Progress: '', Status: Status, Edit: newRegistKey })
                }
            })
        } else {
            values.push({ Region: '', CloudletLocation: '' })
        }
    }
    return values
}


