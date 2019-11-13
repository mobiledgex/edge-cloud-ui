### 라우터
1. 주소창에 입력한 주소값으로 페이지 이동
    - 주소값 : window.location.pathname
    - 페이지이동 : <Redirect push to={this.state.directLink} />
    - 페이지이동 : this.router.history.push(pathName);
#MEX

#### HighChart
1. react highchart : https://www.highcharts.com/blog/post/192-use-highcharts-to-create-charts-in-react/
2. $ npm install highcharts --save

1. https://github.com/whawker/react-jsx-highcharts

1. http://beomy.tistory.com/37
2. npm install --save react-highcharts highcharts-drilldown

1.
출처: http://beomy.tistory.com/37 [beomy]
#### spinner or loader
- http://www.davidhu.io/react-spinners/

#### Router v.4
 - react-router-dom을 사용
    1. https://perfectacle.github.io/2017/03/25/react-router-v4/


#### transitions
    - https://medium.com/appifycanada/animations-with-reacttransitiongroup-4972ad7da286
    - https://medium.com/appifycanada/reusing-reacttransitiongroup-animations-with-higher-order-components-1e7043451f91

#### TweenMax
    - https://github.com/azazdeaz/react-gsap-enhancer#demos


#### AJAX widt AXIOS
    - https://velopert.com/1552


#### JSON server 가상 운영
    - https://jsonplaceholder.typicode.com/
    - npm install -g json-server

    - https://github.com/typicode/json-server
    - $ json-server --watch db.json
    - 포트 변경 실행 : $ json-server --watch db.json --port 3004
    Create a db.json file

    {
      "posts": [
        { "id": 1, "title": "json-server", "author": "typicode" }
      ],
      "comments": [
        { "id": 1, "body": "some comment", "postId": 1 }
      ],
      "profile": { "name": "typicode" }
    }
    Now if you go to http://localhost:3004/posts/1, you'll get

#### graphQL 사용 예정
    - tutorial : https://medium.com/react-weekly/implementing-graphql-in-your-redux-app-dad7acf39e1b
    - 이미 구현 된 redux에 적용하는 방법을 위에서 설명 함


#### scroll box
 - http://smikhalevski.github.io/react-scroll-box/
 - https://www.npmjs.com/package/react-scroll-box

#### react motion
 - https://github.com/chenglou/react-motion/wiki/Gallery-of-third-party-React-Motion-demos
 - https://github.com/chenglou/react-motion/wiki/Gallery-of-third-party-React-Motion-demos
#### d3 svg
 - https://github.com/Olical/react-faux-dom

### GLOBE 3D
 - https://github.com/chrisrzhou/react-3d-globe
 - https://chrisrzhou.github.io/react-3d-globe/?selectedKind=Data%20and%20Markers&selectedStory=Bar%20Markers&full=0&addons=1&stories=1&panelRight=0

### 지도관련
 #### 지역 알아내기 : https://github.com/johan/world.geo.json/blob/master/countries.geo.json

### Chart
- https://github.com/plotly/react-plotly.js/
- https://plot.ly/javascript/react/
- 각종 차트
  : https://naver.github.io/billboard.js/


#### 써클 그라디언트 주기
 - 패스에 그라디언트(d3 v4)
   https://gist.github.com/mbostock/4163057
 - arc gradient
    http://jsfiddle.net/duopixel/GfVrK/
 - gradient circle
    http://jsfiddle.net/gerardofurtado/fro6Lu2x/
 - gradient parts
    http://jsfiddle.net/staceyburnsy/afo292ty/2/


#### zoom 
 - https://chrvadala.github.io/react-svg-pan-zoom/?knob-detectWheel=true&knob-scaleFactor=1.1&knob-scaleFactorMax=999999&knob-detectPinchGesture=true&knob-preventPanOutside=true&knob-toolbarPosition=right&knob-scaleFactorMin=0&knob-miniaturePosition=left&knob-detectAutoPan=true&knob-scaleFactorOnWheel=1.1&knob-miniatureWidth=100&selectedKind=React%20SVG%20Pan%20Zoom&selectedStory=Viewer&full=0&addons=1&stories=1&panelRight=1&addonPanel=storybooks%2Fstorybook-addon-knobs
 
 
 
#### influxdb
 - https://docs.influxdata.com/influxdb/v1.7/administration/https_setup/
 - 실행
 : $ influxd run -->  인스턴스 생성
 : $ influx  --> 인스턴스에 접
 : $ show databases;
 
 : $ CREATE DATABASE foodb
 : $ use foodb
 : $ SHOW FIELD KEYS;
 
 - 기타 설정
  : https://influxdbcom.readthedocs.io/en/latest/content/docs/v0.9/introduction/installation/ 
  : https://code.i-harness.com/ko/docs/influxdata/influxdb/v1.3/administration/config/index
  : http://blog.naver.com/PostView.nhn?blogId=alice_k106&logNo=221226137412&parentCategoryNo=&categoryNo=27&viewDate=&isShowPopularPosts=true&from=search

 - REST API
  : 명령프롬프트 상태에서 (inkis-MacBook-Pro:etc inkikim$ ) curl -G 'http://localhost:8086/query?pretty=true' --data-urlencode "db=mexTestDB" --data-urlencode "q=SELECT * FROM memory where host='server01'"

 - influxdb 환경설정
  : /usr/local/etc/influxdb.conf
  : 참고 - https://docs.influxdata.com/influxdb/v1.7/administration/https_setup/
  : 
  
  
  curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/operator" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt

#### SSL을 node.js에서 인증하기
 - https://www.namecheap.com/support/knowledgebase/article.aspx/9705/33/installing-a-ssl-certificate-on-nodejs


### Login , Mongodb, bcrypt
- https://medium.com/front-end-weekly/how-to-create-a-simple-authorization-login-using-bcrypt-react-and-ajax-d71ed919f5cb
- https://medium.com/@kouohhashi/simple-authentication-with-react-and-mongodb-dd2828cc4f16
- https://github.com/kouohhashi/react_mongo_accounts


### PM2 사용하여 서버 실행
- pm2 start app.js --interpreter ./node_modules/.bin/babel-node –
- npm install -g babel-cli
- pm2 start --interpreter babel-node server.js


### React 최적화방안
- https://marmelab.com/blog/2017/02/06/react-is-slow-react-is-fast.html 


### react drag rect zoom
- http://bl.ocks.org/jasondavies/3689931 

### popup


### Login - JWT
- jwt



### Debugging in Intellij IDE
- https로 실행되도록 설정
- middle웨어 3030도 마찬가지로 크롬브라우져에서 탭을 옆에 생성하고 보안인증 허락


### redux-form
 - semantic ur + redux-form 
   https://codesandbox.io/s/jn0w4mxm5 


### 버블차트
- https://d3indepth.com/layouts/


### Timeline horizontal
- http://sherubthakur.github.io/react-horizontal-timeline/
https://github.com/andyfaizan/react-horizontal-timeline

### Tabulator
- http://tabulator.info/