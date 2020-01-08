export const formatData = (datas,body) => {
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
    if(toJson){
        toJson.map((dataResult, i) => {
            if(dataResult.message) {
                values.push({Region:'', ClusterFlavor:'', MasterFlavor:'', NumberOfMasterNode:'', NodeFlavor:'', NumberOfNode:'', MaximumNodes:'', Edit:null})
            } else {
            let Index = i;
            let Region = body.region || '-';
            let ClusterFlavor = dataResult.data.key.name  || '-';
            let MasterFlavor = dataResult.data.master_flavor.name  || '-';
            let NumberOfMasterNode = dataResult.data.num_masters  || '-';
            let NodeFlavor = dataResult.data.node_flavor.name  || '-';
            let NumberOfNode = dataResult.data.num_nodes || '-';
            let MaximumNodes = dataResult.data.max_nodes || '-';

            let newRegistKey = ['Region', 'ClusterFlavor', 'MasterFlavor', 'NumberOfMasterNode', 'NodeFlavor', 'NumberOfNode', 'MaximumNodes'];
            values.push({Region:Region, ClusterFlavor:ClusterFlavor, MasterFlavor:MasterFlavor, NumberOfMasterNode:NumberOfMasterNode, NodeFlavor:NodeFlavor, NumberOfNode:NumberOfNode, MaximumNodes:MaximumNodes, Edit:newRegistKey})
            }
        })
    } else {
        let newRegistKey = ['Region', 'ClusterFlavor', 'MasterFlavor', 'NumberOfMasterNode', 'NodeFlavor', 'NumberOfNode', 'MaximumNodes'];
        values.push({Region:'', ClusterFlavor:'', MasterFlavor:'', NumberOfMasterNode:'', NodeFlavor:'', NumberOfNode:'', MaximumNodes:'', Edit:newRegistKey})
    }
    return values
}
