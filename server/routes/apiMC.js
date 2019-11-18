import sha256 from 'sha256'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

import axios from "axios-https-proxy-fix";
import qs from "qs";
import fs from "fs";
import shell from 'shelljs';

const API_KEY = '__apiMC_key__'
let mcUrl = 'https://mc.mobiledgex.net:9900';
let mcDevUrl = 'https://mc-stage.mobiledgex.net:9900';
let _version = 'v0.0.0';
console.log("how fast...", process.env.MC_URL)
// create user
exports.getToken = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
  let serviceName = '';
  let serviceBody = {};

  if(req.body.service){
    serviceName = req.body.service;
    serviceBody = req.body.serviceBody;
  }
  console.log('Please waite loading token... ', serviceBody, mcUrl)
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
  console.log('create user.. ', serviceBody,emailEncode, mcUrl)
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
    console.log('current user.. ', serviceBody, mcUrl)
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
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
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
    console.log('show user accounts.. ', serviceBody, mcUrl)
    axios.post(mcUrl + '/api/v1/auth/user/show', qs.stringify({

        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show account user..', response.data)
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
            if(error.response.data.message && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again.'})
            } else {
                res.json({error:error.response.data})
            }
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
    console.log('showController .. ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/controller/show', qs.stringify({

        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success showController..', response.data)
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
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
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
    console.log('show org-- ', serviceBody, 'mc_url = ', mcUrl,'process.env.MC_URL = ', process.env.MC_URL)
    axios.post(mcUrl + '/api/v1/auth/org/show', qs.stringify({

        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show org', response.data)
            if(response.data && response.data.length > 0) {
                res.json(response.data)
            } else {
                res.json({error:'No records available'})
            }
        })
        .catch(function (error) {
            // console.log('error show org..', String(error));
            // res.json({error:'There is no data'})
            console.log('error show showOrg...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
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
    console.log('show me flavor-- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowFlavor', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show flavor', response.data)
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
            res.json({error:'Request failed'})
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
    console.log('show me cluster flavor-- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowClusterFlavor', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show cluster flavor', response.data)
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
            res.json({error:'Request failed'})
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
    console.log('show me users -- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/role/showuser', qs.stringify({

        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show users', response.data)
            if(response.data && response.data.length) {
                res.json(response.data)
            } else {
                res.json({error:'No records available'})
            }
        })
        .catch(function (error) {
            console.log('error show ShowUsers..', error.response.data);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }

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
    console.log('show me cloudlet-- ', serviceBody, 'domain url==',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowCloudlet', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show cloudlet', response.data)
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
            res.json({error:'Request failed'})
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
    console.log('show me cluster instances-- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowClusterInst', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show cluster instances', response.data)
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
    console.log('show me clusterInst-- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowClusterInst', serviceBody,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show clusterInsts', response.data)
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
    console.log('show me app-- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowApp', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show apps', response.data, 'status=',response.statusText, 'has data = ', String(response.data).indexOf('data'))
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
    console.log('show me app-- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowApp', serviceBody,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show apps', response.data)
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
    console.log('show me appinst-- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowAppInst', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show appinst', response.data)
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json({error:region+' : No records available'})

            } else {
                res.json({error:'Request failed'})
            }
        })
        .catch(function (error) {
            console.log('error show ShowAppInst..', String(error));
            res.json({error:'Request failed'})
            //res.json({error:'Login Timeout Expired. Please login again'})
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
    console.log('show me appInstsssssssss-- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowAppInst', serviceBody,
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show appInstsssssss', response.data)
            if(response.data && response.statusText === 'OK') {
                res.json(response.data)
            } else if(response.statusText === 'OK'){
                console.log('empty')
                res.json({error:region+' :No records available'})

            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ShowAppInsts..', String(error));
            res.json({error:'Request failed'})
            //res.json({error:'Login Timeout Expired. Please login again'})
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
            console.log('success create service', response.data)
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
            console.log('success create service', response.data)
            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show CreateOrg...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
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
            console.log('success create service', response.data)
            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show addUserRole...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
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
    console.log('Create me flavor-- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateFlavor', serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Create flavor', response.data)

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show CreateFlavor...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
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
    console.log('Create me flavor-- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateClusterFlavor', serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Create clusterFlavor', response.data)

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show CreateClusterFlavor...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
        });
}

//Create Cloudlet
exports.CreateCloudlet = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    let clusterId = '';
    axios.defaults.timeout = 10000000;
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
        clusterId = serviceBody.cloudlet.key.operator_key.name + serviceBody.cloudlet.key.name;
    }

    //fs.createWriteStream('./temp/'+clusterId+'.txt')

    console.log('Create me cloudlet-- ', serviceBody, 'mcUrl=',mcUrl,":::",clusterId)
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateCloudlet', serviceBody,

        {
            headers: {'Authorization':`Bearer ${superpass}`},
            responseType: 'stream'
        }
    )
        .then(function (response) {

            console.log('success Create cloudlet', response.data)

            if(response.data) {
                //res.json(response.data)
                response.data.pipe(
                    fs.createWriteStream('./temp/'+clusterId+'.txt')
                )
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show CreateCloudlet...', error.response.statusText);
            res.json({error:String(error.response.statusText)})
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
    console.log('Create me app-- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateApp', serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Create app', response.data)

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show CreateApp...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
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
    console.log('Update me app-- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/UpdateApp', serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Update app', response.data)

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show UpdateApp...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
        });
}
exports.CreateAppInst = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceName = '';
    let params = {};
    let superpass = '';
    let region = 'local'
    let clusterId = 'cl_';
    axios.defaults.timeout = 1000000;
    if(req.body.serviceBody){
        params = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
        params.appinst.key.cluster_inst_key.cloudlet_key.name = req.body.multiCloudlet;
        params.appinst.key.cluster_inst_key.cluster_key.name = req.body.multiCluster;
        if(req.body.multiCluster.indexOf('autocluster') > -1){
            clusterId = req.body.multiCluster + req.body.multiCloudlet;
        } else {
            clusterId = params.appinst.key.app_key.name + req.body.multiCloudlet;
            clusterId = clusterId.concat((req.body.multiCluster == '')?'DefaultVMCluster': req.body.multiCluster);
        }
    }
    res.send(clusterId);
    //
    //fs.createWriteStream('./temp/'+clusterId+'.txt')

    console.log('Create me app inst--string...', JSON.stringify(params), 'mcUrl=',mcUrl,"vvv",req.body.multiCluster)
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateAppInst', params,

        {
            headers: {'Authorization':`Bearer ${superpass}`},
            responseType: 'stream'
        }
    )
        .then(function (response) {

            console.log('success Create app', response.data)

            if(response.data) {
                //res.json(response.data)
                response.data.pipe(
                    fs.createWriteStream('./temp/'+clusterId+'.txt')
                )
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show CreateAppInst...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
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
    console.log('Update me appinst-- ', serviceBody, 'mcUrl=',updataId)
    axios.post(mcUrl + '/api/v1/auth/ctrl/UpdateAppInst', serviceBody,

        {
            headers: {'Authorization':`Bearer ${superpass}`},
            responseType: 'stream'
        }
    )
        .then(function (response) {

            console.log('success Update appinst', response.data)

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
            console.log('error show UpdateApp...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
        });
}
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
        clusterId = serviceBody.clusterinst.key.cluster_key.name + req.body.multiData;
    }
    // avoid error for fs.createReadStream, so that preview create file before read file.
    // fs.readFileSync 로 파일을 먼저 읽으려 할 때 파일이 없으면 오류가 생기는 문제 발생, 그러므로 먼저 파일을 만들어 놓는다
    //fs.createWriteStream('./temp/'+clusterId+'.txt')

    /**
     * steam
     * http --stream --timeout 100000 --auth-type=jwt --auth=$SUPERPASS POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/ctrl/CreateClusterInst <<< '{"region":"US","clusterinst":{"key":{"cluster_key":{"name":"dockertest20190802-9"},"cloudlet_key":{"operator_key":{"name":"TDG"},"name":"mexplat-stage-bonn-cloudlet"},"developer":"MobiledgeX"},"deployment":"docker","flavor":{"name":"c1.small"},"ip_access":1,"num_masters":0,"num_nodes":0}}'
     */
    // var url = `http --stream --timeout 100000 --auth-type=jwt --auth=${superpass} POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/ctrl/CreateClusterInst <<< '{"region":"KR","clusterinst":{"key":{"cluster_key":{"name":"dockertest20190805-15"},"cloudlet_key":{"operator_key":{"name":"TDG"},"name":"mexplat-stage-bonn-cloudlet"},"developer":"MobiledgeX"},"deployment":"docker","flavor":{"name":"c1.small"},"ip_access":1,"num_masters":0,"num_nodes":0}}'`
    // var child = shell.exec(url, {async:true});
    // child.stdout.on('data', function(data) {
    //     console.log(data)
    // });


    console.log('Create me cluster inst-- ', JSON.stringify(serviceBody), 'mcUrl=',mcUrl,'mdata=',req.body.multiData, 'clusterId=', clusterId)
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateClusterInst', serviceBody,

        {
            headers: {'Authorization':`Bearer ${superpass}`},
            responseType: 'stream'
        }
    )
        .then(function (response) {

            console.log('success Create ClusterInst ==>==>==>==>==>', response.data)

            if(response.data) {
                //res.json(response.data)
                //

                response.data.pipe(
                    fs.createWriteStream('./temp/'+clusterId+'.txt')
                )
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show CreateClusterInst...', error.response.data);
            res.json(error)
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


exports.DeleteService = (req, res) => {
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
    console.log('Delete me --- serviceName == ', serviceName, 'serviceBody == ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/ctrl/'+serviceName, serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Delete ', response.data)

            if(response.data && Object.keys(response.data).length !== 0) {
                res.json(response.data)
            } else {
                res.json({'message':'ok'})
            }
        })
        .catch(function (error) {
            console.log('error show DeleteService...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
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
    console.log('Delete me --- serviceName == ', serviceName, 'serviceBody == ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/role/'+serviceName, serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Delete ', response.data)

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show DeleteUser...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
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
    console.log('Delete me --- serviceName == ', serviceName, 'serviceBody == ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/user/'+serviceName, serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Delete ', response.data)

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show DeleteAccount...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
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
    console.log('Delete me --- serviceName == ', serviceName, 'serviceBody == ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/org/'+serviceName, serviceBody,

        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success Delete ', response.data)

            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show DeleteOrg...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
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
    console.log('reset password --- serviceName == ', serviceName, 'serviceBody == ', serviceBody, 'mcUrl=',mcUrl)
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
            console.log('error show ResetPassword...', error.response.data.message);
            res.json({error:String(error.response.data.message)})
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
    console.log('update password --- serviceName == ', serviceName, 'serviceBody == ', serviceBody, 'mcUrl=',mcUrl)
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

            res.json({error:'Login Timeout Expired. Please login again.'})
            console.log('error show UpdatePassword..', String(error));
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
    console.log('Resend verify --- serviceName == ', serviceName, 'serviceBody == ', serviceBody, 'mcUrl=',mcUrl)
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

            console.log('error show ResendVerify..', String(error));
            res.json({error:String(error)})
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
    console.log('Update verify == ', serviceName, 'serviceBody == ', serviceBody, 'token=', token, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/'+serviceName, serviceBody)
        .then(function (response) {

            console.log('success verify email ', response.data)

            if(response.statusText === 'OK') {
                res.json({message:response.data.message})
            } else {
                res.json({error:'Retry'})
            }
        })
        .catch(function (error) {

            console.log('error show UpdateVerify..', String(error));
            res.json({error:String(error)})
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
    console.log('show role-- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/role/assignment/show', {},
            {
                headers: {
                    'Authorization':`Bearer ${superpass}`}
            }
        )
        .then(function (response) {

            console.log('success show role', response.data)
            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show ShowRole...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data)})
            }
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
    console.log('show controller-- -- -- -- ', serviceBody, 'mcUrl=',mcUrl)
    axios.post(mcUrl + '/api/v1/auth/controller/show', {},
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {

            console.log('success show controller', response.data)
            if(response.data) {
                res.json(response.data)
            } else {
                res.json({error:'Fail'})
            }
        })
        .catch(function (error) {
            console.log('error show controller...', error.response.data.message);
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login again'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
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
            if(error.response.data && error.response.data.message.indexOf('expired') > -1) {
                res.json({error:'Login Timeout Expired. Please login againd'})
            } else {
                res.json({error:String(error.response.data.message)})
            }
        });
}
