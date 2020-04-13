import React from 'react';
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
//redux
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import * as serviceMC from '../../../services/serviceMC';
import TimelineAuditView from "../../../container/TimelineAuditView";
import {Card, Toolbar} from "@material-ui/core";


let _self = null;
let rgn = ['US', 'EU'];

class SiteFourPageAudits extends React.Component {
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
            viewMode: 'listView',
            auditMounted: false
        };
        this.headerH = 70;
        this.hgap = 0;
        this.hiddenKeys = ['Ip_support', 'Num_dynamic_ips', 'Status', 'Physical_name', 'Platform_type'];
        this.headerLayout = [1, 3, 3, 3, 2, 2, 2];
        this.userToken = null;
        this._devData = [];
        this.loadCount = 0;
        this._cloudletDummy = [];
    }

    //go to
    gotoPreview(site) {
        //브라우져 입력창에 주소 기록
        let mainPath = site;
        let subPath = 'pg=0';
        _self.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: {some: 'state'}
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath: mainPath, subPath: subPath})

    }

    handleItemClick = (e, {name}) => this.setState({activeItem: name})

    onHandleRegistry() {
        this.props.handleInjectDeveloper('userInfo');
    }

    readyToData(subPaths) {
        let subPath = '';
        let subParam = null;
        if (subPaths.indexOf('&org=') > -1) {
            let paths = subPaths.split('&')
            subPath = paths[0];
            subParam = paths[1];
        }
        this.setState({devData: []})
        this.setState({page: subPath, OrganizationName: subParam})
        this.props.handleLoadingSpinner(true);
        // get audits data
        this.getDataAudit(subParam);
    }

    refreshData = ()=>
    {
        if (this.props.location && this.props.location.search) {
            this.readyToData(this.props.location.search)
        }
    }


    componentWillMount() {
        this.setState({bodyHeight: (window.innerHeight - this.headerH)})
        this.setState({contHeight: (window.innerHeight - this.headerH) / 2 - this.hgap})
    }

    componentDidMount() {
        if (this.props.location && this.props.location.search) {
            this.readyToData(this.props.location.search)
        }
    }

    componentWillUnmount() {
        this._devData = [];
        this._cloudletDummy = [];

    }


    componentWillReceiveProps(nextProps, nextContext) {

        this.setState({bodyHeight: (window.innerHeight - this.headerH)})
        this.setState({contHeight: (nextProps.size.height - this.headerH) / 2 - this.hgap})
        if (nextProps.viewMode) {
            if (nextProps.viewMode === 'listView') {
                this.setState({viewMode: nextProps.viewMode})
            } else {
                this.setState({viewMode: nextProps.viewMode})
                setTimeout(() => this.setState({detailData: nextProps.detailData}), 300)
            }
        }
        //
        if (nextProps.location && nextProps.location.search && (nextProps.location.search !== this.props.location.search)) {
            this.setState({auditMounted: true})
            this.readyToData(nextProps.location.search);
        }

    }

    reduceAuditCount(all, data) {
        let itemArray = [];
        let addArray = [];
        let savedArray = localStorage.getItem('auditUnChecked');
        let checkedArray = localStorage.getItem('auditChecked');
        let checked = [];
        if (all.error) {
            this.props.handleAlertInfo('error', all.error)
        } else {
            all.map((item, i) => {
                if (savedArray && JSON.parse(savedArray).length) {

                    //이전에 없던 데이터 이면 추가하기
                    if (JSON.parse(savedArray).findIndex(k => k == item.traceid) === -1) addArray.push(item.traceid)
                } else {
                    itemArray.push(item.traceid)
                }
            })

            if (addArray.length) {
                JSON.parse(savedArray).concat(addArray);
            }


            // 이제 새로운 데이터에서 체크된 오딧은 제거
            let checkResult = null;

            if (savedArray && JSON.parse(savedArray).length) {
                checkResult = JSON.parse(savedArray);
            } else if (itemArray.length) {
                checkResult = itemArray;
            }

            checked = (checkedArray) ? JSON.parse(checkedArray) : [];
            this.props.handleAuditCheckCount(checkResult.length - checked.length)
            localStorage.setItem('auditUnChecked', JSON.stringify(checkResult))
        }


    }

    receiveResult = (mcRequest) => {
        if (mcRequest) {

            if (mcRequest.response) {
                if (mcRequest.response.data.length > 0) {
                    let response = mcRequest.response;
                    let request = mcRequest.request;
                    let checked = localStorage.getItem('auditChecked')
                    if (request.method === serviceMC.getEP().SHOW_SELF || request.method === serviceMC.getEP().SHOW_AUDIT_ORG) {
                        _self.reduceAuditCount(response.data, checked)
                    }
                    _self.setState({ devData: response, auditMounted: true })
                    if (rgn.length == this.loadCount - 1) {
                        return
                    }
                }
                else{
                    this.props.handleAlertInfo('error',"Data Not Present")
                }
            }
        }
        _self.props.toggleLoading(false);
        _self.props.handleLoadingSpinner(false);
    }

    countJoin() {
        let cloudlet = this._cloudletDummy;
        _self.setState({devData: cloudlet})
        this.props.handleLoadingSpinner(false);
    }

    makeOga = (logName) => {
        let lastSub = logName.substring(logName.lastIndexOf('=') + 1);
        return lastSub
    }

    getDataAudit = async (orgName) => {
        this.props.handleLoadingSpinner(true);
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({devData: []})
        this._cloudletDummy = [];
        _self.loadCount = 0;

        if (orgName) {
            serviceMC.sendRequest(_self, {token:store.userToken, method:serviceMC.getEP().SHOW_AUDIT_ORG, data:{"org": this.makeOga(orgName)}}, this.receiveResult)
        } else {
            serviceMC.sendRequest(_self, {token: store.userToken, method:serviceMC.getEP().SHOW_SELF, data: '{}'}, _self.receiveResult)
        }
    }
    

    selectedAudit = (selectedAudit) => {
        // if get same item find from storage should remove it.
        let savedData = localStorage.getItem('auditUnChecked');
        let checkData = localStorage.getItem('auditChecked');
        let newCheckData = null;
        let newData = null;
        if (savedData) {
            let parseSavedData = JSON.parse(savedData)
            newData = parseSavedData.filter(function (item) {
                return item !== selectedAudit.traceid
            })
            newCheckData = JSON.parse(checkData);

            if (newCheckData) {
                //만약 이미 체크된 오딧 이면 배열에 넣지 않는다
                if (newCheckData.findIndex(k => k == selectedAudit.traceid) === -1) {
                    newCheckData.push(selectedAudit.traceid)
                } else {

                }

            } else {
                newCheckData = [selectedAudit.traceid]
            }


        }
        //console.log('20191022 filtering audit checked ...', newData, ":", newData.length)
        localStorage.setItem('auditChecked', JSON.stringify(newCheckData))

        //refresh number badge of Audit Log button
        let allCnt = JSON.parse(savedData).length;
        let selectedCnt = newCheckData.length;
        if (newData && newData.length) _self.props.handleAuditCheckCount(allCnt - selectedCnt)

    }

    render() {
        let randomValue = Math.round(Math.random() * 100);
        return (
            <Card style={{ width: '100%', height: '100%', backgroundColor: '#292c33', padding: 10, color: 'white' }}>
                <Toolbar>
                    <label className='content_title_label'>Audit Logs</label>
                </Toolbar>

                <div className="mexListView">
                    <TimelineAuditView data={this.state.devData} randomValue={randomValue}
                                       headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId={'Audit'}
                                       userToken={this.userToken} mounted={this.state.auditMounted}
                                       handleSelectedAudit={this.selectedAudit} refreshData={this.refreshData}>
                    </TimelineAuditView>
                </div>
            </Card>
        );
    }
};

