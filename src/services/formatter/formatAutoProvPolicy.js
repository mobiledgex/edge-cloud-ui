import { generateUniqueId } from '../serviceMC';

export const getKey = (data) => {
  const { OrganizationName, AppName, Version, Operator, Cloudlet, ClusterInst, Region } = data
  return ({
    region: Region,
    appinst: {
      key: {
        app_key: { developer_key: { name: OrganizationName }, name: AppName, version: Version },
        cluster_inst_key: {
          cloudlet_key: { name: Cloudlet, operator_key: { name: Operator } },
          cluster_key: { name: ClusterInst },
          developer: OrganizationName
        }
      },
    }
  })
}
/*
{
  "data": {
    "key": {
      "app_key": {
        "developer_key": {
          "name": "MobiledgeX"
        },
        "name": "MEXPrometheusAppName",
        "version": "1.0"
      },
      "cluster_inst_key": {
        "cluster_key": {
          "name": "bickh123"
        },
        "cloudlet_key": {
          "operator_key": {
            "name": "TDG"
          },
          "name": "mexplat-stage-hamburg-cloudlet"
        },
        "developer": "MobiledgeX"
      }
    },
    "cloudlet_loc": {
      "latitude": 55,
      "longitude": 44,
      "timestamp": {}
    },
    "uri": "bickh123.mexplat-stage-hamburg-cloudlet.tdg.mobiledgex.net",
    "liveness": "LivenessStatic",
    "mapped_ports": null,
    "flavor": {
      "name": "x1.medium"
    },
    "state": "DeleteError",
    "errors": [
      "Delete App Inst failed: error deleting helm chart, KUBECONFIG=bickh123.TDG.kubeconfig helm delete --purge mexprometheusappname, Error: release: \"mexprometheusappname\" not found, Process exited with status 1"
    ],
    "runtime_info": {},
    "created_at": {
      "seconds": 1558940545,
      "nanos": 950911983
    }
  }
}
 */

// {"data":{"key":{"developer":"ldevorg","name":"AutoPolicy"},"deploy_client_count":10,"deploy_interval_count":3,"cloudlets":[{"key":{"operator_key":{"name":"TDG"},"name":"automationMunichCloudlet"},"loc":{"latitude":48.1351253,"longitude":11.5819806}}]}}
// {"data":{"key":{"developer":"ldevorg","name":"TestAutoPolicy"},"deploy_client_count":1,"deploy_interval_count":1,"cloudlets":[{"key":{"operator_key":{"name":"TDG"},"name":"automationMunichCloudlet"},"loc":{"latitude":48.1351253,"longitude":11.5819806}}]}}
// {"data":{"key":{"developer":"testing","name":"TestAuto"},"deploy_client_count":1}}
// {"data":{"key":{"developer":"testing","name":"TestAutoPolicy"},"deploy_client_count":1,"deploy_interval_count":1}}

export const formatData = (datas, body) => {

  let values = [];
  if (datas.data && datas.data.length > 0) {
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
