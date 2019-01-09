//import axios from 'axios';
//import fetchJsonp from 'fetch-jsonp';
import axios from 'axios-jsonp-pro';
import urlencode from 'urlencode';


//let gUrl = 'http://121.78.87.232:8080/station/';
//let gUrl = 'http://211.195.163.17:8080/station/';
let gUrl = 'http://192.168.10.42:8080/station/';
/*
신공항    : 097 <Integer>
북인천    : 098 <Integer>
청라      : 099 <Integer>
전체      : ALL <Integer>
*/
//let areaCode = ["/TCS 설비 모니터링/인천공항/", "/TCS 설비 모니터링/북인천/", "/TCS 설비 모니터링/청라/"];
let areaCode = ['27147', '26561', '37880']
/*
http://211.195.163.17:9090/station/hiway/cctvMng.do?method=dashboard_detail&mapId=40&mapPath=/TCS%20%EC%84%A4%EB%B9%84%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81/%EC%9D%B8%EC%B2%9C%EA%B3%B5%ED%95%AD/
*/

let siteAddress = {
    mapURL:'hiway/cctvMng.do?method=dashboard_detail&mapId=40'
}

    //urlencode(url, 'gbk')
let encordingURL =(url) => (
    urlencode(url, 'UTF8')
)

export function getMapURL(resource, hId, callback) {
    console.log('request data as global area code == '+global.areaCode.mainPath)
    let area = '';
    switch(global.areaCode.mainPath) {
        case '/site1': area = areaCode[0]; break;
        case '/site2': area = areaCode[1]; break;
        case '/site3': area = areaCode[2]; break;
    }



    //let url = gUrl+siteAddress[resource]+'&mapPath='+encordingURL(area);
    let url = gUrl+siteAddress[resource]+'&mapPath='+area;
    console.log('encoded url == '+url)
    callback(url);

}
