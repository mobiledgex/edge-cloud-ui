

let memUsageListPerOneInstance = require('../Jsons/memUsage')



//console.log('sldkflskdflksdlfklsdkfk====>',memUsageListPerOneInstance);


let filteredAppInstanceList = memUsageListPerOneInstance.filter((item) => {
    if ( item.instance.Region ==='EU'){
        return item;
    }
});

console.log('filteredAppInstanceList====>',filteredAppInstanceList.length);
