// https://material-ui.com/components/steppers/

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

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

        

    }

    componentDidMount() {
        this.AlertInterval = setInterval(
            () => this.receiveInterval(this.props.site),
            3000
        );       
    }

    componentWillMount() {
        this.setState({_item:this.props.item})
        this.receiveInterval(this.props.site)
    }
    

    componentWillUnmount() {
        clearInterval(this.AlertInterval)
        deleteFlag = false;
    }

    receiveInterval = (data) => {
        const prgDiv = document.getElementById("prgBox");
        if(prgDiv){
            prgDiv.scrollTop = prgDiv.scrollHeight;
        }
        if(this.props.item.State == 3 || this.props.item.State == 7) {
            if(this.props.item.ClusterInst && this.props.item.ClusterInst.indexOf('autocluster') > -1 && this.props.auto == 'auto'){
                //computeService.creteTempFile(this.props.item, this.props.site, this.receiveStatusAuto)
            } else {
                //computeService.creteTempFile(this.props.item, this.props.site, this.receiveStatusData)
            }
        } else if(this.props.item.State == 5) {
            this.setState({steps:['Created successfully'],activeStep:1})
            clearInterval(this.AlertInterval)
        } else if(this.props.item.State == 10 || this.props.item.State == 12) {
            if(this.props.site == 'Cloudlet'){
                //computeService.creteTempFile(this.props.item, this.props.site, this.receiveStatusData)
            } else{
                this.setState({steps:['DeletePrepare', 'Deleting'],activeStep:1})
                clearInterval(this.AlertInterval)
            }
        } else  {
            this.setState({steps:['Create error'],activeStep:1})
        }
        
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
