import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as serviceMC from '../services/serviceMC';
import './siteThree.css';
import RegistryViewer from "../container/registryViewer";



let _self = null;

class SiteFourPageAppReg extends React.Component {
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
            edit:false
        };
        this.headerH = 70;
        this.hgap = 0;
        this.userToken = null;
    }
    gotoUrl(site, subPath) {
        let mainPath = site;
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})

    }
    gotoApp() {
        let mainPath = '/site4';
        let subPath = 'pg=6';
        _self.props.history.push({
            pathname: mainPath,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})
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

        if(this.props.editable) {
            this.setState({edit:this.props.editable})
        }
    }
    componentWillUnmount() {
        
    }
    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

        this.getDataDeveloper(store ? store.userToken : 'null', this.props.region.value)
    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})


    }

    receiveResult(mcRequest) {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                _self.setState({ devData: response })
            }
        }
    }

    getDataDeveloper(token, region) {
        serviceMC.sendRequest(_self, { token: token, method: serviceMC.getEP().SHOW_APP, data: { region: (region === 'All') ? 'US' : region } }, _self.receiveResult)
    }

    /*
     */
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (

            <RegistryViewer devData={this.state.devData} gotoApp={this.gotoApp} editMode={this.state.edit}/>
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
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageAppReg)));
