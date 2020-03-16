export const formatData = (datas) => {
    let result = datas;
    let values = [];
    if (result) {
        result.map((data, i) => {
            let dataResult = data.result || '-';
            let Index = i;
            let OperatorName = dataResult.key.name || '-';
            let newRegistKey = ['OperatorName'];

            values.push({ OperatorName: OperatorName, Edit: newRegistKey })
        })
    } else {
        console.log('there is no result')
    }
    return values
}
