import React from 'react';
import { Grid, Table } from "semantic-ui-react";
import CloseIcon from '@material-ui/icons/Close';
import { Dialog, DialogContent, IconButton, DialogTitle } from '@material-ui/core';

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
export default class PopLegendViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.open) {
            return { open: props.open }
        }
        return null
    }

    close = () =>{
        this.setState({ open: false })
        this.props.close()
    }

    getUserRole = (type) =>{
        return (localStorage.selectRole == 'AdminManager') ? (type !== 'Monitoring' && type !== 'Audit Logs' ? 'Manage' : 'View') :
            (localStorage.selectRole == 'DeveloperManager') ? roles.Developer['Manager'][type] :
                (localStorage.selectRole == 'DeveloperContributor') ? roles.Developer['Contributor'][type] :
                    (localStorage.selectRole == 'DeveloperViewer') ? roles.Developer['Viewer'][type] :
                        (localStorage.selectRole == 'OperatorManager') ? roles.Operator['Manager'][type] :
                            (localStorage.selectRole == 'OperatorContributor') ? roles.Operator['Contributor'][type] :
                                (localStorage.selectRole == 'OperatorViewer') ? roles.Operator['Viewer'][type] : ''
    }

    render() {
        return (
            <Dialog open={this.state.open} onClose={this.close}>
                <DialogTitle >
                    <div style={{width:400}}>
                        <div style={{ display: 'inline-block' }}>
                            <h3>Permissions of Role</h3>
                        </div>
                        <div style={{ display: 'inline-block', float: 'right' }}>
                            <IconButton onClick={this.close} style={{ marginTop: -9 }}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div style={{marginTop:20, marginBottom:-10}}>
                            <div className="markBox">
                                {
                                    (localStorage.selectRole == 'AdminManager') ? <div className="mark markA markS">S</div>
                                        :
                                        (localStorage.selectRole == 'DeveloperManager') ?
                                            <div className="mark markD markM">M</div>
                                            :
                                            (localStorage.selectRole == 'DeveloperContributor') ?
                                                <div className="mark markD markC">C</div>
                                                :
                                                (localStorage.selectRole == 'DeveloperViewer') ?
                                                    <div className="mark markD markV">V</div>
                                                    :
                                                    (localStorage.selectRole == 'OperatorManager') ?
                                                        <div className="mark markO markM">M</div>
                                                        :
                                                        (localStorage.selectRole == 'OperatorContributor') ?
                                                            <div className="mark markO markC">C</div>
                                                            :
                                                            (localStorage.selectRole == 'OperatorViewer') ?
                                                                <div className="mark markO markV">V</div>
                                                                :
                                                                <div></div>
                                }
                                <h4 style={{marginLeft:10, display:'inline'}}>{(localStorage.selectRole == 'AdminManager') ? localStorage.selectRole : localStorage.selectRole}</h4>
                            </div>
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <Grid>
                        <Grid.Row>
                            <Table celled inverted selectable style={{backgroundColor:'#1d1f23'}}>
                                <Table.Body>
                                    {menuItem.map((type, i) =>
                                        this.getUserRole(type) !== 'disabled' ?
                                            <Table.Row key={i}>
                                                <Table.Cell>{type}</Table.Cell>
                                                <Table.Cell>{this.getUserRole(type)}</Table.Cell>
                                            </Table.Row> : null
                                    )}
                                </Table.Body>
                            </Table>
                        </Grid.Row>
                    </Grid>
                </DialogContent>
            </Dialog>
        )
    }
}