const mapStateToProps = (state) => {
    let viewMode = null;
    let detailData = null;

    if (state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
        detailData = state.changeViewMode.mode.data;
    }
    return {
        computeRefresh: (state.computeRefresh) ? state.computeRefresh : null,
        changeRegion: state.changeRegion.region ? state.changeRegion.region : null,
        viewMode: viewMode, detailData: detailData,
        isLoading: state.LoadingReducer.isLoading,
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => {
            dispatch(actions.changeSite(data))
        },
        handleInjectData: (data) => {
            dispatch(actions.injectData(data))
        },
        handleInjectDeveloper: (data) => {
            dispatch(actions.registDeveloper(data))
        },
        handleComputeRefresh: (data) => {
            dispatch(actions.computeRefresh(data))
        },
        handleLoadingSpinner: (data) => {
            dispatch(actions.loadingSpinner(data))
        },
        handleAlertInfo: (mode, msg) => {
            dispatch(actions.alertInfo(mode, msg))
        },
        handleDetail: (data) => {
            dispatch(actions.changeDetail(data))
        },
        handleAuditCheckCount: (data) => {
            dispatch(actions.setCheckedAudit(data))
        },
        toggleLoading: (data) => {
            dispatch(actions.toggleLoading(data))
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(SiteFourPageAudits)));
