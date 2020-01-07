import sha256 from 'sha256'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

import axios from "axios-https-proxy-fix";
import qs from "qs";
import fs from "fs";
import shell from 'shelljs';
import estream from 'event-stream';
import {inspect} from 'util'

const API_KEY = '__apiMC_key__'
let mcUrl = 'https://mc.mobiledgex.net:9900';
let mcDevUrl = 'https://mc-stage.mobiledgex.net:9900';
let _version = 'v0.0.0';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();


console.log("how fast...", process.env.MC_URL)
let _io = null;
exports.setIo = (io) => {
    console.log('set io -- ')
    _io = io
}

function responseError(res, error) {
    if(error.response && error.response.statusText.indexOf('Bad') > -1) {
        res.json({error:error.response.statusText})
    } else {
        res.json({error:'Execution Of Request Failed'})
    }
}

function responseLoginError(res, error) {
    if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
        res.json({error:'Login Timeout Expired.<br/>Please login again'})
    } else {
        res.json({error:String(error.response.data.message)})
    }
}

// create user
exports.getToken = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
  let serviceName = '';
  let serviceBody = {};

  if(req.body.service){
    serviceName = req.body.service;
    serviceBody = req.body.serviceBody;
  }
  console.log('Please waite loading token... ', mcUrl)
  axios.post(mcUrl + '/api/v1/login', qs.stringify({
        username: serviceBody.username,
        password: serviceBody.password
      }),

  )
      .then(function (response) {
        console.log('success get pub token..', response.data)
        if(response.data && response.statusText === 'OK') {
          res.json(response.data)
        } else if(response.statusText === 'OK'){
            console.log('empty')
            res.json(null)
        }
      })
      .catch(function (error) {
        console.log('If you incorrect info give to ...',error.response.data);
          res.json(error.response.data)
      });
}
/*
http -j POST 127.0.0.1:9900/api/v1/usercreate name=me email=me@gmail.com
passhash=test1234
verify:='{
    "callbackurl": "http://console.mobiledgex.net/verify",
    "operatingsystem":"mac OSX",
    "browser":"httpie",
    "clientip":"127.0.0.1"
}'
 */
exports.createUser = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let emailEncode = '';
  if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
  }
  console.log('create user.. ',emailEncode, mcUrl)
  axios.post(mcUrl + '/api/v1/usercreate', qs.stringify({
        name: serviceBody.name,
        passhash: serviceBody.password,
        email: serviceBody.email,
        callbackurl: serviceBody.callbackurl,
        operatingsystem:serviceBody.clientSysInfo.os.name,
        browser:serviceBody.clientSysInfo.browser.name,
        clientip:serviceBody.clientSysInfo.clientIP
      },
      {headers: {'Content-Type':'application/json; charset=utf-8'}})

  )
      .then(function (response) {
        console.log('success create user..', response.data)
        if(response.data && response.statusText === 'OK') {
          res.json(response.data)
        } else if(response.statusText === 'OK'){
            console.log('empty')
            res.json(null)
        }
      })
      .catch(function (error) {
        let errMsg = qs.parse(error);
          console.log('error create user **************** ***',errMsg.response.data);
          res.json( errMsg.response.data )
      });

}


exports.currentUser = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
    }
    console.log('current user.. ', mcUrl, ":", superpass)
    axios.post(mcUrl + '/api/v1/auth/user/current', qs.stringify({

        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success current user..',response.data)
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
                // test expired
                //res.json({message:'Certificated has expired'})
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {
                res.json({message:'Retry'})
            }
        })
        .catch(function (error) {
            console.log('get user info error......', error.data);

            responseLoginError(res, error)
        });

}
exports.showAccounts = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
    }
    console.log('show user accounts.. ', mcUrl)
    axios.post(mcUrl + '/api/v1/auth/user/show', qs.stringify({

        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show account user..')
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {
                res.json({error:'error...'})
            }
        })
        .catch(function (error) {
            console.log('user account error......',Object.keys(error), error.response.data);
            responseLoginError(res, error)
        });
}
exports.showController = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
    }
    console.log('showController .. ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/controller/show', qs.stringify({

        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success showController..')
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {

            }
        })
        .catch(function (error) {
            console.log('error  showController...', error.response.data.message);
            responseLoginError(res, error)
        });
}

exports.showOrg = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
    }
    console.log('show org-- ', 'mc_url = ', mcUrl,'process.env.MC_URL = ', process.env.MC_URL)
    axios.post(mcUrl + '/api/v1/auth/org/show', qs.stringify({

        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show org')
            if(response.data && response.data.length > 0) {
                res.json(response.data)
            } else {
                res.json({error:'No records available'})
            }
        })
        .catch(function (error) {
            // console.log('error show org..', String(error));
            console.log('error show showOrg...', error.response.data.message);
            responseLoginError(res, error)
        });
}


/*
http --auth-type=jwt --auth=$SUPERPASS POST 127.0.0.1:9900/api/v1/auth/ctrl/ShowFlavor region=local

 */
