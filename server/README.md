# mex-mwc-service


[![npm](https://img.shields.io/npm/v/react-https-redirect.svg)](https://www.npmjs.com/package/react-https-redirect)
[![npm](https://img.shields.io/npm/l/react-https-redirect.svg)](https://github.com/mbasso/react-https-redirect/blob/master/LICENSE.md)

This is a connect influxdb there mex.co as a client server middleware via express.js

> http get url
> https post 
> 


## Installation

Using [npm](https://www.npmjs.com/package/react-https-redirect):

```bash
npm install
node app.js

You can request http get method like this : 
--> http://localhost:3030/
--> http://localhost:3030/operator
```

View code :

```javascript
const express = require('express')
const app = express()
const port = 3030
const Influx = require('influxdb-nodejs');
const client = new Influx('http://uiteam:$word@40.122.54.157:8086/metrics');
//
const request = require('request');
//
app.get('/', (req, res, next) => {
    client.query('dme-api')
        .set({limit: 10})
        .then(data => res.json(data))
        .catch(err => next(err))
})

//curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/cloudlet" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt

app.get('/operator', function(req, res){
    //TODO: 2019-01-24 inki kim , request data useing post method
    // https://github.com/mbasso/react-https-redirect/blob/master/README.md
    res
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```


## Author
**Bic Tech**
- inki kim / 
- Peter hong
- HeeKang Choi

## Copyright and License
Copyright (c) 2019, Bic Tech.

source code is licensed under the [MIT License]().
