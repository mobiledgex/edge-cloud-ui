import React from 'react';
import {Button, Divider, Modal, Grid, Input, TextArea, Dropdown} from "semantic-ui-react";

//http://react-s-alert.jsdemo.be/
import Alert from 'react-s-alert';

import * as service from "../services/service_compute_service";
import * as aggregate from "../utils";

let _self = null;
export default class RegistNewItem extends React.Component {
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
        }
        _self = this;
    }

    componentDidMount() {
        // app
        service.getComputeService('app', this.receiveApp)
        // developer
        service.getComputeService('developer', this.receiveDev)
        // operator
        service.getComputeService('operator', this.receiveOper)
        // cloudlet
        service.getComputeService('cloudlet', this.receiveCloudlet)
    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('regist new item -- ', nextProps)
        if(nextProps.open) {
            this.setState({open:nextProps.open, dimmer:nextProps.dimmer});
        }

        let self = this;
        setTimeout(()=>{
            console.log('ddd=', self['input_0'])
            if(self['input_0']) self['input_0'].focus();
        }, 2000)
    }
    handleChangeOne = (e, {value}) => {
        this.setState({ dropdownValueOne: value })
        //reset list of sub dropwDown
        this.setCloudletList(value)
    }
    handleChangeTwo = (e, {value}) => {
        this.setState({ dropdownValueTwo: value })
        this.setAppList(value)
    }
    handleChangeThree = (e, {value}) => {
        this.setState({ dropdownValueThree: value })
    }
    handleChangeFour = (e, {value}) => {
        this.setState({ dropdownValueFour: value })
    }
    handleChangeFive = (e, {value}) => {
        console.log('change input value is ==', value)
        this.setState({ dropdownValueFive: value })
    }
    setCloudletList = (operNm) => {
        let cl = [];
        _self.state.cloudletResult[operNm].map((oper, i) => {
            if(i === 0) _self.setState({dropdownValueThree: oper.CloudletName})
            cl.push({ key: i, value: oper.CloudletName, text: oper.CloudletName })
        })

        _self.setState({devOptionsThree: cl})
    }
    setAppList = (devNm) => {
        let cl = [];
        let vr = [];
        _self.state.appResult[devNm].map((oper, i) => {
            if(i === 0) _self.setState({dropdownValueFour: oper.AppName})
            cl.push({ key: i, value: oper.AppName, text: oper.AppName })
            vr.push({ key: i, value: oper.Version, text: oper.Version })

        })

        _self.setState({devOptionsFour: cl, devOptionsFive: vr})
    }

    receiveOper(result) {
        console.log('operators ==>>>>>>>>>>>> ', result)
        _self.setState({devOptionsOne: result.map((oper, i) => (
                { key: i, value: oper.OperatorName, text: oper.OperatorName }
            ))})
    }
    receiveDev(result) {
        console.log('receive developer ==>>>>>>>>>>>> ', result)
        _self.setState({devOptionsTwo: result.map((oper, i) => (
                { key: i, value: oper.DeveloperName, text: oper.DeveloperName }
            ))})
    }

    receiveCloudlet(result) {
        let groupByOper = aggregate.groupBy(result, 'Operator')
        console.log('receiveCloudlet ==>>>>>>>>> ', groupByOper)
        _self.setState({cloudletResult:groupByOper})
    }
    receiveApp(result) {
        console.log('receive app ==>>>>>>>>>>>> ', result)
        let groupByOper = aggregate.groupBy(result, 'DeveloperName')
        _self.setState({appResult:groupByOper})
    }
    receiveSubmit(result) {
        console.log('registry new ... success result..', result.data)
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
            //create success !!!
            if(splitData[2]['result']['message'] === 'Created successfully') {
                _self.props.success()
            }
        } else {
            if(splitData[0]['error']) {
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
            } else {
                Alert.error(splitData[0]['message'], {
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

        }
        _self.props.handleSpinner(false)
    }

    onSubmit() {
        let serviceBody = {
            OperatorName:this.state.dropdownValueOne, DeveloperName:this.state.dropdownValueTwo,
            CloudletName:this.state.dropdownValueThree, AppName:this.state.dropdownValueFour, AppVer:this.state.dropdownValueFive};
        //save to server
        service.saveNewCompute(this.props.siteId, serviceBody, this.receiveSubmit)
        //playing spinner
        this.props.handleSpinner(true)

        //close
        this.close();
    }
    close = () => {
        this.setState({ open: false })
        this.props.close()
    }
    onClickInput(a, b) {
        // setTimeout(()=>{
        //     console.log('ddd=', _self['input_'+b])
        //     if(_self['input_'+b]) _self['input_'+b].focus();
        // }, 2000)
    }
    InputExampleFluid = (value, i, key) => (
        (key === 'OperatorName')?
            <Dropdown placeholder='Select Operator' fluid search selection options={this.state.devOptionsOne} value={this.state.dropdownValueOne} onChange={this.handleChangeOne}/>
            : (key === 'DeveloperName')?
            <Dropdown placeholder='Select Developer' fluid search selection options={this.state.devOptionsTwo} value={this.state.dropdownValueTwo} onChange={this.handleChangeTwo} />
            : (key === 'CloudletName')?
            <Dropdown placeholder='Select Cloudlet' fluid search selection options={this.state.devOptionsThree} value={this.state.dropdownValueThree} onChange={this.handleChangeThree} />
            : (key === 'AppName')?
            <Dropdown placeholder='Select AppName' fluid search selection options={this.state.devOptionsFour} value={this.state.dropdownValueFour} onChange={this.handleChangeFour} />
            : (key === 'Version')?
            <Dropdown placeholder='Select Version' fluid search selection options={this.state.devOptionsFive} value={this.state.dropdownValueFive} onChange={this.handleChangeFive} />
            :
            <Input ref={ref => this['input_'+i] = ref} onClick={(a)=>this.onClickInput(a,i)} fluid placeholder={(this.state.dimmer === 'blurring')? '' : value } onChange={this.handleChangeFive} />
    )

//Object.keys(data[0]).map((key, i)=>(

    render() {
        let {data, dimmer, selected} = this.props;
        let regKeys = (data[0])?data[0]['Edit']:null;
        console.log('regKeys ===>>>', regKeys)
        return (
            <Modal size={'small'} open={this.state.open} onClose={this.close}>
                <Modal.Header>Settings</Modal.Header>
                <Modal.Content>
                    <Grid divided>
                        {
                            (data.length > 0)?
                                regKeys.map((key, i)=>(

                                    <Grid.Row columns={2}>
                                        <Grid.Column width={5} className='detail_item'>
                                            <div>{key}</div>
                                        </Grid.Column>
                                        <Grid.Column width={11}>
                                            {this.InputExampleFluid(selected[key], i, key)}
                                        </Grid.Column>
                                        <Divider vertical></Divider>
                                    </Grid.Row>

                                ))
                                :''
                        }

                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.close}>
                        Cancel
                    </Button>
                    <Button
                        positive
                        icon='checkmark'
                        labelPosition='right'
                        content="Save"
                        onClick={() => this.onSubmit()}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}


