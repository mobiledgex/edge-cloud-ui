import { generateUniqueId } from '../serviceMC';

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
          let Cloudlets = dataResult.data.cloudlets ? dataResult.data.cloudlets : [];
          let CloudletCount = dataResult.data.cloudlets ? dataResult.data.cloudlets.length : 0

          values.push({
            uuid: generateUniqueId(),
            Region: Region,
            OrganizationName: DeveloperName,
            AutoPolicyName: AutoPolicyName,
            DeployClientCount: DeployClientCount,
            DeployIntervalCount: DeployIntervalCount,
            Cloudlets:Cloudlets,
            CloudletCount: CloudletCount,
            Edit: newRegistKey,
          })
        }
      })
    }
  }
  return values

}
