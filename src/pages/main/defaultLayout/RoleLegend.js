/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { useSelector } from "react-redux";
import { ListItem, Table, TableBody, TableRow, TableCell, TableHead, TableContainer } from '@material-ui/core';
import { perpetual } from '../../../helper/constant';
import { redux_org } from '../../../helper/reduxData';
import { legendRoles } from '../../../constant';
import { splitByCaps } from '../../../utils/string_utils';
import { makeStyles } from '@material-ui/styles';
import { InfoDialog } from '../../../hoc/mexui';

const legends = [
    { role: perpetual.ADMIN_MANAGER, class: 'mark markA markS', mark: 'AM' },
    { role: perpetual.DEVELOPER_MANAGER, class: 'mark markD markM', mark: 'DM' },
    { role: perpetual.DEVELOPER_CONTRIBUTOR, class: 'mark markD markC', mark: 'DC' },
    { role: perpetual.DEVELOPER_VIEWER, class: 'mark markD markV', mark: 'DV' },
    { role: perpetual.OPERATOR_MANAGER, class: 'mark markO markM', mark: 'OM' },
    { role: perpetual.OPERATOR_CONTRIBUTOR, class: 'mark markO markC', mark: 'OC' },
    { role: perpetual.OPERATOR_VIEWER, class: 'mark markO markV', mark: 'OV' },
]

// .MuiTableCell-stickyHeader

const useStyles = makeStyles((theme) => (
    {
        tableContainer: {
            maxHeight: 400,
            width: 400
        },
        tableRow: {
            "&:last-child th, &:last-child td": {
                borderBottom: 0
            },
        },
        tableHead: {
            backgroundColor: '#202125',
        },
        tableCol: {
            borderRight: '1px #515151 solid',
        },
        roleInfo:{
            marginTop: 10, 
            marginBottom: -7
        },
        colText: {
            color: '#E8E8E8',
            fontSize: 13
        },
        legend: {
            display: 'flex',
            alignItems: 'center'
        },
        legendInfo: {
            color: '#BFC0C2',
            fontSize: 14
        }
    }
))

const LegendMark = (props) => {
    const orgInfo = useSelector(state => state.organizationInfo.data)
    const classes = useStyles()
    return (
        <div className={classes.legend}>
            <div className="markBox">
                {
                    orgInfo ?
                        legends.map(legend => (
                            redux_org.role(orgInfo) === legend.role ?
                                <div key={legend.role} className={legend.class}>{legend.mark}</div> : null
                        )) : <div className="mark markA markS">?</div>
                }
            </div>
            {
                props.open ?
                    <div>
                        <strong className={classes.legendInfo}>
                            {
                                orgInfo ? splitByCaps(redux_org.role(orgInfo)) :
                                    <div>
                                        <p>No Organization selected</p>
                                        <p>Click Manage to view and</p>
                                        <p>manage your Organization</p>
                                    </div>
                            }
                        </strong>
                    </div> : null
            }
        </div>
    )
}

const RoleLegend = (props) => {
    const [open, setOpen] = React.useState(false)
    const orgInfo = useSelector(state => state.organizationInfo.data)
    const classes = useStyles()

    const roleInfo = () => {
        return (
            <div className={classes.roleInfo} >
                <ListItem button onClick={(e) => { setOpen(orgInfo !== undefined) }}>
                    <LegendMark open={props.drawerOpen} orgInfo={orgInfo} />
                </ListItem>
            </div>
        )
    }

    const handleClose = () => {
        setOpen(false)
    }

    const orgRole = redux_org.role(orgInfo)
    const roles = orgRole && legendRoles[orgRole]
    const keys = roles && Object.keys(roles)
    return (
        <React.Fragment>
            {roleInfo()}
            <InfoDialog open={open} title={'User Permissions'} onClose={handleClose}>
                <TableContainer className={classes.tableContainer}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2} className={classes.tableHead}>
                                    <LegendMark open={true} />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                roles && keys.map((key, i) => (
                                    <TableRow key={i} className={classes.tableRow}>
                                        <TableCell className={classes.tableCol}><b className={classes.colText}>{key}</b></TableCell>
                                        <TableCell><b className={classes.colText}>{roles[key]}</b></TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </InfoDialog>
        </React.Fragment>
    );
}

export default RoleLegend
