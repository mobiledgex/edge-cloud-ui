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
        name: serviceBody.username,
        passhash: serviceBody.passhash,
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
        console.log(error);
          res.json(error)
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
    console.log('show me flavor-- ', serviceBody)
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

/*
{
"region":"local",
"cloudlet":{"key":{"operator_key":{"name":"bigwaves"},"name":"oceanview"},
"location":{"latitude":1,"longitude":1,"timestamp":{}},
"ip_support":2,
"num_dynamic_ips":30}
}
 */
exports.CreateCloudlet = (req, res) => {
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
    axios.post(mcUrl + '/api/v1/auth/ctrl/CreateCloudlet', qs.stringify({
            region:region
        }),
        {
            headers: {
                'Authorization':`Bearer ${superpass}`}
        }
    )
        .then(function (response) {
            console.log('success create cloudlet', response.data)
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
