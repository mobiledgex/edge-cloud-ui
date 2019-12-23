

let memUsageListPerOneInstance = require('../jsons/cpuUsage_100Count')


let filteredAppInstanceList = memUsageListPerOneInstance.filter((item) => {
    if ( item.instance.Cloudlet==='frankfurt-eu'){
        return item;
    }
});

console.log('filteredAppInstanceList====>',filteredAppInstanceList.length);
