import sha256 from 'sha256'


import axios from "axios-https-proxy-fix";
import qs from "qs";
import requestIp from 'request-ip';

const API_KEY = '__apiMC_key__'
let mcUrl = 'https://mc.mobiledgex.net:9900';
let mcDevUrl = 'https://mc-stage.mobiledgex.net:9900';
let _version = 'v0.0.0';


//app instances
exports.ShowappHealth = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'US'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    //console.log('20190729 show me appinst health-- ', JSON.stringify(serviceBody), 'mcUrl=',mcUrl )
    axios.post(mcUrl + '/api/v1/auth/metrics/app', serviceBody,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('20190719 success show appinst', response.data)
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {
                res.json({error:'Request failed'})
            }
        })
        .catch(function (error) {
            console.log('error show ..', String(error));
            res.json({error:'Request failed'})
        });
}


/*
http --auth-type=jwt --auth=$WORKER1TOKEN POST 127.0.0.1:9900/api/v1/auth/metrics/app <<<
'{"region":"local",
   "appinst":{
        "app_key":{
            "developer_key":{"name":"MobiledgeX"},
            "name":"facedetectiondemo",
            "version":"1.0"
        },
        "cluster_inst_key":{
            "cluster_key":{"name":"AppCluster"},
            "cloudlet_key":{"operator_key":{"name":""}}
        }
    },
    "selector":"connections",
    "last":5
}'

http --auth-type=jwt --auth=$SUPERPASS POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/metrics/app <<< '{"region":"EU","appinst":{"app_key":{"developer_key":{"name":"MobiledgeX"},"name":"MEXPrometheusAppName","version":"1.0"},"cluster_inst_key":{"cluster_key":{"name":"kkkkkkk"},"cloudlet_key":{"operator_key":{"name":"frankfurt-eu"}}}},"selector":"connections","last":5}'
 */
exports.ShowappConnection = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'US'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    axios.post(mcUrl + '/api/v1/auth/metrics/app', serviceBody,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('20190719 success  ShowappConnection', qs.parse(response.data))
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('ShowappConnection empty')
                res.json(null)

            } else {
                res.json({error:'Request failed'})
            }
        })
        .catch(function (error) {
            console.log('error ShowappConnection ..', String(error));
            res.json({error:'Request failed'})
        });
}

/*
http --verify=false --auth-type=jwt --auth=$SUPERPASS POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/metrics/cloudlet <<<  '{"region":"EU","cloudlet":{"operator_key":{"name":"TDG"},"name":"frankfurt-eu"},"selector":"utilization","last":2}'
 */
exports.ShowcloudletHealth = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'US'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('20190730 show me cloudlet health-- ', JSON.stringify(serviceBody), 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/metrics/cloudlet', serviceBody,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('20190923 success show cloudlet', response.data)
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {
                res.json({error:'Request failed'})
            }
        })
        .catch(function (error) {
            console.log('error show ..', String(error));
            res.json({error:'Request failed'})
        });
}

/*
$ http --verify=false --auth-type=jwt --auth=$SUPERPASS POST
https://mc-stage.mobiledgex.net:9900/api/v1/auth/metrics/cluster <<<
'{"region":"EU","clusterinst":{"cluster_key":{"name":"asdfqqq"},"cloudlet_key":{"operator_key":{"name":"TDG"},"name":"frankfurt-eu"},"developer":"MobiledgeX"},"selector":"cpu","last":2}'
 */
exports.ShowclusterHealth = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'US'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('20190730 show me cloudlet health-- ', JSON.stringify(serviceBody), 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/metrics/cluster', serviceBody,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('20190923 success show clusterinst', response.data)
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {
                res.json({error:'Request failed'})
            }
        })
        .catch(function (error) {
            console.log('error show ..', String(error));
            res.json({error:'Request failed'})
        });
}
//Create Cloudlet
exports.CreateCloudlet = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('Create me cloudlet-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateCloudlet', serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Create cloudlet', response.data)

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({'message':'ok'})
            }
        })
        .catch(function (error) {
            console.log('error show ...', error.response.data.message);
            res.json({error:String(error.response.data.message)})
        });
}
exports.getClientIP = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    // const forwarded = req.headers['x-forwarded-for']
    // const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
    // console.log('get client ip -- ', ip, 'forwarded=',forwarded, ":", req.connection.remoteAddress)
    // const realIP = req.headers['x-real-ip']
    // console.log('get client realIP -- ', realIP)


        var clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1
        //next();
    console.log('request ip == ', clientIp)

    res.json({clientIp:clientIp})
}

