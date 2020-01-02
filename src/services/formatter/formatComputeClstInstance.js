import {generateUniqueId} from '../serviceMC';

/*Used as delete and streaming request parameters*/
export const key = (data) => {
    const { Cloudlet, Flavor, ClusterName, OrganizationName, Operator, Region } = data;  
    return ({
        region: Region,
        clusterinst: {
            key: {
                cluster_key: { name: ClusterName },
                cloudlet_key: { operator_key: { name: Operator }, name: Cloudlet },
                developer: OrganizationName
            },
            flavor: { name: Flavor }
        }
    })
}

let formatData = (datas,body) => {
    let values = [];
    let toArray = null;
    let toJson = [];
    if(datas.data) {
        if(typeof datas.data === 'object') {
            toJson.push((datas.data)?datas.data:{});
        } else {
            toArray = datas.data.split('\n')
            toArray.pop();
            toJson = toArray.map((str)=>(JSON.parse(str)))
        }
    }else {
        toJson = null;
    }
    
    let newRegistKey = ['Region', 'ClusterName', 'OrganizationName', 'Operator', 'Cloudlet', 'Flavor', 'IpAccess', 'Number_of_Master', 'Number_of_Node', 'CloudletLocation'];
    if(toJson && toJson.length){
        toJson.map((dataResult, i) => {
            if(dataResult.error || dataResult.message || !dataResult.data) {
                values.push({
                    Region:'',
                    ClusterName:'',
                    OrganizationName:'',
                    Operator:'',
                    Cloudlet:'',
                    Flavor:'',
                    IpAccess:'',
                    CloudletLocation:'',
                    State:'',
                    Progress:'',
                    Status:'',
                    Edit:null})
            } else {
                let Index = i;
                let Region = body.region || body.params.region || '-';
                let ClusterName = dataResult.data.key.cluster_key.name  || '-';
                let DeveloperName = dataResult.data.key.developer || '-';
                let Operator = dataResult.data.key.cloudlet_key.operator_key.name  || '-';
                let Cloudlet = dataResult.data.key.cloudlet_key.name  || '-';
                let Flavor = dataResult.data.flavor.name || '-';
                let IpAccess = dataResult.data.ip_access || '-';
                let NodeFlavor = dataResult.data.node_flavor || '';
                let NumMasters = dataResult.data.num_masters || '';
                let NumNodes = dataResult.data.num_nodes || '';
                let State = dataResult.data.state || '';
                let CloudletLocation = '-';
                let Status = dataResult.data.status;
                let Deployment = dataResult.data.deployment;


                values.push({uuid:generateUniqueId(),Region:Region, ClusterName:ClusterName, OrganizationName:DeveloperName, Operator:Operator, Cloudlet:Cloudlet, Flavor:Flavor, IpAccess:IpAccess, CloudletLocation:CloudletLocation, State:State, Progress:'', Status:Status, Deployment:Deployment, Edit:newRegistKey})

            }
        })
    } else {
        values.push({Region:''})
    }
    return values
}

const FormatComputeClstInst = (props,body) => (
    formatData(props,body)
)

export default FormatComputeClstInst;
