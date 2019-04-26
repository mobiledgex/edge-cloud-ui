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
let generateData = (datas) => {
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

    console.log("Apptojson!!",toJson)
    if(toJson){
        toJson.map((dataResult, i) => {
            if(dataResult.message) {

            } else {
                console.log("gogogo@#@")
                let Index = i;
                let Region = dataResult.key.region || 'US';
                let DeveloperName = dataResult.key.developer_key.name || '-';
                let AppName = dataResult.key.name || '-';
                let Version = dataResult.key.version || '-';
                let ImagePath = dataResult.image_path || '-';
                let DeploymentType = dataResult.deployment || '-';
                let Command = dataResult.Command || '-';
                let DeploymentMF = dataResult.deployment_manifest || '-';
                let ImageType = dataResult.image_type || '-';
                let DefaultFlavor = dataResult.default_flavor.name || '-';
                let Ports = dataResult.access_ports || '-';
                let Cluster = dataResult.cluster.name || '-';
                
                let DeploymentGenerator = dataResult.deployment_generator || '-';

                let newRegistKey = [
                    'Region',
                    'DeveloperName',
                    'AppName',
                    'Version',
                    'ImagePath',
                    'DeploymentType',
                    'ImageType',
                    'DefaultFlavor',
                    'Ports',
                    'Cluster',
                    'Command',
                    'DeploymentMF',
                ];

                values.push({
                    Region:Region,
                    DeveloperName:DeveloperName,
                    AppName:AppName,
                    Version:Version,
                    ImagePath:ImagePath,
                    DeploymentType:DeploymentType,
                    ImageType:ImageType,
                    DefaultFlavor:DefaultFlavor,
                    Ports:Ports,
                    Cluster:Cluster,
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
const formatComputeApp = (props) => (
    generateData(props)
)

export default formatComputeApp;
