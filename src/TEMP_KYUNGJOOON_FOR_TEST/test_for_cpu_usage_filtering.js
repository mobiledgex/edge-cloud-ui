let appInstaceList = require('./appInstanceList.json')


let filteredAppInstanceList = appInstaceList.filter((item) => {

    if (item.Cloudlet==='frankfurt-eu'){
        console.log('CloudLet====>', item.Cloudlet + "-->" + item.ClusterInst);
    }

    //console.log('ClusterInst====>',item.ClusterInst);

});

console.log('filteredAppInstanceList====>', filteredAppInstanceList.length);
