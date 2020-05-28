import React from 'react';
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
//redux
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import * as serverData from '../../../services/model/serverData';
import TimelineAuditView from "../../../container/TimelineAuditView";
import {Card} from "@material-ui/core";
import {AuditTutor} from "../../../tutorial";

const auditSteps = AuditTutor();

let _self = null;

class SiteFourPageAudits extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            contHeight: 0,
            contWidth: 0,
            bodyHeight: 0,
            devData: [],
            viewMode: 'listView',
            auditMounted: false
        };
        this.headerH = 70;
        this.hgap = 0;
        this._devData = [];
    }

    readyToData() {
        let orgName = this.props.match.params.pageId
        if(orgName.includes('&org'))
        {
            orgName = orgName.substring(orgName.indexOf('&org=')+ 5)
        }
        else
        {
            orgName = undefined
        }
        this.setState({devData: []})
        this.props.handleLoadingSpinner(true);
        this.getDataAudit(orgName);
    }

    refreshData = ()=>
    {
        if (this.props.location) {
            this.readyToData(this.props.location.search)
        }
    }


    componentWillMount() {
        this.setState({bodyHeight: (window.innerHeight - this.headerH)})
        this.setState({contHeight: (window.innerHeight - this.headerH) / 2 - this.hgap})
    }

    componentDidMount() {
        this.readyToData()
    }

    componentWillUnmount() {
        this._devData = [];
    }


    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {

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
   
        if (nextProps.location && nextProps.location.search && (nextProps.location.search !== this.props.location.search)) {
            this.setState({auditMounted: true})
            this.readyToData(nextProps.location.search);
        }

        this.props.handleViewMode( auditSteps.stepsAudit )

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

    makeOga = (logName) => {
        let lastSub = logName.substring(logName.lastIndexOf('=') + 1);
        return lastSub
    }

    getDataAudit = async (orgName) => {
        this.setState({devData: []})
        let mcRequest = undefined
        if (orgName) {
            mcRequest = await serverData.showAuditOrg(_self, {"org": orgName})
        } else {
            mcRequest = await serverData.showSelf(_self, {})
        }

        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            let response = mcRequest.response;
            let data = response.data
            if (data.length > 0) {
                let checked = localStorage.getItem('auditChecked')
                _self.reduceAuditCount(data, checked)
                _self.setState({ devData: response, auditMounted: true })
            }
        }
        _self.props.toggleLoading(false);
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
                if (newCheckData.findIndex(k => k == selectedAudit.traceid) === -1) {
                    newCheckData.push(selectedAudit.traceid)
                } else {

                }

            } else {
                newCheckData = [selectedAudit.traceid]
            }


        }
        localStorage.setItem('auditChecked', JSON.stringify(newCheckData))
        let allCnt = JSON.parse(savedData).length;
        let selectedCnt = newCheckData.length;
        if (newData && newData.length) _self.props.handleAuditCheckCount(allCnt - selectedCnt)

    }

    render() {
        return (
            <Card style={{ width: '100%', height: '100%', backgroundColor: '#292c33', padding: 10, color: 'white' }}>
                <TimelineAuditView data={this.state.devData} siteId={'Audit'}
                                   mounted={this.state.auditMounted}
                                   handleSelectedAudit={this.selectedAudit} refreshData={this.refreshData}>
                </TimelineAuditView>
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
        changeRegion: state.changeRegion.region ? state.changeRegion.region : null,
        viewMode: viewMode, detailData: detailData,
        isLoading: state.LoadingReducer.isLoading,
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleInjectDeveloper: (data) => {
            dispatch(actions.registDeveloper(data))
        },
        handleLoadingSpinner: (data) => {
            dispatch(actions.loadingSpinner(data))
        },
        handleAlertInfo: (mode, msg) => {
            dispatch(actions.alertInfo(mode, msg))
        },
        handleAuditCheckCount: (data) => {
            dispatch(actions.setCheckedAudit(data))
        },
        toggleLoading: (data) => {
            dispatch(actions.toggleLoading(data))
        },
        handleViewMode: (data) => {
            dispatch(actions.viewMode(data))
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(SiteFourPageAudits)));
