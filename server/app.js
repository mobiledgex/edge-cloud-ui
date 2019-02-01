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

//clusters cpu mem network
/*
curl -G 'http://40.122.54.157:8086/query'
--data-urlencode "u=uiteam"
--data-urlencode "p=pa$$word"
--data-urlencode "db=clusterstats"
--data-urlencode "q=select \"cpu\" from \"crm-cluster\" where \"cluster\" = 'tdg-barcelona-niantic'"
 */

/******************************************************
//참고 : https://www.npmjs.com/package/influxdb-nodejs
*******************************************************/

app.get('/timeCluster', (req, res, next) => {

    var date = new Date();
    var timeTo = date.toISOString()
    date.setTime(date.getTime() - 1000000)
    var timeFrom = date.toISOString()

    console.log('request —— timeFrom', timeFrom)
    console.log('request —— cluster', req.query)

    let clusterName = ''
    if(req.query.cluster){
        clusterName = req.query.cluster;
    }else{
        clusterName = 'tdg-barcelona-niantic';
    }
    cluster.query('crm-cluster') // from "table"
        .addFunction('cpu') //select "column"
        .addFunction('mem') //select "column"
        .addFunction('disk') //select "column"
        .addFunction('recvBytes') //select "column"
        .addFunction('sendBytes') //select "column"

        .where('cluster', clusterName)
        .where('time', timeFrom, '>')
        .set({limit: 30})
        .then(
            data => res.json(data)
        )
        .catch(err => next(err))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
