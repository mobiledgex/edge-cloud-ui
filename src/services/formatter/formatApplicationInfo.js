export const formatData = (datas) => {
    let result = datas;
    let values = [];
    let formatMB = d3.format('.0f')
    if(result){
        result.map((data, i) => {
            console.log('...', data)
            data.series.map((obj) => {
                obj.values.map((value, j)=>{
                    if(j === 5){
                        console.log('before format --->', value[5])
                        value[5] = formatMB(value[5])
                        console.log('after format --->', value[5])
                    }
                })
            })
        })

    } else {
        console.log('there is no result')
    }
    values = datas
    return values
}
