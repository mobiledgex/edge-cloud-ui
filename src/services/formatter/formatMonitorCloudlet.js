import * as moment from 'moment';

/*
{alarm:'3', dName:'Cluster-A', values:{cpu:35, mem:55, sys:33}}
 */
export const formatData = (datas) => {
    let values = [];
    if (datas.data) {
        let result = datas.data.data[0].Series[0];
        if (result) {
            let _name = '';
            let dataSeries = result.values;
            let dataColumns = result.columns;
            let infoData = [];
            let lastItem = null;
            if (dataSeries.length) {
                dataSeries.map((item, i) => {
                    //console.log('20190930 item -- ', item, ":",  dataColumns, ':name=', _name)
                    _name = dataColumns[i]
                    // time, cluster, cpu, disk, mem, recvBytes, sendBytes
                    if (lastItem !== item[0]) {
                        infoData = item;
                        let valueObj = {};
                        item.map((val, j) => {
                            valueObj[dataColumns[j]] = item[j];
                        });
                        values.push({
                            name: dataColumns[1],
                            values: {
                                time: moment(item[0]).utc().format(),
                                cmsn: valueObj
                            }
                        })
                    }
                    lastItem = item[0]

                })
            }
        }
    }
    return values
}