//Flavor
exports.ShowFlavor = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me flavor-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowFlavor', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show flavor')
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ShowFlavor..', String(error));
            res.json({error:'Execution Of Request Failed'})
        });
}
//Cluster Flavor
exports.ShowClusterFlavor = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me cluster flavor-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowClusterFlavor', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show cluster flavor')
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ShowClusterFlavor..', String(error));
            res.json({error:'Execution Of Request Failed'})
        });
}
//Users
exports.ShowUsers = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
    }
    console.log('show me users -- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/role/showuser', qs.stringify({

        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show users')
            if(response.data && response.data.length) {
                res.json(response.data)
            } else {
                res.json(null)
            }
        })
        .catch(function (error) {
            console.log('error show ShowUsers..', error.response.data);
            responseLoginError(res, error)

        });
}
//cloudlet
exports.ShowCloudlet = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me cloudlet-- ', 'domain url==',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowCloudlet', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show cloudlet', "- : -")
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ShowCloudlet..', String(error));
            res.json({error:'Execution Of Request Failed'})
            //res.json({error:'Login Timeout Expired. Please login again'})
        });
}
//Cluster instances
exports.ShowClusterInst = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me cluster instances-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowClusterInst', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show cluster instances')
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)
            }
        })
        .catch(function (error) {
            console.log('error show ShowClusterInst..', String(error));
            res.json({error:'Request failed'})
            //res.json({error:'Login Timeout Expired. Please login again'})
        });
}
//Organization AppInst
exports.ShowClusterInsts = (req, res) => {
    mcUrl = process.env.MC_URL && process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'US'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me clusterInst-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowClusterInst', serviceBody,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show clusterInsts')
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ShowClusterInsts..', String(error));
            res.json({error:'Request failed'})
            //res.json({error:'Login Timeout Expired. Please login again'})
        });
}
//Apps
exports.ShowApps = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'US'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me app-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowApp', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show apps', 'status=',response.statusText, 'has data = ', String(response.data).indexOf('data'))
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)

            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)
            }
        })
        .catch(function (error) {
            console.log('error show ShowApps..', String(error));
            res.json({error:'Request failed'})
            //res.json({error:'Login Timeout Expired. Please login again'})
        });
}
//Organization App
exports.ShowApp = (req, res) => {
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
    console.log('show me app-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowApp', serviceBody,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show apps')
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ShowApp..', String(error));
            res.json({error:'Request failed'})
            //res.json({error:'Login Timeout Expired. Please login again'})
        });
}
//app instances
exports.ShowAppInst = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me appinst-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowAppInst', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show appinst')
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
            console.log('error show ShowAppInst..', String(error));
            res.json({error:'Request failed'})

        });
}
//Organization AppInst
exports.ShowAppInsts = (req, res) => {
    mcUrl = process.env.MC_URL && process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'US'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me appInstsssssssss-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowAppInst', serviceBody,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show appInstsssssss')
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ShowAppInsts..', error);
            res.json({error:'Execution Of Request Failed'})
        });
}
/*
{
"region":"local",
"cloudlet":{"key":{"operator_key":{"name":"bigwaves"},"name":"oceanview"},
"location":{"latitude":1,"longitude":1,"timestamp":{}},
"ip_support":2,
"num_dynamic_ips":30}
}
biccluster3
khcho
TDG
bonn-mexdemo
x1.large
 */
exports.Create = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let service = '';
    let params = '';
    if(req.body.serviceBody){
        params = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        service = req.body.service;
    }
    console.log('show me boddy@-- ', service,params, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/'+service, params,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success create service')
            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show Create..', String(error));
            res.json({error:String(error)})
        });
}

exports.CreateOrg= (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let service = '';
    let params = {name:'', type:'', address:'', phone:''};
    if(req.body.serviceBody){
        params.name = req.body.serviceBody.name;
        params.type = req.body.serviceBody.type;
        params.address = req.body.serviceBody.address;
        params.phone = req.body.serviceBody.phone;
        superpass = req.body.serviceBody.token;
        service = req.body.service;
    }
    console.log('create organiz show me boddy-- ', params, '   token is ==',superpass, 'mc_url = ', mcUrl)
    axios.post(mcUrl + '/api/v1/auth/org/create', qs.stringify(params),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success create service')
            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show CreateOrg...', error.response.data.message);
            responseLoginError(res, error)
        });
}

/*
http --auth-type=jwt --auth=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTkyMDYxOTcsImlhdCI6MTU1OTExOTc5NywidXNlcm5hbWUiOiJpbmtpa2ltMDUxMyIsImtpZCI6M30.13GB5N79Yf_0BkW1RtruyoEXUXkhVxwZvmtUkz1fnQVblTI2nLo7ydXDVY36TqOGFDLIDitcvIjNgVK6L7-3Hg POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/role/adduser
org=bicTest3Org username=kunhee949 role=OperatorContributor
 */
exports.addUserRole= (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let service = '';
    let params = {org:'', username:'', role:''};
    if(req.body.serviceBody){
        params.org = req.body.serviceBody.org;
        params.username = req.body.serviceBody.username;
        params.role = req.body.serviceBody.role;
        superpass = req.body.serviceBody.token;
        service = req.body.service;
    }
    console.log('add role to show me boddy-- ', params, '   token is ==',superpass, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/role/adduser', qs.stringify(params),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success create service')
            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show addUserRole...', error.response.data.message);
            responseLoginError(res, error)
        });
}

//Create Flavor
exports.CreateFlavor = (req, res) => {
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
    console.log('Create me flavor-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateFlavor', serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Create flavor')

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show CreateFlavor...', error.response.data.message);
            responseLoginError(res, error)
        });
}

//Create Cluster Flavor
exports.CreateClusterFlavor = (req, res) => {
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
    console.log('Create me flavor-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateClusterFlavor', serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Create clusterFlavor')

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show CreateClusterFlavor...', error.response.data.message);
            responseLoginError(res, error)
        });
}

//Create Cloudlet
let stackData = [];

const removeStreamTempNow = (cloudletId) => {
    let tempData = Object.assign([], stackData);
    stackData.map((stack) => {
        if(stack['clId'] === cloudletId) {
            tempData = tempData.filter(function(item) {
                return item !== stack
            })
        }
    })
    stackData = tempData;
    console.log('remove stack data ...', cloudletId, ":", tempData)
}
const stackLengthLimit = 10000;
const stackStreamTemp = (temp) => {

    if(stackData.length > stackLengthLimit) {
        // splice temp number is 0 to 5000
        stackData = stackData.splice(0, 5000);
    }

    stackData.push(temp)
}

