import _ from 'lodash'
import React from 'react';
import { Header, Button, Table, Icon, Input, Popup, Container } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import ReactTooltip from 'react-tooltip'
import { connect } from 'react-redux';
import * as moment from 'moment';
import * as actions from '../actions';
import SelectFromTo from '../components/selectFromTo';
import RegistNewItem from './registNewItem';
import DeleteItem from './deleteItem';
import './styles.css';
import ClustersMap from '../libs/simpleMaps/with-react-motion/index_clusters';
import PopDetailViewer from './popDetailViewer';
import * as serviceMC from '../services/serviceMC';
import ReactJson from 'react-json-view';

import MexMessageStream, { CODE_FINISH } from '../hoc/mexMessageStream';

let prgInter = null;

var layout = [
    { "w": 24, "h": 9, "x": 0, "y": 0, "i": "0", "minW": 5, "minH": 8, "moved": false, "static": false, "title": "LocationView" },
    { "w": 24, "h": 11, "x": 0, "y": 9, "i": "1", "minW": 8, "moved": false, "static": false, "title": "Developer" }
]

const ContainerOne = (props) => (

    <ClustersMap parentProps={props} />

);
let _self = null;
class MapWithListView extends React.Component {
    constructor(props) {
        super(props);

        const layout = this.generateLayout();
        this.state = {
            layout,
            open: false,
            openDetail: false,
            dimmer: true,
            activeItem: '',
            dummyData: [],
            selected: {},
            sideVisible: null,
            direction: null,
            column: null,
            isDraggable: false,
            selectedItem: null,
            openDelete: false,
            tooltipMsg: 'No Message',
            tooltipVisible: false,
            detailViewData: null,
            noData: false,
            updateData: {},
            resize: null,
            sorting: false,
            closeMap: false,
            toggle: false,
            stateCreate: false,
            stateViewToggle: false,
            stateStream: null,
            stackStates: [],
            changeRegion: null,
            viewMode: null,
            _resetMap: null,
            steps: [],
            stepsArray: [],
            uuid: 0

        };
        _self = this;
        this.jsonViewProps = {
            name: null,
            theme: "monokai",
            collapsed: false,
            collapseStringsAfter: 15,
            onAdd: false,
            onEdit: false,
            onDelete: false,
            displayObjectSize: false,
            enableClipboard: true,
            indentWidth: 4,
            displayDataTypes: false,
            iconStyle: "triangle"
        }
        this.mapzoneStyle = [
            { margin: '0 0 10px 0', padding: '5px 15px 15px', alignItems: 'center', display: 'flex', flexDirection: 'column' },
            { margin: '0 0 10px 0', padding: '5px 15px 15px', alignItems: 'center', display: 'flex', flexDirection: 'column', height: '28px' }
        ]
        this.streamInterval = null;
        this.oldTemp = {};
        this.live = true;
        this.stateStreamData = null;
        this.uuid = null;
    }
    gotoUrl(site, subPath) {
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({ mainPath: site, subPath: subPath });
    }

    onHandleEdit(data) {
        this.props.handleLoadingSpinner(true);
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let serviceBody = {
            token: store ? store.userToken : null,
            method: serviceMC.getEP().UPDATE_APP_INST,
            data: {
                region: data['Region'],
                appinst: {
                    key: {
                        app_key: { developer_key: { name: data['OrganizationName'] }, name: data['AppName'], version: data['Version'] },
                        cluster_inst_key: {
                            cluster_key: { name: data['ClusterInst'] },
                            cloudlet_key: { operator_key: { name: data['Operator'] }, name: data['Cloudlet'] }
                        }
                    }
                }
            }
        }
        serviceMC.sendWSRequest(serviceBody, _self.receiveResult)
    }

    receiveResult = (mcRequest) => {
        this.props.handleLoadingSpinner(false);
        this.props.dataRefresh()
    }

    onItemOver(itemData, key, evt) {
        this.setState({ selectedItem: key })
    }

