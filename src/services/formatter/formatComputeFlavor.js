
export const getKey = (data) => {
    const { FlavorName, Region } = data
    return ({
        region: Region,
        flavor: {
            key: {
                name: FlavorName
            }
        }
    })
}
export const formatData = (datas, body) => {
    let values = [];

    if (datas.data && datas.data.length > 0) {
        let toArray = null;
        let toJson = [];

        if (typeof datas.data === 'object') {
            toJson.push((datas.data) ? datas.data : {});
        } else {
            toArray = datas.data.split('\n')
            toArray.pop();
            toJson = toArray.map((str) => (JSON.parse(str)))
        }

        if (toJson) {
            toJson.map((dataResult, i) => {
                if (dataResult.error || dataResult.message) {
                    console.log("error")
                } else {
                    let Region = body.region || '-';
                    let FlavorName = dataResult.data.key.name || '-';
                    let RAM = dataResult.data.ram || '-';
                    let vCPUs = dataResult.data.vcpus || '-';
                    let Disk = dataResult.data.disk || '-';
                    let GPU = dataResult.data.opt_res_map ? 1 : 0;
                    let newRegistKey = ['Region', 'FlavorName', 'RAM', 'vCPUs', 'Disk', 'GPU'];
                    values.push({ Region: Region, FlavorName: FlavorName, RAM: RAM, vCPUs: vCPUs, Disk: Disk,GPU:GPU, Edit: newRegistKey })
                }

            })
        }
    }
    return values
}
