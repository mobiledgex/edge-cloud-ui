import React from 'react';
import { Grid, Image, Header, Menu, Dropdown, Button } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import AccountListView from '../container/accountsListView';
import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

import * as services from '../services/service_compute_service';
import './siteThree.css';


let devOptions = [ { key: 'af', value: 'af', text: 'SK Telecom' } ]
/*
{ Name: 'bickhcho1',
       Email: 'whrjsgml111@naver.com',
       EmailVerified: true,
       Passhash: '',
       Salt: '',
       Iter: 0,
       FamilyName: '',
       GivenName: '',
       Picture: '',
       Nickname: '',
       CreatedAt: '2019-05-23T06:29:01.794715Z',
       UpdatedAt: '2019-05-23T06:30:42.082077Z',
       Locked: false }

 */
let _self = null;
class SiteFourPageAccount extends React.Component {
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
        this.hiddenKeys = ['Passhash', 'Salt', 'Iter','FamilyName','GivenName','Picture','Nickname','CreatedAt','UpdatedAt']
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
        console.log('info..will mount ', this.columnLeft)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {
        console.log('info.. ', this.childFirst, this.childSecond)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if(store.userToken) {
            this.getDataDeveloper(store.userToken);
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})

        if(nextProps.computeRefresh.compute) {
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            if(store.userToken) this.getDataDeveloper(store.userToken);
            this.props.handleComputeRefresh(false);
        }
    }
    receiveResult = (result) => {
        this.props.handleLoadingSpinner(false);
        let reverseResult = result.reverse();
        _self.setState({devData:reverseResult})
    }
    getDataDeveloper(token) {
        _self.props.handleLoadingSpinner(true)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        services.getMCService('ShowAccounts',{token:store.userToken}, _self.receiveResult)
    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (

            <AccountListView devData={this.state.devData} headerLayout={this.headerLayout} siteId={'Account'} dataRefresh={this.getDataDeveloper} hiddenKeys={this.hiddenKeys}></AccountListView>

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
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageAccount)));