/*
    clId:
     'autoclusterbicinkiapp117-1-bicinkiorg1117-1-bicinkioper-bictest1129' } ] : stackData ====== []
success show apps status= OK has data =  2
success show apps status= OK has data =  2
success show audit ==
success show audit ==
create appinst service.../////-------///////
{"data":{"message":"Creating Heat Stack for bictest1129-autoclusterbicinkiapp117-1-bicinkiorg1117-1, Heat Stack Status: CREATE_IN_PROGRESS"}} :
cluserId == autoclusterbicinkiapp117-1-bicinkiorg1117-1-bicinkioper-bictest1129
 */
exports.GetStatStream = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    axios.defaults.timeout = 10000000;
    let clId = null;
    if(req.body.serviceBody) {
        clId = req.body.serviceBody;
    }
    let filteredData = [];
    stackData.map(stData => {
        if(stData['clId'] === clId) {

            filteredData.push(stData)
        }
    })
    //console.log('get state clId === ', clId,": stackData --->>>--->>>")

    res.json({'stacksData':filteredData})

    //if(_io) _io.emit('streamTemp', {'stackData':stackData, 'clId':cloudletId})
}
const RemoveStatStream = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    axios.defaults.timeout = 10000000;
    let clId = null;
    if(req.body.serviceBody) {
        clId = req.body.serviceBody;
    }
    console.log('remove state steam...', clId)
    removeStreamTempNow(clId)
}
exports.CreateCloudlet = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    let cloudletId = '';
    axios.defaults.timeout = 10000000;
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
        cloudletId = serviceBody.cloudlet.key.operator_key.name + serviceBody.cloudlet.key.name;
    }

    //fs.createWriteStream('./temp/'+cloudletId+'.txt')

    //removeStreamTempNow(cloudletId);
    console.log('Create me cloudlet-- ', 'mcUrl=',mcUrl,":::",cloudletId.toLowerCase())

    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateCloudlet', serviceBody,

        {
            headers: {'Authorization':`Bearer ${superpass}`},
            responseType: 'stream',
            cancelToken: source.token
        }
    )
        .then(function (response) {

            console.log('success Create cloudlet')

            if(response.data) {
                //res.json(response.data)
                // response.data.pipe(
                //     fs.createWriteStream('./temp/'+cloudletId+'.txt')
                // )
                /////////////////////////
                let callback =(data) => {
                    if(data.indexOf('result')> -1) {
                        //source.cancel('Operation canceled')
                        let parseData = JSON.parse(data)['result']
                        try{
                            console.log('send data to client use to res --', parseData, ":", res)
                            //res.json(parseData)
                        } catch(e) {
                            console.log('send data to client use to inspect--',parseData, ":", inspect)
                            //inspect(JSON.stringify(parseData))
                        }
                        // 접속된 모든 클라이언트에게 메시지를 전송한다
                        if(_io) _io.emit('streamTemp', {'data':parseData, 'clId':cloudletId})
                    }

                    if(data.indexOf('successfully') > -1) {
                        //source.cancel('Operation canceled')
                        console.log('delete successfully')
                        let parseData = JSON.parse(data)['data']
                        try{
                            //res.json(parseData)
                        } catch(e) {
                            //inspect(JSON.stringify(parseData))
                        }
                        // 접속된 모든 클라이언트에게 메시지를 전송한다
                        if(_io) _io.emit('streamTemp', {'data':parseData, 'clId':cloudletId})
                        //
                    }

                }
                response.data.pipe(estream.split())
                    .pipe(estream.map(function(data, cb){
                        console.log('create Cloudlet.../////-------///////', data, ":  clId=",cloudletId.toLowerCase())
                        let finish = false;
                        if(data === ""){
                            console.log('data...', data, ": -- end" )
                            //data = '{"data":{"message":"Created successfully"}}'
                            finish = true;
                        }
                        if(!finish) stackStreamTemp({'streamTemp':data, 'clId':cloudletId.toLowerCase()});
                        if(data !== ''){
                            cb(null, callback(data, cloudletId.toLowerCase()))
                        } else {
                            removeStreamTempNow(cloudletId.toLowerCase())
                        }

                    }))
                ////////////////////////
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {

            if(error.response && error.response.statusText.indexOf('Bad') > -1) {
                console.log('error show CreateCloudlet...', error.response.statusText);
                //res.json({error:error.response.statusText})
            } else {
                //res.json({error:'Execution Of Request Failed'})
            }
        });
}

//Create
/*
{"region":"US",
    "app":
        {
            "key":
                {
                "developer_key":{"name":"bigorg"},
                "name":"bicTestApp","version":"1.0.0"
                },
            "image_path":"registry.mobiledgex.net:5000/mobiledgex/simapp",
            "image_type":1,"access_ports":"udp:12001,tcp:80,http:7777",
            "default_flavor":{"name":"x1.medium"},
            "cluster":{"name":"biccluster"},
            "command":"simapp -port 7777"
        }
}
 */
exports.CreateApp = (req, res) => {
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
    //params = JSON.stringify(params).replace('"1"', 1);
    console.log('Create me app-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateApp', serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Create app')

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show CreateApp...', error);
            if(error.response && error.response.statusText.indexOf('Bad') > -1) {
                res.json({error:error.response.data.message})
            } else {
                res.json({error:'Execution Of Request Failed'})
            }
        });
}
exports.UpdateApp = (req, res) => {
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
    //params = JSON.stringify(params).replace('"1"', 1);
    console.log('Update me app-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/UpdateApp', serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Update app')

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show UpdateApp...', error);
            if(error.response && error.response.statusText.indexOf('Bad') > -1) {
                res.json({error:error.response.statusText})
            } else {
                res.json({error:'Execution Of Request Failed'})
            }
        });
}

/*
{"region":"EU",
"appinst":{
    "key":{"app_key":{"developer_key":{"name":"bicinkiOrg1117-1"},"name":"bicinkiApp117-1","version":"1.0"},
        "cluster_inst_key":{"cluster_key":{"name":"autoclusterbicinkiApp117-1"},"cloudlet_key":{"operator_key":{"name":"bicinkiOper"},"name":"bictest1129"}}}}}
 */
