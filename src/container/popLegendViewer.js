import React from 'react';
import {Button, Divider, Modal, Grid, Table} from "semantic-ui-react";
import TextareaAutosize from "react-textarea-autosize";


const roles =
    {
        Developer: {
            Manager: {
                'Users': 'Manage',
                'Cloudlets': 'View',
                'Flavor': 'View',
                'Cluster Instance': 'Manage',
                'Apps': 'Manage',
                'App Instance': 'Manage'
            },
            Contributor: {
                'Users': 'View',
                'Cloudlets': 'View',
                'Flavor': 'View',
                'Cluster Instance': 'Manage',
                'Apps': 'Manage',
                'App Instance': 'Manage'
            },
            Viewer: {
                'Users': 'View',
                'Cloudlets': 'View',
                'Flavor': 'View',
                'Cluster Instance': 'View',
                'Apps': 'View',
                'App Instance': 'View'
            }
        },
        Operator: {
            Manager: {
                'Users': 'Manage',
                'Cloudlets': 'Manage',
                'Flavor': 'disabled',
                'Cluster Instance': 'disabled',
                'Apps': 'disabled',
                'App Instance': 'disabled'
            },
            Contributor: {
                'Users': 'View',
                'Cloudlets': 'Manage',
                'Flavor': 'disabled',
                'Cluster Instance': 'disabled',
                'Apps': 'disabled',
                'App Instance': 'disabled'
            },
            Viewer: {
                'Users': 'View',
                'Cloudlets': 'View',
                'Flavor': 'disabled',
                'Cluster Instance': 'disabled',
                'Apps': 'disabled',
                'App Instance': 'disabled'
            },
        }
    }

let _self = null;
export default class PopLegendViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            dummyData:[],
            selected:{},
            open:false,
            dimmer:'',
            devOptionsOne:[],
            devOptionsTwo:[],
            devOptionsThree:[],
            devOptionsFour:[],
            devOptionsFive:[],
            dropdownValueOne:'',
            dropdownValueTwo:'',
            dropdownValueThree:'',
            dropdownValueFour:'',
            dropdownValueFive:'',
            cloudletResult:null,
            appResult:null,
            listOfDetail:null,
            propsData:'',
            orgType:''
        }
        _self = this;
    }

    makeTextBox = (value) => (
        <TextareaAutosize
            minRows={3}
            maxRows={10}
            style={{ boxSizing: "border-box", width:'400px', backgroundColor:'#545b6b', color:'#eeeeee' }}
            defaultValue={value}></TextareaAutosize>
    )

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.open) {
            this.setState({open:nextProps.open, dimmer:nextProps.dimmer});
            let regKeys = [];
            let component = null;
            if(nextProps.data){
                this.setState({orgType:nextProps.data.Type})
                regKeys = Object.keys(nextProps.data)
                component = regKeys.map((key, i)=>(
                    (key !== 'Edit')?
                    <Grid.Row columns={2} key={i}>
                        <Grid.Column width={5} className='detail_item'>
                            <div>
                                {(key === 'FlavorName')?'Flavor Name'
                                 :(key === 'RAM')?'RAM Size'
                                 :(key === 'vCPUs')?'Number of vCPUs'
                                 :(key === 'Disk')?'Disk Space' /* 여기까지 Flavors*/
                                 :(key === 'OrganizationName')?'Organization Name'
                                 :(key === 'AppName')?'App Name'
                                 :(key === 'DeploymentType')?'Deployment Type'
                                 :(key === 'ImageType')?'Image Type'
                                 :(key === 'ImagePath')?'Image Path'
                                 :(key === 'DefaultFlavor')?'Default Flavor'
                                 :(key === 'DeploymentMF')?'Deployment Manifest' /* 여기까지 Apps*/
                                 :(key === 'AuthPublicKey')?'Auth Public Key'
                                 :key}
                            </div>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <div style={{wordWrap: 'break-word'}} style={{overflowY:'auto'}}>
                                {(key === 'DeploymentType' && String(nextProps.data[key]) === 'docker')?"Docker"
                                :(key === 'DeploymentType' && String(nextProps.data[key]) === 'vm')?"VM"
                                :(key === 'DeploymentType' && String(nextProps.data[key]) === 'kubernetes')?"Kubernetes"
                                :(key === 'DeploymentType' && String(nextProps.data[key]) === 'helm')?"Helm"
                                :(key === 'Ports')?String(nextProps.data[key]).toUpperCase()
                                :(key === 'DeploymentMF')? this.makeTextBox(nextProps.data[key])
                                :(key === 'ImageType' && String(nextProps.data[key]) === '1')?"Docker"
                                :(key === 'ImageType' && String(nextProps.data[key]) === '2')?"Qcow" /* 여기까지 Apps*/
                                :(key === 'Created')? String("time is ==  "+nextProps.data[key])
                                :(typeof nextProps.data[key] === 'object')? JSON.stringify(nextProps.data[key])
                                :String(nextProps.data[key])}
                            </div>
                        </Grid.Column>

                        <Divider vertical></Divider>
                    </Grid.Row>
                        :null

                ))
            }
            this.setState({listOfDetail:component,propsData:nextProps.data})
        }

    }

    setCloudletList = (operNm) => {
        let cl = [];
        _self.state.cloudletResult[operNm].map((oper, i) => {
            if(i === 0) _self.setState({dropdownValueThree: oper.CloudletName})
            cl.push({ key: i, value: oper.CloudletName, text: oper.CloudletName })
        })

        _self.setState({devOptionsThree: cl})
    }



    close() {
        this.setState({ open: false })
        this.props.close()
    }
    getUserRole (type) {
        return (localStorage.selectRole == 'AdminManager') ? 'Manage' :
            (localStorage.selectRole == 'DeveloperManager') ? roles.Developer['Manager'][type] :
                (localStorage.selectRole == 'DeveloperContributor') ? roles.Developer['Contributor'][type] :
                    (localStorage.selectRole == 'DeveloperViewer') ? roles.Developer['Viewer'][type] :
                        (localStorage.selectRole == 'OperatorManager') ? roles.Operator['Manager'][type] :
                            (localStorage.selectRole == 'OperatorContributor') ? roles.Operator['Contributor'][type] :
                                (localStorage.selectRole == 'OperatorViewer') ? roles.Operator['Viewer'][type] :
                                    ''
    }

    render() {
        let { orgType } = this.state;
        return (
            <Modal style={{width: '450px'}} className="modal_role" open={this.state.open} dimmer={false}>
                <Modal.Header >Permission of Role</Modal.Header>
                <Modal.Content scrolling>
                    <Modal.Description>
                        <Grid divided>
                            <div role={"list"}>

                            </div>

                        </Grid>
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
                                    {/* <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>Status</Table.HeaderCell>

                                        </Table.Row>
                                    </Table.Header> */}

                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell style={{width:'35%'}}>Users</Table.Cell>
                                            <Table.Cell>
                                                {this.getUserRole('Users')}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Cloudlets</Table.Cell>
                                            <Table.Cell>
                                                {this.getUserRole('Cloudlets')}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Flavor</Table.Cell>
                                            <Table.Cell>{this.getUserRole('Flavor')}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Cluster Instance</Table.Cell>
                                            <Table.Cell>{this.getUserRole('Cluster Instance')}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Apps</Table.Cell>
                                            <Table.Cell>{this.getUserRole('Apps')}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>App Instance</Table.Cell>
                                            <Table.Cell>{this.getUserRole('App Instance')}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Row>
                        </Grid>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.close()}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}


