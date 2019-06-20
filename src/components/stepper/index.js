// https://material-ui.com/components/steppers/

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Progress } from 'semantic-ui-react';

const useStyles = makeStyles(theme => ({
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

function getSteps(data) {
    if(data.item.item.State == 10 || data.item.item.State == 12) {
        return [
            'DeletePrepare',
            'Deleting'
        ];
    } else {
        if(data.item.site == 'ClusterInst'){
            return [
                (data.item.item.Status.task_name)?localStorage.clusterinstCreateStep:'Creating Heat Stack',
                'Waiting for Cluster to Initialize',
                'Updating Docker Credentials for cluster'
            ];
        } else if(data.item.site == 'appinst') {
            return [
                (data.item.item.Status.task_name)?localStorage.clusterinstCreateStep:'Creating App',
                'Configuring Service: LB, Firewall Rules and DNS',
            ];
        }
        
    }
    
}

function getStepContent(step,data) {
    console.log("datadata",data.item.item.Status.step_name)
    return (data.item.item.Status.step_name)?data.item.item.Status.step_name:'';
}


export default function VerticalLinearStepper(rData) {

    let data = rData;
    console.log("data@@date!!",data,data.item.site)
    const classes = useStyles();
    const [activeStep, setActiveStep] = (data.item.item.State == 10 || data.item.item.State == 12) ? React.useState((data.item.item.State == 12)?0:(data.item.item.State == 10)?1:2) : React.useState((data.item.item.Status.task_number)?data.item.item.Status.task_number-1:3)
    const steps = getSteps(data);

    function percent(pData) {
        if(data.item.item.State == 10 || data.item.item.State == 12) {
            if(pData.item.item.State == 12) return 30
            else if(pData.item.item.State == 10) return 70
            else return 100
        } else {
            if(data.item.site == 'ClusterInst') {
                if(pData.item.item.Status.task_number == 1 && !pData.item.item.Status.step_name) return 20
                else if(pData.item.item.Status.task_number == 1 && pData.item.item.Status.step_name) return 30
                else if(pData.item.item.Status.task_number == 2 && !pData.item.item.Status.step_name) return 50
                else if(pData.item.item.Status.task_number == 2 && pData.item.item.Status.step_name) return 70
                else if(pData.item.item.Status.task_number == 3) return 90
                else if(Object.keys(pData.item.item.Status).length === 0) return 100
            } else if(data.item.site == 'appinst') {
                if(pData.item.item.Status.task_number == 1) return 40
                else if(pData.item.item.Status.task_number == 2) return 80
                else if(Object.keys(pData.item.item.Status).length === 0) return 100
            }
            
        }
    }
    
    return (
        <div className={classes.root}>
            <div>
                <Progress percent={percent(rData)} progress />
            </div>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            <Typography>{getStepContent(index,data)}</Typography>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </div>
    );
}
