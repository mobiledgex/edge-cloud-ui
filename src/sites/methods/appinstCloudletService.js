import * as reducer from '../../utils'
import * as services from '../../services/service_compute_service';

let rgn = [];
let props = {};
let loadCount = 0;
let _AppInstDummy = [];
let returnData = null;

const gotoUrl = (site, subPath) => {
    props.history.push({
        pathname: site,
        search: subPath
    });
    props.history.location.search = subPath;

}
const receiveResultApp = (result) => {
    if(result.error && result.error.indexOf('Expired') > -1) {
        props.handleAlertInfo('error', result.error);
        setTimeout(() => gotoUrl('/logout'), 4000);
        props.handleLoadingSpinner(false);
        return;
    }

    let cloudletGroup = (!result.error) ? reducer.groupBy(result, 'Cloudlet'):{};
    if(Object.keys(cloudletGroup)[0]) {
        _AppInstDummy = _AppInstDummy.concat(result)
    }
    loadCount ++;
    if(rgn.length == loadCount){
        countJoin(_AppInstDummy)
    }
    props.handleLoadingSpinner(false);

}
const countJoin = (_AppInstDummy) => {
    let appInst = [];
    appInst = reducer.groupBy(_AppInstDummy, 'Cloudlet')
    returnData(appInst)
    props.handleLoadingSpinner(false);
    // TODO :  결과값을 차트에 적용하기
}
export const setProps =(_rgn, _props, _return) => {
    rgn = _rgn;
    props = _props;
    returnData = _return;
}
export const getDataofAppinst = (region,regionArr) => {
    props.handleLoadingSpinner(true);
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    let serviceBody = {}
    loadCount = 0;
    //setState({devData:[]})
    _AppInstDummy = []
    if(region !== 'All'){
        rgn = [region]
    } else {
        rgn = (regionArr)?regionArr:props.regionInfo.region;

    }

    let _store={
        "email": "mexadmin",
        "password": "mexadmin123",
        "userToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY3MzY0OTIsImlhdCI6MTU3NjY1MDA5MiwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.Cb4vFGypczftq4cJOamHi3kI810PNKsV6oWHD05eJAAUH0Wo5hCka0zzaR6N6jnprsArMUvGZCL9ezAHj0WJ-A"
    }

    if(localStorage.selectRole == 'AdminManager') {
        rgn.map((item) => {
            // All show appInst

            services.getMCService('ShowAppInst',{token:store ? store.userToken : 'null', region:item}, receiveResultApp)

        })
    } else {
        rgn.map((item) => {
            serviceBody = {
                "token":store.userToken,
                "params": {
                    "region":item,
                    "appinst":{
                        "key":{
                            "app_key": {
                                "developer_key":{"name":localStorage.selectOrg},
                            }
                        }
                    }
                }
            }
            // org별 show appInst

            services.getMCService('ShowAppInsts',serviceBody, receiveResultApp)

        })
    }
}
