import React from 'react';
import sizeMe from 'react-sizeme';
import DeveloperListView from '../../container/developerListView';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import * as serviceMC from '../../services/serviceMC';
import '../siteThree.css';

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

    receiveResult = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                let reverseResult = response.data.reverse();
                _self.setState({ devData: reverseResult })
                _self.props.handleLoadingSpinner(false);
            }
        }
        _self.props.handleLoadingSpinner(false);
    }
    getDataDeveloper(token) {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        serviceMC.sendRequest(_self, { token: store ? store.userToken : 'null', method: serviceMC.getEP().SHOW_USERS }, _self.receiveResult)
        this.props.handleLoadingSpinner(true);
    }
    render() {
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
