import React from 'react'
import { Stepper, Popover, Step, StepLabel, CircularProgress } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Check from "@material-ui/icons/Check";
import ErrorIcon from '@material-ui/icons/Error';
import { green, red } from '@material-ui/core/colors';

export const CODE_FINISH = 100; 
export const CODE_SUCCESS = 200; 
export const CODE_FAILED = 400; 

const useStyles = makeStyles(theme => ({

    root: {
        backgroundColor: 'transparent',
        zIndex: 1,
        color: '#fff',
        width: 25,
        height: 25,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: "relative"
    },
    stepper: {
        backgroundColor: '#616161'
    },
    label: {
        color: '#FFF',
        width: 200,
        fontWeight: 500,
        wordWrap: "break-word"
    },
    iconLabel: {
        fontSize: 15
    },
    progress: {
        position: "absolute",
        color: "#FFF",
        top: 0,
        left: -6,
        zIndex: 1
    },
    success: {
        backgroundColor: green[500],
        borderRadius: '50%',
        width: 20,
        height: 20,
        fontSize: 10
    },
    error: {
        color: red[500],
        borderRadius: '50%',
        width: 23,
        height: 23,
        fontSize: 10
    }
}));




const VerticalStepper = (props) => {
    const classes = useStyles();

    const IconSelector = (stepperProps) => {
        const { completed } = stepperProps;
        return (
            <div className={classes.root}>
                {
                    completed ?
                        props.steps[stepperProps.icon - 1].code === CODE_FAILED ?
                            <ErrorIcon className={classes.error} /> :
                            <Check className={classes.success} /> :
                        <div className={classes.wrapper}>
                            <p className={classes.iconLabel}>{stepperProps.icon}</p>
                            <CircularProgress className={classes.progress} size={25} thickness={3} />
                        </div>
                }
            </div>
        );
    }

    return (
        (props.steps && props.steps.length > 0) ?
            <div>
                <Popover style={{ width: 400, maxHeight: 400 }}
                    anchorReference="anchorPosition"
                    anchorPosition={{ top: 0, left: window.innerWidth }}
                    onClose={()=>{props.onClose()}}
                    open={props.steps.length>0} 
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}>
                <Stepper className={classes.stepper} activeStep={props.steps[props.steps.length - 1].code ===  CODE_FINISH ? props.steps.length : props.steps.length - 1} orientation="vertical">
                    {props.steps.map((step, index) => (
                        step.message ?
                            <Step key={index}>
                                <StepLabel StepIconComponent={IconSelector}><p className={classes.label}>{step.message}</p></StepLabel>
                            </Step>
                            : null
                    ))}
                </Stepper>
                </Popover>
            </div>
            :
            null
    )
}

export default VerticalStepper;
