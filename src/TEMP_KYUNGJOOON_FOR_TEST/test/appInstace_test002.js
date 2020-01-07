

let appinstanceListByRegions = require('../jsons/appinstanceListByRegionsUS')


let cloudletList=[]
appinstanceListByRegions.map(item=>{

    console.log('item====>',item.Cloudlet);
    cloudletList.push(item.Cloudlet)
})

console.log('cloudletList====>',cloudletList);


let uniqueArray = cloudletList.filter(function(item, pos) {
    return cloudletList.indexOf(item) == pos;
})

console.log('uniqueArray====>',uniqueArray);
