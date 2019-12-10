import React from 'react';
import { Grid, Image, Header, Menu, Dropdown, Button } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import InstanceListView from '../container/instanceListView';
import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import PageDetailViewer from '../container/pageDetailViewer';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as services from '../services/service_audit_api';
import './siteThree.css';
import TimelineAuditView from "../container/timelineAuditView";
import Alert from "react-s-alert";
import * as reducer from '../utils'


let _self = null;
let rgn = ['US','KR','EU'];
class SiteFourPageAudits extends React.Component {
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
            viewMode:'listView',
            auditMounted:false
        };
        this.headerH = 70;
        this.hgap = 0;
        this.hiddenKeys = ['Ip_support', 'Num_dynamic_ips','Status','Physical_name','Platform_type'];
        this.headerLayout = [1,3,3,3,2,2,2];
        this.userToken = null;
        this._devData = [];
        this.loadCount = 0;
        this._cloudletDummy = [];
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
    readyToData(subPaths) {
        console.log('20191018 subPaths.subPaths...', subPaths,":",subPaths.indexOf('&org='))
        let subPath = '';
        let subParam = null;
        if(subPaths.indexOf('&org=') > -1) {
            let paths = subPaths.split('&')
            subPath = paths[0];
            subParam = paths[1];
        }
        this.setState({devData:[]})
        this.setState({page:subPath, OrganizationName:subParam})
        this.props.handleLoadingSpinner(true);
        // get audits data
        this.getDataAudit(subParam);
    }


    componentWillMount() {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {

        if(this.props.location && this.props.location.search) {
            this.readyToData(this.props.location.search)

        }
    }
    componentWillUnmount() {
        this._devData = [];
        this._cloudletDummy = [];

    }


    componentWillReceiveProps(nextProps, nextContext) {

        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})
        if(nextProps.viewMode) {
            if(nextProps.viewMode === 'listView') {
                this.setState({viewMode:nextProps.viewMode})
            } else {
                this.setState({viewMode:nextProps.viewMode})
                setTimeout(() => this.setState({detailData:nextProps.detailData}), 300)
            }
        }
        //
        if(nextProps.location && nextProps.location.search && (nextProps.location.search !== this.props.location.search)) {
            console.log('20191018 nextProps.props...', nextProps.location.search, ":", this.props.location.search)
            this.setState({auditMounted:true})
            this.readyToData(nextProps.location.search);
        }

    }
    reduceAuditCount(all, data) {
        let itemArray = [];
        let addArray = [];
        let savedArray = localStorage.getItem('auditUnChecked');
        let checkedArray = localStorage.getItem('auditChecked');
        let checked = [];
        console.log('20191105 item is -- ', all, "  :  ",  JSON.parse(savedArray), typeof  JSON.parse(savedArray))
        if(all.error) {
            this.props.handleAlertInfo('error', all.error)
        } else {
            all.map((item, i) => {
                if(savedArray && JSON.parse(savedArray).length) {
                    console.log('20191022 item is -- ', JSON.parse(savedArray).findIndex(k => k==item.traceid) )
                    //이전에 없던 데이터 이면 추가하기
                    if(JSON.parse(savedArray).findIndex(k => k==item.traceid) === -1) addArray.push(item.traceid)
                } else {
                    itemArray.push(item.traceid)
                }
            })

            if(addArray.length) {
                console.log('20191022 if has new data ... ', addArray)
                JSON.parse(savedArray).concat(addArray);
            }


            // 이제 새로운 데이터에서 체크된 오딧은 제거
            let checkResult = null;

            if(savedArray && JSON.parse(savedArray).length) {
                checkResult = JSON.parse(savedArray);
            } else if(itemArray.length) {
                checkResult = itemArray;
            }

            checked = (checkedArray) ? JSON.parse(checkedArray) : [];
            console.log('20191022  unchecked... is -- ',checkResult.length, ":", checked.length," - ", (checkResult.length - checked.length))
            this.props.handleAuditCheckCount(checkResult.length - checked.length)
            localStorage.setItem('auditUnChecked', JSON.stringify(checkResult))
        }


    }

    receiveResult = (result, resource, self, body) => {
        // @inki if data has expired token
        console.log('20191106 receive result...', result, ":",resource)
        if(result.error && result.error.indexOf('Expired') > -1) {
            _self.props.handleAlertInfo('error', result.error);
            setTimeout(() => _self.gotoUrl('/logout'), 4000);
            _self.props.handleLoadingSpinner(false);
            return;
        } else if(result.error) {
            _self.props.handleAlertInfo('error', result.error);
        }

        let unchecked = result.data.length;
        let checked = localStorage.getItem('auditChecked')
        if(resource === 'ShowSelf' || resource === 'ShowOrg') {
            console.log('20191106 audit result..', result,":",resource, ": unchecked : ", unchecked)
            _self.reduceAuditCount(result.data, checked)

        }
        _self.setState({devData:result, auditMounted:true})
        _self.props.handleLoadingSpinner(false);
        if(rgn.length == this.loadCount-1){
            return
        }


    }
    countJoin() {
        let cloudlet = this._cloudletDummy;
        _self.setState({devData:cloudlet})
        this.props.handleLoadingSpinner(false);
    }
    makeOga = (logName) => {
        let lastSub = logName.substring(logName.lastIndexOf('=')+1);
        return lastSub
    }
    getDataAudit = (orgName) => {
        // this.props.handleLoadingSpinner(true);
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({devData:[]})
        this._cloudletDummy = [];
        _self.loadCount = 0;

        if(orgName) {
            services.showAuditOrg('ShowOrg',{token:store.userToken, params:{"org":_self.makeOga(orgName)}}, _self.receiveResult, _self)
        } else {
            services.showAuditSelf('ShowSelf',{token:store.userToken, params:'{}'}, _self.receiveResult, _self)
        }
    }
    selectedAudit = (selectedAudit) => {
        // if get same item find from storage should remove it.
        let savedData = localStorage.getItem('auditUnChecked');
        let checkData = localStorage.getItem('auditChecked');
        let newCheckData = null;
        let newData = null;
        if(savedData) {
            let parseSavedData = JSON.parse(savedData)
            newData = parseSavedData.filter(function(item) {
                return item !== selectedAudit.traceid
            })
            newCheckData = JSON.parse(checkData);

            if(newCheckData) {
                //만약 이미 체크된 오딧 이면 배열에 넣지 않는다
                if(newCheckData.findIndex(k => k==selectedAudit.traceid) === -1) {
                    newCheckData.push(selectedAudit.traceid)
                } else {

                }

            } else {
                newCheckData = [selectedAudit.traceid]
            }
            console.log('20191022 newData // newCheckData ...', newCheckData, ":", typeof newCheckData)


        }
        //console.log('20191022 filtering audit checked ...', newData, ":", newData.length)
        localStorage.setItem('auditChecked', JSON.stringify(newCheckData))

        //refresh number badge of Audit Log button
        let allCnt = JSON.parse(savedData).length;
        let selectedCnt = newCheckData.length;
        if(newData && newData.length) _self.props.handleAuditCheckCount(allCnt - selectedCnt)

    }

    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem, viewMode } = this.state;
        let randomValue = Math.round(Math.random() * 100);
        return (
            (viewMode === 'listView')?
            <TimelineAuditView data={this.state.devData} randomValue={randomValue} headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId={'Audit'} userToken={this.userToken} mounted={this.state.auditMounted} handleSelectedAudit={this.selectedAudit}></TimelineAuditView>
            :
            <div></div>
        );
    }

};

const mapStateToProps = (state) => {
    let viewMode = null;
    let detailData = null;

    if(state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
        detailData = state.changeViewMode.mode.data;
    }
    return {
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null,
        changeRegion : state.changeRegion.region?state.changeRegion.region:null,
        viewMode : viewMode, detailData:detailData
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
        handleDetail: (data) => { dispatch(actions.changeDetail(data))},
        handleAuditCheckCount: (data) => { dispatch(actions.setCheckedAudit(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageAudits)));
