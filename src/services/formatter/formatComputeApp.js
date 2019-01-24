/*
{
            "result": {
                "fields": [],
                "key": {
                    "developer_key": {
                        "name": "1000 Realities"
                    },
                    "name": "ThousandRealitiesApp",
                    "version": "1.0"
                },
                "image_path": "registry.mobiledgex.net:5000/1000realities/1000realitiesapp",
                "image_type": "ImageTypeDocker",
                "ip_access": "IpAccessDedicatedOrShared",
                "access_ports": "udp:8888,tcp:8889,tcp:8890",
                "config": "",
                "default_flavor": {
                    "name": "x1.small"
                },
                "cluster": {
                    "name": "mexdemo-app-cluster"
                },
                "app_template": "",
                "auth_public_key": "",
                "command": "",
                "annotations": "",
                "deployment": "kubernetes",
                "deployment_manifest": "apiVersion: v1\nkind: Service\nmetadata:\n  name: thousandrealitiesapp-tcp\n  labels:\n    run: thousandrealitiesapp\nspec:\n  type: LoadBalancer\n  ports:\n  - name: tcp8889\n    protocol: TCP\n    port: 8889\n    targetPort: 8889\n  - name: tcp8890\n    protocol: TCP\n    port: 8890\n    targetPort: 8890\n  selector:\n    run: thousandrealitiesapp\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: thousandrealitiesapp-udp\n  labels:\n    run: thousandrealitiesapp\nspec:\n  type: LoadBalancer\n  ports:\n  - name: udp8888\n    protocol: UDP\n    port: 8888\n    targetPort: 8888\n  selector:\n    run: thousandrealitiesapp\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: thousandrealitiesapp-deployment\nspec:\n  selector:\n    matchLabels:\n      run: thousandrealitiesapp\n  replicas: 1\n  template:\n    metadata:\n      labels:\n        run: thousandrealitiesapp\n    spec:\n      volumes:\n      imagePullSecrets:\n      - name: mexregistrysecret\n      containers:\n      - name: thousandrealitiesapp\n        image: registry.mobiledgex.net:5000/1000realities/1000realitiesapp\n        imagePullPolicy: Always\n        ports:\n        - containerPort: 8888\n          protocol: UDP\n        - containerPort: 8889\n          protocol: TCP\n        - containerPort: 8890\n          protocol: TCP\n",
                "deployment_generator": "kubernetes-basic",
                "android_package_name": "",
                "permits_platform_apps": false,
                "del_opt": "NoAutoDelete"
            }
        }
//

 */


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

let generateData = (datas) => {
    let result = datas.data.data;
    let values = [];
    if(result){
        result.map((data, i) => {
            let dataResult = data.result || '-';
            let Index = i;
            let DeveloperName = dataResult.key.name || '-';
            let DeveKey = dataResult.key.developer_key.name || '-';
            let Version = dataResult.key.version || '-';
            let Ip_access = dataResult.ip_access || '-';
            let Access_ports = dataResult.access_ports || '-';
            let Cluster = dataResult.cluster.name || '-';
            let Deployment = dataResult.deployment || '-';

            values.push({Index:Index, DeveloperName:DeveloperName, DeveKey:DeveKey, Version:Version, Ip_access:Ip_access, Access_ports:Access_ports, Cluster:Cluster, Deployment:Deployment})
        })
    } else {
        console.log('there is no result')
    }

    //ascending or descending

    //values.sort(numberDes);
    values.reverse();

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
