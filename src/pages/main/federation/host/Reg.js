import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { Item, Step } from 'semantic-ui-react';
import { Grid } from '@material-ui/core';
import { _sort } from '../../../../helper/constant/operators';
import { HELP_FEDERATION_GUEST_REG } from "../../../../tutorial";
import Federator from '../reg/Federator';
import Fedaration from '../reg/Fedaration';
import ShareZones from './reg/ShareZones';

const stepData = [
    {
        step: "Step 1",
        description: "Enter Operator Details"
    },
    {
        step: "Step 2",
        description: "Enter Partner Details"
    },
    {
        step: "Step 3",
        description: "Share Zones With Partner"
    }
]

class HostReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            defaultData: undefined
        }
        this._isMounted = false
        this.isUpdate = this.props.isUpdate
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    onFinish = (data) => {
        let step = this.state.step
        if (step === 0 && data) {
            this.updateState({ step: 1, defaultData: data })
        }
        else if (step === 1 && data) {
            this.updateState({ step: 2, defaultData: data })
        }
        else {
            this.props.onClose()
        }
    }

    render() {
        const { step, defaultData } = this.state
        return (
            <div className="round_panel">
                <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                    <div>
                        <Step.Group stackable='tablet' style={{ width: '100%' }}>
                            {
                                stepData.map((item, i) => (
                                    <Step active={step === i} key={i}>
                                        <Step.Content>
                                            <Step.Title>{item.step}</Step.Title>
                                            <Step.Description>{item.description}</Step.Description>
                                        </Step.Content>
                                    </Step>
                                ))
                            }
                        </Step.Group>
                        <br />
                    </div>
                    <Grid container>
                        <Grid item xs={12}>
                            {
                                step === 1 ? <Fedaration data={defaultData} onClose={this.onFinish} /> :
                                step === 2 ? <ShareZones data={defaultData} onClose={this.onFinish} /> :
                                        <Federator onClose={this.onFinish} />
                            }
                        </Grid>
                    </Grid>
                </Item>
            </div>
        )
    }

    componentDidMount() {
        this._isMounted = true
        this.props.handleViewMode(HELP_FEDERATION_GUEST_REG)
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data,
        regions: state.regionInfo.region
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(HostReg));