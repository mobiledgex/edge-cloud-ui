import React, { useRef } from 'react'
import { Button, Dialog, DialogContent, DialogActions, Divider, Grid, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, IconButton } from '@material-ui/core';
import { Stepper, Step, StepLabel, CircularProgress } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Check from "@material-ui/icons/Check";
import ErrorIcon from '@material-ui/icons/Error';
import { green, red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import { fields } from '../../services/model/format';
export const CODE_FINISH = 100;
export const CODE_SUCCESS = 200;
export const CODE_FAILED = 400;
export const CODE_FAILED_403 = 403;
let header = 'Cloudlet';

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
        backgroundColor: '#24252b'
    },
    label: {
        color: '#FFF',
        width: '100%',
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
    },
    dividerColor: {
        backgroundColor: '#88dd00'
    },
    close_btn: {
        color: '#88dd00'
    },
}));

export const updateStepper = (stepsArray, labels, data, serverData, wsObj) => {
    let currentSteps = null;
    let id = data[fields.uuid]
    header = labels[0].label
    if (stepsArray && stepsArray.length > 0) {
        stepsArray.map((item, i) => {
            if (id === item.id) {
                if (data) {
                    currentSteps = item;
                }
                else {
                    item.steps.push({ code: CODE_FINISH })
                }
            }
        })
    }

    if (serverData) {
        let step = { code: serverData.code, message: serverData.data.message }
        if (currentSteps === null) {
            stepsArray.push({ data: data, labels: labels, id: id, steps: [step], wsObj: wsObj })
        }
        else {
            stepsArray.map((item, i) => {
                if (id === item.id) {
                    item.steps.push(step)
                }
            })
        }
    }
    return stepsArray
}


const MultiStream = (props) => {
    const body = useRef();
    const classes = useStyles();


    const getSummary = (data) => (
        <ExpansionPanelSummary
            style={{ backgroundColor: '#24252b', color: 'white' }}
            expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography>{data}</Typography>
        </ExpansionPanelSummary>
    )
    const getDataSummary = (steps) => {
        let step = steps[steps.length - 1]
        step = step.code === CODE_FINISH ? steps[steps.length - 2] : step
        return getSummary(step.message)
    }

    const getHeaderDetails = (item) => {
        let data = item.data
        let labels = item.labels
        return (
            <ExpansionPanelDetails style={{ backgroundColor: '#24252b', color: 'white' }}>
                <div ref={body} style={{ backgroundColor: '#24252b', overflowY: 'auto', maxHeight: 400 }}>
                    {labels.map((info, i) => {
                        if (i > 0)
                            return <p><b>{info.label}</b>&nbsp;-&nbsp;{data[info.field]}</p>
                    })}
                </div>
            </ExpansionPanelDetails>
        )
    }


    const getStepLabel = (item, stepperProps) => {
        let code = item.steps[stepperProps.icon - 1].code;
        return (<div className={classes.root}>
            {
                stepperProps.completed ?
                    code === CODE_FAILED || code === CODE_FAILED_403 ?
                        <ErrorIcon className={classes.error} /> :
                        <Check className={classes.success} /> :
                    <div className={classes.wrapper}>
                        <p className={classes.iconLabel}>{stepperProps.icon}</p>
                        <CircularProgress className={classes.progress} size={25} thickness={3} />
                    </div>
            }
        </div>)
    }

    const getDetails = (item) => {
        return (
            <ExpansionPanelDetails style={{ backgroundColor: '#24252b', color: 'white' }}>
                <div ref={body} style={{ backgroundColor: '#24252b', overflowY: 'auto', maxHeight: 400 }}>
                    <Stepper className={classes.stepper} activeStep={item.steps[item.steps.length - 1].code === CODE_FINISH ? item.steps.length : item.steps.length - 1} orientation="vertical">
                        {item.steps.map((step, index) => {
                            return (
                                step.message ?
                                    <Step key={index}>
                                        <StepLabel StepIconComponent={(stepperProps) => {
                                            return getStepLabel(item, stepperProps)
                                        }}><p className={classes.label}>{step.message}</p></StepLabel>
                                    </Step>
                                    :
                                    null
                            )
                        })}
                    </Stepper>
                </div>
            </ExpansionPanelDetails>
        )
    }
    return (
        props.multiStepsArray.length > 0 ?
            <div>
                {
                    <Dialog open={props.multiStepsArray.length > 0} maxWidth='lg' fullWidth={true}>
                        <div style={{ backgroundColor: '#24252b' }} align="right">
                            <IconButton aria-label="delete" className={classes.close_btn} onClick={(e) => props.onClose()}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <DialogContent style={{ background: '#24252b', maxHeight: 600 }}>
                            <Grid container spacing={2} style={{ paddingLeft: 10, paddingRight: 10 }}>
                                <Grid item xs={3}>
                                    <h4 style={{ padding: '13px 0', color: '#88dd00' }}><strong>{header}</strong></h4>
                                </Grid>
                                <Grid item xs={9}>
                                    <h4 style={{ padding: '13px 0', color: '#88dd00' }} align="center"><strong>Progress</strong></h4>
                                </Grid>
                            </Grid>
                            <Divider classes={{ root: classes.dividerColor }} />
                            {props.multiStepsArray.map((item, i) => {
                                return (
                                    <div key={i}>
                                        <Grid container spacing={2} style={{ padding: 10 }}>
                                            <Grid item xs={3}>
                                                {item.labels.length > 1 ?
                                                    <ExpansionPanel>
                                                        {getSummary(item.data[item.labels[0].field])}
                                                        {getHeaderDetails(item)}
                                                    </ExpansionPanel> :
                                                    <h4 style={{ padding: '13px 0', color: '#DDDD' }}>{item.data[item.labels[0].field]}</h4>}
                                            </Grid>
                                            <Grid item xs={9}>
                                                {

                                                    <ExpansionPanel>
                                                        {getDataSummary(item.steps)}
                                                        {getDetails(item)}
                                                    </ExpansionPanel>
                                                }
                                            </Grid>
                                        </Grid>
                                    </div>)
                            })}

                        </DialogContent>

                    </Dialog>}
            </div> : null
    )
}

export default MultiStream;

