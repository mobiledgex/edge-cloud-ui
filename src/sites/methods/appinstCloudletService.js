import * as reducer from '../../utils'
import * as serviceMC from '../../services/serviceMC'

let rgn = [];
const receiveResultApp = (mcRequest) => {
    let result = mcRequest.data;
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
            serviceMC.sendRequest({ token: store ? store.userToken : 'null', method: serviceMC.getEP().SHOW_APP_INST, data: { region: item } }, _self.receiveResultApp)
        })
    } else {
        rgn.map((item) => {
            serviceBody = {
                method:serviceMC.getEP().SHOW_APP_INST,
                token:store.userToken,
                data: {
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
            serviceMC.sendRequest(serviceBody, _self.receiveResultApp)
        })
    }
}
