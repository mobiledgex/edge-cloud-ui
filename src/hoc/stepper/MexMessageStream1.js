import React from 'react'
import { Stepper, Popover, Step, StepLabel, CircularProgress } from '@material-ui/core';
import Check from "@material-ui/icons/Check";
import ErrorIcon from '@material-ui/icons/Error';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import { green, red } from '@material-ui/core/colors';
import * as serverData from '../../services/model/serverData';
import { fields } from '../../services/model/format';
import cloneDeep from 'lodash/cloneDeep';
import { serverFields } from '../../helper/formatter';
import { equal } from '../../helper/constant/operators';

export const CODE_FINISH = 100;
export const CODE_SUCCESS = 200;
export const CODE_REQUEST = 300;
export const CODE_FAILED = 400;


const useStyles = {

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
        position: 'relative'
    },
    stepper: {
        backgroundColor: '#616161'
    },
    label: {
        color: '#FFF',
        width: 200,
        fontWeight: 500,
        marginTop:-5,
        wordWrap: "break-word"
    },
    iconLabel: {
        fontSize: 15,
        alignItems:'center',
        justifyContent:'center'
    },
    progress: {
        color: '#FFF',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -20,
        marginLeft: -12,
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
};


const classes = useStyles;
class MexMessageStream extends React.Component {

    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            stepsArray: [],
            resetToggle: undefined
        }
        this.body = React.createRef()
    }

    requestResponse = (mc) => {
        let request = mc.request;
        let responseData = null;
        let stepsList = cloneDeep(this.state.stepsArray);
        if (stepsList && stepsList.length > 0) {
            stepsList = stepsList.filter((item) => {
                if (request.uuid === item.uuid) {
                    if (mc.response) {
                        responseData = item;
                        return true
                    }
                    else {
                        let steps = item.steps
                        let lastStep = steps[steps.length - 1]
                        if (steps.length >= 1 && steps[0].code === 200) {
                            if (lastStep.code === 200) {
                                item.steps.push({ code: CODE_FINISH })
                                this.props.generateRequestData(request)
                            }
                        }
                        if (lastStep.code === 200) {
                            return this.props.uuid !== 0
                        }
                        return true
                    }
                }
                return true
            })
        }

        if (mc.response) {
            let response = mc.response.data
            let step = { code: response.code, message: response.data.message }
            if (responseData === null) {
                stepsList.push({ uuid: request.uuid, steps: [step] })
            }
            else {
                stepsList.map((item, i) => {
                    if (request.uuid === item.uuid) {
                        if (item.steps[0].code === CODE_REQUEST) {
                            item.steps = [step]
                        }
                        else {
                            item.steps.push(step)
                        }
                    }
                })
            }
        }

        if (this._isMounted) {
            this.setState({ stepsArray: stepsList }, ()=>{
            })
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.resetStream !== state.resetToggle) {
            return { resetToggle: props.resetStream, stepsArray: [] }
        }
        return null
    }


    sendWSRequest = (data) => {
        let stream = this.props.streamType;
        if (stream) {
            let valid = false
            let state = data[fields.state];
            if (state === serverFields.READY || state === serverFields.CREATING || state === serverFields.UPDATE_REQUESTED || state === serverFields.UPDATING || state === serverFields.DELETE_REQUESTED || state === serverFields.DELETING || state === serverFields.DELETE_PREPARE || state === serverFields.CRM_INITOK || state === serverFields.CREATING_DEPENDENCIES) {
                valid = true
            }
            else if (data[fields.powerState]) {
                let powerState = data[fields.powerState];
                if (powerState !== serverFields.UNKNOWN && powerState !== serverFields.POWER_ON && powerState !== serverFields.POWER_OFF && powerState !== serverFields.REBOOT && powerState !== serverFields.ERROR) {
                    valid = true
                }
            }
            return valid
        }
    }

    streamProgress = (data) => {
        let stream = this.props.streamType;
        if (stream) {
            let stepsArray = cloneDeep(this.state.stepsArray)
            let proceed = true
            for (const steps of stepsArray) {
                if (steps.uuid === data.uuid) {
                    proceed = false
                    break;
                }
            }
            if (proceed) {
                let forceStream = false
                let valid = false
                if (data[fields.state] !== serverFields.READY) {
                    valid = this.sendWSRequest(data, forceStream)
                }
                if (this.props.customStream) {
                    forceStream = this.props.customStream(data)
                }
                if (valid || forceStream) {
                    stepsArray.push({ uuid: data.uuid, steps: [{code: CODE_REQUEST, message:'Waiting for response from server'}] })
                    this.setState({ stepsArray })
                    serverData.sendWSRequest(this, stream(data), this.requestResponse)
                }
            }
        }
    }

    onClose = () => {
        this.state.stepsArray.map((item, i) => {
            item.steps.map(step => {
                if (step.code === CODE_FINISH) {
                    this.state.stepsArray.splice(i, 1)
                }
            })
        })
        this.props.onClose()
    }

    onEnter = ()=>{
        this.body.current.scrollTop = this.body.current.scrollHeight
    }


    render() {
        const { stepsArray } = this.state
        return (
            (this.props.uuid && this.props.uuid !== 0 && stepsArray && stepsArray.length > 0) ?
                <div>
                    {stepsArray.map((item, i) => {
                        return (
                            this.props.uuid === item.uuid ?
                                <Popover
                                    key={i}
                                    style={{ width: 400 }}
                                    anchorReference="anchorPosition"
                                    TransitionProps={{onEnter:this.onEnter}}
                                    anchorPosition={{ top: 0, left: window.innerWidth }}
                                    onClose={() => { this.onClose() }}
                                    open={this.props.uuid !== 0}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}>
                                    <div ref={this.body} style={{ backgroundColor: '#616161', overflowY: 'auto', maxHeight: 400 }}>
                                        <Stepper style={classes.stepper} activeStep={item.steps[item.steps.length - 1].code === CODE_FINISH ? item.steps.length : item.steps.length - 1} orientation="vertical">
                                            {item.steps.map((step, index) => {
                                                return (
                                                    step.message ?
                                                        <Step key={index}>
                                                            <StepLabel StepIconComponent={(stepperProps) => {
                                                                let code = item.steps[stepperProps.icon - 1].code
                                                                return (<div style={classes.root}>
                                                                    {
                                                                        code === CODE_REQUEST ?
                                                                            <div style={classes.wrapper}>
                                                                                <HourglassEmptyIcon />
                                                                            </div> :
                                                                            stepperProps.completed ?
                                                                                code === CODE_FAILED ?
                                                                                    <ErrorIcon style={classes.error} /> :
                                                                                    <Check style={classes.success} /> :
                                                                                <div style={classes.wrapper}>
                                                                                    <p style={classes.iconLabel}>{stepperProps.icon}</p>
                                                                                    <CircularProgress style={classes.progress} size={25} thickness={3} />
                                                                                </div>
                                                                    }
                                                                </div>)

                                                            }} style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                                                <p style={classes.label}>{step.message}</p>
                                                            </StepLabel>
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

    componentDidUpdate(prevProps, prevState) {
        if (this.body.current && this.props.uuid !== 0) {
            this.body.current.scrollTop = this.body.current.scrollHeight;
        }
        if (!equal(prevProps.progressData, this.props.progressData)) {
            this.streamProgress(this.props.progressData)
        }
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

export default MexMessageStream;