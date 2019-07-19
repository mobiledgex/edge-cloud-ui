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

let generateData = (datas,body) => {
    console.log('format data cluster- ', datas)
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
    console.log("tojson!!",toJson)
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
const FormatComputeCluster = (props,body) => (
    generateData(props,body)
)

export default FormatComputeCluster;
