import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import '../../siteThree.css';
import RegistryInstViewer from "../../../container/registryInstViewer";



let _self = null;

class SiteFourPageAppInstReg extends React.Component {
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
        this.headerLayout = [2,2,1,3,2,1,1,2,2];
        this.hiddenKeys = ['ImagePath', 'DeploymentMF', 'ImageType']
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
        _self.setState({ page:subPath})

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


        // if(store.userToken) {
        //     if(this.props.region.value) {
        //         this.getDataDeveloper(store.userToken, this.props.region.value)
        //     }
        //     this.userToken = store.userToken;
        // } else {
        //     Alert.error('Invalid or expired token', {
        //         position: 'top-right',
        //         effect: 'slide',
        //         timeout: 5000
        //     });
        //     setTimeout(()=>_self.gotoPreview('/Logout'), 2000)
        // }



    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})

        if(this.props.editable) {
            this.setState({edit:this.props.editable})
        }

    }
    receiveResult(result) {
        // @inki if data has expired token
        if(result.error && result.error.indexOf('Expired') > -1) {
            _self.props.handleAlertInfo('error', result.error);
            setTimeout(() => _self.gotoUrl('/logout'), 4000);
            return;
        }

        if(result.error) {
            _self.props.handleAlertInfo('error',result.error)
        } else {
            _self.setState({devData:result})
        }
    }

    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (

            <RegistryInstViewer devData={this.state.devData} editMode={this.state.edit}/>
        );
    }

};
const mapStateToProps = (state) => {
    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};
    let editObj = state.editInstance.data;
    //if(editObj) alert('eidtObj..'+JSON.stringify(editObj))
    return {
        editObj:editObj,
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageAppInstReg)));
