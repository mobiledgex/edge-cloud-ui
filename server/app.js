const express = require('express')
const app = express()
const port = 3030
const Influx = require('influxdb-nodejs');
const client = new Influx('http://uiteam:$word@40.122.54.157:8086/metrics');
const cluster = new Influx('http://uiteam:$word@40.122.54.157:8086/clusterstats');
const fs = require('fs');
const request = require('request');
import session from 'express-session'
import bodyParser from 'body-parser'
//

app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );

app.use(session({
    secret: 'dog vs cat',
    resave: true,
    saveUninitialized: false,
}))


// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

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



/******************************************************
//참고 : https://www.npmjs.com/package/influxdb-nodejs
*******************************************************/
//clusters cpu mem network
/*
curl -G 'http://40.122.54.157:8086/query'
--data-urlencode "u=uiteam"
--data-urlencode "p=pa$$word"
--data-urlencode "db=clusterstats"
--data-urlencode "q=select \"cpu\" from \"crm-cluster\" where \"cluster\" = 'tdg-barcelona-niantic'"
 */
app.get('/timeCluster', (req, res, next) => {



    let clusterName = ''
    if(req.query.cluster){
        clusterName = req.query.cluster;
    }else{
        clusterName = 'tdg-barcelona-niantic';
    }
    cluster.query('crm-cluster') // from "table"
        .addFunction('cluster') //select "column"
        .addFunction('cpu') //select "column"
        .addFunction('mem') //select "column"
        .addFunction('disk') //select "column"
        .addFunction('recvBytes') //select "column"
        .addFunction('sendBytes') //select "column"
        .where('cluster', clusterName)
        .set({limit: 30})
        .then(
            data => res.json(data)
        )
        .catch(err => console.log(err))
})

//crm-appinst
/*
curl -G 'http://mexdemo.influxdb.mobiledgex.net:8086/query'
--data-urlencode "u=uiteam"
--data-urlencode "p=pa$$word"
--data-urlencode "db=clusterstats"
--data-urlencode "q=select last(\"cpu\") from \"crm-appinst\" where \"app\" =~ /neon2/ AND \"cluster\" = 'tdg-barcelona-niantic'"
*/
app.get('/appInstance', (req, res, next) => {
    let clusterName = ''
    console.log('request appInstance—— cluster fix', req.query)
    if(req.query.cluster){
        clusterName = req.query.cluster;
    }else{
        clusterName = 'tdg-barcelona-niantic';
    }
    cluster.query('crm-appinst') // from "table"
        .addFunction('last', 'cpu') //select "column"
        .where('cluster', clusterName)
        .where('app', '~ /neon2/')
        .set({limit: 30})
        .then(
            data => res.json(data)
        )
        .catch(err => console.log(err))
})

app.get('/appInstanceList', (req, res, next) => {
    let clusterName = '';
    let appName = '';
    console.log('request appInstanceList—— cluster fix', req.query)
    if(req.query.cluster){
        clusterName = req.query.cluster;
        appName = req.query.app;
    }else{
        clusterName = 'tdg-barcelona-niantic';
        appName = 'neon2-deployment-6885d6b975-hpxdb';
    }
    cluster.query('crm-appinst') // from "table"
        .addFunction('*') //select "column"
        .where('cluster', clusterName)
        .where('app', appName)
        .set({limit: 30})
        .then(
            data => res.json(data)
        )
        .catch(err => console.log(err))
})

//tcp conn..timeSeries
/*
curl -G 'http://mexdemo.influxdb.mobiledgex.net:8086/query'
--data-urlencode "u=uiteam"
--data-urlencode "p=pa$$word"
--data-urlencode "db=clusterstats"
--data-urlencode "q=select tcpConns from \"crm-cluster\" where \"cluster\" = 'tdg-barcelona-niantic'"
*/
//일정 시간 간격으로 지표를 개별 요청
app.get('/tcpudp', (req, res, next) => {
    let clusterName = '';
    let columnName = '';
    console.log('request tcp—— ', req.query)
    if(req.query.cluster){
        clusterName = req.query.cluster;
        columnName = req.query.column;
    }else{
        clusterName = 'tdg-barcelona-niantic';
        columnName = 'tcpConns';
    }
    cluster.query('crm-cluster') // from "table"
        .addFunction(columnName[0]) //select "column"
        .addFunction(columnName[1]) //select "column"
        .where('cluster', clusterName)
        .set({limit: 30})
        .then(
            data => res.json(data)
        )
        .catch(err => console.log(err))
})
/*
curl -G 'http://mexdemo.influxdb.mobiledgex.net:8086/query'
--data-urlencode "u=uiteam"
--data-urlencode "p=pa$$word"
--data-urlencode "db=clusterstats"
--data-urlencode "q=select * from \"crm-cluster\" where \"cluster\" = 'tdg-barcelona-niantic' limit 1"
 */