exports.CreateAppInst = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let params = {};
    let superpass = '';
    let region = 'local'
    let clusterId = 'cl_';
    let serviceBody = '';
    axios.defaults.timeout = 1000000;
    if(req.body.serviceBody){
        params = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
        params.appinst.key.cluster_inst_key.cloudlet_key.name = req.body.multiCloudlet;
        params.appinst.key.cluster_inst_key.cluster_key.name = req.body.multiCluster;

        let appName     = params.appinst.key.app_key.name;
        let orgName     = params.appinst.key.app_key.developer_key.name;
        let operator    = params.appinst.key.cluster_inst_key.cloudlet_key.operator_key.name;
        let cloudlet    = params.appinst.key.cluster_inst_key.cloudlet_key.name;

        if(req.body.multiCluster.indexOf('autocluster') > -1){
            //clusterId = req.body.multiCluster + req.body.multiCloudlet;
            clusterId = 'autocluster'+appName +'-'+ orgName +'-'+ operator;
        } else {
            clusterId = appName +'-'+ orgName +'-'+ operator;
            //clusterId = params.appinst.key.app_key.name + req.body.multiCloudlet;
            //clusterId = clusterId.concat((req.body.multiCluster == '')?'DefaultVMCluster': req.body.multiCluster);
        }
    }

    //
    //fs.createWriteStream('./temp/'+clusterId+'.txt')

    console.log('Create me app inst--string...', JSON.stringify(params), 'mcUrl=',mcUrl,"vvv",req.body.multiCluster,":clId=",clusterId.toLowerCase())

    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateAppInst', params,

        {
            headers: {'Authorization':`Bearer ${superpass}`},
            responseType: 'stream'
        }
    )
        .then(function (response) {

            console.log('success Create app')
            let _res = res;


            if(response.data) {
                // response.data.pipe(
                //     fs.createWriteStream('./temp/'+clusterId+'.txt')
                // )
                res.send(clusterId); //start show progress to list view of instances
                /////////////////////////
                let callback =(data) => {
                    if(data.indexOf('result')> -1) {
                        let inspectData = data.replace(/\"/g, "")
                        inspectData = data.replace(/\\"/g, "")
                        //source.cancel('Operation canceled')
                        let parseData = JSON.parse(inspectData)['result']
                        console.log('parse data..1205-- ', typeof parseData, ":", parseData)
                        //res.json(parseData)
                        try{
                            console.log('res', parseData);
                            //res.json(parseData)
                        } catch(e) {
                            //let inst = inspect(JSON.stringify(parseData))
                            //console.log('inspect', inst, ":", typeof parseData, ":", parseData)
                            //inspect('{"error":"state is CLOUDLET_STATE_NOT_PRESENT"}')
                        }
                        // 접속된 모든 클라이언트에게 메시지를 전송한다
                        if(_io) _io.emit('streamTemp', {'data':{'message':parseData.message, 'code':parseData.code}, 'clId':clusterId.toLowerCase()})

                    }

                    if(data.indexOf('Create') > -1 && data.indexOf('successfully') > -1) {
                        let parseData = JSON.parse(data)
                        let instName = "";
                        //if(data.indexOf('ClusterInst') > -1) {
                            instName = clusterId.toLowerCase()
                        //}
                        //source.cancel('Operation canceled')
                        let messageData = JSON.parse(data)['data']
                        let instance = '';
                        let lastMessage = ' successfully';
                        if(messageData['message'].indexOf('AppInst') > -1) {
                            instance = 'Application Instance';
                        } else if(messageData['message'].indexOf('ClusterInst') > -1) {
                            instance = 'Your cluster';
                        }

                        console.log('create successfully =', parseData['data'], ":", typeof parseData['data'])

                        try{
                            //res.json({"message":"Created "+instName+" successfully"})
                        } catch(e) {
                            //inspect(JSON.stringify(parseData['data']))
                        }
                        //inspect(JSON.stringify(parseData))
                        // 접속된 모든 클라이언트에게 메시지를 전송한다
                        if(_io) _io.emit('streamTemp', {'data':{"message":instance +":"+ instName + lastMessage}, 'clId':clusterId.toLowerCase()})
                    }



                }

                response.data.pipe(estream.split())
                    .pipe(estream.map(function(data, cb){
                        console.log('create appinst service.../////---'+serviceName+'----///////', data,":",typeof data , ": data -- ", JSON.stringify(data), ":    cluserId ==", clusterId.toLowerCase())

                        let finish = false;
                        if(data === ""){
                            console.log('data...', data, ": -- end" )
                            //data = '{"data":{"message":"Created successfully"}}'
                            finish = true;
                        }
                        if(!finish) stackStreamTemp({'streamTemp':data, 'clId':clusterId.toLowerCase()});
                        if(data !== ''){
                            cb(null, callback(data, clusterId.toLowerCase()))
                        } else {
                            removeStreamTempNow(clusterId.toLowerCase())
                        }
                    }))
                ////////////////////////
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show CreateAppInst...', error);
            responseError(res, error)
        });


}
exports.UpdateAppInst = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local';
    let updataId = '';
    axios.defaults.timeout = 1000000;
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
        updataId = serviceBody.appinst.key.app_key.name + serviceBody.appinst.key.cluster_inst_key.cloudlet_key.name + serviceBody.appinst.key.cluster_inst_key.cluster_key.name;
    }
    res.send(updataId);
    //params = JSON.stringify(params).replace('"1"', 1);
    console.log('Update me appinst-- ', 'mcUrl=',updataId)
    axios.post(mcUrl + '/api/v1/auth/ctrl/UpdateAppInst', serviceBody,

        {
            headers: {'Authorization':`Bearer ${superpass}`},
            responseType: 'stream'
        }
    )
        .then(function (response) {

            console.log('success Update appinst')

            if(response.data) {
                // res.json(response.data)
                response.data.pipe(
                    fs.createWriteStream('./temp/'+updataId+'.txt')
                )
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show UpdateApp...', error);
            if(error.response && error.response.statusText.indexOf('Bad') > -1) {
                res.json({error:error.response.statusText})
            } else {
                res.json({error:'Execution Of Request Failed'})
            }
        });
}

/*
"region":data['Region'],
        "clusterinst":
            {
                "key":
                    {
                        "cluster_key":{"name":data['ClusterName']},
                        "cloudlet_key":{
                            "operator_key":{"name":data['Operator']},
                            "name":data['Cloudlet']
                        },
                        "developer":data['OrganizationName']
                    },
                "deployment":data['DeploymentType'],
                "flavor":{"name":data['Flavor']},
                "ip_access":parseInt(getInteger(data['IpAccess'])),
                "num_masters":parseInt(data['NumberOfMaster']),
                "num_nodes":parseInt(data['NumberOfNode'])
            }
 */
exports.CreateClusterInst = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local';
    let clusterId = 'cl_';
    axios.defaults.timeout = 1000000;
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
        serviceBody.clusterinst.key.cloudlet_key.name = req.body.multiData;
        let clusterName = serviceBody.clusterinst.key.cluster_key.name;
        let orgName = serviceBody.clusterinst.key.developer;
        let operator = serviceBody.clusterinst.key.cloudlet_key.operator_key.name;
        let cloudlet = serviceBody.clusterinst.key.cloudlet_key.name;

        //clusterId = serviceBody.clusterinst.key.cluster_key.name + req.body.multiData;
        clusterId = clusterName +'-'+ orgName +'-'+ operator;
    }
    // avoid error for fs.createReadStream, so that preview create file before read file.
    // fs.readFileSync 로 파일을 먼저 읽으려 할 때 파일이 없으면 오류가 생기는 문제 발생, 그러므로 먼저 파일을 만들어 놓는다
    //fs.createWriteStream('./temp/'+clusterId+'.txt')

    /**
     * steam
     * http --stream --timeout 100000 --auth-type=jwt --auth=$SUPERPASS POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/ctrl/CreateClusterInst <<< '{"region":"EU","clusterinst":{"key":{"cluster_key":{"name":"bicinkiCluster1206-03"},"cloudlet_key":{"operator_key":{"name":"MEX"},"name":"jlm-dind"},"developer":"MobiledgeX"},"deployment":"docker","flavor":{"name":"x1.medium"},"ip_access":1,"num_masters":0,"num_nodes":0}}'
     */
    // var url = `http --stream --timeout 100000 --auth-type=jwt --auth=${superpass} POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/ctrl/CreateClusterInst <<< '{"region":"KR","clusterinst":{"key":{"cluster_key":{"name":"dockertest20190805-15"},"cloudlet_key":{"operator_key":{"name":"TDG"},"name":"mexplat-stage-bonn-cloudlet"},"developer":"MobiledgeX"},"deployment":"docker","flavor":{"name":"c1.small"},"ip_access":1,"num_masters":0,"num_nodes":0}}'`
    // var child = shell.exec(url, {async:true});
    // child.stdout.on('data', function(data) {
    //     console.log(data)
    // });

    console.log('Create me cluster inst-- ', JSON.stringify(serviceBody), 'mcUrl=',mcUrl,'mdata=',req.body.multiData, 'clusterId=', clusterId.toLowerCase())
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateClusterInst', serviceBody,

        {
            headers: {'Authorization':`Bearer ${superpass}`},
            responseType: 'stream'
        }
    )
        .then(function (response) {

            console.log('success Create ClusterInst ==>==>==>==>==>', response)

            if(response.data) {
                // response.data.pipe(
                //     fs.createWriteStream('./temp/'+clusterId+'.txt')
                // )
                /////////////////////////
                let callback =(data) => {
                    if(data.indexOf('result')> -1) {
                        //source.cancel('Operation canceled')
                        let parseData = JSON.parse(data)['result']
                        try{
                            res.json(parseData)
                        } catch(e) {
                            //inspect(JSON.stringify(parseData))
                            res.json({"message": "Execution Of Request Failed"})
                        }
                        // 접속된 모든 클라이언트에게 메시지를 전송한다
                        //if(_io) _io.emit('streamTemp', {'data':parseData, 'clId':cloudletId})
                    }
                    if(data.indexOf('Create') > -1 && data.indexOf('successfully') > -1) {
                        //source.cancel('Operation canceled')
                        //console.log('create appinst successfully')
                        let parseData = JSON.parse(data)['data']
                        try{
                            console.log('sucessfulloy created...res === ', res)
                            //res.json(parseData)
                        } catch(e) {
                            console.log('sucessfulloy created...inspect === ', inspect, ': res???', res)
                            //inspect(JSON.stringify(parseData))

                        }
                        // 접속된 모든 클라이언트에게 메시지를 전송한다
                        if(_io) _io.emit('streamTemp', {'data':parseData, 'clId':clusterId})
                    }
                }
                response.data.pipe(estream.split())
                    .pipe(estream.map(function(data, cb){
                        console.log('create appinst.../////-------///////', data)
                        let finish = false;
                        if(data === ""){
                            console.log('data...', data, ": -- end" )
                            //data = '{"data":{"message":"Created successfully"}}'
                            finish = true;
                        }
                        if(!finish) stackStreamTemp({'streamTemp':data, 'clId':clusterId.toLowerCase()});
                        if(data !== ''){
                            cb(null, callback(data, clusterId.toLowerCase()))
                        } else {
                            removeStreamTempNow(clusterId.toLowerCase())
                        }

                    }))
                ////////////////////////
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show CreateClusterInst...', error);
            res.json({error:'Execution Of Request Failed, Audit may help you '})
        });


}
exports.CreteTempFile = (req, res) => {
    console.log("reqreqreq12",req)
    let clusterId = '';
    if(req.body.site == 'ClusterInst'){

        clusterId = req.body.item.ClusterName + req.body.item.Cloudlet;

        if(req.body.item.ClusterName.indexOf('autocluster') > -1){
            clusterId
        } else {
            clusterId = req.body.item.ClusterName + req.body.item.Cloudlet;
        }
    } else if (req.body.site == 'appinst'){
        if(req.body.item.ClusterInst.indexOf('autocluster') > -1) {
            clusterId = req.body.item.ClusterInst + req.body.item.Cloudlet;
        } else {
            clusterId = req.body.item.AppName + req.body.item.Cloudlet +req.body.item.ClusterInst;
        }
        
    } else if (req.body.site == 'Cloudlet'){
        clusterId = req.body.item.Operator + req.body.item.CloudletName
    }

    console.log('read status inst....----.... CreteTempFile=', clusterId)

    try {
        fs.readFileSync('./temp/'+clusterId+'.txt');
        fs.createReadStream('./temp/'+clusterId+'.txt').pipe(res);
    } catch (error) {
        console.log('CreteTempFile Error!!')
    }

}

