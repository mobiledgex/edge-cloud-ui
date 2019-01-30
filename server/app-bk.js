const express = require('express')
const app = express()
const port = 3030
const Influx = require('influxdb-nodejs');
const client = new Influx('http://uiteam:$word@40.122.54.157:8086/metrics');


const queryClient = function() {
    let result = null;
    client.query('dme-api')
        .set({limit: 10})
        .then((data) => {
            console.log('data == '+JSON.stringify(data))
            result = data;
        })

    return result;
}
app.get('/', (req, res) => res.send(
        {data:{result:queryClient()}}

    ))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
