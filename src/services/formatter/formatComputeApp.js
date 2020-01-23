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
{ key:
   { developer_key: { name: 'bicinkiOrg' },
     name: 'bicTestApp',
     version: '1.0.0' },
  image_path: 'registry.mobiledgex.net:5000/mobiledgex/simapp',
  image_type: 1,
  access_ports: 'udp:12001,tcp:80,http:7777',
  default_flavor: { name: 'x1.medium' },
  cluster: { name: 'biccluster' },
  command: 'simapp -port 7777',
  deployment: 'kubernetes',
  deployment_manifest:
   'apiVersion: v1\nkind: Service\nmetadata:\n  name: bictestapp-tcp\n  labels:\n    run: bictestapp\nspec:\n  type: LoadBalancer\n  ports:\n  - name: tcp80\n    protocol: TCP\n    port: 80\n    targetPort: 80\n  - name: http7777\n    protocol: TCP\n    port: 7777\n    targetPort: 7777\n  selector:\n    run: bictestapp\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: bictestapp-udp\n  labels:\n    run: bictestapp\nspec:\n  type: LoadBalancer\n  ports:\n  - name: udp12001\n    protocol: UDP\n    port: 12001\n    targetPort: 12001\n  selector:\n    run: bictestapp\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: bictestapp-deployment\nspec:\n  selector:\n    matchLabels:\n      run: bictestapp\n  replicas: 1\n  template:\n    metadata:\n      labels:\n        run: bictestapp\n    spec:\n      volumes:\n      imagePullSecrets:\n      - name: mexregistrysecret\n      containers:\n      - name: bictestapp\n        image: registry.mobiledgex.net:5000/mobiledgex/simapp\n        imagePullPolicy: Always\n        ports:\n        - containerPort: 12001\n          protocol: UDP\n        - containerPort: 80\n          protocol: TCP\n        - containerPort: 7777\n          protocol: TCP\n        command:\n        - "simapp"\n        - "-port"\n        - "7777"\n',
  deployment_generator: 'kubernetes-basic' }

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

    if (datas.data && datas.data.length > 0) {
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