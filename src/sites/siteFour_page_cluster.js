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
class SiteFourPageCluster extends React.Component {
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
        this.headerLayout = [1,3,2,2,3,2,3]
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
        console.log('info..will mount page one  0000   ', this.columnLeft)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {
        console.log('info.. ', this.childFirst, this.childSecond)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        console.log('info.. store == ', store)
        if(store.userToken) {
            this.getDataDeveloper(store.userToken);
        } else {
            Alert.error('Invalid or expired token', {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
            setTimeout(()=>_self.gotoPreview('/Logout'), 2000)
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})

    }
    receiveResult(result) {
        console.log("receive cluster== ", result)
        if(result.error) {
            Alert.error(result.error, {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });

        } else {
            _self.setState({devData:result})

        }
    }
    getDataDeveloper(token) {
        //services.getComputeService('cluster', this.receiveResult)
        services.getMCService('ShowClusterFlavor',{token:token, region:'US'}, _self.receiveResult)
    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (

            <DeveloperListView devData={this.state.devData} headerLayout={this.headerLayout}></DeveloperListView>

        );
    }

};


const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))}
    };
};

export default withRouter(connect(null, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageCluster)));
