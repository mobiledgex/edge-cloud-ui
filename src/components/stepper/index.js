// https://material-ui.com/components/steppers/

import React from 'react';
import * as computeService from '../../services/service_compute_service';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Progress } from 'semantic-ui-react';





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
            () => this.receiveInterval(this.props.site,2),
            5000
        );       
    }

    componentWillMount() {
        this.setState({_item:this.props.item})
        this.receiveInterval(this.props.site,1)
    }
    

    componentWillUnmount() {
        console.log("componentWillUnmount")
        clearInterval(this.AlertInterval)
    }

    receiveInterval = (data,num) => {
        console.log("receiveInterval",data,this.props.item)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

        if(Object.keys(this.props.item.Status).length !== 0) {
            if(data === 'ClusterInst') {
                computeService.getMCService('ShowClusterInst',{token:store.userToken, region:this.props.item.Region}, this.receiveResultClusterInst)
            } else if(data === 'appinst') {
                computeService.getMCService('ShowAppInst',{token:store.userToken, region:this.props.item.Region}, this.receiveResultClusterInst)
            }
            if(num === 2) {
                console.log("this.state._item",this.state._item)
                if(this.percent(this.state._item) == 100 && this.props.site === 'ClusterInst') {
                    console.log("100@@@@@@@@@@@@aaaa")
                    this.props.alertRefresh();
                    return false;
                }
            }
            
        } else {
            this.receiveResultClusterInst([this.props.item])
        }
        
    }

    receiveResultClusterInst = (result) => {
        console.log("resultstepper",result,this.props.site)
        result.map((item,i) => {
            if((this.props.site === 'ClusterInst')?item.ClusterName == this.props.item.ClusterName:item.AppName == this.props.item.AppName) {
                console.log("togogogo",item)
                this.setState({_item:item,steps:this.getSteps(item,this.props.site)})

                let task_number = 0;
                if(!item.Status.task_number){
                    task_number = 0;
                } else {
                    task_number = item.Status.task_number;
                }

                let _activeStep = 0
                //Delete
                if(item.State == 10 || item.State == 12){
                    if(item.State == 12) _activeStep = 0
                    else if(item.State == 10) _activeStep = 1
                    else _activeStep = 2
                }
                //Create
                if(!task_number && item.State == 3){
                    _activeStep = 0
                } else if(task_number && item.State == 3) {
                    _activeStep = task_number-1
                } else {
                    _activeStep = 3
                }

                
                console.log("_activeStep@@",_activeStep)
                this.setState({activeStep:_activeStep})
            }
        })
    }

    getSteps = (data,site) => {
        if(data && (data.State == 10 || data.State == 12)) {
            return [
                'DeletePrepare',
                'Deleting'
            ];
        } else {
            if(site && site == 'ClusterInst'){
                return [
                    (data.Status.task_name)?localStorage.clusterinstCreateStep:'Creating Heat Stack',
                    'Waiting for Cluster to Initialize',
                    'Updating Docker Credentials for cluster'
                ];
            } else if(site && site == 'appinst') {
                return [
                    'Setting up registry secret',
                    'Creating Kubernetes App',
                    'Configuring Service: LB, Firewall Rules and DNS'
                ];
            } else {
                return ['no data']
            }
            
        }
        
    }
    percent = (item) => {
        console.log("itemitem",item)
        if(this.props.item.State == 10 || this.props.item.State == 12) {
            if(item.State == 12) return 50
            else if(item.State == 10) return 80
            else return 100
        } else {
            if(this.props.site == 'ClusterInst') {
                if(Object.keys(item.Status).length === 0 && item.State == 3) return 0
                else if(item.Status.task_number == 1 && !item.Status.step_name) return 20
                else if(item.Status.task_number == 1 && item.Status.step_name) return 30
                else if(item.Status.task_number == 2 && !item.Status.step_name) return 50
                else if(item.Status.task_number == 2 && item.Status.step_name) return 70
                else if(item.Status.task_number == 3) return 90
                else if(Object.keys(item.Status).length === 0 && item.State == 5) return 100
            } else if(this.props.site == 'appinst') {
                if(Object.keys(item.Status).length === 0 && item.State == 3) return 0
                else if(item.Status.task_number == 1) return 30
                else if(item.Status.task_number == 2) return 50
                else if(item.Status.task_number == 3) return 80
                else if(Object.keys(item.Status).length === 0 && item.State == 5) return 100
            }
            
        }
    }

    getStepContent = (step,data) => {
        console.log("datadata",data.Status.step_name)
        return (data.Status.step_name)?data.Status.step_name:'';
    }

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
        console.log("getsteps222",steps)
        let classes = this.useStyles
        return (
            <div>
                <div>
                    <Progress percent={this.percent(this.state._item)} progress />
                </div>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                <Typography>{this.getStepContent(index,this.state._item)}</Typography>
                            </StepContent>
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