exports.DeleteTempFile = (req, res) => {   
    let clusterId = '';
    if(req.body.site == 'ClusterInst'){
        if(req.body.item.ClusterName.indexOf('autocluster') > -1) return

        clusterId = req.body.item.ClusterName + req.body.item.Cloudlet;
    } else if (req.body.site == 'appinst'){
        if(req.body.item.ClusterInst.indexOf('autocluster') > -1) {
            clusterId = req.body.item.ClusterInst + req.body.item.Cloudlet;
        } else {
            clusterId = req.body.item.AppName + req.body.item.Cloudlet +req.body.item.ClusterInst;
        }
    } else if (req.body.site == 'Cloudlet'){
        clusterId = req.body.item.Operator + req.body.item.CloudletName
    }
    console.log('read status inst....----.... DeleteTempFile=', req.body)

    try {
        fs.readFileSync('./temp/'+clusterId+'.txt');
        fs.unlink('./temp/'+clusterId+'.txt',function(){
            console.log("DeleteTempFile!!")
        });
    } catch (error) {
        console.log('DeleteTempFile Error!!')
    }

    


}

exports.ErrorTempFile = (req, res) => {
    console.log('read status inst....----.... ErrorTempFile=', req.body.item)

    try {
        fs.readFileSync('./temp/'+req.body.item+'.txt');
        fs.createReadStream('./temp/'+req.body.item+'.txt').pipe(res);
    } catch (error) {
        console.log('ErrorTempFile Error!!')
    }
    
    
}

