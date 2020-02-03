import React from 'react';
import { Table } from 'semantic-ui-react';
import {IconButton, Grow, Popper, Paper, ClickAwayListener, MenuList} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AlarmIcon from '@material-ui/icons/List';
import { green } from '@material-ui/core/colors';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import './styles.css';
import _ from "lodash";




let _self = null;
const organizationEdit = [
    { key: 'Audit', text: 'Audit', icon: null },
    { key: 'AddUser', text: 'Add User', icon: null },
    { key: 'Delete', text: 'Delete', icon: 'trash alternate' },
]
class DeveloperListView extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            dummyData: [],
            anchorEl : null
        };
        this.sorting = false;
    }

    gotoUrl(site, subPath, pg) {
        let arrSubPath = subPath.toString().split("&org=")
        let orgName = arrSubPath[1];

        this.props.history.push({
            pathname: site,
            search: subPath,
            goBack: pg,
            state: {
                orgName: orgName
            }
        });
        this.props.history.location.search = subPath;
        this.props.handleChangeSite({ mainPath: site, subPath: subPath })
    }


    

    handleSort = clickedColumn => (a) => {

        this.sorting = true;
        const { column, dummyData, direction } = _self.state
        if ((column !== clickedColumn) && dummyData) {
            let sorted = _.sortBy(dummyData, [clm => typeof clm[clickedColumn] === 'string' ? String(clm[clickedColumn]).toLowerCase() : clm[clickedColumn]])
            this.setState({
                column: clickedColumn,
                dummyData: sorted,
                direction: 'ascending',
            })
            return
        } else {
            let reverse = dummyData.reverse()
            this.setState({
                dummyData: reverse,
                direction: direction === 'ascending' ? 'descending' : 'ascending',
            })
        }
    }

    makeHeader() {
        const { column, direction } = this.state
        return this.props.headerInfo.map((header, i) => {
            if (header.visible) {
                return (
                    <Table.HeaderCell key={i} className={header.sortable ? '' : 'unsortable'} textAlign='center' sorted={column === header.field ? direction : null} onClick={header.sortable ? this.handleSort(header.field) : null}>
                        {header.label}
                    </Table.HeaderCell>)
            }
        })
    }

   

    detailView(item) {
       
    }

   
    appLaunch = (data) => {
        this.gotoUrl('/site4', 'pg=createAppInst', 'pg=5')
        this.props.handleAppLaunch(data)
        localStorage.setItem('selectMenu', 'App Instances')
    }


    getCellClick = (field, item) => {
        return (
                field === 'Actions' ?
                    null :
                    this.detailView(item)
        )
    }

    onActionClose = (action)=>
    {
        action.onClick()
        this.setState({
            anchorEl: null
        })
    }

    getAction = () => {

        return (
            <IconButton aria-label="Action" onClick={e => this.setState({ anchorEl: e.currentTarget })}>
                <AlarmIcon style={{ color: '#76ff03' }} />
            </IconButton>
        )
    }

    makeBody(i, item) {
        return this.props.headerInfo.map((header, j) => {
            if (header.visible) {
                let field = header.field;
                return <Table.Cell key={j} className="table_actions" textAlign='center' onClick={() => this.getCellClick(field, item)} style={(this.state.selectedItem == i) ? { background: '#444', cursor: 'pointer' } : { cursor: 'pointer' }}>
                    {
                        field === 'Actions' ? this.getAction()
                        :
                        <div ref={ref => this.tooltipref = ref}
                            data-tip='tooltip' data-for='happyFace'>
                            {String(item[field])}
                        </div>
                    }</Table.Cell>
            }
        })
    }


    componentDidUpdate(prevProps, prevState) {
        if(prevProps.devData !== this.props.devData)
        {
            this.setState({
                dummyData:this.props.devData
            })
        }
    }
   
    

    render() {
        return (
            <div style={{ display: 'flex', overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
                <div className="round_panel" style={{ display: 'flex', flexDirection: 'column' }}>
                    {
                        this.state.dummyData.length > 0 ?
                            <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing>
                                <Table.Header className="viewListTableHeader">
                                    <Table.Row>
                                        {this.makeHeader()}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body className="tbBodyList" onScroll={this.onHandleScroll}>
                                    {
                                        this.state.dummyData.map((item, i) => (
                                            <Table.Row key={i}>
                                                {this.makeBody(i, item)}
                                            </Table.Row>
                                        ))
                                    }
                                </Table.Body>
                            </Table> :
                            null
                    }
                </div>
                {
                    this.props.actionMenu ?
                        <Popper open={Boolean(this.state.anchorEl)} anchorEl={this.state.anchorEl} role={undefined} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                    <Paper style={{ backgroundColor: '#212121', color: 'white' }}>
                                        <ClickAwayListener onClickAway={this.onActionClose}>
                                            <MenuList autoFocusItem={Boolean(this.state.anchorEl)} id="menu-list-grow" >
                                                {this.props.actionMenu.map(action => {
                                                    return <MenuItem onClick={(e)=>{this.onActionClose(action)}}>{action.label}</MenuItem>
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
}


const mapStateToProps = (state) => {
    let account = state.registryAccount.account;
    let dimm = state.btnMnmt;
    let accountInfo = account ? account + Math.random() * 10000 : null;
    let dimmInfo = dimm ? dimm : null;

    return {
        accountInfo,
        dimmInfo,
        itemLabel: state.computeItem.item,
        userToken: (state.user.userToken) ? state.userToken : null,
        searchValue: (state.searchValue.search) ? state.searchValue.search : null,
        searchType: (state.searchValue.scType) ? state.searchValue.scType : null,
        userRole: state.showUserRole ? state.showUserRole.role : null,
        roleInfo: state.roleInfo ? state.roleInfo.role : null,
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => {
            dispatch(actions.changeSite(data))
        },
        handleInjectDeveloper: (data) => {
            dispatch(actions.registDeveloper(data))
        },
        handleUserRole: (data) => {
            dispatch(actions.showUserRole(data))
        },
        handleSelectOrg: (data) => {
            dispatch(actions.selectOrganiz(data))
        },
        handleRefreshData: (data) => {
            dispatch(actions.refreshData(data))
        },
        handleAppLaunch: (data) => {
            dispatch(actions.appLaunch(data))
        },
        handleChangeComputeItem: (data) => {
            dispatch(actions.computeItem(data))
        },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(DeveloperListView));


