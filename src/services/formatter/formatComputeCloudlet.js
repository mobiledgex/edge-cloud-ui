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
    //{"data":{"key":{"organization":"AnandOprOrg","name":"hackathon-anand"},"location":{"latitude":33.01,"longitude":-96.61},"ip_support":2,"num_dynamic_ips":254,"time_limits":{},"status":{},"state":5,"platform_type":5,"notify_srv_addr":"127.0.0.1:0","flavor":{"name":"x1.medium"},"physical_name":"hackathon-anand","container_version":"2020-02-18","config":{}}}

    try
    {
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
                        CloudletLocation: '',
                        Ip_support: '',
                        Num_dynamic_ips: '',
                        Physical_name: '',
                        Platform_type: '',
                        State: '',
                        Progress: '',
                        Status: '',
                        CloudletInfoState:4,
                        Edit: null
                    })
                } else {
                    let Region = body.region || '-';
                    let CloudletName = dataResult.data.key.name || '-';
                    let Operator = dataResult.data.key.organization || '-';
                    let CloudletLocation = dataResult.data.location || '-';
                    let Ip_support = dataResult.data.ip_support || '-';
                    let Num_dynamic_ips = dataResult.data.num_dynamic_ips || '-';
                    let Physical_name = dataResult.data.physical_name || '-';
                    let Platform_type = dataResult.data.platform_type || '-';
                    let State = dataResult.data.state || '-';
                    let Status = dataResult.data.status;
                    let CloudletInfoState = 4;
                    values.push({ uuid: generateUniqueId(), CloudletInfoState:CloudletInfoState, Region: Region, CloudletName: CloudletName, Operator: Operator, CloudletLocation: CloudletLocation, Ip_support: Ip_support, Num_dynamic_ips: Num_dynamic_ips, Physical_name: Physical_name, Platform_type: Platform_type, State: State,Progress: '', Status: Status, Edit: newRegistKey })
                }
            })
        }
    }
}
catch( e)
{
    alert(e)
}
    console.log('Rahul1234', values)
    return values
}