/*
 { region: 'EU',
  cloudlet:
   { key: { operator_key: [Object], name: 'inkikimTest1122-05' } } }
 */

exports.DeleteService = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local';
    let serviceId = '';
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        serviceName = req.body.service;
        serviceId = req.body.serviceBody.instanceId;
    }
    console.log('Delete me --- serviceName == ', serviceName, 'serviceBody == ',JSON.stringify(serviceBody), 'mcUrl=',mcUrl)

    axios.post(mcUrl + '/api/v1/auth/ctrl/'+serviceName, serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`
            },
            responseType: 'stream',
        }
    )
        .then(function (response) {

            console.log('start Delete---   service name ==  ', serviceName)

            let callback =(data, serviceId) => {
                if(data.indexOf('result')> -1) {
                    //source.cancel('Operation canceled')
                    let parseData = JSON.parse(data)['result']
                    console.log('result type..', typeof parseData, ":", parseData)

                    try{
                        //res.json(parseData)
                    } catch(e) {
                        //inspect(JSON.stringify(parseData))
                    }
                    //res.json(parseData)
                    // 접속된 모든 클라이언트에게 메시지를 전송한다
                    if(_io) _io.emit('streamTemp', {'data':parseData, 'clId':serviceId})
                }

                if(data.indexOf('successfully') > -1 && data.indexOf('Deleted') > -1) {
                    //source.cancel('Operation canceled')
                    console.log('delete successfully')

                    let messageData = JSON.parse(data)['data']
                    let instance = '';
                    let lastMessage = ' successfully deleted';
                    if(messageData['message'].indexOf('AppInst') > -1) {
                        instance = 'Application Instance';
                    } else if(messageData['message'].indexOf('ClusterInst') > -1) {
                        instance = 'Your cluster';
                        lastMessage = ' deleted successfully'
                    }


                    // socket 전달 방식을 원치 않는다면,
                    try{
                        //res.json({"message":"Deleted "+instance+" : "+serviceId+" successfully"})
                    } catch(e) {
                        //inspect(JSON.stringify({"message":"Deleted "+instance+" : "+serviceId+" successfully"}))
                    }

                    // socket 전달 방식 : 접속된 모든 클라이언트에게 메시지를 전송한다
                    //Application Instance '+body.params.appinst.key.app_key.name+' successfully deleted
                    if(_io) _io.emit('streamTemp', {'data':{"message":instance+" : "+serviceId+lastMessage}, 'clId':serviceId ? serviceId.toLowerCase() : ''})
                }

            }

            if(response.data && Object.keys(response.data).length !== 0) {
                //res.json(response.data)
                /////////////////////////
                if(serviceName == 'DeleteApp') {
                    res.json({'message':response.data.message || 'Deleted successfully'})
                    return;
                }
                if(serviceId) {
                    response.data.pipe(estream.split())
                        .pipe(estream.map(function(data, cb){
                            console.log('delete service.../////---'+serviceName+'----///////',typeof data,": data - ", JSON.stringify(data), ":  serviceId == ", serviceId.toLowerCase())

                            let finish = false;
                            if(data === ""){
                                console.log('data...', data, ": -- end" )
                                //data = '{"data":{"message":"Created successfully"}}'
                                finish = true;
                            }
                            if(!finish) stackStreamTemp({'streamTemp':data, 'clId':serviceId.toLowerCase()});
                            if(data !== ''){
                                cb(null, callback(data, serviceId.toLowerCase()))
                            } else {
                                removeStreamTempNow(serviceId.toLowerCase())
                            }

                        }))
                } else {

                }

                ////////////////////////
            } else {
                res.json({'message':'Request Failed'})
            }
        })
        .catch(function (error) {
            console.log('error show DeleteService...', error);
            //Application Instance '+body.params.appinst.key.app_key.name+' successfully deleted
            //if(_io) _io.emit('streamTemp', {'data':{"message":"Request failed with status code 400"}, 'clId':serviceId ? serviceId.toLowerCase() : ''})
        });
}
exports.DeleteUser = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        serviceName = req.body.service;
    }
    console.log('Delete me --- serviceName == ', serviceName, 'serviceBody == ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/role/'+serviceName, serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Delete ')

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show DeleteUser...', error.response.data.message);
            responseLoginError(res, error)
        });
}
exports.DeleteAccount = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        serviceName = req.body.service;
    }
    console.log('Delete me --- serviceName == ', serviceName, 'serviceBody == ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/user/'+serviceName, serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Delete ')

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show DeleteAccount...', error.response.data.message);
            responseLoginError(res, error)
        });
}
exports.DeleteOrg = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        serviceName = req.body.service;
    }
    console.log('Delete me --- serviceName == ', serviceName, 'serviceBody == ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/org/'+serviceName, serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Delete ')

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show DeleteOrg...', error.response.data.message);
            responseLoginError(res, error)
        });
}


/*
http POST https://mc.mobiledgex.net:9900/api/v1/passwordresetrequest
email=popkim71@gmail.com
callbackurl="https://console.mobiledgex.net/passwordreset"
operatingsystem="mac OSX"
browser=httpie clientip=127.0.0.1
 */
exports.ResetPassword = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};

    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        serviceName = req.body.service;
    }
    console.log('reset password --- serviceName == ', serviceName, 'serviceBody == ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/'+serviceName, serviceBody)
        .then(function (response) {

            console.log('success send email ', response.statusText)

            if(response.statusText === 'OK') {
                res.json({message:'Success'})
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            responseLoginError(res, error)
        });
}
exports.UpdatePassword = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};

    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        serviceName = req.body.service;
    }
    console.log('update password --- serviceName == ', serviceName, 'serviceBody == ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/'+serviceName, serviceBody)
        .then(function (response) {

            console.log('success update pass ', response.statusText)

            if(response.statusText === 'OK') {
                res.json({message:'You have successfully updated your password'})
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {

            responseLoginError(res, error)
        });
}
exports.ResendVerify = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};

    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        serviceName = req.body.service;
    }
    console.log('Resend verify --- serviceName == ', serviceName, 'serviceBody == ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/'+serviceName, serviceBody)
        .then(function (response) {

            console.log('success send email ', response.statusText)

            if(response.statusText === 'OK') {
                res.json({message:'Success'})
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {

            responseLoginError(res, error)
        });
}
exports.UpdateVerify = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let token = '';

    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        serviceName = req.body.serviceBody.service;
        token = req.body.serviceBody.token;
    }
    console.log('Update verify == ', serviceName, 'serviceBody == ', 'token=', token, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/'+serviceName, serviceBody)
        .then(function (response) {


            if(response.statusText === 'OK') {
                //res.json({message:response.data.message})
                response.data == '' ? res.json({error:'No user'}) : res.json({message:response.data.message})
            } else {
                res.json({error:'Retry'})
            }
        })
        .catch(function (error) {
            responseLoginError(res, error)
        });
}

/**
 * code by kunhee(190419)
 * http --auth-type=jwt --auth=$ORGMANTOKEN POST 127.0.0.1:9900/api/v1/auth/role/assignment/show
 * @param req
 * @param res
 * @constructor
 */

exports.ShowRole = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
    }
    console.log('show role-- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/role/assignment/show', {},
            {
                headers: {
                    'Authorization':`Bearer ${superpass}`}
            }
        )
        .then(function (response) {

            console.log('success show role' )
            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show ShowRole...', error.response.data.message);
            if(error.Error){

            }

            responseLoginError(res, error)
        });
}

/*
mcctl --addr https://mc-stage.mobiledgex.net:9900 controller show
 */
exports.ShowController = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
    }
    console.log('show controller-- -- -- -- ', 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/controller/show', {},
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success show controller  ', response)
            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show controller...', error);
            responseLoginError(res, error)
        });
}


exports.getVersion = (req, res) => {
    if(process.env.BUILD_VERSION) _version =  process.env.BUILD_VERSION;
    console.log('get version = ', _version)
    res.json({version:_version})
}


/**
 * http --auth-type=jwt --auth=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjMwMDM5OTMsImlhdCI6MTU2MjkxNzU5MywidXNlcm5hbWUiOiJtZXhhZG1pbiIsImtpZCI6M30.VRTLHYhdtfc3PztxyZxaJS1AqXjHSVV1FiqghkiTRx1QkE6SNCl69m0Fu7ws4Smr9d3cTQ6ucz8vrVUCSi3uig POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/restricted/user/update email=popkim71@gmail.com locked:=false
 * http --auth-type=jwt --auth=$SUPERPASS POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/restricted/user/update email=wonhopark80@gmail.com locked:=true
 * @param req
 * @param res
 * @constructor
 * If users are configured to be created locked (by command below), then an email will be sent tosupport@mobiledgex.com(or whatever the notify email address is configured to). It is up to the MobiledgeX admin to then unlock theaccount.

 To lock/unlock ALL new users (does not affect existing users) (run as admin):
 http --auth-type=jwt --auth=$SUPERPASS POST 127.0.0.1:9900/api/v1/auth/config/update locknewaccounts:=true> or, to disable:http --auth-type=jwt --auth=$SUPERPASS POST 127.0.0.1:9900/api/v1/auth/config/update locknewaccounts:=false

 Show configuration:
 http --auth-type=jwt --auth=$SUPERPASS POST 127.0.0.1:9900/api/v1/auth/config/show

 To unlock a specific user (run as admin):
 http --auth-type=jwt --auth=$SUPERPASS POST 127.0.0.1:9900/api/v1/auth/restricted/user/update email=me@gmail.com locked:=false

 To force verify a user's email manually without email access:
 http --auth-type=jwt --auth=$SUPERPASS POST 127.0.0.1:9900/api/v1/auth/restricted/user/update email=me@gmail.com emailverified:=true
 */
exports.SettingLock = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    if(req.body.serviceBody){
        serviceBody = {email:req.body.serviceBody.params.email, locked:req.body.serviceBody.params.locked === 'true'?true:false};
        superpass = req.body.serviceBody.token;
    }
    console.log('set lock -- ', qs.stringify(serviceBody), 'mcUrl=',mcUrl, 'token=', superpass)
    axios.post(mcUrl + '/api/v1/auth/restricted/user/update', serviceBody,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`},
                 //'Content-Type': 'application/json',
                'Content-Type':'application/json; charset=UTF-8'

        }
    )
        .then(function (response) {

            console.log('success set lock', response)
            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error set lock ...', error);
            responseLoginError(res, error)
        });
}

