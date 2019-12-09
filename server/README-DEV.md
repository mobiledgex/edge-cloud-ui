## EXPRESS start
 - https://expressjs.com/en/starter/hello-world.html
 - 기초 (클라이언트에서 주소호출하는 방법)
 https://stackoverflow.com/questions/50983612/how-to-fetch-data-in-reactjs-from-nodejs-api-for-influxdb

 #### influxdb-nodejs
  - https://www.npmjs.com/package/influxdb-nodejs

 #### https 를  node.js에서
 - https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2
 - post https를 가져오기
 https://stackoverflow.com/questions/15254976/how-do-i-use-the-node-js-request-module-to-make-an-ssl-call-with-my-own-certific

 ### curl 명령을 nodejs에서 실행하기
 1.


 ### influxdb
 ````
 $ influx -host '40.122.54.157' -port '8086' -username 'uiteam' -password 'pa$$word'
 Connected to mexdemo.influxdb.mobiledgex.net:8086 version unknown
 InfluxDB shell version: v1.6.3
 > show databases
 name: databases
 name
 ----
 _internal
 metrics
 > use metrics
 Using database metrics
 > SELECT * FROM "dme-api" limit 10

 =================
 테이블 찾기
 $ use clusterstats
 $ show measurements
 name: measurements
 name
 ----
 crm-appinst

 ````

테이블
 - metrics
 : 테이블에 대한 정의가 필요
 - clusterstats
 : 페이지3에 대한 데이터 인지?


## create & delete
- to delete and create MobiledgeX SDK Demo application instance at operator:TDG and cloudlet:bonn-mexdemo
  show this particular clouldet
  curl -X POST “https://mexdemo.ctrl.mobiledgex.net:36001/show/appinst” -H “accept: application/json”  --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt -H “Content-Type: application/json” -d “{ \“key\“: { \“app_key\“: { \“developer_key\“: { \“name\“: \“MobiledgeX SDK Demo\” }, \“name\“: \“MobiledgeX SDK Demo\“, \“version\“: \“1.0\” }, \“cloudlet_key\“: { \“operator_key\“: { \“name\“: \“TDG\” }, \“name\“: \“bonn-mexdemo\” }, \“id\“: \“123\” }}”
  then delete and recreate…

  curl -X POST “https://mexdemo.ctrl.mobiledgex.net:36001/delete/appinst” -H “accept: application/json”  --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt -H “Content-Type: application/json” -d “{ \“key\“: { \“app_key\“: { \“developer_key\“: { \“name\“: \“MobiledgeX SDK Demo\” }, \“name\“: \“MobiledgeX SDK Demo\“, \“version\“: \“1.0\” }, \“cloudlet_key\“: { \“operator_key\“: { \“name\“: \“TDG\” }, \“name\“: \“bonn-mexdemo\” }, \“id\“: \“123\” }}”
  {
  “result”: {
   “message”: “Deleting”,
   “code”: 0
  }
  }
  {
  “result”: {
   “message”: “NotPresent”,
   “code”: 0
  }
  }
  {
  “result”: {
   “message”: “Deleted AppInst successfully”,
   “code”: 0
  }
  }
  wpark-macmac:out wonhopark$
  wpark-macmac:out wonhopark$
  wpark-macmac:out wonhopark$
  wpark-macmac:out wonhopark$ curl -X POST “https://mexdemo.ctrl.mobiledgex.net:36001/create/appinst” -H “accept: application/json”  --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt -H “Content-Type: application/json” -d “{ \“key\“: { \“app_key\“: { \“developer_key\“: { \“name\“: \“MobiledgeX SDK Demo\” }, \“name\“: \“MobiledgeX SDK Demo\“, \“version\“: \“1.0\” }, \“cloudlet_key\“: { \“operator_key\“: { \“name\“: \“TDG\” }, \“name\“: \“bonn-mexdemo\” }, \“id\“: \“123\” }}”
  {
  “result”: {
   “message”: “Creating”,
   “code”: 0
  }
  }
  {
  “result”: {
   “message”: “Ready”,
   “code”: 0
  }
  }
  {
  “result”: {
   “message”: “Created successfully”,
   “code”: 0
  }
  }


### 로그인
 - https://medium.com/@kouohhashi/simple-authentication-with-react-and-mongodb-dd2828cc4f16


### redux-form
 - semantic ur + redux-form 
   https://codesandbox.io/s/jn0w4mxm5 
   
 
### websocket
 -  corss 이슈 : 
 - https://github.com/facebook/create-react-app/issues/8075
