export const getKey = (data) => {
    const { OrganizationName, AppName, Version, Region } = data
    return ({
        region: Region,
        app: {
            key: {
                organization: OrganizationName,
                name: AppName,
                version: Version
            }
        }
    })
}

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
                    let DeveloperName = dataResult.data.key.organization || '-';
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