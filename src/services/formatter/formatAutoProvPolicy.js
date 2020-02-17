import { generateUniqueId } from '../serviceMC';
import {TYPE_JSON} from '../../hoc/constant';

export const layouts = [
  {key:'Region', label:'Region'},
  {key:'OrganizationName', label:'Organization Name'},
  {key:'AutoPolicyName', label:'Auto Provisioning Policy Name'},
  {key:'Cloudlets', label:'Cloudlets', 
        layouts : [
          {key:'CloudletName', label:'Cloudlet Name'},
          {key:'Operator', label:'Operator'},
          {key:'Location', label:'Location', type:TYPE_JSON}
        ]}
]

export const formatData = (datas, body) => {

  let values = [];
  if (datas.data) {
    let toArray = null;
    let toJson = null;
    if (typeof datas.data === 'object') {

    } else {
      toArray = datas.data.split('\n')
      toArray.pop();
    }
    if (toArray) {
      toJson = toArray.map((str) => (JSON.parse(str)))
    } else {
      toJson = [];
      toJson.push((datas.data) ? datas.data : {})
    }

    let newRegistKey = [
      'Region',
      'DeveloperName',
      'AutoPolicyName',
      'DeployClientCount',
      'DeployIntervalCount',
      'CloudletCount',
      'Editable'
    ];
    if (toJson && toJson.length) {
      toJson.map((dataResult, i) => {

        if (dataResult.error || dataResult.message || !dataResult.data) {
          values.push({
            Region: '',
            OrganizationName: '',
            AutoPolicyName: '',
            CloudletCount: '',
            Edit: null,
          })
        } else {
          let Region = body.region || body.params.region || '-';
          let DeveloperName = dataResult.data.key.developer || '-';
          let AutoPolicyName = dataResult.data.key.name || '-';
          let DeployClientCount = dataResult.data.deploy_client_count || 0;
          let DeployIntervalCount = dataResult.data.deploy_interval_count || 0;

          let cloudlets = [];

          if(dataResult.data.cloudlets && dataResult.data.cloudlets.length>0)
          {
            for(let i=0;i<dataResult.data.cloudlets.length;i++)
            {
                let data = dataResult.data.cloudlets[i];
                let CloudletName = data.key.name;
                let Operator = data.key.operator_key.name;
                let Location = data.loc;
                cloudlets.push({ CloudletName: CloudletName, Operator: Operator, Location: Location })
            }
          }

          values.push({
            uuid: generateUniqueId(),
            Region: Region,
            OrganizationName: DeveloperName,
            AutoPolicyName: AutoPolicyName,
            DeployClientCount: DeployClientCount,
            DeployIntervalCount: DeployIntervalCount,
            Cloudlets:cloudlets,
            CloudletCount: cloudlets.length,
            Edit: newRegistKey,
          })
        }
      })
    }
  }
  return values

}
