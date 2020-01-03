
export const getKey =(data) =>{
    const { FlavorName, Region } = data
    return({ 
        region: Region, 
        flavor: { 
            key: { 
                name: FlavorName 
            } 
        } 
    })
}
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
            if(dataResult.error || dataResult.message) {
                console.log("error")
            } else {
                let Index = i;
                let Region = body.region || '-';
                let FlavorName = dataResult.data.key.name || '-';
                let RAM = dataResult.data.ram || '-';
                let vCPUs = dataResult.data.vcpus || '-';
                let Disk = dataResult.data.disk || '-';
                let newRegistKey = ['Region', 'FlavorName', 'RAM', 'vCPUs', 'Disk'];

                values.push({Region:Region, FlavorName:FlavorName, RAM:RAM, vCPUs:vCPUs, Disk:Disk, Edit:newRegistKey})
            }

        })
    } else {
        let newRegistKey = ['Region', 'FlavorName', 'RAM', 'vCPUs', 'Disk'];
        //values.push({Region:'', FlavorName:'', RAM:'', vCPUs:'', Disk:'', Edit:newRegistKey})
    }
    return values
}
