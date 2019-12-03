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
            deleteName:'',
            deleteOrg:''

        }
        _self = this;
    }

    /***************************
     * delete selected item
     * @param result
     ***************************/
    receiveSubmitResult = (result, body) => {
        if (result.data.error) {
            this.props.handleAlertInfo('error', result.data.error)
        } else {
            console.log('20191119 receive submit result is success..', result,":", result.data)
            this.props.handleAlertInfo('success',result.data.message)
        }
        if(this.props.siteId !== 'appinst' || body.params.appinst.key.cluster_inst_key.cluster_key.name.indexOf('autocluster') > -1){
            setTimeout(() => {
                _self.props.refresh(this.props.changeRegion);
            }, 3000);
        }
    }
    receiveSubmit = (result, body) => {
        console.log('20191119 .. ceceiveSubmit...', result, ":", body)
        if(result.data && result.data.message && result.data.message.indexOf('failures') <= -1) {
            //this.receiveSubmitResult(result)
            if(this.props.siteId == 'ClusterInst') {
                this.props.handleAlertInfo('success','Your cluster '+body.params.clusterinst.key.cluster_key.name+' deleted successfully')
            } else if(this.props.siteId == 'appinst') {
                this.props.handleAlertInfo('success','Application Instance '+body.params.appinst.key.app_key.name+' successfully deleted')
            } else if(this.props.siteId == 'Cloudlet') {
                this.props.handleAlertInfo('success','Cloudlet '+body.params.cloudlet.key.name+' successfully deleted')
            }
            console.log("20191119 appinstdelete",this.props.siteId,":::",body)
            //if(this.props.siteId !== 'appinst' || body.params.appinst.key.cluster_inst_key.cluster_key.name.indexOf('autocluster') > -1){
                setTimeout(() => {
                    _self.props.refresh(this.props.changeRegion);
                }, 3000);
            //}
            return;
        }
        if(result.data.message.indexOf('failures') > -1) {
            this.props.handleAlertInfo('error',result.data.message)
        }
        if(result.data.error) {
            this.props.handleAlertInfo('error',result.data.error)
        }


        
    }

    receiveListSubmit = (result, body) => {
        let msg = '';
        if(this.props.siteId == 'Cloudlet') msg = 'Cloudlet '+body.params.cloudlet.key.name
        else if(this.props.siteId == 'Flavors') msg = 'Flavor '+body.params.flavor.key.name
        else if(this.props.siteId == 'App') msg = 'Your application '+body.params.app.key.name
        
        this.props.handleLoadingSpinner(false);
        this.props.refresh(this.props.changeRegion)
        
        if(result.data.error) {
            if(result.data.error.indexOf('Flavor in use by Cluster') > -1) {
                this.props.handleAlertInfo('error','Error deleting '+body.params.flavor.key.name+'. Flavor is in use by a Cluster Instance.')
            } else {
                this.props.handleAlertInfo('error',result.data.error)
            }
            
        } else if(result.data.message) {
            this.props.handleAlertInfo('success',msg+' deleted successfully.')
        }
    }

    receiveUserSubmit = (result,body) => {

        let msg = '';
        if(this.props.siteId === 'Organization') {
            msg = 'Your organization '+body.params.name+' deleted successfully'
        } else if(this.props.siteId === 'User') {
            msg = 'User '+body.params.username+' removed from organization '+body.params.org
        } else if(this.props.siteId === 'Account') {
            msg = 'User '+_self.state.deleteName+' removed from console '
        }

        this.props.handleLoadingSpinner(false);
        if(result.data.message) {
            this.props.handleAlertInfo('success',msg)
        } else if(result.data.error) {
            this.props.handleAlertInfo('error',result.data.error)
        }
        if(this.props.siteId === 'Organization' && body.params.name == localStorage.selectOrg) {
            localStorage.setItem('selectRole', '')
            localStorage.setItem('selectOrg', '')
            this.props.handleSelectOrg('-')
            this.props.handleUserRole('')
        }
        _self.props.refresh('All');
    }

    closeDeleteModal(confirm) {
        _self.setState({ showWarning: false })
        _self.props.close()
        if(confirm === 'yes') {
            _self.onHandleDelete()
        }
    }
    onHandleDelete() {
        let select = this.props.selected;
        let region = this.props.region;
        let serviceBody = {}
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.props.handleLoadingSpinner(true);
        let serviceNm = '';
        if(this.props.siteId === 'ClusterInst'){
            const {Cloudlet, Flavor, ClusterName, OrganizationName, Operator, Region} = this.props.selected
            serviceNm = 'DeleteClusterInst';
            serviceBody = {
                "token":store ? store.userToken : 'null',
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
                },
                "instanceId":ClusterName+'-'+OrganizationName+'-'+Operator
            }
            service.deleteCompute(serviceNm, serviceBody, this.receiveSubmit)
            setTimeout(() => {
                this.props.handleDeleteReset(true);
                this.props.refresh(this.props.changeRegion);
                this.props.handleLoadingSpinner(false);
            }, 2000)
            
        } else if(this.props.siteId === 'appinst') {
            const {OrganizationName, AppName, Version, Operator, Cloudlet, ClusterInst, Region} = this.props.selected
            serviceNm = 'DeleteAppInst';
            let clId = '';
            if(ClusterInst.indexOf('autocluster') > -1) {
                clId = 'autocluster';
            }
            clId = clId+AppName+'-'+OrganizationName+'-'+Operator
            serviceBody = {
                "token":store ? store.userToken : 'null',
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
                },
                "instanceId":clId.toLowerCase()
            }
            //autoclusterbicapp   bictest1129-2
            service.deleteCompute(serviceNm, serviceBody, this.receiveSubmit)
            setTimeout(() => {
                this.props.handleDeleteReset(true);
                this.props.refresh(this.props.changeRegion);
                this.props.handleLoadingSpinner(false);
            }, 1000)
        } else if(this.props.siteId === 'User') {
            let userArr = [];
            Object.values(this.props.selected).map((item,i) => {
                userArr.push(item);
            })
            serviceNm = 'removeuser'
            serviceBody = {
                "token":store ? store.userToken : 'null',
                "params": {
                    "org":userArr[1],
                    "username":userArr[0],
                    "role":userArr[2]
                }
            }
            service.deleteUser(serviceNm, serviceBody, this.receiveUserSubmit)
        } else if(this.props.siteId === 'Account') {
            let userArr = [];
            Object.values(this.props.selected).map((item,i) => {
                userArr.push(item);
            })
            serviceNm = 'delete'
            serviceBody = {
                "token":store ? store.userToken : 'null',
                "params": {
                    "name":userArr[0]
                }
            }
            service.deleteAccount(serviceNm, serviceBody, this.receiveUserSubmit)
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
                },
                "instanceId":Operator+CloudletName
            }
            service.deleteCompute(serviceNm, serviceBody, this.receiveSubmit)
            setTimeout(() => {
                this.props.handleDeleteReset(true);
                this.props.refresh(this.props.changeRegion);
                this.props.handleLoadingSpinner(false);
            }, 2000)
        } else if(this.props.siteId === 'App') {
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
        
    }

    /** ************************ **/
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.open){
            let name = '';
            this.setState({showWarning:nextProps.open})
            if(nextProps.siteId == 'Organization') name = nextProps.selected.Organization
            else if(nextProps.siteId == 'User') name = nextProps.selected.Username
            else if(nextProps.siteId == 'Account') name = nextProps.selected.Username
            else if(nextProps.siteId == 'Cloudlet') name = nextProps.selected.CloudletName
            else if(nextProps.siteId == 'Flavors') name = nextProps.selected.FlavorName
            else if(nextProps.siteId == 'ClusterInst') name = nextProps.selected.ClusterName
            else if(nextProps.siteId == 'App') name = nextProps.selected.AppName
            else if(nextProps.siteId == 'appinst') name = nextProps.selected.AppName
            this.setState({deleteName:name})
            let orgName = '';
            if(nextProps.siteId == 'User') orgName = nextProps.selected.Organization
            this.setState({deleteOrg:orgName})


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
                <Modal.Header>{(this.props.siteId == 'User')?`Delete ${this.props.siteId} from Organization`:`Delete ${this.props.siteId}`}</Modal.Header>
                <Modal.Content>
                    {(this.props.siteId == 'User')?
                    <p>{'Are you sure you want to delete '}<b>{this.state.deleteName}</b>{' from '}<b>{this.state.deleteOrg}</b>{'?'}</p>
                    :<p>{'Are you sure you want to delete '}<b>{this.state.deleteName}</b>{'?'}</p>}
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
    return {
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        changeRegion : state.changeRegion.region?state.changeRegion.region:null
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleSelectOrg: (data) => { dispatch(actions.selectOrganiz(data))},
        handleUserRole: (data) => { dispatch(actions.showUserRole(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))},
        handleDeleteReset: (data) => { dispatch(actions.deleteReset(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(DeleteItem));
