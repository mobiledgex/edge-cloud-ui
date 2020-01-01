import React, { Fragment } from "react";
import {Button, Form, Item, Message, List, Grid, Card, Header, Image, Input} from "semantic-ui-react";
import {Field, reduxForm, initialize, reset, stopSubmit} from "redux-form";
import SiteFourCreatePoolForm  from './siteFourCreatePoolForm';
import './styles.css';

let _self = null;
class SiteFourPoolTwo extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            typeValue:'',
            propsData:[],
            selectedData:[]
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
        //this.handleInitialize();
        //let panelParams = {data:data, keys:keysData, region:region,
    }

    componentWillReceiveProps(nextProps) {
        let regions = [];
        let fieldValue = [];
        if(this.props.toggleSubmit) {
            this.props.dispatch(stopSubmit('orgaStepOne',{}))
        }

        if(nextProps.data) {
            if(nextProps.selectedData && nextProps.selectedData.region && nextProps.selectedData.poolName) {
                let assObj = Object.assign([], nextProps.data);
                assObj.data[0].Region = nextProps.selectedData.region;
                assObj.data[0].poolName = nextProps.selectedData.poolName;
            }

            this.setState({propsData:nextProps.data})
        }

    }

    //data:data, keys:keysData, region:region
    // data={props} pId={0} getUserRole={props.userrole} gotoUrl={props.gotoUrl} toggleSubmit={props.toggleSubmit} validError={props.error} onSubmit={() => console.log('submit form')}
    render (){
        const { handleSubmit, reset, org, type } = this.props;
        return (
            <Fragment>
                <Grid>
                    <Grid.Column>
                        <div><SiteFourCreatePoolForm data={this.state.propsData}  pId={0} getUserRole={this.props.userrole} gotoUrl={this.props.gotoUrl} toggleSubmit={this.props.toggleSubmit} validError={this.props.error || []} onSubmit={() => console.log('submit form')}/></div>
                    </Grid.Column>
                </Grid>
            </Fragment>
        )

    }
};


export default SiteFourPoolTwo;
