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
    console.log('format data cluster- ', datas)
    let result = datas;
    let values = [];
    //20190409 transition string to json
    let toArray = datas.data.split('\n')
    let toJson = toArray.map((str)=>(JSON.parse(str)))
    console.log("tojson!!",toJson)
    if(toJson){
        toJson.map((dataResult, i) => {
            if(dataResult.message) {

            } else {
            let Index = i;
            let ClusterFlavor = dataResult.key.name  || '-';
            let MasterFlavor = dataResult.master_flavor.name  || '-';
            let NumberOfMasterNode = dataResult.num_masters  || '-';
            let NodeFlavor = dataResult.node_flavor.name  || '-';
            let NumberOfNode = dataResult.num_nodes || '-';
            let MaximumNodes = dataResult.max_nodes || '-';

            let newRegistKey = ['ClusterFlavor', 'MasterFlavor', 'NumberOfMasterNode', 'NodeFlavor', 'NumberOfNode', 'MaximumNodes'];
            values.push({ClusterFlavor:ClusterFlavor, MasterFlavor:MasterFlavor, NumberOfMasterNode:NumberOfMasterNode, NodeFlavor:NodeFlavor, NumberOfNode:NumberOfNode, MaximumNodes:MaximumNodes, Edit:newRegistKey})
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
const FormatComputeCluster = (props) => (
    generateData(props)
)

export default FormatComputeCluster;
