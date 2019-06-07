var MC_URL = process.env.MC_URL;
import qs from "qs";

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('mex-ca.key', 'utf8');
var certificate = fs.readFileSync('mex-ca.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};


const express = require('express')
const cors = require('cors')
const app = express()
var port = 3030
var moment = require('moment');
const Influx = require('influxdb-nodejs');
const client = new Influx('https://uiteam:$word@mexdemo.influxdb.mobiledgex.net:8086/metrics');
const cluster = new Influx('https://uiteam:$word@mexdemo.influxdb.mobiledgex.net:8086/clusterstats');

const request = require('request');
import session from 'express-session'
import bodyParser from 'body-parser'
import axios from 'axios-https-proxy-fix';
import QL from 'influx-ql';

//import axios from 'axios-jsonp-pro';


///////////////////////////////////////////////////
/**
 * reference
 * https://expressjs.com/en/resources/middleware/cors.html
 **/
///////////////////////////////////////////////////

axios.defaults.withCredentials = true;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );

app.use(session({
    secret: 'dog vs cat',
    resave: true,
    saveUninitialized: false,
    rejectUnauthorized: false
}))


// Add headers
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin', 'X-Requested-With,content-type,Accept');
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
/******************************************************
 * TOTAL COUNTS
 * Page 2
 *Total Number of FindCloudlet

Total Number of VerifyLocation
Total Number of RegisterClient
Rate of FindCloudlet
Rate of  VerifyLocation
Rate of RegisterClient
Predictive QoE

http://yourDomain/total?methodName=FindCloudlet&cloudlet=barcelona-mexdemo
 ******************************************************/
 const retunDate = (str) => {
     var year = str.substring(0, 4);
     var month = str.substring(4, 6);
     var day = str.substring(6, 8);
     var hour = str.substring(8, 10);
     var minute = str.substring(10, 12);
     //var second = str.substring(12, 14);
     var date = new Date(year, month-1, day, hour, minute);
     return moment(date).format('YYYYMMDD hh:mm');
 }

 // http://yourdomain/total?service=frankfurt-cloudlet&fromTo=-32h&limit=30
 app.get('/total', (req, res, next) => {
     console.log('request total', req.query)


     var date = new Date();
     //var timeTo = date.toISOString()
     date.setTime(date.getTime() - 60000) // -1000000 :
     var timeFrom = date.toISOString()
        console.log('q time= ', timeFrom)


     let cloudletName = null;

     let limit = null;
     if(req.query.cloudlet){
         cloudletName = req.query.cloudlet;

     } else {
         return;

     }
     if(req.query.limit){
         limit = req.query.limit;
     } else {
         limit = 30;
     }
     client.query('dme-api')
         .addFunction('*')
         .where('cloudlet', cloudletName)
         .where('time', timeFrom, '>')
         .then(data => res.json(data))
         .catch(err => next(err))
 })
app.get('/total2', function(req, res) {

    client.query('dme-api')
        .set({limit: 30})
        .then(data => res.json(data))
        .catch(err => next(err))
})
 /******************************************************/




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


    var date = new Date();
    var timeTo = date.toISOString()
    date.setTime(date.getTime() - 1000000)
    var timeFrom = date.toISOString()

    console.log('request —— timeFrom', timeFrom, timeTo)
    console.log('request timeCluster---------', req.query)
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
        .where('time', timeFrom, '>')
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
        .addFunction('*') //select "column"
        .where('cluster', clusterName)
        .set({limit: 10})
        .then(
            data => res.json(data)
        )
        .catch(err => console.log(err))
})

