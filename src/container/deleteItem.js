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

        if(splitData[2] && splitData[2]['result']) {
            Alert.success(splitData[2]['result']['message'], {
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
        } else {
            Alert.error(splitData[0]['error']['message'], {
                position: 'top-right',
                effect: 'slide',
                onShow: function () {
                    console.log('aye!')
                },
                beep: true,
                timeout: 5000,
                offset: 100
            });
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
        let serviceBody = {
            OperatorName:select.OperatorName, DeveloperName:select.DeveloperName,
            CloudletName:select.CloudletName, AppName:select.AppName, AppVer:select.Version};
        //save to server
        service.deleteCompute(this.props.siteId, serviceBody, this.receiveSubmit)

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
                <Modal.Header>Delete Application Instance</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete app instance</p>
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


