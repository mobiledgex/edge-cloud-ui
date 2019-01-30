const express = require('express')
const app = express()
const port = 3030
const Influx = require('influxdb-nodejs');
const client = new Influx('http://uiteam:$word@40.122.54.157:8086/metrics');
const cluster = new Influx('http://uiteam:$word@40.122.54.157:8086/clusterstats');
const fs = require('fs');
const request = require('request');
//
app.get('/', (req, res, next) => {
    client.query('dme-api')
        .set({limit: 10})
        .then(data => res.json(data))
        .catch(err => next(err))
})

app.get('/cluster', (req, res, next) => {
    console.log('request ---- cluster', req.query)
    cluster.query('crm-appinst')
        .set({limit: 10})
        .then(data => res.json(data))
        .catch(err => next(err))
})
app.get('/cluster', (req, res, next) => {
    console.log('request ---- cluster', req.query)
    cluster.query('crm-appinst')
        .set({limit: 10})
        .then(data => res.json(data))
        .catch(err => next(err))
})
//curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/cloudlet" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt

app.get('/compute', function(req, res){

    console.log('request ---- instance', req.query)
    let serviceName = ''
    if(req.query.service){
        serviceName = req.query.service;
    }
    request.post({
        url: 'https://mexdemo.ctrl.mobiledgex.net:36001/show/'+serviceName,
        agentOptions: {
            ca: fs.readFileSync('mex-ca.crt'),
            key: fs.readFileSync('mex-client.key')
        }

    }, function (error, response, body) {
        res.json(body)
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
