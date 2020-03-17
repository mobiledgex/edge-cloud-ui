import { generateUniqueId } from '../serviceMC';

export const getKey = (data) => {
  const { OrganizationName, AppName, Version, Operator, Cloudlet, ClusterInst, Region } = data
  return ({
    region: Region,
    appinst: {
      key: {
        app_key: { organization: OrganizationName, name: AppName, version: Version },
        cluster_inst_key: {
          cloudlet_key: { name: Cloudlet, organization: Operator },
          cluster_key: { name: ClusterInst },
          developer: OrganizationName
        }
      },
    }
  })
}

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
      'AppName',
      'Version',
      'Operator',
      'Cloudlet',
      'ClusterInst',
      'CloudletLocation',
      'State',
      'Editable'
    ];
    if (toJson && toJson.length) {
      toJson.map((dataResult, i) => {

        if (dataResult.error || dataResult.message || !dataResult.data) {
          values.push({
            Region: '',
            OrganizationName: '',
            AppName: '',
            Version: '',
            Operator: '',
            Cloudlet: '',
            ClusterInst: '',
            CloudletLocation: '',
            URI: '',
            Liveness: '',
            Mapped_port: '',
            Flavor: '',
            State: '',
            Error: '',
            Runtime: '',
            Created: '',
            Progress: '',
            Edit: null,
            Status: '',
            Revision: ''
          })
        } else {
          let Index = i;
          let Region = body.region || body.params.region || '-';
          let DeveloperName = dataResult.data.key.app_key.organization || '-';
          let AppName = dataResult.data.key.app_key.name || '-';
          let Version = dataResult.data.key.app_key.version || '-';
          let Operator = dataResult.data.key.cluster_inst_key.cloudlet_key.organization || '-';
          let Cloudlet = dataResult.data.key.cluster_inst_key.cloudlet_key.name || '-';
          let CloudletLocation = dataResult.data.cloudlet_loc || '-';
          let ClusterInst = dataResult.data.key.cluster_inst_key.cluster_key.name || '-';
          let URI = dataResult.data.uri || '-';
          let liveness = dataResult.data.liveness || '-';
          let mapped_ports = dataResult.data.mapped_ports || '-';
          let flavor = dataResult.data.flavor.name || '-';
          let state = dataResult.data.state || '-';
          let error = dataResult.data.errors || '-';
          let runtime = dataResult.data.runtime_info || '-';
          let created = "seconds : " + dataResult.data.created_at.seconds || '-' + "     nanos : " + dataResult.data.created_at.nanos || '-';
          let Status = dataResult.data.status
          let Revision = dataResult.data.revision || '-';




          values.push({
            uuid: generateUniqueId(),
            Region: Region,
            OrganizationName: DeveloperName,
            AppName: AppName,
            Version: Version,
            Operator: Operator,
            Cloudlet: Cloudlet,
            ClusterInst: ClusterInst,
            CloudletLocation: CloudletLocation,
            URI: URI,
            Liveness: liveness,
            Mapped_port: mapped_ports,
            Flavor: flavor,
            State: state,
            Error: error,
            Runtime: runtime,
            Created: created,
            Progress: '',
            Edit: newRegistKey,
            Status: Status,
            Revision: Revision
          })
        }
      })
    } else {
      let newRegistKey = [
        'Region',
        'DeveloperName',
        'AppName',
        'Version',
        'Operator',
        'Cloudlet',
        'ClusterInst',
        'CloudletLocation'
      ];
      values.push({
        Region: '',
        OrganizationName: '',
        AppName: '',
        Version: '',
        Operator: '',
        Cloudlet: '',
        ClusterInst: '',
        CloudletLocation: '',
        Edit: newRegistKey
      })
    }
  }
  return values

}
