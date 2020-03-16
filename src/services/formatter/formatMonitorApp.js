
import * as moment from 'moment';

/*
columns =
0: "time"
1: "app"
2: "cloudlet"
3: "cluster"
4: "cpu"
5: "dev"
6: "operator"
 */
export const formatData = (datas) => {
    let values = [];
    try {
        if (datas.data) {
            if (datas.data.data.length > 0) {
                if (datas.data.data[0].Series.length > 0) {
                    let result = datas.data.data[0].Series[0];
                    if (result) {
                        let _name = result.name;
                        let dataSeries = result.values;
                        let dataColumns = result.columns;
                        let infoData = [];
                        let lastItem = null;
                        if (dataSeries.length) {
                            //remove duplicated data

                            dataSeries.map((item) => {
                                // time, cluster, cpu, disk, mem, recvBytes, sendBytes
                                if (lastItem !== item[0]) {
                                    infoData = item;
                                    values.push({
                                        name: _name,
                                        alarm: infoData[2],
                                        dName: infoData[1],
                                        values: {
                                            time: moment(item[0]).utc().local().format(),
                                            cluster: infoData[3],
                                            cmsn: (_name.indexOf('cpu') > -1) ? infoData[4] : (_name.indexOf('mem') > -1) ? infoData[5] : (_name.indexOf('connections') > -1) ? infoData : [infoData[6], infoData[7]]
                                        }
                                    })
                                }

                                lastItem = item[0];
                            })
                        }
                    } else {
                        console.log('there is no result')
                    }
                    values = values.reverse();
                }
            }
        }
    }
    catch (error) {
    }
    return values
}