import React, { Fragment } from "react";
import {Grid} from "semantic-ui-react";
import {stopSubmit} from "redux-form";
import CreateAutoPolicyForm  from './createAutoPolicyForm';
import '../styles.css';

let _self = null;
class SiteFourPoolOne extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            typeValue:'',
            data:null
        };

    }

    handleInitialize() {
        let cType = this.props.type.substring(0,1).toUpperCase() + this.props.type.substring(1);
        const initData = {
            "orgName": this.props.org,
            "orgType": cType
        };

        this.props.initialize(initData);
    }

    componentDidMount() {
      
    }

    componentWillReceiveProps(nextProps) {
        let regions = [];
        let fieldValue = [];
        if(this.props.toggleSubmit) {
            this.props.dispatch(stopSubmit('orgaStepOne',{}))
        }
        if(nextProps.data) {
            this.setState({data:nextProps.data})
        }


    }

    render() {
        const { handleSubmit, reset, org, type, step } = this.props;
        return (
            <Fragment>
                <Grid>
                    <CreateAutoPolicyForm data={this.state.data} step={step} pId={0} getUserRole={this.props.userrole} gotoUrl={this.props.gotoUrl} toggleSubmit={this.props.toggleSubmit} validError={this.props.error || []} onSubmit={() => console.log('submit form')} />
                </Grid>
            </Fragment>
        )

    }
};


export default SiteFourPoolOne;
