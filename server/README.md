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
set Environment
$ export MC_URL=https://mc-stage.mobiledgex.net:9900
$ npm install
$ node start.js 
or $ npm run start_server


You can request http get method like this : 
--> https://localhost:3030/
--> https://localhost:3030/operator
```
You need MongoDB. Here's an example of installing MongoDB on mac os X
```
brew update   
brew install mongodb
cd server  
mkdir mongodb_data  
mongod --dbpath mongodb_data/ 
```



Create account DB :

```javascript
in new terminal window
%%%% You did not below step, If you alredy created as doing registry 'createAccount' url
$ mongo
> show dbs or show collections 
> use mex-mwc-mongo
> db.createCollection('users')
> use mex-mwc-mongo
```


## Author
**Bic Tech**
- inki kim / 
- Peter hong
- HeeKang Choi

## Copyright and License
Copyright (c) 2019, Bic Tech.

source code is licensed under the [MIT License]().