    show = (dim) => this.setState({ dimmer: dim, open: true })
    close = () => {
        this.setState({ open: false, openDelete: false, selected: {} })
        this.props.handleInjectDeveloper(null)
    }
    closeDetail = () => {
        this.setState({ openDetail: false })
        this.props.handleDetail({ data: null, viewMode: 'listView' })
    }
    makeHeader_noChild = (title) => (
        <Header className='panel_title'>{title}</Header>
    )
    makeHeader_date = (title) => (
        <Header className='panel_title' style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: 'flex', flexGrow: 8 }}>{title}</div>
            <SelectFromTo style={{ display: 'flex', alignSelf: 'flex-end' }}></SelectFromTo>
        </Header>
    )
    makeHeader_select = (title) => (
        <Header className='panel_title'>{title}</Header>
    )

    InputExampleFluid = (value) => <Input fluid placeholder={(this.state.dimmer === 'blurring') ? '' : value} />
    zoomIn(detailMode) {
        _self.setState({ sideVisible: detailMode })
    }
    zoomOut(detailMode) {

        _self.setState({ sideVisible: detailMode })
    }
    //this.props.parentProps.resetMap(false, 'fromDetail')
    handleSort = clickedColumn => (a) => {
        console.log('20190819 handle sort..', a)
        _self.setState({ sorting: true });
        const { column, dummyData, direction } = _self.state
        this.stateSort(dummyData)
        if ((column !== clickedColumn) && dummyData) {
            let sorted = _.sortBy(dummyData, [clm => typeof clm[(clickedColumn === 'State') ? 'StateData' : clickedColumn] === 'string' ? String(clm[(clickedColumn === 'State') ? 'StateData' : clickedColumn]).toLowerCase() : clm[(clickedColumn === 'State') ? 'StateData' : clickedColumn]])
            sorted.map((item) => {
                delete item['StateData']
            })
            this.setState({
                column: clickedColumn,
                dummyData: sorted,
                direction: 'ascending',
            })
        } else {
            let reverse = dummyData.reverse()
            reverse.map((item) => {
                delete item['StateData']
            })
            this.setState({
                dummyData: reverse,
                direction: direction === 'ascending' ? 'descending' : 'ascending',
            })

        }
    }
    stateSort = (_sortData) => {
        _sortData.map((item) => {
            (item.State === 0) ? item['StateData'] = 'TrackedStateUnknown' :
                (item.State === 1) ? item['StateData'] = 'NotPresent' :
                    (item.State === 2) ? item['StateData'] = 'CreateRequested' :
                        (item.State === 3) ? item['StateData'] = 'Creating' :
                            (item.State == 4) ? item['StateData'] = 'CreateError' :
                                (item.State === 5) ? item['StateData'] = 'Ready' :
                                    (item.State === 6) ? item['StateData'] = 'UpdateRequested' :
                                        (item.State === 7) ? item['StateData'] = 'Updating' :
                                            (item.State === 8) ? item['StateData'] = 'UpdateError' :
                                                (item.State === 9) ? item['StateData'] = 'DeleteRequested' :
                                                    (item.State === 10) ? item['StateData'] = 'Deleting' :
                                                        (item.State === 11) ? item['StateData'] = 'DeleteError' :
                                                            (item.State === 12) ? item['StateData'] = 'DeletePrepare' :
                                                                (item.State === 13) ? item['StateData'] = 'CRMInit' :
                                                                    item['StateData'] = item.State
        })
        return _sortData
    }
    generateStart() {
        (this.state.dummyData.length) ? this.setState({ noData: false }) : this.setState({ noData: true })
    }
    checkLengthData() {
        this.setState({ noData: false })
        setTimeout(() => this.generateStart(), 2000)
    }

    generateDOM(open, dimmer, dummyData, resize, resetMap) {
        return layout.map((item, i) => (

            (i === 1) ?
                <div className="round_panel" key={i} >

                    <div className={'grid_table ' + this.props.siteId}>
                        {
                            this.TableExampleVeryBasic(this.props.headerLayout, this.props.hiddenKeys, dummyData)
                        }
                    </div>
                </div>
                :
                <div className="round_panel" key={i} style={(!this.state.closeMap) ? this.mapzoneStyle[0] : this.mapzoneStyle[1]}>
                    <div style={{ margin: '0 0 5px 0', cursor: 'pointer', display: 'flex', alignItems: 'column', justifyContent: 'center' }} onClick={this.onCloseMap}>
                        <span style={{ color: '#c8c9cb' }}>{(this.state.closeMap) ? 'Show map' : 'Hide map'}</span>
                        <Icon name={(this.state.closeMap) ? 'angle down' : 'angle up'} />
                    </div>
                    <div className='panel_worldmap'>
                        <ContainerOne ref={ref => this.container = ref} {...this.props} gotoNext={this.gotoNext} zoomIn={this.zoomIn} zoomOut={this.zoomOut} resetMap={resetMap}></ContainerOne>
                    </div>
                </div>
        ))

    }

    generateLayout() {
        const p = this.props;
        return layout
    }

    makeHeader(_keys, headL, hidden) {
        const { column, direction } = this.state
        let keys = Object.keys(_keys);
        let widthDefault = Math.round(16 / keys.length);

        return keys.map((key, i) => (
            (key === 'uuid') ? null :
                (!(String(hidden).indexOf(key) > -1)) ?
                    (i === keys.length - 1) ?
                        <Table.HeaderCell key={i} className='unsortable' textAlign='center'>
                            {(key === 'Edit') ? 'Actions' : key}
                        </Table.HeaderCell>
                        :
                        <Table.HeaderCell key={i} className={(key === 'CloudletLocation' || key === 'Edit' || key === 'Progress') ? 'unsortable' : ''} textAlign='center' sorted={column === key ? direction : null} onClick={(key == 'CloudletLocation' || key == 'Edit' || key == 'Progress' || key == 'Ports') ? null : this.handleSort(key)}>
                            {
                                (key === 'CloudletName') ? 'Cloudlet Name'
                                    : (key === 'CloudletLocation') ? 'Cloudlet Location'
                                        : (key === 'ClusterName') ? 'Cluster Name'
                                            : (key === 'OrganizationName') ? 'Organization Name'
                                                : (key === 'IpAccess') ? 'IP Access'
                                                    : (key === 'AppName') ? 'App Name'
                                                        : (key === 'ClusterInst') ? 'Cluster Instance'
                                                            : (key === 'Physical_name') ? 'Physical Name'
                                                                : (key === 'Platform_type') ? 'Platform Type'
                                                                    : (key === 'Edit') ? 'Actions'
                                                                        : key}
                        </Table.HeaderCell>
                    :
                    null
        ));
    }

    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
    }
    onPortClick(a, b) {
        alert(b[a])
    }
    detailView(item) {
        //change popup to page view
        _self.setState({ viewMode: 'detailView' })
        _self.props.handleDetail({ data: item, viewMode: 'detailView' })
    }
    jsonView = (jsonObj) => (
        <ReactJson src={jsonObj} {...this.jsonViewProps} />
    )

    /*****************************
     * view status of creating app
     * ***************************/
    getParentProps = () => {
        return _self.stateStreamData ? _self.stateStreamData : null;
    }
    resetParentProps = () => {
    }

    showProgress(_item, _siteId, _auto) {
        this.setState({
            uuid: 0
        })

        this.setState({
            uuid: _item.uuid
        })

        if (_item.State === 5) {
            this.setState({
                stepsArray: [{ uuid: _item.uuid, steps: [{ message: 'Created Successfully', code: CODE_FINISH }] }]
            })
        }
    }

    requestResponse = (mcRequest) => {
        let request = mcRequest.request;
        let responseData = null;
        if (this.state.stepsArray && this.state.stepsArray.length > 0) {
            this.state.stepsArray.map((item, i) => {
                if (request.uuid === item.uuid) {
                    if (mcRequest.response) {
                        responseData = item;
                    }
                    else {
                        if (item.steps.length >= 1 && item.steps[0].code === 200) {
                            item.steps.push({ code: CODE_FINISH })
                            this.props.dataRefresh();
                        }

                        if (this.state.uuid === 0) {
                            this.state.stepsArray.splice(i, 1);
                        }
                    }
                }
            })
        }

        if (mcRequest.response) {
            let result = mcRequest.response.data
            let step = { code: result.code, message: result.data.message }
            if (responseData === null) {
                responseData = { uuid: request.uuid, steps: [step] }
                this.setState(prevState => ({
                    stepsArray: [...prevState.stepsArray, responseData]
                }))
            }
            else {
                responseData.steps = [...responseData.steps, step];
            }
        }
    }

    closeStepper = () => {
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

    

    makeUTC = (time) => (
        moment.unix(time.replace('seconds : ', '')).utc().format('YYYY-MM-DD HH:mm:ss')
    )
    compareDate = (date) => {

        let isNew = false;
        let darray = [];
        if (date) {
            let formatDate = this.makeUTC(date);

            let fromNow = moment(formatDate).utc().startOf('day').fromNow();
            if (fromNow === 'a day ago') fromNow = '24 hours ago'
            if (fromNow === 'an hour ago') fromNow = '1 hours ago'
            darray = fromNow.split(' ')
            if (fromNow.indexOf('hours') > -1 && (parseInt(darray[0]) <= 24 || fromNow === 'a day ago')) isNew = true;
        } else {

        }

        return { new: isNew, days: darray[0] };
    }

    makeTableRow = () => {
        let row = null;

        return row;
    }

    TableExampleVeryBasic = (headL, hidden, dummyData) => (
        <Table className="viewListTable" basic='very' striped celled sortable ref={ref => this.viewListTable = ref} style={{ width: '100%' }}>
            <Table.Header className="viewListTableHeader" style={{ width: '100%' }}>
                <Table.Row>
                    {(dummyData.length > 0) ? this.makeHeader(dummyData[0], headL, hidden) : null}
                </Table.Row>
            </Table.Header>
            <Table.Body className="tbBodyList">
                {

                    dummyData.map((item, i) => (
                        <Table.Row key={i}>
                            {Object.keys(item).map((value, j) => (
                                (value === 'uuid') ?
                                    null :
                                    (value === 'Edit') ?
                                        String(item[value]) === 'null' ? <Table.Cell /> :
                                            <Table.Cell key={j} textAlign='center' style={(this.state.selectedItem == i) ? { whiteSpace: 'nowrap', background: '#444' } : { whiteSpace: 'nowrap' }} onMouseOver={(evt) => this.onItemOver(item, i, evt)}>
                                                {/* {
                                                this.props.diffRev.map((_diff) => (
                                                    (String(item[value]).indexOf('Editable') > -1 && _diff.AppName == item['AppName'] && _diff.Region == item['Region'] && _diff.OrganizationName == item['OrganizationName'] && _diff.Operator == item['Operator'] && _diff.Cloudlet == item['Cloudlet'] && _diff.ClusterInst == item['ClusterInst'] && item['State'] != 7) ? <Button key={`key_${j}`} color='teal' onClick={() => this.onHandleEdit(item)}>Update</Button> : null
                                                ))
                                            } */}
                                                <Button disabled={this.props.dimmInfo.onlyView} onClick={() => this.setState({ openDelete: true, selected: item })}><Icon name={'trash alternate'} /></Button>
                                            </Table.Cell>
                                        :
                                        (value === 'AppName' && item[value]) ? //
                                            <Table.Cell key={j} textAlign='left' ref={cell => this.tableCell = cell} onClick={() => this.detailView(item)} style={(this.state.selectedItem == i) ? { background: '#444', cursor: 'pointer' } : { cursor: 'pointer' }} onMouseOver={(evt) => this.onItemOver(item, i, evt)}>
                                                <div style={{ display: 'flex', justifyContent: 'row', wordBreak: 'break-all' }}>
                                                    {String(item[value])}
                                                </div>
                                            </Table.Cell>
                                            :
                                            (value === 'Mapped_ports' && item[value]) ?
                                                <Table.Cell key={j} textAlign='left' style={(this.state.selectedItem == i) ? { background: '#444' } : null} onMouseOver={(evt) => this.onItemOver(item, i, evt)}>
                                                    <Icon name='server' size='big' onClick={() => this.onPortClick(value, item)} style={{ cursor: 'pointer' }}></Icon>
                                                </Table.Cell>
                                                :
                                                (value === 'CloudletLocation' && item[value]) ?
                                                    <Table.Cell key={j} textAlign='left' onClick={() => this.detailView(item)} style={(this.state.selectedItem == i) ? { background: '#444', cursor: 'pointer' } : { cursor: 'pointer' }} onMouseOver={(evt) => this.onItemOver(item, i, evt)}>
                                                        <div>
                                                            {`Latitude : ${item[value].latitude}`} <br />
                                                            {`Longitude : ${item[value].longitude}`}
                                                        </div>
                                                    </Table.Cell>
                                                    :
                                                    (value === 'IpAccess' && item[value]) ?
                                                        <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)} style={(this.state.selectedItem == i) ? { background: '#444', cursor: 'pointer' } : { cursor: 'pointer' }} onMouseOver={(evt) => this.onItemOver(item, i, evt)}>
                                                            {(item[value] == 0) ? "IpAccessUnknown" : (item[value] == 1) ? "Dedicated" : (item[value] == 2) ? "IpAccessDedicatedOrShared" : (item[value] == 3) ? "Shared" : item[value]}
                                                            {/*{item[value]}*/}
                                                        </Table.Cell>
                                                        :
                                                        (value === 'State' && item[value]) ?
                                                            <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)} style={(this.state.selectedItem === i) ? { background: '#444', cursor: 'pointer' } : { cursor: 'pointer' }} onMouseOver={(evt) => this.onItemOver(item, i, evt)}>
                                                                {(item[value] === 0) ? "Tracked State Unknown" : (item[value] === 1) ? "Not Present" : (item[value] === 2) ? "Create Requested" : (item[value] === 3) ? "Creating" : (item[value] == 4) ? "Create Error" : (item[value] == 5) ? "Ready" : (item[value] == 6) ? "Update Requested" : (item[value] == 7) ? "Updating" : (item[value] == 8) ? "Update Error" : (item[value] == 9) ? "Delete Requested" : (item[value] == 10) ? "Deleting" : (item[value] == 11) ? "Delete Error" : (item[value] == 12) ? "Delete Prepare" : (item[value] == 13) ? "CRM Init" : item[value]}
                                                            </Table.Cell>
                                                            :
                                                            (value === 'Progress' && (item['State'] === 3 || item['State'] === 7 || item['State'] === 14)) ?
                                                                <Table.Cell key={j} textAlign='center' onClick={() => this.showProgress(item, this.props.siteId, '', item['State'])} style={(this.state.selectedItem === i) ? { background: '#444', cursor: 'pointer' } : { cursor: 'pointer' }} onMouseOver={(evt) => this.onItemOver(item, i, evt)}>
                                                                    <Popup content='View Progress' trigger={<Icon className={'progressIndicator'} loading size={12} color='green' name='circle notch' />} />
                                                                </Table.Cell>
                                                                :
                                                                (value === 'Progress' && item['State'] === 5) ?
                                                                    <Table.Cell key={j} textAlign='center' onClick={() => this.showProgress(item, this.props.siteId, '', item['State'])} style={(this.state.selectedItem === i) ? { background: '#444', cursor: 'pointer' } : { cursor: 'pointer' }} onMouseOver={(evt) => this.onItemOver(item, i, evt)}>
                                                                        <Icon className="progressIndicator" name='check' color='rgba(255,255,255,.5)' />
                                                                    </Table.Cell>
                                                                    :
                                                                    (value === 'Progress' && (item['State'] === 10 || item['State'] === 12)) ?
                                                                        <Table.Cell key={j} textAlign='center' onClick={() => this.showProgress(item, this.props.siteId, '', item['State'])} style={(this.state.selectedItem === i) ? { background: '#444', cursor: 'pointer' } : { cursor: 'pointer' }} onMouseOver={(evt) => this.onItemOver(item, i, evt)}>
                                                                            <Popup content='View Progress' trigger={<Icon className={'progressIndicator'} loading size={12} color='red' name='circle notch' />} />
                                                                        </Table.Cell>
                                                                        :
                                                                        (value.indexOf('Name') !== -1 || value === 'Cloudlet' || value === 'ClusterInst') ?
                                                                            <Table.Cell key={j} textAlign='left' ref={cell => this.tableCell = cell} onClick={() => this.detailView(item)} style={(this.state.selectedItem === i) ? { background: '#444', cursor: 'pointer' } : { cursor: 'pointer' }} onMouseOver={(evt) => this.onItemOver(item, i, evt)}>
                                                                                <div style={{ display: 'flex', alignContent: 'Column', justifyContent: 'flex-start', alignItems: 'center', wordBreak: 'break-all' }}>
                                                                                    <div>{String(item[value])}</div>{(this.compareDate(item['Created']).new && value === 'Region') ? <div className="userNewMark" style={{ marginLeft: 5, fontSize: 10, padding: '0 5px' }}>{`New`}</div> : null}
                                                                                </div>
                                                                            </Table.Cell>
                                                                            :
                                                                            (!(String(hidden).indexOf(value) > -1)) ?
                                                                                <Table.Cell key={j} textAlign={'center'} ref={cell => this.tableCell = cell} onClick={() => this.detailView(item)} style={(this.state.selectedItem == i) ? { background: '#444', cursor: 'pointer' } : { cursor: 'pointer' }} onMouseOver={(evt) => this.onItemOver(item, i, evt)}>
                                                                                    <div style={{ display: 'flex', alignContent: 'Column', justifyContent: 'center', alignItems: 'center', wordBreak: 'break-all' }}>
                                                                                        <div>{String(item[value])}</div>{(this.compareDate(item['Created']).new && value === 'Region') ? <div className="userNewMark" style={{ marginLeft: 5, fontSize: 10, padding: '0 5px' }}>{`New`}</div> : null}
                                                                                    </div>
                                                                                </Table.Cell>
                                                                                : null
                            ))}
                        </Table.Row>
                    ))


                }
            </Table.Body>

        </Table>
    )
    handleMouseOverCell(value) {
        this.setState({ tooltipMsg: value })
        ReactTooltip.rebuild()
        ReactTooltip.show(this.tooltipref)
    }
    successfully(msg) {
        _self.props.handleRefreshData({ params: { state: 'refresh' } })
    }
    updateDimensions(e) {
        _self.setState({ resize: e.currentTarget.innerHeight })
    }
    onCloseMap = () => {
        let close = !this.state.closeMap;
        this.setState({ closeMap: close })
    }
    

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        if (this.props.viewMode !== this.state.viewMode) {
            this.setState({ dummyData: this.props.devData })
            this.forceUpdate();
        }
    }
    componentWillUnmount() {
        //window.addEventListener("resize", this.updateDimensions);
        clearTimeout(this.interval)
        //this.props.handleSetHeader([])
        clearInterval(prgInter);
        clearInterval(_self.streamInterval);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.dataSort) {
            this.setState({ sorting: false, direction: null })
        }

        if (this.state.sorting) {
            return;
        }

        let cityCoordinates = []
        let filterList = []

        const reduceUp = (value) => {
            return Math.round(value)
        }

        if (nextProps.accountInfo) {
            this.setState({ dimmer: 'blurring', open: true })
        }
        if (nextProps.devData.length && !this.state.toggle) {
            this.setState({ toggle: true })
            //set filtering
            let filteredData = [];
            if (this.state.dummyData.length === 0) {
                let headers = Object.keys(nextProps.devData[0])
                let filters = [];
                headers.map((item) => {
                    let _state = false;
                    this.props.hiddenKeys.map((hkey) => {
                        if (item === hkey) {
                            _state = true
                        }
                    })
                    filters.push({ name: item, hidden: _state })
                })
                this.props.handleSetHeader(filters)
            }
        } else {
            this.checkLengthData();
        }
        nextProps.clickCity.map((item) => {
            cityCoordinates.push(item.coordinates)
        })
        if (nextProps.clickCity.length > 0) {
            nextProps.devData.map((list) => {
                let arr = [];
                arr.push(reduceUp(list.CloudletLocation.longitude))
                arr.push(reduceUp(list.CloudletLocation.latitude))
                if (arr[0] == cityCoordinates[0][0] && arr[1] == cityCoordinates[0][1]) {
                    filterList.push(list)
                }
            })
            if (filterList && filterList[0]) {
                this.setState({ changeRegion: filterList[0]['Region'] })
            }
        } else {
            this.setState({ changeRegion: null })
        }
        if (nextProps.clickCity.length == 0) {
            if (nextProps.devData.length > 0 && this.state.dummyData !== nextProps.devData) {
                nextProps.devData.map(_item => {
                    if (_item.State !== 5) {
                        this.sendWSRequest(_item)
                    }
                })
                this.setState({ dummyData: nextProps.devData })
            }
        } else {
            if (filterList !== this.state.dummyData) {
                this.setState({ dummyData: filterList })
            }
        }


        if (nextProps.stateStream) {
            this.setState({ stateStream: nextProps.stateStream })
        }

        if (nextProps.resetMap) {
            this.setState({ _resetMap: nextProps.resetMap })
            this.forceUpdate()
        }


    }
    resetMap() {
        this.props.handleChangeClickCity([])
    }

    getAppInstKey=(item)=>{
        return (
        {
        region:item.Region,
        appinst:
        {
            key:
            {
                app_key:
                {
                    developer_key:{name:item.OrganizationName},name:item.AppName,version: item.Version
                },
                cluster_inst_key:
                {
                    cluster_key:{name:item.ClusterInst},
                    cloudlet_key:{operator_key:{name:item.Operator},name:item.Cloudlet}
                }
            }
        }
        })
    }

    sendWSRequest = (_item) =>
    {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        console.log('Rahul1234', this.props.siteId)
        let data = null;
        let method = null;
        switch(this.props.siteId)
        {
            case 'Cloudlet':
                data = { region: _item.Region, cloudlet: { key: { operator_key: { name: _item.Operator }, name: _item.CloudletName } } }
                method = serviceMC.getEP().STREAM_CLOUDLET;
            case 'ClusterInst':
                data = { region: _item.Region, clusterinst: { key: { cluster_key: { name: _item.ClusterName }, cloudlet_key: { operator_key: { name: _item.Operator }, name: _item.Cloudlet }, developer: _item.OrganizationName } } }
                method = serviceMC.getEP().STREAM_CLUSTER_INST;
                break;
            case 'appinst':
                data = {"region":"EU","appinst":{"key":{"app_key":{"developer_key":{"name":"MobiledgeX"},"name":"Face Detection Demo","version":"1.0"},"cluster_inst_key":{"cluster_key":{"name":"autoclusterFaceDetectionDemo"},"cloudlet_key":{"operator_key":{"name":"TDG"},"name":"ashish-munich1"}}}}}//this.getAppInstKey(_item);
                method = serviceMC.getEP().STREAM_APP_INST;
                console.log('Rahul123456', data)
                break; 
        }
        if(data)
        {
            console.log('Rahul123456111', _item) 
            serviceMC.sendWSRequest({ uuid: _item.uuid, token: store.userToken, method: method, data: data }, this.requestResponse) 
        }
    }



    render() {
        const { open, dimmer, dummyData, resize, _resetMap } = this.state;

        return (
            <div style={{ display: 'flex', overflowY: 'hidden', overflowX: 'hidden', width: '100%' }}>
                <RegistNewItem data={this.state.dummyData} dimmer={this.state.dimmer} open={this.state.open}
                    selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                    userToken={this.props.userToken}
                    success={this.successfully} zoomIn={this.zoomIn} zoomOut={this.zoomOut} refresh={this.props.dataRefresh} />

                <DeleteItem open={this.state.openDelete}
                    selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                    success={this.successfully} refresh={this.props.dataRefresh}>
                </DeleteItem>

                <Container
                    layout={this.state.layout}
                    onLayoutChange={this.onLayoutChange}
                    {...this.props}
                    style={{ justifyContent: 'space-between', width: '100%' }}>
                    {this.generateDOM(open, dimmer, dummyData, resize, _resetMap, this.resetMap)}
                </Container>
                <MexMessageStream onClose={this.closeStepper} uuid={this.state.uuid} stepsArray={this.state.stepsArray} />
                <PopDetailViewer data={this.state.detailViewData} dimmer={false} open={this.state.openDetail} close={this.closeDetail} centered={false} style={{ right: 400 }}></PopDetailViewer>
            </div>


        );
    }
    static defaultProps = {
        className: "layout",
        items: 20,
        rowHeight: 30,
        cols: 12,
        width: 1600,
        isDraggable: false,
        diffRev: [],
        dataSort: false
    };
}

const mapStateToProps = (state) => {
    let account = state.registryAccount.account;
    let dimm = state.btnMnmt;
    let accountInfo = account ? account + Math.random() * 10000 : null;
    let dimmInfo = dimm ? dimm : null;
    let viewMode = null;
    let detailData = null;
    if (state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
        detailData = state.changeViewMode.mode.data;
    }
    let deleteReset = state.deleteReset.reset
    let stateStream = state.stateStream ? state.stateStream.state : null;
    let submitObj = state.submitObj ? state.submitObj.submit : null;
    let resetMap = state.resetMap ? state.resetMap.region : null;
    return {
        accountInfo,
        dimmInfo,
        clickCity: state.clickCityList.list,
        deleteReset,
        stateStream,
        submitObj,
        viewMode: viewMode, detailData: detailData,
        resetMap
    }


};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) },
        handleDetail: (data) => { dispatch(actions.changeDetail(data)) },
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data)) },
        handleRefreshData: (data) => { dispatch(actions.refreshData(data)) },
        handleSetHeader: (data) => { dispatch(actions.tableHeaders(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleEditInstance: (data) => { dispatch(actions.editInstance(data)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data)) },
        handleChangeClickCity: (data) => { dispatch(actions.clickCityList(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MapWithListView));


