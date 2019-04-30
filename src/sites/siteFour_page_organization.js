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
import Alert from "react-s-alert";


let devOptions = [ { key: 'af', value: 'af', text: 'SK Telecom' } ]

let _self = null;
class SiteFourPageOrganization extends React.Component {
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
        this.headerLayout = [2,2,3,3,6]
        //this.hideHeader = ['Address','Phone']
    }

    //go to
    gotoPreview(site, page) {
        //브라우져 입력창에 주소 기록
        let mainPath = site;
        let subPath = page;
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
        console.log('info..will mount ', this.columnLeft)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        console.log('info.. store == ', store)
        if(store.userToken) this.getDataDeveloper(store.userToken);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})
        // if(nextProps.userToken) {
        //     this.getDataDeveloper(nextProps.userToken);
        // }
        // console.log(nextProps.computeRefresh)
        if(nextProps.computeRefresh.compute) {
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            this.getDataDeveloper(store.userToken);
            this.props.handleComputeRefresh(false);
        }

    }
    receiveResult = (result,resource, self) => {
        this.props.handleLoadingSpinner(false);
        console.log("receive == ", result, resource, self)
        if(result.error) {
            Alert.error('Invalid or expired token', {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
            setTimeout(()=>_self.gotoPreview('/site4', 'page=newOrg'), 2000)
        } else {
            _self.setState({devData:result})
            //TODO: 20190419 save orgizations name to localstore
            let orgData = [];
            result.map((item)=>{
                if(item.Type === 'operator') orgData.push(item.Organization)
            })
            localStorage.setItem('organization', JSON.stringify({"list":orgData}));
        }
    }
    getDataDeveloper(token) {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        services.getMCService('showOrg',{token:store.userToken}, _self.receiveResult)
    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (
            <DeveloperListView devData={this.state.devData} headerLayout={this.headerLayout} hideHeader={this.hideHeader} siteId={"Organization"} dataRefresh={this.getDataDeveloper}></DeveloperListView>
            // <DeveloperListView headerLayout={this.headerLayout}></DeveloperListView>
        );
    }

};

const mapStateToProps = (state) => {
    console.log('props in userToken..', state)
    return {
        userToken : (state.user.userToken) ? state.userToken: null,
        userInfo: state.user.user,
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageOrganization)));
