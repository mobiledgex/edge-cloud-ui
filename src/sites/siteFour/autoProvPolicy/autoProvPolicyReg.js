import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
import { Item, Step, Icon } from 'semantic-ui-react';
import MexForms from '../../../hoc/forms/MexForms';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serverData from '../../../services/ServerData';

const stepData = [
    {
        step: "Step 1",
        description: "Create New Policy"
    },
    {
        step: "Step 2",
        description: "Link the organization to the cloudlet pool"
    },
    {
        step: "Step 3",
        description: "Review your Cloudlet Pool"
    }
]

class AutoProvPolicyReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            forms: [],
            info: { region: 'US' }
        }
        this.regions = props.regionInfo.region
    }


    onChangeActive(num) {
        if (this.state.step == num + 1) {
            return true;
        } else {
            return false;
        }
    }

    getRegionData = () => {
        if (this.regions && this.regions.length > 0)
            return this.regions.map(region => {
                return { key: region, value: region, text: region }
            })
    }

    onChange = (data) => {
        this.setState(prevState => {
            let info = Object.assign({}, prevState.info);
            info.region = data;
            return { info };
        })
    }

    onCreate = (data) => {
        alert(JSON.stringify(data))
    }


    render() {
        return (
            <div className="round_panel">
                <div className="grid_table" style={{ overflow: 'auto' }}>
                    <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                        <div className='content_title' style={{ padding: '0px 0px 10px 0' }}>Create New Cloudlet Policy</div>
                        <Step.Group stackable='tablet' style={{ width: '100%' }}>
                            {
                                stepData.map((item, i) => (
                                    <Step active={this.onChangeActive(i)} key={i} >
                                        <Icon name='info circle' />
                                        <Step.Content>
                                            <Step.Title>{item.step}</Step.Title>
                                            <Step.Description>{item.description}</Step.Description>
                                        </Step.Content>
                                    </Step>
                                ))
                            }
                        </Step.Group>
                        <MexForms forms={this.state.forms} />
                    </Item>

                </div>
            </div>
        )
    }

    

    getFormData = ()=>
    {
        serverData.getCloudletInfo(this, this.regions).then(data => {
            console.log('Rahul1234', data)

            let step1 = [
                { field: 'Region', label: 'Region', type: 'Select', placeholder: 'Select Region', required: true, data: this.getRegionData() },
                { field: 'AutoPolicyName', label: 'Auto Policy Name', type: 'Input', placeholder: 'Enter Auto Prov Name', rules: { required: true } },
                { field: 'DeployClientCount', label: 'Deploy Client Count', type: 'Input', rules: { type: 'number', required: true } },
                { field: 'DeployIntervalCount', label: 'Deploy Interval Count', type: 'Input', rules: { type: 'number', required: true } },
                { field: 'Cloudlets', label: 'Select Cloudlet', type: 'DualList' },
                { label: 'Create Cloudlet Pool', type: 'Button', onClick: this.onCreate }
            ]
            this.setState({
                forms: step1
            })
        })
        
    }

    componentDidMount() {
        this.getFormData()
    }

};
const mapStateToProps = (state) => {

    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    let appLaunch = state.appLaunch;
    let changeNext = state.changeNext ? state.changeNext.next : null;
    let _changedRegion = (state.form && state.form.createAppFormDefault && state.form.createAppFormDefault.values) ? state.form.createAppFormDefault.values.Region : null;
    return {
        getRegion: (state.getRegion) ? state.getRegion.region : null,
        regionInfo: regionInfo,
        region: region,
        changeRegion: state.changeRegion ? state.changeRegion.region : null,
        changedRegion: _changedRegion,
        appLaunch,
        changeNext
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(AutoProvPolicyReg)));
