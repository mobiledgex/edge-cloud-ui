
import axios from 'axios-https-proxy-fix';
import qs from "qs";
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
    console.log('show audit self.. ', mcUrl)
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
    console.log('show audit org..........>>>>> ', mcUrl)
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


/***************
 * send mail to audit
 */
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
let smtpTrans = null;

exports.SendMail = (req, res) => {
    if (process.env.MC_URL) mcUrl = process.env.MC_URL;
    if(process.env.SMTP_TRANS) smtpTrans =  JSON.parse(process.env.SMTP_TRANS);
    let serviceName = '';
    let serviceBody = {};
    let superpass = '';
    if (req.body.serviceBody) {
        serviceBody = {
            fromEmail: req.body.serviceBody.fromEmail,
            toEmail: req.body.serviceBody.toEmail,
            audit: req.body.serviceBody.message,
            title: req.body.serviceBody.title,
            traceId: req.body.serviceBody.traceId
        };
        superpass = req.body.serviceBody.token;
    }
    console.log('send email  -- ', qs.stringify(serviceBody), 'mcUrl=', mcUrl, 'token=', superpass)

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transDefault = {
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'from@email.com', // generated ethereal user
            pass: 'password' // generated ethereal password
        }
    }
    let transObj = (smtpTrans) ? smtpTrans : transDefault ;

    let transporter = nodemailer.createTransport(smtpTransport(transObj));

    var mailOptions = {
        from: serviceBody.fromEmail || '',
        to: serviceBody.toEmail || '',
        subject: serviceBody.title || 'Sending Email from the Mobiledgex',
        text: JSON.stringify(serviceBody.audit) || 'No Contents'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });






}