app.get('/tcpudpCluster', (req, res, next) => {
    let clusterName = '';
    let limit = null;
    console.log('request tcp——>>--->>--->>--->> ', req.query)
    if(req.query.cluster){
        clusterName = req.query.cluster;
    }else{
        clusterName = 'tdg-barcelona-niantic';
    }
    if(req.query.limit) limit = parseInt(req.query.limit);
    cluster.query('crm-cluster') // from "table"
        .addFunction('*') //select "column"
        .where('cluster', clusterName)
        .set({limit: (limit)?limit:1})
        .then(
            data => res.json(data)
        )
        .catch(err => console.log(err))
})

/******************************************************
 * USER ACCOUNTS
 ******************************************************/


const apiu = require('./routes/api');
app.get('/account', apiu.echo);

app.post('/account', apiu.echo);
app.post('/account/create_user', apiu.create_user);
app.post('/account/login_with_email_password', apiu.login_with_email_password);
app.post('/account/login_with_token', apiu.login_with_token);
app.post('/account/logout', apiu.logout)

/******************************************************
 * Create new Application
 ******************************************************/
//curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/create/appinst"
// -H "accept: application/json"
// --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
// -H "Content-Type: application/json"
// -d "{ \"key\": { \"app_key\": { \"developer_key\": { \"name\": \"MobiledgeX SDK Demo\" }, \"name\": \"MobiledgeX SDK Demo\", \"version\": \"1.0\" }, \"cloudlet_key\": { \"operator_key\": { \"name\": \"TDG\" }, \"name\": \"bonn-mexdemo\" }, \"id\": \"123\" }}"
app.post('/register', function(req, res){

    console.log('registry ---- new instance', req.body)
    let serviceName = '';
    let serviceBody = {};
    if(req.body.service){
        serviceName = req.body.service;
        serviceBody = req.body.serviceBody;
    }
    request.post({
        url: 'https://mexdemo.ctrl.mobiledgex.net:36001/create/'+serviceName,
        agentOptions: {
            ca: fs.readFileSync('mex-ca.crt'),
            key: fs.readFileSync('mex-client.key')
        },
        body: JSON.stringify({ "key":
                {
                    "app_key":
                        { "developer_key":
                                { "name": serviceBody.DeveloperName },
                            "name": serviceBody.AppName,
                            "version": serviceBody.AppVer
                        },
                    "cloudlet_key":
                        { "operator_key":
                                { "name": serviceBody.OperatorName },
                            "name": serviceBody.CloudletName
                        },
                    "id": "123"
                }
        })


    }, function (error, response, body) {
        res.json(body)
    });
});
app.post('/delete', function(req, res){

    console.log('registry ---- delete instance', req.body)
    let serviceName = '';
    let serviceBody = {};
    if(req.body.service){
        serviceName = req.body.service;
        serviceBody = req.body.serviceBody;
    }
    request.post({
        url: 'https://mexdemo.ctrl.mobiledgex.net:36001/delete/'+serviceName,
        agentOptions: {
            ca: fs.readFileSync('mex-ca.crt'),
            key: fs.readFileSync('mex-client.key')
        },
        body: JSON.stringify({ "key":
                {
                    "app_key":
                        { "developer_key":
                                { "name": serviceBody.DeveloperName },
                            "name": serviceBody.AppName,
                            "version": serviceBody.AppVer
                        },
                    "cloudlet_key":
                        { "operator_key":
                                { "name": serviceBody.OperatorName },
                            "name": serviceBody.CloudletName
                        },
                    "id": "123"
                }
        })


    }, function (error, response, body) {
        res.json(body)
    });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
