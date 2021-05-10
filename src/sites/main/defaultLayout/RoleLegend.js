import React from 'react';
import { useSelector } from "react-redux";
import { ListItem, Dialog, DialogContent, IconButton, Table, TableBody, TableRow, TableCell, TableHead } from '@material-ui/core';
import { ADMIN_MANAGER, DEVELOPER_CONTRIBUTOR, DEVELOPER_MANAGER, DEVELOPER_VIEWER, legendRoles, OPERATOR_CONTRIBUTOR, OPERATOR_MANAGER, OPERATOR_VIEWER } from '../../../constant';
import CloseIcon from '@material-ui/icons/Close';
import { redux_org } from '../../../helper/reduxData';

const legends = [
    { role: ADMIN_MANAGER, class: 'mark markA markS', mark: 'AM' },
    { role: DEVELOPER_MANAGER, class: 'mark markD markM', mark: 'DM' },
    { role: DEVELOPER_CONTRIBUTOR, class: 'mark markD markC', mark: 'DC' },
    { role: DEVELOPER_VIEWER, class: 'mark markD markV', mark: 'DV' },
    { role: OPERATOR_MANAGER, class: 'mark markO markM', mark: 'OM' },
    { role: OPERATOR_CONTRIBUTOR, class: 'mark markO markC', mark: 'OC' },
    { role: OPERATOR_VIEWER, class: 'mark markO markV', mark: 'OV' },
]

const menuItem = ['Users & Roles', 'Cloudlets', 'Flavors', 'Cluster Instances', 'Apps', 'App Instances', 'Policies', 'Monitoring', 'Audit Logs'];


const LegendMark = (props) => {
    const orgInfo = useSelector(state => state.organizationInfo.data)
    return (
        <React.Fragment>
            <div className="markBox" style={{ display: 'inline' }}>
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
                    <div style={{ display: 'inline' }}>
                        <strong style={{ color: '#BFC0C2', fontSize: 14, }}>
                            {
                                orgInfo ? redux_org.role(orgInfo) :
                                    <div>
                                        <p>No Organization selected</p>
                                        <p>Click Manage to view and</p>
                                        <p>manage your Organization</p>
                                    </div>
                            }
                        </strong>
                    </div> : null
            }
        </React.Fragment>
    )
}

const RoleLegend = (props) => {
    const [open, setOpen] = React.useState(false)
    const length = menuItem.length - 1
    const orgInfo = useSelector(state => state.organizationInfo.data)

    const roleInfo = () => {
        return (
            <div style={{ marginTop: 10, marginBottom: -7 }} >
                <ListItem button onClick={(e) => { setOpen(orgInfo) }}>
                    <LegendMark open={props.drawerOpen} orgInfo={orgInfo} />
                </ListItem>
            </div>
        )
    }

    const handleClose = () => {
        setOpen(false)
    }

    const renderUserRole = (type) => {
        let role = redux_org.role(orgInfo)
        return (role == ADMIN_MANAGER) ? (type !== 'Monitoring' && type !== 'Audit Logs' ? 'Manage' : 'View') :
            (role == DEVELOPER_MANAGER) ? legendRoles.developer['Manager'][type] :
                (role == DEVELOPER_CONTRIBUTOR) ? legendRoles.developer['Contributor'][type] :
                    (role == DEVELOPER_VIEWER) ? legendRoles.developer['Viewer'][type] :
                        (role == OPERATOR_MANAGER) ? legendRoles.operator['Manager'][type] :
                            (role == OPERATOR_CONTRIBUTOR) ? legendRoles.operator['Contributor'][type] :
                                (role === OPERATOR_VIEWER) ? legendRoles.operator['Viewer'][type] : ''
    }

    return (
        <React.Fragment>
            {roleInfo()}
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <div style={{ width: 400 }}>
                        <div style={{ display: 'inline-block' }}>
                            <h3>Permissions of Role</h3>
                        </div>
                        <div style={{ display: 'inline-block', float: 'right' }}>
                            <IconButton onClick={handleClose} style={{ marginTop: -9 }}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </div>
                    <Table style={{ backgroundColor: '#1d1f23', borderRadius: 5 }} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2} style={{ padding: 10 }}>
                                    <LegendMark open={true} />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {menuItem.map((type, i) =>
                                renderUserRole(type) !== 'disabled' ?
                                    <TableRow key={i}>
                                        <TableCell style={length === i ? { borderBottom: 'none', borderRight: '1px #515151 solid' } : { borderRight: '1px #515151 solid' }}>{type}</TableCell>
                                        <TableCell style={length === i ? { borderBottom: 'none' } : null}>{renderUserRole(type)}</TableCell>
                                    </TableRow> : null
                            )}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export default RoleLegend
