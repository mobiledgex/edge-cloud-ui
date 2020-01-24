import React, {useRef} from 'react'
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
    const body = useRef();

    return (
        (props.uuid && props.uuid !== 0 && props.stepsArray && props.stepsArray.length > 0) ?
            <div>
                {props.stepsArray.map(item => {
                    return (
                        props.uuid === item.uuid ?
                            <Popover
                                style={{width:400}}
                                anchorReference="anchorPosition"
                                onEnter={()=>{body.current.scrollTop=body.current.scrollHeight}}
                                anchorPosition={{ top: 0, left: window.innerWidth }}
                                onClose={() => { props.onClose() }}
                                open={props.uuid !== 0}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}>
                                <div ref={body} style={{backgroundColor:'#616161', overflowY:'auto', maxHeight: 400 }}>
                                    <Stepper className={classes.stepper} activeStep={item.steps[item.steps.length - 1].code === CODE_FINISH ? item.steps.length : item.steps.length - 1} orientation="vertical">
                                        {item.steps.map((step, index) => {
                                            return (
                                                step.message ?
                                                    <Step key={index}>
                                                        <StepLabel StepIconComponent={(stepperProps) => {
                                                            return (<div className={classes.root}>
                                                                {
                                                                    stepperProps.completed ?
                                                                        item.steps[stepperProps.icon - 1].code === CODE_FAILED ?
                                                                            <ErrorIcon className={classes.error} /> :
                                                                            <Check className={classes.success} /> :
                                                                        <div className={classes.wrapper}>
                                                                            <p className={classes.iconLabel}>{stepperProps.icon}</p>
                                                                            <CircularProgress className={classes.progress} size={25} thickness={3} />
                                                                        </div>
                                                                }
                                                            </div>)

                                                        }}><p className={classes.label}>{step.message}</p></StepLabel>
                                                    </Step>
                                                    :
                                                    null
                                            )
                                        })}
                                    </Stepper>
                                </div>
                            </Popover>
                            :
                            null
                    )
                })}
            </div>
            :
            null
    )
}

export default VerticalStepper;

