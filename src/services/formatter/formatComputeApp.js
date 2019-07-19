import * as moment from 'moment';
let trimData = (datas) => {
    let newData = datas.splice(0,1);
    return datas ;
}
const week_kr = ["월","화","수","목","금","토","일"]
let week = moment().format('E');
let getWeek = week_kr[(week-1)];
const numberDes =(a,b)=> (
    b-a
)

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
    'DefaultFlavor',
    'Ports',
    // 'IpAccess',
    //'Cluster',
    'Command',
    'DeploymentMF',
];
let generateData = (datas,body) => {
    console.log('format data apps - ', JSON.stringify(datas.data))
    let values = [];
    let toArray = null;
    let toJson = [];
 
    if(typeof datas.data === 'object') {
        toJson.push((datas.data)?datas.data:{});
    } else {
        toArray = datas.data.split('\n')
        toArray.pop();
        toJson = toArray.map((str)=>(JSON.parse(str)))
    }

    console.log("Apptojson!!",toJson, body)
    if(toJson && toJson.length){
        toJson.map((dataResult, i) => {
            if(dataResult.error || dataResult.message || !dataResult.data) {
                console.log("20190712 error")
                values.push({
                    Region:'',
                    OrganizationName:'',
                    AppName:'',
                    Version:'',
                    DeploymentType:'',
                    ImageType:'',
                    ImagePath:'',
                    DefaultFlavor:'',
                    Ports:'',
                    // IpAccess:IpAccess,
                    //Cluster:Cluster,
                    Command:'',
                    DeploymentMF:'',
                    Edit:null

                })
            } else {
                console.log("gogogo@#@")
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
                //let DeploymentGenerator = dataResult.deployment_generator || '-';



                values.push({
                    Region:Region,
                    OrganizationName:DeveloperName,
                    AppName:AppName,
                    Version:Version,
                    DeploymentType:DeploymentType,
                    ImageType:ImageType,
                    ImagePath:ImagePath,
                    DefaultFlavor:DefaultFlavor,
                    Ports:Ports,
                    // IpAccess:IpAccess,
                    //Cluster:Cluster,
                    Command:Command,
                    DeploymentMF:DeploymentMF,
                    Edit:newRegistKey
                })
            }
        })
    } else {
        console.log('there is no result')
    }

    //ascending or descending

    //values.sort(numberDes);
    //values.reverse();

    return values

}
const retunDate = (str) => {
    var year = str.substring(0, 4);
    var month = str.substring(4, 6);
    var day = str.substring(6, 8);
    var hour = str.substring(8, 10);
    var minute = str.substring(10, 12);
    //var second = str.substring(12, 14);
    var date = new Date(year, month-1, day, hour, minute);
    return moment(date).format('hh:mm');
}
const formatComputeApp = (props,body) => (
    generateData(props,body)
)

export default formatComputeApp;
