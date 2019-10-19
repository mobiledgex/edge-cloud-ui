
import axios from 'axios-https-proxy-fix';

const API_KEY = '__apiMC_key__'
let mcUrl = 'https://mc.mobiledgex.net:9900';
let mcDevUrl = 'https://mc-stage.mobiledgex.net:9900';
let _version = 'v0.0.0';


/*
http --auth-type=jwt --auth=$SUPERPASS POST https://mc.mobiledgex.net:9900/api/v1/auth/audit/showself <<< '{}'​
http --auth-type=jwt --auth=$SUPERPASS POST https://mc.mobiledgex.net:9900/api/v1/auth/audit/showorg <<< '{"org":"MobiledgeX"}'

 */
//app instances
exports.ShowSelf = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceBody = {};
    let superpass = '';
    console.log('service body is .. ', req.body.serviceBody)
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
    }
    console.log('show audit self.. ', serviceBody, mcUrl)
    axios.post(mcUrl + '/api/v1/auth/audit/showself', serviceBody,
        {headers: {'Authorization':`Bearer ${superpass}`}}
    )
        .then(function (response) {
            if(response.data && response.statusText === 'OK') {
                console.log('success show audit == ')
                res.json(response.data)

            } else {
                res.json({error:'Request failed'})
            }
        })
        .catch(function (error) {
            console.log('error show ..', String(error));
            res.json({error:'Request failed'})
        });
}


exports.ShowOrg = (req, res) => {
    if(process.env.MC_URL) mcUrl =  process.env.MC_URL;
    let serviceBody = {};
    let superpass = '';
    if(req.body.serviceBody){
        serviceBody = req.body.serviceBody.params;
        superpass = req.body.serviceBody.token;
    }

    axios.post(mcUrl + '/api/v1/auth/audit/showorg', serviceBody,
        {headers: {'Authorization':`Bearer ${superpass}`}}
    )
        .then(function (response) {
            console.log('20190719 success show audit org', response.data)
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



