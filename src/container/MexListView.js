import React from 'react';
import { Table } from 'semantic-ui-react';
import { IconButton, Grow, Popper, Paper, ClickAwayListener, MenuList } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import ListIcon from '@material-ui/icons/List';
import './styles.css';
import _ from "lodash";
import { fields } from '../services/model/format';
import * as serverData from '../services/model/serverData';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import MexToolbar, { ACTION_CLOSE, ACTION_REGION, ACTION_REFRESH, REGION_ALL, ACTION_NEW, ACTION_MAP } from './MexToolbar';
import MexDetailViewer from '../hoc/dataViewer/DetailViewer';
import MexMessageStream, { CODE_FINISH } from '../hoc/stepper/mexMessageStream';
import ClustersMap from '../libs/simpleMaps/with-react-motion/index_clusters_new';
import * as serviceMC from '../services/model/serviceMC';

const regions = ['US', 'EU']
class MexListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            anchorEl: null,
            currentView: null,
            isDetail: false,
            stepsArray: [],
            showMap:true,
            uuid: 0
        };
        this.keys = props.requestInfo.keys;
        this.selectedRowIndex = {};
        this.sorting = false;
        this.selectedRegion = REGION_ALL
    }



    handleSort = clickedColumn => (a) => {

        this.sorting = true;
        const { column, dataList, direction } = this.state
        if ((column !== clickedColumn) && dataList) {
            let sorted = _.sortBy(dataList, [clm => typeof clm[clickedColumn] === 'string' ? String(clm[clickedColumn]).toLowerCase() : clm[clickedColumn]])
            this.setState({
                column: clickedColumn,
                dataList: sorted,
                direction: 'ascending',
            })
            return
        } else {
            let reverse = dataList.reverse()
            this.setState({
                dataList: reverse,
                direction: direction === 'ascending' ? 'descending' : 'ascending',
            })
        }
    }

    makeHeader() {
        const { column, direction } = this.state
        return this.keys.map((header, i) => {
            if (header.visible) {
                return (
                    <Table.HeaderCell key={i} className={header.sortable ? '' : 'unsortable'} textAlign='center' sorted={column === header.field ? direction : null} onClick={header.sortable ? this.handleSort(header.field) : null}>
                        {header.label}
                    </Table.HeaderCell>)
            }
        })
    }

    getCellClick = (key, rowIndex) => {
        this.selectedRowIndex = rowIndex
        let item = this.state.dataList[this.selectedRowIndex]
        if (key.field !== fields.actions) {
            if (key.field === fields.state) {
                this.onProgress(item)
            }
            else {
                this.setState(
                    {
                        isDetail: true,
                        currentView: <MexDetailViewer detailData={item} keys={this.keys} />
                    }
                )
            }
        }
    }

    onActionClose = async (action) => {
        this.setState({
            anchorEl: null
        })
        let dataList = this.state.dataList;
        if (action.onClick != null) {
            if (await action.onClick(dataList[this.selectedRowIndex])) {
                switch (action.label) {
                    case 'Delete':
                        dataList.splice(this.selectedRowIndex, 1)
                        this.setState({ dataList: dataList })
                        break;
                    case 'Update':
                        break;
                }
            }
        }
    }

    getAction = (item) => {
        return (
            <IconButton aria-label="Action" onClick={e => this.setState({ anchorEl: e.currentTarget })}>
                <ListIcon style={{ color: '#76ff03' }} />
            </IconButton>
        )
    }

    makeBody(i, item) {
        return this.keys.map((header, j) => {
            if (header.visible) {
                let field = header.field;
                return <Table.Cell key={j} className="table_actions" textAlign='center' onClick={() => this.getCellClick(header, i)} style={(this.state.selectedItem == i) ? { background: '#444', cursor: 'pointer' } : { cursor: 'pointer' }}>
                    {
                        field === fields.actions ? this.getAction(item)
                            :
                            <div>
                                {header.customizedData ? header.customizedData(item[field]) : item[field]}
                            </div>
                    }</Table.Cell>
            }
        })
    }

    listView = () => {
        let isMap = this.props.requestInfo.isMap && this.state.showMap
        return (this.state.dataList.length > 0 ?
            <div style={{height:'100%'}}>
                {isMap ?
                    <div className='panel_worldmap' style={{ height: '40%' }}>
                        <ClustersMap dataList = {this.state.dataList} id={this.props.requestInfo.id} />
                    </div> : null}
                <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing style={{ height: isMap ? '50%' : '95%' }}>
                    <Table.Header className="viewListTableHeader">
                        <Table.Row>
                            {this.makeHeader()}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body className="tbBodyList" onScroll={this.onHandleScroll}>
                        {
                            this.state.dataList.map((item, i) => (
                                <Table.Row key={i}>
                                    {this.makeBody(i, item)}
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table> </div> :
            null)
    }

    /*
    Stepper Block
    Todo: Move to separate file
    */

    streamProgress = (dataList) => {
        let stream = this.props.requestInfo.streamType;
        if (stream) {
            for (let i = 0; i < dataList.length; i++) {
                let data = dataList[i];
                if (data[fields.state] !== 5) {
                    this.sendWSRequest(data)
                }
            }
        }
    }

    sendWSRequest = (data) => {
        let method = this.props.requestInfo.streamType;
        if (method) {
            let state = data[fields.state];
            if (state === 3 || state === 2 || state === 3 || state === 6 || state === 7 || state === 9 || state === 10 || state === 12 || state === 14) {
                let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
                let requestData = serviceMC.getEP().getKey(method, data);
                if (requestData) {
                    serviceMC.sendWSRequest({ uuid: data[fields.uuid], token: store.userToken, method: method, data: requestData }, this.requestResponse)
                }
            }
        }
    }

    requestResponse = (mcRequest) => {
        let request = mcRequest.request;
        let responseData = null;
        let stepsArray = this.state.stepsArray;
        if (stepsArray && stepsArray.length > 0) {
            stepsArray.map((item, i) => {
                if (request.uuid === item.uuid) {
                    if (mcRequest.response) {
                        responseData = item;
                    }
                    else {
                        if (item.steps && item.steps.length > 1) {
                            this.requestLastResponse(item.steps[item.steps.length - 1]);
                        }
                        if (item.steps.length >= 1 && item.steps[0].code === 200) {
                            item.steps.push({ code: CODE_FINISH })
                            this.props.dataRefresh();
                        }

                        if (this.state.uuid === 0) {
                            stepsArray.splice(i, 1);
                        }
                    }
                }
            })
        }

        if (mcRequest.response) {
            let response = mcRequest.response.data
            let step = { code: response.code, message: response.data.message }
            if (responseData === null) {
                stepsArray.push({ uuid: request.uuid, steps: [step] })
            }
            else {
                stepsArray.map((item, i) => {
                    if (request.uuid === item.uuid) {
                        item.steps.push(step)
                    }
                })

            }
        }

        this.setState({
            stepsArray: stepsArray
        })


    }

    onCloseStepper = () => {
        this.state.stepsArray.map((item, i) => {
            item.steps.map(step => {
                if (step.code === CODE_FINISH) {
                    this.state.stepsArray.splice(i, 1)
                }
            })
        })
        this.setState({
            uuid: 0
        })
    }

    onProgress(data) {
        this.setState({
            uuid: data.uuid
        })

        if (data[fields.state] === 5) {
            this.setState({
                stepsArray: [{ uuid: data.uuid, steps: [{ message: 'Created successfully', code: CODE_FINISH }] }]
            })
        }
    }
    /*
      Stepper Block
      Todo: Move to separate file
      */

    render() {
        return (
            <div className="round_panel">
                <MexMessageStream onClose={this.onCloseStepper} uuid={this.state.uuid} stepsArray={this.state.stepsArray} />
                <MexToolbar requestInfo={this.props.requestInfo} onAction={this.onToolbarAction} isDetail={this.state.isDetail} />
                {this.state.currentView ? this.state.currentView : this.listView()}
                {
                    this.props.actionMenu ?
                        <Popper open={Boolean(this.state.anchorEl)} anchorEl={this.state.anchorEl} role={undefined} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center right' }}
                                >
                                    <Paper style={{ backgroundColor: '#212121', color: 'white' }}>
                                        <ClickAwayListener onClickAway={this.onActionClose}>
                                            <MenuList autoFocusItem={Boolean(this.state.anchorEl)} id="menu-list-grow" >
                                                {this.props.actionMenu.map((action, i) => {
                                                    return <MenuItem key={i} onClick={(e) => { this.onActionClose(action) }}>{action.label}</MenuItem>
                                                })}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper> : null}
            </div>
        );

    }

    onToolbarAction = (type, data) => {
        switch (type) {
            case ACTION_REGION:
                this.selectedRegion = data;
                this.dataFromServer(this.selectedRegion)
                break;
            case ACTION_REFRESH:
                this.dataFromServer(this.selectedRegion)
                break;
            case ACTION_NEW:
                this.props.requestInfo.onAdd()
                break;
            case ACTION_MAP:
                this.setState({showMap : data})
                break;
            case ACTION_CLOSE:
                this.setState({ isDetail: false, currentView: null })
                break;
            default:

        }
    }

    getFilterInfo = (requestInfo, region) => {
        let filterList = [];
        if (requestInfo.isRegion) {
            if (region === REGION_ALL) {
                for (let i = 0; i < regions.length; i++) {
                    region = regions[i];
                    let filter = requestInfo.filter === undefined ? {} : requestInfo.filter;
                    filter[fields.region] = region;
                    filterList.push(filter)
                }
            }
            else {
                let filter = requestInfo.filter === undefined ? {} : requestInfo.filter;
                filter[fields.region] = region;
                filterList.push(filter)
            }
        }
        else {
            let filter = requestInfo.filter === undefined ? {} : requestInfo.filter;
            filterList.push(filter)
        }
        return filterList;
    }



    onServerResponse = (mcRequestList) => {
        let requestInfo = this.props.requestInfo
        let dataList = this.state.dataList
        if (mcRequestList && mcRequestList.length > 0) {
            if (this.props.multiDataRequest) {
                dataList = [...dataList, ...this.props.multiDataRequest(mcRequestList)]
            }
            else {
                let mcRequest = mcRequestList[0]
                if (mcRequest.response && mcRequest.response.data) {
                    dataList = [...dataList, ...mcRequest.response.data]
                }
            }

        }

        if (dataList.length > 0 && requestInfo.sortBy) {
            dataList = _.orderBy(dataList, requestInfo.sortBy)
            this.streamProgress(dataList)
        }
        this.setState({
            dataList: dataList
        })
    }

    dataFromServer = (region) => {
        this.setState({ dataList: [] })
        let requestInfo = this.props.requestInfo
        if (requestInfo) {
            let filterList = this.getFilterInfo(requestInfo, region)
            if (filterList && filterList.length > 0) {
                for (let i = 0; i < filterList.length; i++) {
                    let filter = filterList[i];
                    serverData.getDataListFromServer(this, requestInfo.requestType, filter, this.onServerResponse)
                }
            }
            else {
                serverData.getDataListFromServer(this, requestInfo.requestType, this.onServerResponse)
            }
        }
    }

    componentDidMount() {
        this.dataFromServer(REGION_ALL)
    }
}

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MexListView));


