import sha256 from 'sha256'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

import axios from "axios-https-proxy-fix";
import qs from "qs";

const API_KEY = '__apiMC_key__'
let mcUrl = 'https://mc.mobiledgex.net:9900';
let mcDevUrl = 'https://mc-stage.mobiledgex.net:9900';
let _version = 'v0.0.0';


//app instances
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
    console.log('20190719 show me cluster health-- ', serviceBody, 'mcUrl=',mcUrl, 'token=', superpass)
    axios.post(mcUrl + '/api/v1/auth/metrics/cluster', serviceBody,
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
    console.log('Create me cloudlet-- ', serviceBody, 'mcUrl=',mcUrl)
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

