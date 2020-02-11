export const getKey = (data) => {
    const { OrganizationName, AppName, Version, Region } = data
    return ({
        region: Region,
        app: {
            key: {
                developer_key: {
                    name: OrganizationName
                },
                name: AppName,
                version: Version
            }
        }
    })
}
/*
{
  "default_shared_volume_size": "",
  "access_ports": "",
  "default_flavor": {
    "name": ""
  },
  "official_fqdn": "",
  "scale_with_cluster": true,
  "image_path": "",
  "deployment_manifest": "",
  "image_type": "IMAGE_TYPE_UNKNOWN",
  "access_type": "ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT",
  "auto_prov_policy": "",
  "default_privacy_policy": "",
  "command": "",
  "deployment": "",
  "key": {
    "developer_key": {
      "name": "WonhoOrg1"
    },
    "name": "BICAPPINKI",
    "version": "1.0"
  }
}
 */
let newRegistKey = [
    'Region',
    'DeveloperName',
    'AppName',
    'Version',
    'DeploymentType',
    'ImageType',
    'ImagePath',
    'AuthPublicKey',
    'DefaultFlavor',
    'Ports',
    'DefaultFQDN',
    'PackageName',
    'ScaleWithCluster',
    'Command',
    'DeploymentMF',
    'Editable'
];

export const formatData = (datas, body) => {
    let values = [];
    if (datas.data) {
        let toArray = null;
        let toJson = [];

        if (typeof datas.data === 'object') {
            toJson.push((datas.data) ? datas.data : {});
        } else {
            toArray = datas.data.split('\n')
            toArray.pop();
            toJson = toArray.map((str) => (JSON.parse(str)))
        }
        if (toJson && toJson.length) {
            toJson.map((dataResult, i) => {
                if (dataResult.error || dataResult.message || !dataResult.data) {
                    values.push({
                        Region: '',
                        OrganizationName: '',
                        AppName: '',
                        Version: '',
                        DeploymentType: '',
                        ImageType: '',
                        ImagePath: '',
                        AuthPublicKey: '',
                        DefaultFlavor: '',
                        Ports: '',
                        DefaultFQDN: '',
                        PackageName: '',
                        // IpAccess:IpAccess,
                        //Cluster:Cluster,
                        ScaleWithCluster: '',
                        Command: '',
                        DeploymentMF: '',
                        Revision: '',
                        Edit: null

                    })
                } else {
                    let Index = i;
                    let Region = body.region || body.params.region || '-';
                    let DeveloperName = dataResult.data.key.developer_key.name || '-';
                    let AppName = dataResult.data.key.name || '-';
                    let Version = dataResult.data.key.version || '-';
                    let DeploymentType = dataResult.data.deployment || '-';
                    let Command = dataResult.data.command || '-';
                    let DeploymentMF = dataResult.data.deployment_manifest || '-';
                    let ImageType = dataResult.data.image_type || '-';
                    let ImagePath = dataResult.data.image_path || '-';
                    let DefaultFlavor = dataResult.data.default_flavor.name || '-';
                    let Ports = dataResult.data.access_ports || '-';
                    let AuthPublicKey = dataResult.data.auth_public_key || '-';
                    let ScaleWithCluster = dataResult.data.scale_with_cluster || false;
                    let DefaultFQDN = dataResult.data.official_fqdn || '-';
                    let PackageName = dataResult.data.android_package_name || '-';
                    let Revision = dataResult.data.revision || '-';
                    //let DeploymentGenerator = dataResult.deployment_generator || '-';



                    values.push({
                        Region: Region,
                        OrganizationName: DeveloperName,
                        AppName: AppName,
                        Version: Version,
                        DeploymentType: DeploymentType,
                        ImageType: ImageType,
                        ImagePath: ImagePath,
                        AuthPublicKey: AuthPublicKey,
                        DefaultFlavor: DefaultFlavor,
                        Ports: Ports,
                        DefaultFQDN: DefaultFQDN,
                        PackageName: PackageName,
                        // IpAccess:IpAccess,
                        //Cluster:Cluster,
                        ScaleWithCluster: ScaleWithCluster,
                        Command: Command,
                        DeploymentMF: DeploymentMF,
                        Revision: Revision,
                        Edit: newRegistKey
                    })
                }
            })
        } else {
            console.log('there is no result')
        }
    }
    return values

}