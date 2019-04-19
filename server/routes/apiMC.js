import sha256 from 'sha256'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

import axios from "axios-https-proxy-fix";
import qs from "qs";

const API_KEY = '__apiMC_key__'
const mcUrl = 'https://mc.mobiledgex.net:9900';
// create user
exports.getToken = (req, res) => {
  let serviceName = '';
  let serviceBody = {};
  if(req.body.service){
    serviceName = req.body.service;
    serviceBody = req.body.serviceBody;
  }
  console.log('Please waite loading token... ', serviceName)
  axios.post(mcUrl + '/api/v1/login', qs.stringify({
        username: serviceBody.username,
        password: serviceBody.password
      }),

  )
      .then(function (response) {
        console.log('success get pub token..', response.data)
        if(response.data) {
          res.json(response.data)
        } else {

        }
      })
      .catch(function (error) {
        console.log(error);
          res.json(error)
      });
}

exports.createUser = (req, res) => {
  let serviceName = '';
  let serviceBody = {};
  if(req.body.serviceBody){
    serviceBody = req.body.serviceBody;
  } else {
      serviceBody = req.body.serviceBody;
  }
  console.log('create user.. ', serviceBody)
  axios.post(mcUrl + '/api/v1/usercreate', qs.stringify({
        name: serviceBody.name,
        passhash: serviceBody.password,
        email: serviceBody.email
      }),

  )
      .then(function (response) {
        console.log('success create user..', response.data)
        if(response.data) {
          res.json(response.data)
        } else {

        }
      })
      .catch(function (error) {
        let errMsg = qs.parse(error);
          console.log('error create user **************** ',errMsg.response.data);
          res.json( errMsg.response.data )
      });
}


exports.currentUser = (req, res) => {
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
    }
    console.log('current user.. ', serviceBody)
    axios.post(mcUrl + '/api/v1/auth/user/current', qs.stringify({

        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success current user..', response.data)
            if(response.data) {
                res.json(response.data)
            } else {

            }
        })
        .catch(function (error) {
            console.log(error);
            res.json(error)
        });
}

exports.showController = (req, res) => {
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
    }
    console.log('showController .. ', serviceBody)
    axios.post(mcUrl + '/api/v1/auth/controller/show', qs.stringify({

        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success showController..', response.data)
            if(response.data) {
                res.json(response.data)
            } else {

            }
        })
        .catch(function (error) {
            console.log(error);
            res.json(error)
        });
}

exports.showOrg = (req, res) => {
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
    }
    console.log('show org-- ', serviceBody)
    axios.post(mcUrl + '/api/v1/auth/org/show', qs.stringify({

        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show org', response.data)
            if(response.data) {
                res.json(response.data)
            } else {

            }
        })
        .catch(function (error) {
            console.log('error show org..', String(error));
            res.json({error:'Request failed'})
        });
}


/*
http --auth-type=jwt --auth=$SUPERPASS POST 127.0.0.1:9900/api/v1/auth/ctrl/ShowFlavor region=local

 */
//Flavor
exports.ShowFlavor = (req, res) => {
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me flavor-- ', serviceBody)
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
            if(response.data) {
                res.json(response.data)
            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ..', String(error));
            res.json({error:'Request failed'})
        });
}
//Cluster Flavor
exports.ShowClusterFlavor = (req, res) => {
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me cluster flavor-- ', serviceBody)
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
            if(response.data) {
                res.json(response.data)
            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ..', String(error));
            res.json({error:'Request failed'})
        });
}
//Users
exports.ShowUsers = (req, res) => {
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
    }
    console.log('show me users -- ', serviceBody)
    axios.post(mcUrl + '/api/v1/auth/role/showuser', qs.stringify({

        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show users', response.data)
            if(response.data) {
                res.json(response.data)
            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ..', String(error));
            res.json({error:'Request failed'})
        });
}
//cloudlet
exports.ShowCloudlet = (req, res) => {
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me cloudlet-- ', serviceBody)
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
            if(response.data) {
                res.json(response.data)
            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ..', String(error));
            res.json({error:'Request failed'})
        });
}
//Cluster instances
exports.ShowClusterInst = (req, res) => {
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me cluster instances-- ', serviceBody)
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
            if(response.data) {
                res.json(response.data)
            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ..', String(error));
            res.json({error:'Request failed'})
        });
}
//Apps
exports.ShowApps = (req, res) => {
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me app-- ', serviceBody)
    axios.post(mcUrl + '/api/v1/auth/ctrl/ShowApp', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success show apps', response.data)
            if(response.data) {
                res.json(response.data)
            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ..', String(error));
            res.json({error:'Request failed'})
        });
}
//app instances
exports.ShowAppInst = (req, res) => {
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('show me appinst-- ', serviceBody)
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
            if(response.data) {
                res.json(response.data)
            } else {

            }
        })
        .catch(function (error) {
            console.log('error show ..', String(error));
            res.json({error:'Request failed'})
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
 */
exports.Create = (req, res) => {
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
    console.log('show me boddy-- ', service, qs.stringify(params))
    axios.post(mcUrl + '/api/v1/auth/ctrl/'+service, qs.stringify(params),
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

            }
        })
        .catch(function (error) {
            console.log('error show ..', String(error));
            res.json({error:String(error)})
        });
}

exports.CreateOrg= (req, res) => {
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
    console.log('create organiz show me boddy-- ', params, '   token is ==',superpass)
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

            }
        })
        .catch(function (error) {
            console.log('error show ..', String(error));
            res.json({error:String(error)})
        });
}


/*
http --auth-type=jwt --auth=$ORGMANTOKEN POST 127.0.0.1:9900/api/v1/auth/role/adduser
org=bigorg username=worker1 role=DeveloperContributor
 */
exports.addUserRole= (req, res) => {
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
    console.log('add role to show me boddy-- ', params, '   token is ==',superpass)
    axios.post(mcUrl + '/api/v1/auth/role/adduser', qs.stringify(params),

//Create Flavor
exports.CreateFlavor = (req, res) => {
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    let region = 'local'
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
        region = req.body.serviceBody.region;
    }
    console.log('Create me flavor-- ', serviceBody)
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateFlavor', qs.stringify(serviceBody),

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

            }
        })
        .catch(function (error) {

            console.log('error show ..', String(error));
            res.json({error:String(error)})
        });
}

