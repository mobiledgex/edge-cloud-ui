import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serviceMC from '../../../services/serviceMC';
import '../../siteThree.css';

import RegistryClusterInstViewer from "../../../container/registryClusterInstViewer";



let _self = null;

class SiteFourPageClusterInstReg extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight:0,
            contWidth:0,
            bodyHeight:0,
            activeItem: 'Developers',
            devData:[],
            cloudlets:[],
            operators:[],
            clustinst:[],
            apps:[],
        };
        this.headerH = 70;
        this.hgap = 0;
        this.headerLayout = [2,2,1,3,2,1,1,2,2];
        this.hiddenKeys = ['ImagePath', 'DeploymentMF', 'ImageType']
        this.userToken = null;
    }
    gotoUrl(site, subPath) {
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;

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
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})

    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    onHandleRegistry() {
        this.props.handleInjectDeveloper('userInfo');
    }
    componentWillMount() {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

        if(store && store.userToken) {
            if(this.props.region.value) {
                this.getDataDeveloper(store.userToken, this.props.region.value)
            }
            this.userToken = store.userToken;
        } else {
            this.props.handleAlertInfo('error','Invalid or expired token')
            setTimeout(()=>_self.gotoPreview('/logout'), 2000)
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})


    }

    receiveResult(mcRequest) {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                _self.props.handleInjectFlavor(response.data)
            }
        }
    }

    receivePrivacyResponse(mcRequest){
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                _self.props.handleInjectPrivacy(response.data)
            }
        }
    }

    gotoUrl() {
        _self.props.history.push({
            pathname: '/site4',
            search: 'pg=4'
        });
        _self.props.history.location.search = 'pg=4';
        _self.props.handleChangeSite({mainPath:'/site4', subPath: 'pg=4'})
    }

    getDataDeveloper(token, region) {

        //serviceMC.sendRequest(_self, {token:token, method:serviceMC.getEP().SHOW_FLAVOR, data:{region:(region === 'All') ? 'US' : region}}, _self.receiveResult)
        //serviceMC.sendRequest(_self, {token:token, method:serviceMC.getEP().SHOW_PRIVACY_POLICY, data:{region:(region === 'All') ? 'US' : region}}, _self.receivePrivacyResponse)
    }

    /*
     */
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (

            <RegistryClusterInstViewer devData={this.state.devData} gotoUrl={this.gotoUrl}/>
        );
    }

};
const mapStateToProps = (state) => {
    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};
    return {

        region:region
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleInjectFlavor: (data) => { dispatch(actions.showFlavor(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageClusterInstReg)));
