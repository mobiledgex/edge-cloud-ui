import React, { Component } from "react";
import MaterialTable, { MTableToolbar} from "material-table";
import MexDetailViewer from '../../hoc/dataViewer/DetailViewer';
import Map from "../../hoc/maps/MexMap";
import { ACTION_NEW, ACTION_REFRESH } from '../../container/MexToolbar'
import './style.css'

import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import ListIcon from '@material-ui/icons/List';
import { IconButton, Menu, MenuItem } from "@material-ui/core";

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};



class MexTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            actionEl: null,
            columns: [],
            selectedRow: {}
        }
    }

    /*Action Block*/
    actionClose = (action) => {
        this.setState({ actionEl: null });
        this.props.actionClose(action)
    }

    getActionMenu = (props) => {
        return (
            props.actionMenu ?
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.actionEl}
                    keepMounted
                    open={Boolean(this.state.actionEl)}
                    onClose={this.actionClose}
                >
                    {props.actionMenu.map((action, i) => {
                        let visible = action.visible ? action.visible(this.state.selectedRow) : true
                        return visible ? <MenuItem key={i} onClick={(e) => { this.actionClose(action) }}>{action.label}</MenuItem> : null
                    })}
                </Menu>
                : null
        )
    }

    onActionClick = (e, rowData) => {
        this.setState({ actionEl: e.currentTarget, selectedRow: rowData })
    }

    //Column definitions
    columns = (props) => {
        let keys = props.keys
        let columns = []
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            if (key.label === 'Actions') {
                columns.push({
                    title: 'Actions', searchable: false, render: rowData => {
                        return (
                            <IconButton size="small" aria-label="Action" className='buttonActions' onClick={(e) => { this.onActionClick(e, rowData) }}>
                                <ListIcon style={{ color: '#76ff03' }} />
                            </IconButton>
                        )
                    }
                })
            }
            else if (key.visible) {
                let column = { title: key.label, field: key.field, searchable: key.filter ? key.filter : false }
                if(key.group === 0)
                {
                    column.defaultGroupOrder =  key.group
                }
                columns.push(column)
            }
        }
        return columns
    }

    //Component customization
    components = () => {
        let isMap = this.props.showMap
        return (
            {
                Toolbar: props => (
                    <div style={{ backgroundColor: '#292C33', paddingTop: 10, marginBottom: 10 }}>
                        <MTableToolbar {...props} />
                        {isMap ?
                            <div className='panel_worldmap' style={{ height: 400 }}>
                                <Map dataList={this.props.dataList}
                                    id={this.props.requestInfo.id}
                                    onClick={this.props.onMapClick}
                                    region={this.props.selectedRegion}
                                    mapDetails={this.props.mapDetails} />
                            </div> : null}
                    </div>
                )
            }
    )}

    //All options of table
    options = {
        search: true,
        filtering: false,
        headerStyle: { backgroundColor: '#292C33', position: 'sticky', top: 0 },
        pageSizeOptions: [25, 50, 75],
        pageSize: 25,
        doubleHorizontalScroll: true,
        maxBodyHeight: `calc(100vh - ${this.props.showMap ? '590px' : '234px'})`,
        selection: true,
        grouping: this.props.requestInfo.grouping
    }
    

    //Action list. An icon button will be rendered for each actions
    actions = [
        {
            icon: () => (<AddIcon style={{ color: '#76ff03' }} />),
            tooltip: 'Add',
            isFreeAction: true,
            onClick: (event) => { this.props.onAction(ACTION_NEW) }
        },
        {
            icon: () => (<RefreshIcon style={{ color: '#76ff03' }} />),
            tooltip: 'Refresh',
            isFreeAction: true,
            onClick: (e) => { this.props.onAction(ACTION_REFRESH) }
        }
    ]

    detailPanel = (data) => {
        let additionalDetail = this.props.requestInfo.additionalDetail
        return <div style={{ height: 400, overflow: 'auto' }}>
            <MexDetailViewer detailData={data} keys={this.props.keys} />
            {additionalDetail ? additionalDetail(data) : null}</div>
    }

    render() {
        return (
            <div style={{ maxWidth: "100%" }}>
                <MaterialTable
                    components={this.components()}
                    icons={tableIcons}
                    columns={this.state.columns}
                    data={this.props.dataList}
                    title={this.props.headerLabel}
                    options={this.options}
                    actions={this.actions}
                    onRowClick={(event, rowData, togglePanel) => {
                        togglePanel()
                    }}
                    detailPanel={rowData=>(
                        this.detailPanel(rowData)
                    )}
                />
                {this.getActionMenu(this.props)}
            </div>
        )
    }

    componentDidMount() {
        this.setState({ columns: this.columns(this.props) })
    }
}
export default MexTable