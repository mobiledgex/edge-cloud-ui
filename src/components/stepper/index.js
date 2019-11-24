// https://material-ui.com/components/steppers/

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import * as computeService from '../../services/service_compute_service';
import * as ServiceSocket from '../../services/service_webSocket';
import store from '../../store';
import * as actions from '../../actions';

let failFlag = false;
let deleteFlag = false;



class VerticalLinearStepper extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            steps:[],
            classes:null,
            activeStep:null,
            _item:{Status:{}}
        };

        this.AlertInterval = null;

    }

    componentDidMount() {


            this.AlertInterval = setInterval(() => {
                this.receiveInterval()
            }, 2000)

        this.receiveInterval()

    }

    componentWillMount() {
        this.setState({_item:this.props.item})

    }
    

    componentWillUnmount() {
        clearInterval(this.AlertInterval)
        deleteFlag = false;
    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('20191119 index receive props in stepper ---- ',nextProps.item,"== : ==", nextProps.site, "== : stream ?? ==", nextProps.stateStream)
        if(nextProps.item !== this.props.item) {
            //console.log('20191119 receive props in stepper ---- ',nextProps.item,"== : ==", nextProps.site)
            //this.setState({steps:nextProps.stateStream,activeStep:nextProps.stateStream.length - 1})
        }

    }

    /*
    props is ==========>
    alertRefresh: ƒ ()
    auto: ""
    autoRefresh: ƒ ()
    failRefresh: ƒ (msg)
    item:
        CloudletLocation: {latitude: 50.110924, longitude: 8.682127}
        CloudletName: "frankfurt-eu"
        Edit: (6) ["Region", "CloudletName", "OperatorName", "CloudletLocation", "Ip_support", "Num_dynamic_ips"]
        Ip_support: 2
        Num_dynamic_ips: 10
        Operator: "TDG"
        Physical_name: "frankfurt"
        Platform_type: 2
        Progress: ""
        Region: "EU"
        State: 5
        Status: {}
        __proto__: Object
        site: "Cloudlet"
        stateStream: null
        ---------------------------
        cloudletId = serviceBody.cloudlet.key.operator_key.name + serviceBody.cloudlet.key.name;
    */


    // receiveInterval = () => {
    //
    //     console.log('20191119 index receiveInterval info === ', this.props)
    //
    //
    //
    // }

    receiveInterval = () => {
        try{
            const prgDiv = document.getElementById("prgBox");
            if(prgDiv){
                prgDiv.scrollTop = prgDiv.scrollHeight;
            }
        } catch(e) {

        }

        let hashName = '';
        let item = this.props.item;
        let resultStream = [];
        hashName = item.Operator + item.CloudletName;
        let _step = []
        let stateStream = (this.props.item.State == 5) ? null : this.props.getParentProps() ;
        console.log('20191119 index receiveInterval info === ', stateStream)
        if(stateStream) {
            //resultStream = this.storeData(data.data.stacksData,'createCloudlet', 'result')
            console.log('20191119 index stateStream .. ', stateStream, ":",resultStream)
            if(this.props.site === 'Cloudlet' && stateStream.length > 0) {
                console.log('20191119 index receiveInterval hashName and clId.. ', hashName)
                stateStream.map((stat) => {
                    console.log('20191119 index receiveInterval hashName and clId...... ', hashName , ":", stat)

                    _step.push(stat['message'])

                    //
                    if(stat['message'].indexOf('successfully') > -1) {
                        // refresh
                        clearInterval(this.AlertInterval)
                        this.props.stopInterval('info',stat['message'])
                        this.props.alertRefresh(stat['message']);
                        //store.dispatch(actions.alertInfo('info',stat['message']))
                        //stackStates = [];

                    }


                    if(stat['message'].indexOf('Failed') > -1 || stat['message'].indexOf('failed') > -1) {
                        clearInterval(this.AlertInterval)
                        this.props.stopInterval('error',stat['message'])
                        this.props.failRefresh(stat['message']);

                    }

                })
            }
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        console.log('20191119 receiveInterval === ', this.props,":_step =", _step,":")
        if(this.props.item.State == 3 || this.props.item.State == 7) {
            if(this.props.item.ClusterInst && this.props.item.ClusterInst.indexOf('autocluster') > -1 && this.props.auto == 'auto'){
                //computeService.creteTempFile(this.props.item, this.props.site, this.receiveStatusAuto)
                if(stateStream) this.setState({steps:_step,activeStep:_step.length-1})
            } else {
                //computeService.creteTempFile(this.props.item, this.props.site, this.receiveStatusData)
                if(stateStream) this.setState({steps:_step,activeStep:_step.length-1})
            }
        } else if(this.props.item.State == 5) {
            this.setState({steps:['Created successfully'],activeStep:1})
            clearInterval(this.AlertInterval)
        } else if(this.props.item.State == 10 || this.props.item.State == 12) {
            if(this.props.site == 'Cloudlet'){
                //computeService.creteTempFile(this.props.item, this.props.site, this.receiveStatusData)
                if(_step.length) this.setState({steps:_step,activeStep:_step.length - 1})
            } else{
                this.setState({steps:['DeletePrepare', 'Deleting'],activeStep:1})
                clearInterval(this.AlertInterval)
            }
        } else  {
            this.setState({steps:['Create error'],activeStep:1})
        }

    }

    receiveStatusData = (result, _item) => {
        console.log("receiveStatusAuto222",result,":::",_item)
        let toArray = null;
        let toJson = null;
        let stepData = [];
        let count = 0;
        toArray = result.data.split('\n')
        toArray.pop();
        toJson = toArray.map((str)=>(JSON.parse(str)))
        toJson.map((item,i) => {
            if(item.data) {
                stepData.push(item.data.message) //Created ClusterInst successfully
                //console.log("successfullyzxxx222",item.data.message,":::",item.data.message.toLowerCase().indexOf('created successfully'))
                if(item.data.message.toLowerCase().indexOf('created') > -1 && item.data.message.toLowerCase().indexOf('successfully') > -1 && !deleteFlag){
                    deleteFlag = true;
                    console.log("Created successfullyCreated successfully")
                    count++;
                    if(_item.ClusterInst && _item.ClusterInst.indexOf('autocluster') > -1 && count < 2){
                        deleteFlag = false;
                        return;
                    };
                    setTimeout(() => {
                        this.props.alertRefresh();
                        computeService.deleteTempFile(this.props.item, this.props.site)
                    }, 2000);
                } else if(item.data.message.toLowerCase().indexOf('deleted cloudlet successfully') > -1){
                    deleteFlag = true;
                    console.log("Delete successfullyCreated successfully")
                    setTimeout(() => {
                        this.props.failRefresh('Deleted cloudlet successfully');
                        computeService.deleteTempFile(this.props.item, this.props.site)
                    }, 2000);
                } else if(item.data.message.toLowerCase().indexOf('completed') > -1 && item.data.message.toLowerCase().indexOf('updated') > -1 && !deleteFlag){
                    deleteFlag = true;
                    console.log("Updated AppInst")
                    setTimeout(() => {
                        this.props.alertRefresh();
                        computeService.deleteTempFile(this.props.item, this.props.site)
                    }, 2000);
                }
            } else if(item.result && item.result.code == 400 && !failFlag){
                console.log("failRefreshfailRefreshfailRefresh")
                failFlag = true;
                stepData.push(item.result.message)
                setTimeout(() => {
                    this.props.failRefresh(item.result.message);
                    computeService.deleteTempFile(this.props.item, this.props.site)
                }, 3000);
            }
        })
        console.log("toArraytoArray",stepData)
        this.setState({steps:stepData, activeStep:stepData.length-1})

    }

    receiveStatusAuto = (result, _item) => {
        let toArray = null;
        let toJson = null;
        let count = 0;
        let stepData = [];
        toArray = result.data.split('\n')
        toArray.pop();
        toJson = toArray.map((str)=>(JSON.parse(str)))
        toJson.map((item,i) => {
            stepData.push(item.data.message)
            if(item.data) {
                if(item.data.message.toLowerCase().indexOf('created') > -1 && item.data.message.toLowerCase().indexOf('successfully') > -1){
                    console.log("Created successfullyCreated successfully")
                    count++;
                    setTimeout(() => {
                        if(count == 1){
                            this.props.autoRefresh();
                        }
                    }, 1000);
                    
                }
            }
        })
        this.setState({steps:stepData, activeStep:stepData.length-1})
    }
    

        
    // }
    // percent = (item) => {
    //     if(this.props.item.State == 10 || this.props.item.State == 12) {
    //         if(item.State == 12) return 50
    //         else if(item.State == 10) return 80
    //         else return 100
    //     } else {
    //         if(this.props.site == 'ClusterInst') {
    //             if(Object.keys(item.Status).length === 0 && item.State == 3) return 10
    //             else if(item.Status.task_number == 1 && !item.Status.step_name) return 20
    //             else if(item.Status.task_number == 1 && item.Status.step_name) return 30
    //             else if(item.Status.task_number == 2 && !item.Status.step_name) return 50
    //             else if(item.Status.task_number == 2 && item.Status.step_name) return 70
    //             else if(item.Status.task_number == 3) return 90
    //             else if(Object.keys(item.Status).length === 0 && item.State == 5) return 100
    //         } else if(this.props.site == 'appinst') {
    //             if(Object.keys(item.Status).length === 0 && item.State == 3) return 10
    //             else if(item.Status.task_number == 1) return 30
    //             else if(item.Status.task_number == 2) return 50
    //             else if(item.Status.task_number == 3) return 80
    //             else if(Object.keys(item.Status).length === 0 && item.State == 5) return 100
    //         }
            
    //     }
    // }

 

    useStyles = makeStyles(theme => ({
        root: {
            width: '90%',
        },
        button: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        actionsContainer: {
            marginBottom: theme.spacing(2),
        },
        resetContainer: {
            padding: theme.spacing(3),
        },
    }));

    render() {
        const { steps,activeStep } = this.state;
        let classes = this.useStyles
        return (
            <div>
                {/* <div>
                    <Progress percent={this.percent(this.state._item)} progress />
                </div> */}
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
        );
    }
    
    
}
VerticalLinearStepper.defaultProps = {
    item:{State:0, Status:{task_number:0}}
}




export default VerticalLinearStepper;
