import * as reducer from '../../utils'
import * as serviceMC from '../../services/serviceMC'

let rgn = [];

const receiveResultApp = (mcRequest) => {
    let regionGroup = {};
    if (mcRequest) {
        if (mcRequest.response) {
            let response = mcRequest.response;
            regionGroup = reducer.groupBy(response.data, 'Region');
            if (Object.keys(regionGroup)[0]) {
                _self._AppInstDummy = _self._AppInstDummy.concat(response.data)
            }
            _self.loadCount++;
            if (rgn.length == _self.loadCount) {
                countJoin()
            }
        }
    }
    _self.props.handleLoadingSpinner(false);

}
const countJoin = () => {
    let AppInst = this._AppInstDummy;
    _self.setState({devData:AppInst,dataSort:false})

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
            serviceMC.sendRequest(_self, { token: store ? store.userToken : 'null', method: serviceMC.getEP().SHOW_APP_INST, data: { region: item } }, receiveResultApp)
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
            serviceMC.sendRequest(_self, serviceBody, receiveResultApp)
        })
    }
}