app.get('/appInstanceList', (req, res, next) => {
    var date = new Date();
    var timeTo = date.toISOString()
    //date.setTime(date.getTime() + (1*60*60*1000)); //1시간 차이남 ?
    date.setTime(date.getTime() - 1000000)
    var timeFrom = date.toISOString()

    let clusterName = '';
    let appName = '';
    console.log('request appInstanceList—— times old n new', new Date(), timeFrom)
    if(req.query.cluster){
        clusterName = req.query.cluster;
        appName = req.query.app;
    }else{
        clusterName = 'tdg-barcelona-niantic';
        appName = '';
    }
    cluster.query('crm-appinst') // from "table"
        .addFunction('*') //select "column"
        .where('cluster', clusterName)
        .where('app', appName)
        .where('time', timeFrom, '>')
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
// app.get('/tcpudp', (req, res, next) => {
//     let clusterName = '';
//     let appName = '';
//     console.log('request tcp—— ', req.query)
//     if(req.query.cluster){
//         clusterName = req.query.cluster;
//         appName = req.query.app;
//     }else{
//         clusterName = 'tdg-barcelona-niantic';
//         appName = '';
//     }
//     cluster.query('crm-cluster') // from "table"
//         .addFunction(columnName[0]) //select "column"
//         .addFunction(columnName[1]) //select "column"
//         .where('cluster', clusterName)
//         .where('app', appName)
//         .where('time', timeFrom, '>')
//         .then(
//             data => res.json(data)
//         )
//         .catch(err => console.log(err))
// })
/*
curl -G 'http://mexdemo.influxdb.mobiledgex.net:8086/query'
--data-urlencode "u=uiteam"
--data-urlencode "p=pa$$word"
--data-urlencode "db=clusterstats"
--data-urlencode "q=select * from \"crm-appinst\" where \"app\" =~ /neon2/ AND \"cluster\" = 'tdg-barcelona-niantic' AND time > now() - 15m"
 */
app.get('/tcpudpCluster', (req, res, next) => {
    var date = new Date();
    var timeTo = date.toISOString()
    date.setTime(date.getTime() - 1000000)
    var timeFrom = date.toISOString()

    let clusterName = '';
    let appName = '';

    console.log('request tcp——>>--->>--->>--->> ', req.query)
    if(req.query.cluster){
        clusterName = req.query.cluster;
        appName = req.query.app;
    }else{
        clusterName = 'tdg-barcelona-niantic';
        appName = '';
    }

    cluster.query('crm-cluster') // from "table"
        .addFunction('*') //select "column"
        .where('cluster', clusterName)
        .where('time', timeFrom, '>')
        .then(
            data => res.json(data)
        )
        .catch(err => console.log(err))
})


/******************************************************
 * USER ACCOUNTS
 ******************************************************/


// const apiu = require('./routes/api');
// app.get('/account', apiu.echo);
//
// app.post('/account', apiu.echo);
// app.post('/account/create_user', apiu.create_user);
// app.post('/account/login_with_email_password', apiu.login_with_email_password);
// app.post('/account/login_with_token', apiu.login_with_token);
// app.post('/account/logout', apiu.logout)


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

/*****************************
 * 2019 04 04 Post MWC
 * mc.mobiledgex.net
 * Start Controller Manager
 ** ****************************/

const apiMC = require('./routes/apiMC');
apiMC.MC_URL = process.env.MC_URL;
app.post('/masterControl', apiMC.getToken);
app.post('/createUser', apiMC.createUser);
app.post('/UpdateVerify', apiMC.UpdateVerify);
app.post('/ResendVerify', apiMC.ResendVerify);

app.post('/createOrg', apiMC.CreateOrg);
app.post('/showOrg', apiMC.showOrg);
app.post('/ShowFlavor', apiMC.ShowFlavor);
app.post('/ShowClusterFlavor', apiMC.ShowClusterFlavor);
app.post('/ShowUsers', apiMC.ShowUsers);
app.post('/ShowAccounts', apiMC.showAccounts);
app.post('/ShowCloudlet', apiMC.ShowCloudlet);
app.post('/showController', apiMC.showController);
app.post('/ShowClusterInst', apiMC.ShowClusterInst);
app.post('/ShowClusterInsts', apiMC.ShowClusterInsts);
app.post('/ShowApps', apiMC.ShowApps);
app.post('/ShowApp', apiMC.ShowApp);
app.post('/ShowAppInst', apiMC.ShowAppInst);
app.post('/ShowAppInsts', apiMC.ShowAppInsts);

app.post('/create', apiMC.Create);
app.post('/CreateApp', apiMC.CreateApp);
app.post('/CreateAppInst', apiMC.CreateAppInst);
app.post('/addUserRole', apiMC.addUserRole);

app.post('/currentUser', apiMC.currentUser);

app.post('/CreateFlavor', apiMC.CreateFlavor);
app.post('/CreateClusterFlavor', apiMC.CreateClusterFlavor);
app.post('/CreateCloudlet', apiMC.CreateCloudlet);
app.post('/CreateClusterInst', apiMC.CreateClusterInst);

app.post('/ShowRole', apiMC.ShowRole);
/////
app.post('/deleteService', apiMC.DeleteService);
app.post('/deleteUser', apiMC.DeleteUser);
app.post('/deleteAccount', apiMC.DeleteAccount);
app.post('/deleteOrg', apiMC.DeleteOrg);

// mc-dev
app.post('/passwordresetrequest', apiMC.ResetPassword)
app.post('/newpass', apiMC.UpdatePassword)
/*
--auth-type=jwt --auth=$SUPERPASS
 */
// app.post('/showRole', (req, res, next) => {
//     let superpass = null;
//     if(req.body.serviceBody){
//         superpass = req.body.serviceBody.superuser;
//     }
//     console.log('***** get current user ... ', req.body.serviceBody)
//
//     if(req.body.serviceBody) {
//         axios.post(
//             mcUrl + '/api/v1/auth/role/show',
//             {},
//             {
//                 headers: {
//                     'Authorization':`Bearer ${superpass}`}
//             }
//         )
//             .then(function (response) {
//                 console.log('success get ..', response.data)
//                 res.json(response.data)
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     }
// });
// app.post('/showOrg', (req, res, next) => {
//     let superpass = null;
//     if(req.body.serviceBody){
//         superpass = req.body.serviceBody.superuser;
//     }
//     console.log('***** get current user ... ', req.body.serviceBody)
//
//     if(req.body.serviceBody) {
//         axios.post(
//             mcUrl + '/api/v1/auth/org/show',
//             {},
//             {
//                 headers: {
//                     'Authorization':`Bearer ${superpass}`}
//             }
//         )
//             .then(function (response) {
//                 console.log('success get ..', response.data)
//                 res.json(response.data)
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     }
// });

// http

//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
//var httpServer = http.createServer(app);
//httpServer.listen(8080);


// https
var host = '0.0.0.0';
if(process.argv.length > 2) {
    host = process.argv[2];
    if(process.argv.length > 3) {
        port = parseInt(process.argv[3], 10);
    }
}
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, host, () => console.log(`<< https >> app listening on ${host} port ${port}! MC_URL = ${MC_URL}`));
