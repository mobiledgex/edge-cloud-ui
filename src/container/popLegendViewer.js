import React from 'react';
import {Modal, Grid, Table} from "semantic-ui-react";
import CloseIcon from '@material-ui/icons/Close';

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
                'Monitoring' : 'View',
                'Audit Logs' : 'View'
            },
            Contributor: {
                'Users & Roles': 'View',
                'Cloudlets': 'View',
                'Flavors': 'View',
                'Cluster Instances': 'Manage',
                'Apps': 'Manage',
                'App Instances': 'Manage',
                'Policies': 'Manage',
                'Monitoring' : 'View',
                'Audit Logs' : 'View'
            },
            Viewer: {
                'Users & Roles': 'View',
                'Cloudlets': 'View',
                'Flavors': 'View',
                'Cluster Instances': 'View',
                'Apps': 'View',
                'App Instances': 'View',
                'Policies': 'View',
                'Monitoring' : 'View',
                'Audit Logs' : 'View'
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
                'Monitoring' : 'View',
                'Audit Logs' : 'View'
            },
            Contributor: {
                'Users & Roles': 'View',
                'Cloudlets': 'Manage',
                'Flavors': 'disabled',
                'Cluster Instances': 'disabled',
                'Apps': 'disabled',
                'App Instances': 'disabled',
                'Policies': 'disabled',
                'Monitoring' : 'View',
                'Audit Logs' : 'View'
            },
            Viewer: {
                'Users & Roles': 'View',
                'Cloudlets': 'View',
                'Flavors': 'disabled',
                'Cluster Instances': 'disabled',
                'Apps': 'disabled',
                'App Instances': 'disabled',
                'Policies': 'disabled',
                'Monitoring' : 'View',
                'Audit Logs' : 'View'
            },
        }
    }

let _self = null;
export default class PopLegendViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false
        }
        _self = this;
    }

    static getDerivedStateFromProps(props, state) {
        if (props.open) {
            return { open: props.open }
        }
        return null
    }

    close() {
        this.setState({ open: false })
        this.props.close()
    }

    getUserRole(type) {
        return (localStorage.selectRole == 'AdminManager') ? (type !== 'Monitoring' && type !== 'Audit Logs'? 'Manage' : 'View') :
            (localStorage.selectRole == 'DeveloperManager') ? roles.Developer['Manager'][type] :
                (localStorage.selectRole == 'DeveloperContributor') ? roles.Developer['Contributor'][type] :
                    (localStorage.selectRole == 'DeveloperViewer') ? roles.Developer['Viewer'][type] :
                        (localStorage.selectRole == 'OperatorManager') ? roles.Operator['Manager'][type] :
                            (localStorage.selectRole == 'OperatorContributor') ? roles.Operator['Contributor'][type] :
                                (localStorage.selectRole == 'OperatorViewer') ? roles.Operator['Viewer'][type] : ''
    }

    render() {
        return (
            <Modal style={{width: '450px'}} className="modal_role" open={this.state.open}>
                <Modal.Content >
                    <h3 style={{ display: 'inline', top:20, position: 'absolute'}}>Permissions of Role</h3>
                    <button onClick={() => this.close()} style={{ display: 'inline', right: 5, position: 'fixed', backgroundColor:'transparent', border:'none' }}>
                        <CloseIcon />
                    </button>
                </Modal.Content>
                <Modal.Content scrolling>
                    <Modal.Description>
                        <Grid className="stepOrgDeveloper2">
                            <Grid.Row columns={2} onClick={this.orgTypeLegendShow}>
                                <Grid.Column width={5}>
                                    <div className="markBox">
                                        {
                                            (localStorage.selectRole == 'AdminManager')? <div className="mark markA markS">S</div>
                                                :
                                                (localStorage.selectRole == 'DeveloperManager')?
                                                    <div className="mark markD markM">M</div>
                                                    :
                                                    (localStorage.selectRole == 'DeveloperContributor')?
                                                        <div className="mark markD markC">C</div>
                                                        :
                                                        (localStorage.selectRole == 'DeveloperViewer')?
                                                            <div className="mark markD markV">V</div>
                                                            :
                                                            (localStorage.selectRole == 'OperatorManager')?
                                                                <div className="mark markO markM">M</div>
                                                                :
                                                                (localStorage.selectRole == 'OperatorContributor')?
                                                                    <div className="mark markO markC">C</div>
                                                                    :
                                                                    (localStorage.selectRole == 'OperatorViewer')?
                                                                        <div className="mark markO markV">V</div>
                                                                        :
                                                                        <div></div>
                                        }
                                    </div>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    {
                                        (localStorage.selectRole == 'AdminManager') ? localStorage.selectRole : localStorage.selectRole
                                    }
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Table celled inverted selectable>

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
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        )
    }
}


