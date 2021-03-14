import React from 'react';
import { ListItem, Dialog, DialogContent, IconButton, Table, TableBody, TableRow, TableCell, TableHead } from '@material-ui/core';
import { ADMIN_MANAGER, DEVELOPER_CONTRIBUTOR, DEVELOPER_MANAGER, DEVELOPER_VIEWER, OPERATOR_CONTRIBUTOR, OPERATOR_MANAGER, OPERATOR_VIEWER } from '../../../constant';
import CloseIcon from '@material-ui/icons/Close';
import { getUserRole } from '../../../services/model/format';

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
const roles =
{
    Developer: {
        Manager: {
            'Users & Roles': 'Manage',
            'Cloudlets': 'View',
            'Flavors': 'View',
            'Cluster Instances': 'Manage',
            'Apps': 'Manage',
            'App Instances': 'Manage',
            'Policies': 'Manage',
            'Monitoring': 'View',
            'Audit Logs': 'View'
        },
        Contributor: {
            'Users & Roles': 'View',
            'Cloudlets': 'View',
            'Flavors': 'View',
            'Cluster Instances': 'Manage',
            'Apps': 'Manage',
            'App Instances': 'Manage',
            'Policies': 'Manage',
            'Monitoring': 'View',
            'Audit Logs': 'View'
        },
        Viewer: {
            'Users & Roles': 'View',
            'Cloudlets': 'View',
            'Flavors': 'View',
            'Cluster Instances': 'View',
            'Apps': 'View',
            'App Instances': 'View',
            'Policies': 'View',
            'Monitoring': 'View',
            'Audit Logs': 'View'
        }
    },
    Operator: {
        Manager: {
            'Users & Roles': 'Manage',
            'Cloudlets': 'Manage',
            'Flavors': 'disabled',
            'Cluster Instances': 'disabled',
            'Apps': 'disabled',
            'App Instances': 'disabled',
            'Policies': 'disabled',
            'Monitoring': 'View',
            'Audit Logs': 'View'
        },
        Contributor: {
            'Users & Roles': 'View',
            'Cloudlets': 'Manage',
            'Flavors': 'disabled',
            'Cluster Instances': 'disabled',
            'Apps': 'disabled',
            'App Instances': 'disabled',
            'Policies': 'disabled',
            'Monitoring': 'View',
            'Audit Logs': 'View'
        },
        Viewer: {
            'Users & Roles': 'View',
            'Cloudlets': 'View',
            'Flavors': 'disabled',
            'Cluster Instances': 'disabled',
            'Apps': 'disabled',
            'App Instances': 'disabled',
            'Policies': 'disabled',
            'Monitoring': 'View',
            'Audit Logs': 'View'
        },
    }
}

const LegendMark = (props) => (
    <React.Fragment>
        <div className="markBox" style={{ display: 'inline' }}>
            {
                getUserRole() ?
                    legends.map(legend => (
                        getUserRole() === legend.role ?
                            <div key={legend.role} className={legend.class}>{legend.mark}</div> : null
                    )) : <div className="mark markA markS">?</div>
            }
        </div>
        {
            props.open ?
                <div style={{ display: 'inline' }}>
                    <strong style={{ color: '#BFC0C2', fontSize: 14, }}>
                        {
                            getUserRole() ? getUserRole() :
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

const RoleLegend = (props) => {
    const [open, setOpen] = React.useState(false)
    const length = menuItem.length - 1
    const roleInfo = () => {
        return (
            <div style={{ marginTop: 10, marginBottom: -7 }} >
                <ListItem button onClick={(e) => { setOpen(getUserRole() !== undefined) }}>
                    <LegendMark open={props.drawerOpen} />
                </ListItem>
            </div>
        )
    }

    const handleClose = () => {
        setOpen(false)
    }

    const renderUserRole = (type) => {
        return (localStorage.selectRole == 'AdminManager') ? (type !== 'Monitoring' && type !== 'Audit Logs' ? 'Manage' : 'View') :
            (localStorage.selectRole == 'DeveloperManager') ? roles.Developer['Manager'][type] :
                (localStorage.selectRole == 'DeveloperContributor') ? roles.Developer['Contributor'][type] :
                    (localStorage.selectRole == 'DeveloperViewer') ? roles.Developer['Viewer'][type] :
                        (localStorage.selectRole == 'OperatorManager') ? roles.Operator['Manager'][type] :
                            (localStorage.selectRole == 'OperatorContributor') ? roles.Operator['Contributor'][type] :
                                (localStorage.selectRole == 'OperatorViewer') ? roles.Operator['Viewer'][type] : ''
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
                                    <LegendMark open={true}/>
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
