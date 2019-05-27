import React from 'react';
import {Button, Divider, Modal, Grid, Input, TextArea, Dropdown} from "semantic-ui-react";
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';
import * as service from "../services/service_compute_service";
import * as aggregate from "../utils";
import Alert from "react-s-alert";

let _self = null;
class DeleteItem extends React.Component {
    constructor() {
        super();
        this.state = {
            dummyData:[],
            selected:{},
            open:false,
            dimmer:'',
            devOptionsOne:[],
            devOptionsTwo:[],
            dropdownValueOne:'',
            dropdownValueTwo:'',
            showWarning:false,
            closeOnEscape:true,
            closeOnDimmerClick:true,
            deleteName:''
        }
        _self = this;
    }

    /***************************
     * delete selected item
     * @param result
     ***************************/
    receiveSubmit = (result) => {
        this.props.handleLoadingSpinner(false);
        this.props.refresh('All')
        console.log('registry delete ... success result..', result.data)
        let paseData = result.data;
        let splitData = JSON.parse( "["+paseData.split('}\n{').join('},\n{')+"]" );

        if(result.data.indexOf('successfully') > -1 || result.data.indexOf('ok') > -1) {
            Alert.success("Deletion!", {
                position: 'top-right',
                effect: 'slide',
                onShow: function () {
                    console.log('aye!')
                },
                beep: true,
                timeout: 5000,
                offset: 100
            });
            _self.props.success();
        }
    }

    receiveListSubmit = (result) => {
        this.props.handleLoadingSpinner(false);
        this.props.refresh('All')
        console.log('registry delete ... success result..', result.data)
        if(result.data.message.indexOf('ok') > -1) {
            console.log("deleteSuccess@@")
            Alert.success("Deletion!", {
                position: 'top-right',
                effect: 'slide',
                onShow: function () {
                    console.log('aye!')
                },
                beep: true,
                timeout: 5000,
                offset: 100
            });
            _self.props.success();
        }
    }

    receiveUserSubmit = (result,body) => {
        this.props.handleLoadingSpinner(false);
        _self.props.refresh('All');
        console.log('user delete ... success result..', result.data, body.params.name,':::',this.props.selectOrg);
        if(result.data.message) {
            Alert.success(result.data.message, {
                position: 'top-right',
                effect: 'slide',
                onShow: function () {
                    console.log('aye!')
                },
                beep: true,
                timeout: 5000,
                offset: 100
            });
            _self.props.success();
        }
        if(this.props.siteId === 'Organization' && body.params.name == (this.props.selectOrg.Organization)?this.props.selectOrg.Organization:null) {
            this.props.handleSelectOrg('-')
            this.props.handleUserRole('')
        }
    }

