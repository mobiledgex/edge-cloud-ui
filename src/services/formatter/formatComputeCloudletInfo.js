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
                        NotifyId: '',
                        Controller: '',
                        Version: '',
                        OSMaxRam: '',
                        State: '',
                        Status: ''
                    })
                } else {
                    let Region = body.region || '-';
                    let CloudletName = dataResult.data.key.name || '-';
                    let Operator = dataResult.data.key.operator_key.name || '-';
                    let State = dataResult.data.state || '-';
                    let NotifyId = dataResult.data.notify_id || '-';
                    let Controller = dataResult.data.controller || '-';
                    let Errors = dataResult.data.errors;
                    let Status = dataResult.data.status;
                    let Version = dataResult.data.version || '-';
                    let OSMaxRam = dataResult.data.os_max_ram || '-';
                    let OSMaxVCores = dataResult.data.os_max_vcores
                    let OSMaxVolGB = dataResult.data.os_max_vol_gb
                    let Flavors = dataResult.data.flavors
                    values.push({ Region: Region, CloudletName: CloudletName, Operator: Operator, State: State, NotifyId: NotifyId, Controller: Controller, Errors: Errors, Status: Status, Version: Version, OSMaxRam: OSMaxRam, OSMaxVCores: OSMaxVCores, OSMaxVolGB: OSMaxVolGB, Flavors: Flavors })
                }
            })
        } else {
            values.push({ Region: '', CloudletLocation: '' })
        }
    }
    return values
}


