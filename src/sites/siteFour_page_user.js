import React from 'react';
import { Grid, Image, Header, Menu, Dropdown, Button } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import DeveloperListView from '../container/developerListView';
import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

import * as services from '../services/service_compute_service';
import './siteThree.css';
import MapWithListView from "./siteFour_page_six";


let devOptions = [ { key: 'af', value: 'af', text: 'SK Telecom' } ]

let _self = null;
class SiteFourPageUser extends React.Component {
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
            devData:[]
        };
        this.headerH = 70;
        this.hgap = 0;
        this.headerLayout = [4,4,4,3]
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
            this.getDataDeveloper(store.userToken);
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})

        if(nextProps.computeRefresh.compute) {
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            if(store && store.userToken) this.getDataDeveloper(store.userToken);
            this.props.handleComputeRefresh(false);
        }
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
    receiveResult = (result) => {
        // @inki if data has expired token
        if(result.error && result.error.indexOf('Expired') > -1) {
            _self.props.handleAlertInfo('error', result.error);
            setTimeout(() => _self.gotoUrl('/logout'), 4000);
            _self.props.handleLoadingSpinner(false);
            return;
        }
        let reverseResult = result.reverse();
        _self.setState({devData:reverseResult})
        _self.props.handleLoadingSpinner(false);
    }
    getDataDeveloper(token) {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        services.getMCService('ShowUsers',{token:store ? store.userToken : 'null'}, _self.receiveResult)
        this.props.handleLoadingSpinner(true);
    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (

            <DeveloperListView devData={this.state.devData} headerLayout={this.headerLayout} siteId={'User'} dataRefresh={this.getDataDeveloper}></DeveloperListView>

        );
    }

};

const mapStateToProps = (state) => {
    return {
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))},
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageUser)));
