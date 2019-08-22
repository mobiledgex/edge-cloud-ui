import React from 'react';
import {Button, Divider, Modal, Grid, Input, TextArea, Dropdown} from "semantic-ui-react";
import TextareaAutosize from "react-textarea-autosize";
import * as moment from 'moment';

let _self = null;
export default class PopDetailViewer extends React.Component {
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
            propsData:''
        }
        _self = this;
    }

    makeTextBox = (value) => (
        <TextareaAutosize
            minRows={3}
            maxRows={10}
            style={{ boxSizing: "border-box", width:'450px', backgroundColor:'#545b6b', color:'#eeeeee' }}
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
                regKeys = Object.keys(nextProps.data)
                component = regKeys.map((key, i)=>(
                    (key !== 'Edit')?
                    <Grid.Row columns={2} key={i}>
                        <Grid.Column width={5} className='detail_item'>
                            <div>
                                {(key === 'FlavorName')?'Flavor Name'
                                 :(key == 'RAM')?'RAM Size'
                                 :(key == 'vCPUs')?'Number of vCPUs'
                                 :(key == 'Disk')?'Disk Space' /* 여기까지 Flavors*/
                                 :(key == 'OrganizationName')?'Organization Name'
                                 :(key == 'AppName')?'App Name'
                                 :(key == 'DeploymentType')?'Deployment Type'
                                 :(key == 'ImageType')?'Image Type'
                                 :(key == 'ImagePath')?'Image Path'
                                 :(key == 'DefaultFlavor')?'Default Flavor'
                                 :(key == 'DeploymentMF')?'Deployment Manifest' /* 여기까지 Apps*/
                                 :(key == 'AuthPublicKey')?'Auth Public Key'
                                 :key}
                            </div>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <div style={{wordWrap: 'break-word'}} style={{overflowY:'auto'}}>
                                {(key == 'DeploymentType' && String(nextProps.data[key]) === 'docker')?"Docker"
                                :(key == 'DeploymentType' && String(nextProps.data[key]) === 'vm')?"VM"
                                :(key == 'DeploymentType' && String(nextProps.data[key]) === 'kubernetes')?"Kubernetes"
                                :(key == 'DeploymentType' && String(nextProps.data[key]) === 'helm')?"Helm"
                                :(key == 'Ports')?String(nextProps.data[key]).toUpperCase()
                                :(key == 'DeploymentMF')? this.makeTextBox(nextProps.data[key])
                                :(key == 'ImageType' && String(nextProps.data[key]) === '1')?"Docker"
                                :(key == 'ImageType' && String(nextProps.data[key]) === '2')?"Qcow" /* 여기까지 Apps*/
                                :(key == 'Created')? String("time is ==  "+nextProps.data[key])
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


    render() {

        return (
            <Modal size={'small'} open={this.state.open} dimmer={false}>
                <Modal.Header >View Detail</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Grid divided style={{overflowY:'scroll'}}>
                            {
                                this.state.listOfDetail
                            }
                        </Grid>
                        {(this.props.siteId === 'Organization') ?
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column>
                                        <div>
                                            If your image is docker, please upload your image with your MobiledgeX
                                            Account Credentials to our docker registry using the following docker
                                            command.
                                        </div>
                                        <br></br>
                                        <div>
                                            {`$ docker login -u <username> docker.mobiledgex.net`}
                                        </div>
                                        <div>
                                            {`$ docker tag <your application> docker.mobiledgex.net/` + this.state.propsData.Organization + `/images/<application name>:<version>`}
                                        </div>
                                        <div>
                                            {`$ docker push docker.mobiledgex.net/` + this.state.propsData.Organization + `/images/<application name>:<version>`}
                                        </div>
                                        <div>
                                            $ docker logout docker.mobiledgex.net
                                        </div>
                                        <br></br>
                                        <div>
                                            If you image is VM, please upload to our VM registry with your MobiledgeX
                                            Account Credentials.
                                        </div>
                                        <div>
                                            {`curl -u<username> -T <path_to_file> `}<span
                                            style={{color: 'rgba(136,221,0,.9)'}}>{`"https://artifactory.mobiledgex.net/artifactory/repo-` + this.state.propsData.Organization + `/<target_file_path>"`}</span>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            :null
                        }
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


