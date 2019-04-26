import React from 'react';
import {Button, Divider, Modal, Grid, Input, TextArea, Dropdown} from "semantic-ui-react";

import * as service from "../services/service_compute_service";
import * as aggregate from "../utils";
import Alert from "react-s-alert";

let _self = null;
export default class DeleteItem extends React.Component {
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
            closeOnDimmerClick:true
        }
        _self = this;
    }

    /***************************
     * delete selected item
     * @param result
     ***************************/
    receiveSubmit(result) {
        console.log('registry delete ... success result..', result.data)
        let paseData = result.data;
        let splitData = JSON.parse( "["+paseData.split('}\n{').join('},\n{')+"]" );
        console.log('response paseData  -',splitData );

        //if(splitData[2] && splitData[2]['result']) {
        if(result.data.indexOf('successfully') > -1) {
            Alert.success(splitData[2].message, {
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
        _self.props.handleSpinner(false)
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


        /*
        http --auth-type=jwt --auth=$ORGMANTOKEN POST 127.0.0.1:9900/api/v1/auth/ctrl/CreateClusterInst
        <<< '{
        "region":"local",
        "clusterinst":{"key":{"cluster_key":{"name":"bigclust"},
        "cloudlet_key":{"operator_key":{"name":"bigwaves"},"name":"oceanview"},"developer":"bigorg"},
        "flavor":{"name":"x1.medium"}
        }}'


            Cloudlet: "bonn-mexdemo"
            CloudletLocation: {latitude: 37, longitude: 132, timestamp: {…}}
            ClusterFlavor: "x1.medium"
            ClusterName: "macrometa"
            Edit: (7) ["ClusterName", "DeveloperName", "Operator", "Cloudlet", "ClusterFlavor", "IPAccess", "CloudletLocation"]
            IPAccess: 3
            Operator: "TDG"


            {
                "key":
                {
                    "cluster_key":{"name":"biccluster"},
                    "cloudlet_key":{"operator_key":{"name":"TDG"},"name":"bonn-mexdemo"},
                    "developer":"bicinkiOrg"
                },
                "flavor":{"name":"x1.medium"},
                "liveness":1,
                "state":5,
                "ip_access":3,
                "node_flavor":"m4.small",
                "master_flavor":"m4.small"
            }
         */
        let serviceNm = '';
        if(this.props.siteId === 'ClusterInst'){
            const {Cloudlet, ClusterFlavor, ClusterName, Developer, Operator} = this.props.selected
            console.log("delete@!!@",this.props.selected)
            serviceNm = 'DeleteClusterInst';
            serviceBody = {
                "token":store.userToken,
                "params": {
                    "region":"US",
                    "clusterinst":{
                        "key":{
                            "cluster_key":{"name":ClusterName},
                            "cloudlet_key":{"operator_key":{"name":Operator},"name":Cloudlet},
                            "developer":Developer
                        },
                        "flavor":{"name":ClusterFlavor}
                    }
                }
            }
        } else if(this.props.siteId === 'appinst') {
            serviceNm = 'DeleteAppInst'
        }
        console.log("delete@@@",serviceNm,serviceBody)
        //service_compute_service
        service.deleteCompute(serviceNm, serviceBody, this.receiveSubmit)

        //playing spinner
        this.props.handleSpinner(true)
    }

    /** ************************ **/
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.open){
            this.setState({showWarning:nextProps.open})
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
                    <p>{`Are you sure you want to delete ${this.props.siteId}`}</p>
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