/**
 * cloudlet pool
 * @inki 20191219
 * @param req
 * @param res
 * @constructor
 */
//cloudlet pool
exports.ShowCloudletPool = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me cloudlet-- ', 'domain url==',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowCloudletPool', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show cloudlet', "- : -")
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ShowCloudlet..', String(error));
            res.json({error:'Execution Of Request Failed'})
            //res.json({error:'Login Timeout Expired. Please login again'})
        });
}


/**
 * Now creating cloudletpool named "DeletemPool"
 http --auth-type=jwt --auth=$SUPERPASS POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/ctrl/CreateCloudletPool <<< '{"region":"EU", "cloudletpool": {"key": {"name": "TEST1223"}}}'
 * @param req
 * @param res
 * @constructor
 */
exports.CreateCloudletPool = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local';
    let poolName = '';
    if(req.body.serviceBody){
        poolName = req.body.serviceBody.params.poolName;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.params.Region;
        serviceBody = {"region":region, "cloudletpool": {"key": {"name": poolName}}};
    }
    console.log('create  cloudlet pool -- ', 'domain req.body.serviceBody==',req.body.serviceBody, ":region = ",region, ": poolName=", poolName)
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateCloudletPool', serviceBody,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success create  pool ', "- : -", response)
            if(response.data && response.statusText === 'OK') {
                res.json({message:'Careated '+poolName+' successfully'})
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {

            }
        })
        .catch(function (error) {
            console.log('error show createCloudletpool..', String(error));
            res.json({error:'Execution Of Request Failed'})
            //res.json({error:'Login Timeout Expired. Please login again'})
        });
}

