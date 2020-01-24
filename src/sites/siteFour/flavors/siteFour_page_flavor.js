import React from 'react';
import sizeMe from 'react-sizeme';
import DeveloperListView from '../../../container/developerListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import * as serviceMC from '../../../services/serviceMC';
import '../../siteThree.css';


let devOptions = [{ key: 'af', value: 'af', text: 'SK Telecom' }]

let _self = null;
let rgn = [];
class SiteFourPageFlavor extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight: 0,
            contWidth: 0,
            bodyHeight: 0,
            activeItem: 'Developers',
            devData: [],
            regionToggle: false
        };
        this.requestCount = 0;
        this.multiRequestData = [];
        this.headerH = 70;
        this.hgap = 0;
        this.headerLayout = [1, 4, 4, 4, 4, 3]
    }
    gotoUrl(site, subPath) {
        let mainPath = site;
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })

    }
    //go to
    gotoPreview(site) {
        //브라우져 입력창에 주소 기록
        let mainPath = site;
        let subPath = 'pg=0';
        _self.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })

    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    onHandleRegistry() {
        this.props.handleInjectDeveloper('userInfo');
    }
    componentWillMount() {
        this.setState({ bodyHeight: (window.innerHeight - this.headerH) })
        this.setState({ contHeight: (window.innerHeight - this.headerH) / 2 - this.hgap })
    }
    componentDidMount() {
       
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ bodyHeight: (window.innerHeight - this.headerH) })
        this.setState({ contHeight: (nextProps.size.height - this.headerH) / 2 - this.hgap })

        if (nextProps.computeRefresh.compute) {
            this.getDataDeveloper(nextProps.changeRegion);
            this.props.handleComputeRefresh(false);
        }
        if (this.props.changeRegion !== nextProps.changeRegion) {
            this.getDataDeveloper(nextProps.changeRegion);
        }
        if (nextProps.regionInfo.region.length && !this.state.regionToggle) {
            _self.setState({ regionToggle: true })
            this.getDataDeveloper(nextProps.changeRegion, nextProps.regionInfo.region);
        }

    }

    receiveResult = (mcRequest) => {
        _self.requestCount -= 1;
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                if (response.data.length > 0) {
                    _self.multiRequestData = [..._self.multiRequestData, ...response.data]
                }
            }
        }

        if (_self.requestCount === 0) {
            if (_self.multiRequestData.length > 0) {
                _self.setState({
                    devData: _self.multiRequestData
                })
            } else {
                _self.props.handleComputeRefresh(false);
                _self.props.handleAlertInfo('error', 'Requested data is empty')
            }
        }
    }

    getDataDeveloper = (region, regionArr) => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({ devData: [] })
        this.multiRequestData = [];
        this.requestCount = 0;

        if (region !== 'All') {
            rgn = [region]
        } else {
            rgn = (regionArr) ? regionArr : this.props.regionInfo.region;
        }
        
        if (rgn && rgn.length > 0) {
            this.requestCount = rgn.length;
            rgn.map((item) => {
                let requestData = { token: store ? store.userToken : 'null', method: serviceMC.getEP().SHOW_FLAVOR, data: { region: item } };
                serviceMC.sendRequest(_self, requestData, _self.receiveResult)
            })
        }
    }
    render() {
        return (
            <DeveloperListView devData={this.state.devData} headerLayout={this.headerLayout} siteId={'Flavors'} dataRefresh={this.getDataDeveloper}></DeveloperListView>
        );
    }

};

const mapStateToProps = (state) => {
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    return {
        computeRefresh: (state.computeRefresh) ? state.computeRefresh : null,
        changeRegion: state.changeRegion.region ? state.changeRegion.region : null,
        regionInfo: regionInfo
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) },
        handleInjectData: (data) => { dispatch(actions.injectData(data)) },
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data)) },
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageFlavor)));
