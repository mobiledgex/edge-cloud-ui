import * as reducer from '../../utils'

let rgn = [];
const receiveResultApp = (result) => {
    if(result.error && result.error.indexOf('Expired') > -1) {
        _self.props.handleAlertInfo('error', result.error);
        setTimeout(() => _self.gotoUrl('/logout'), 4000);
        _self.props.handleLoadingSpinner(false);
        return;
    }

    let regionGroup = (!result.error) ? reducer.groupBy(result, 'Region'):{};
    if(Object.keys(regionGroup)[0]) {
        _self._AppInstDummy = _self._AppInstDummy.concat(result)
    }
    _self.loadCount ++;
    if(rgn.length == _self.loadCount){
        _self.countJoin()
    }
    _self.props.handleLoadingSpinner(false);

}
const countJoin = () => {
    let AppInst = this._AppInstDummy;
    _self.setState({devData:AppInst,dataSort:false})
    this.props.handleLoadingSpinner(false);

}
export const setRegion =(rgn) => {
    rgn = rgn;
}
export const getDataofAppinst = (region,regionArr) => {
    this.props.handleLoadingSpinner(true);
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    let serviceBody = {}
    this.loadCount = 0;
    this.setState({devData:[]})
    this._AppInstDummy = []
    if(region !== 'All'){
        rgn = [region]
    } else {
        rgn = (regionArr)?regionArr:this.props.regionInfo.region;
    }

    if(localStorage.selectRole == 'AdminManager') {
        rgn.map((item) => {
            // All show appInst
            services.getMCService('ShowAppInst',{token:store ? store.userToken : 'null', region:item}, _self.receiveResultApp)
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
            services.getMCService('ShowAppInsts',serviceBody, _self.receiveResultApp)
        })
    }
}
