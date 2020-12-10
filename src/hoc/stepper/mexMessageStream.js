import React from 'react'
import { Stepper, Popover, Step, StepLabel, CircularProgress } from '@material-ui/core';
import Check from "@material-ui/icons/Check";
import ErrorIcon from '@material-ui/icons/Error';
import { green, red } from '@material-ui/core/colors';
import * as serverData from '../../services/model/serverData';
import { fields } from '../../services/model/format';
import cloneDeep from 'lodash/cloneDeep';

export const CODE_FINISH = 100;
export const CODE_SUCCESS = 200;
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
};


const classes = useStyles;
class VerticalStepper extends React.Component {

    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            stepsArray: [],
            resetToggle: undefined
        }
        this.body = React.createRef()
    }

    requestLastResponse = (data) => {
        if (this.props.uuid === 0) {
            let type = 'error'
            if (data.code === 200) {
                type = 'success'
            }
        }
    }

    requestResponse = (mcRequest) => {
        let request = mcRequest.request;
        let responseData = null;
        let stepsList = cloneDeep(this.state.stepsArray);
        if (stepsList && stepsList.length > 0) {
            stepsList = stepsList.filter((item) => {
                if (request.uuid === item.uuid) {
                    if (mcRequest.response) {
                        responseData = item;
                        return item
                    }
                    else {
                        if (item.steps && item.steps.length > 1) {
                            this.requestLastResponse(item.steps[item.steps.length - 1]);
                        }
                        if (item.steps.length >= 1 && item.steps[0].code === 200) {
                            item.steps.push({ code: CODE_FINISH })
                            this.props.dataFromServer(request)
                        }

                        if (this.props.uuid !== 0) {
                            return item
                        }
                    }
                }
                return item
            })

        }

       if (mcRequest.response) {
            let response = mcRequest.response.data
            let step = { code: response.code, message: response.data.message }
            if (responseData === null) {
                stepsList.push({ uuid: request.uuid, steps: [step] })
            }
            else {
                stepsList.map((item, i) => {
                    if (request.uuid === item.uuid) {
                        item.steps.push(step)
                    }
                })
            }
        }
        if(this._isMounted)
        {
            this.setState({ stepsArray: stepsList })
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
            if (state === 2 || state === 3 || state === 6 || state === 7 || state === 9 || state === 10 || state === 12 || state === 13 || state === 14) {
                valid = true
            }
            else if (data[fields.powerState]) {
                let powerState = data[fields.powerState];
                if (powerState !== 0 && powerState !== 3 && powerState !== 6 && powerState !== 9 && powerState !== 10) {
                    valid = true
                }
            }
            return valid
        }
    }

    streamProgress = () => {
        let stream = this.props.streamType;
        if (stream) {
            for (let i = 0; i < this.props.dataList.length; i++) {
                let data = this.props.dataList[i];
                let forceStream = false
                let valid = false
                if (data[fields.state] !== 5) {
                    valid = this.sendWSRequest(data, forceStream)
                }
                if(this.props.customStream)
                {
                    forceStream = this.props.customStream(data)
                }
                if (valid || forceStream) {
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
                                    onEnter={() => { this.body.current.scrollTop = this.body.current.scrollHeight }}
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

                                                            }}><p style={classes.label}>{step.message}</p></StepLabel>
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
        if (prevProps.dataList !== this.props.dataList) {
            this.streamProgress()
        }
    }

    componentDidMount(){
        this._isMounted = true
    }

    componentWillUnmount(){
        this._isMounted = false   
    }
}

export default VerticalStepper;