/**
 * Now adding Cloudlet named "deleteme" to CloudletPool named "DeletemePool"
 mcctl --addr https://mc-stage.mobiledgex.net:9900 region CreateCloudletPoolMember region=EU operator=TDG cloudlet=deleteme pool=DeletemePool
 * @param req
 * @param res
 * @constructor
 */
exports.CreateCloudletPoolMember = (req, res) => {
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
    console.log('show me create pool member -- ', 'domain url==',mcUrl, 'body = ', serviceBody)
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateCloudletPoolMember', serviceBody,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success create pool member ', "- : -", response.data)
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {

            }
        })
        .catch(function (error) {
            console.log('error create cloudlet pool member ..', String(error));
            res.json({error:'Execution Of Request Failed'})
            //res.json({error:'Login Timeout Expired. Please login again'})
        });
}

/**
 * Show cloudlet pool member
 * $  mcctl --addr https://mc-stage.mobiledgex.net:9900 region ShowCloudletPoolMember region=EU
 */

exports.ShowCloudletPoolMember = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me cloudlet pool member -- ', 'region==',region)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowCloudletPoolMember', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show cloudlet member -- ', "- : -",response.data)
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ShowCloudlet pool member ..', String(error));
            res.json({error:'Execution Of Request Failed'})
            //res.json({error:'Login Timeout Expired. Please login again'})
        });
}


/**
 * http --auth-type=jwt --auth=$SUPERPASS POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/orgcloudletpool/create <<< '{"cloudletpool":"cloudletPool_bictest_1223-01","org":"bicinkiOper","region":"EU"}'
 * @param req
 * @param res
 * @constructor
 */
exports.CreateLinkPoolOrg = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
    }
    console.log('show me link org to pool -- ', 'param==',serviceBody)
    axios.post(mcUrl + '/api/v1/auth/orgcloudletpool/create', qs.stringify(serviceBody),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success link org to pool -- ', "- : -",response.data)
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {

            }
        })
        .catch(function (error) {
            console.log('error link org to pool ..', String(error));
            res.json({error:'Execution Of Request Failed'})
            //res.json({error:'Login Timeout Expired. Please login again'})
        });
}

/**
 * https://mc-stage.mobiledgex.net:9900/api/v1/auth/orgcloudletpool/show
 * @param req
 * @param res
 * @constructor
 */
exports.ShowOrgCloudletpool = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
    }
    console.log('show me link org cloudlet pool -- ', 'param==',serviceBody)
    axios.post(mcUrl + '/api/v1/auth/orgcloudletpool/show', {},
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show org cloudlet pool -- ', "- : -",response.data)
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json(null)

            } else {

            }
        })
        .catch(function (error) {
            console.log('error show org cloudlet pool ..', String(error));
            res.json({error:'Execution Of Request Failed'})
            //res.json({error:'Login Timeout Expired. Please login again'})
        });
}
