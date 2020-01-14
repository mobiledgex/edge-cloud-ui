
let seriesList = cpuUsageList.data[0].Series;
let seriesList2 = memUsageList.data[0].Series;

let mergedList = seriesList.concat(seriesList2);

mergedList.map(item => {

    //console.log('sdlkfsldkflksdflksdlfk===>', item);

    console.log('appName===>', item.values[0][1]);
    console.log('cpuUsage===>', item.values[0][4]);
    console.log('dev===>', item.values[0][5]);

})


console.log(JSON.stringify(response.data, null, "  "));