    closeDeleteModal(confirm) {
        _self.setState({ showWarning: false })
        _self.props.close()
        if(confirm === 'yes') {
            _self.onHandleDelete()
        }
    }
    onHandleDelete() {
        console.log('on handle delete item == ',this.props.siteId, this.props.selected);
        let select = this.props.selected;
        let region = this.props.region;
        let serviceBody = {}
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.props.handleLoadingSpinner(true);
        // setTimeout(() => {
        //     this.props.handleLoadingSpinner(false);
        // },3000);

        let serviceNm = '';
        if(this.props.siteId === 'ClusterInst'){
            const {Cloudlet, Flavor, ClusterName, OrganizationName, Operator, Region} = this.props.selected
            console.log("clusterInst@@@@",this.props.selected);
            serviceNm = 'DeleteClusterInst';
            serviceBody = {
                "token":store.userToken,
                "params": {
                    "region":Region,
                    "clusterinst":{
                        "key":{
                            "cluster_key":{"name":ClusterName},
                            "cloudlet_key":{"operator_key":{"name":Operator},"name":Cloudlet},
                            "developer":OrganizationName
                        },
                        "flavor":{"name":Flavor}
                    }
                }
            }
            service.deleteCompute(serviceNm, serviceBody, this.receiveSubmit)
        } else if(this.props.siteId === 'appinst') {
            const {OrganizationName, AppName, Version, Operator, Cloudlet, ClusterInst, Region} = this.props.selected
            serviceNm = 'DeleteAppInst'
            serviceBody = {
                "token":store.userToken,
                "params": {
                    "region":Region,
                    "appinst":{
                        "key":{
                            "app_key":{"developer_key":{"name":OrganizationName},"name":AppName,"version":Version},
                            "cluster_inst_key":{
                                "cloudlet_key":{"name":Cloudlet,"operator_key":{"name":Operator}},
                                "cluster_key":{"name":ClusterInst},
                                "developer":OrganizationName
                            }
                        },
                        
                    }
                }
            }
            service.deleteCompute(serviceNm, serviceBody, this.receiveSubmit)
        } else if(this.props.siteId === 'User') {
            let userArr = [];
            Object.values(this.props.selected).map((item,i) => {
                userArr.push(item);
            })
            serviceNm = 'removeuser'
            serviceBody = {
                "token":store.userToken,
                "params": {
                    "org":userArr[1],
                    "username":userArr[0],
                    "role":userArr[2]
                }
            }
            service.deleteUser(serviceNm, serviceBody, this.receiveUserSubmit)
        } else if(this.props.siteId === 'Organization') {
            const {Organization, Type, Address, Phone} = this.props.selected
            serviceNm = 'delete'
            serviceBody = {
                "token":store.userToken,
                "params": {
                    "name":Organization,
                    "type":Type,
                    "address":Address,
                    "phone":Phone
                }
            }
            service.deleteOrg(serviceNm, serviceBody, this.receiveUserSubmit)
        } else if(this.props.siteId === 'Flavors') {
            const {FlavorName, Region} = this.props.selected
            serviceNm = 'DeleteFlavor'
            serviceBody = {
                "token":store.userToken,
                "params": {
                    "region":Region,
                    "flavor":{
                        "key":{"name":FlavorName}
                    }
                }
            }
            service.deleteCompute(serviceNm, serviceBody, this.receiveListSubmit)
        } else if(this.props.siteId === 'ClusterFlavors') {
            const {ClusterFlavor, Region} = this.props.selected
            serviceNm = 'DeleteClusterFlavor'
            serviceBody = {
                "token":store.userToken,
                "params": {
                    "region":Region,
                    "clusterflavor":{
                        "key":{"name":ClusterFlavor}
                    }
                }
            }
            service.deleteCompute(serviceNm, serviceBody, this.receiveListSubmit)
        } else if(this.props.siteId === 'Cloudlet') {
            const {CloudletName, Operator, Region} = this.props.selected
            serviceNm = 'DeleteCloudlet'
            serviceBody = {
                "token":store.userToken,
                "params": {
                    "region":Region,
                    "cloudlet":{
                        "key":{
                            "operator_key":{"name":Operator},
                            "name":CloudletName
                        }
                    }
                }
            }
            service.deleteCompute(serviceNm, serviceBody, this.receiveListSubmit)
        } else if(this.props.siteId === 'App') {
            console.log("select@@@##",this.props.selected)
            const {OrganizationName, AppName, Version, Region, ImagePath, ImageType, Ports, DefaultFlavor, DeploymentType} = this.props.selected
            serviceNm = 'DeleteApp'
            serviceBody = {
                "token":store.userToken,
                "params": {
                    "region":Region,
                    "app":{
                        "key":{
                            "developer_key":{"name":OrganizationName},
                            "name":AppName,
                            "version":Version
                        }
                        // "image_path":ImagePath,
                        // "image_type":Number(ImageType),
                        // "access_ports":Ports,
                        // "default_flavor":{"name":DefaultFlavor},
                        // "deploymentType":DeploymentType
                    }
                }
            }
            service.deleteCompute(serviceNm, serviceBody, this.receiveListSubmit)
        }
        


        console.log("delete@@@",serviceNm,serviceBody)
        //service_compute_service
        //service.deleteCompute(serviceNm, serviceBody, this.receiveSubmit)

        //playing spinner
        //this.props.handleSpinner(true)
    }

    /** ************************ **/
    componentWillReceiveProps(nextProps, nextContext) {
        
        if(nextProps.open){
            let name = '';
            this.setState({showWarning:nextProps.open})
            if(nextProps.siteId == 'Organization') name = nextProps.selected.Organization
            else if(nextProps.siteId == 'User') name = nextProps.selected.Username
            else if(nextProps.siteId == 'Cloudlet') name = nextProps.selected.CloudletName
            else if(nextProps.siteId == 'Flavors') name = nextProps.selected.FlavorName
            else if(nextProps.siteId == 'ClusterInst') name = nextProps.selected.ClusterName
            else if(nextProps.siteId == 'App') name = nextProps.selected.AppName
            else if(nextProps.siteId == 'appinst') name = nextProps.selected.AppName
            this.setState({deleteName:name})
        }
    }

    render() {
        const { showWarning, closeOnEscape, closeOnDimmerClick } = this.state
        return (
            <Modal
                open={showWarning}
                closeOnEscape={closeOnEscape}
                closeOnDimmerClick={closeOnDimmerClick}
            >
                <Modal.Header>{`Delete ${this.props.siteId}`}</Modal.Header>
                <Modal.Content>
                    <p>{'Are you sure you want to delete '}<b>{this.state.deleteName}</b></p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.closeDeleteModal('no')} negative>
                        No
                    </Button>
                    <Button
                        onClick={() => this.closeDeleteModal('yes')}
                        positive
                        labelPosition='right'
                        icon='checkmark'
                        content='Yes'
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("siteFour@@@stateRedux ::: ",state)

    return {
        selectOrg : state.selectOrg.org?state.selectOrg.org:null
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleSelectOrg: (data) => { dispatch(actions.selectOrganiz(data))},
        handleUserRole: (data) => { dispatch(actions.showUserRole(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(DeleteItem));