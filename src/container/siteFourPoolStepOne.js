import React, { Fragment } from "react";
import {Button, Form, Item, Message, List, Grid, Card, Header, Image, Input} from "semantic-ui-react";
import {Field, reduxForm, initialize, reset, stopSubmit} from "redux-form";
import SiteFourCreatePoolForm  from './siteFourCreatePoolForm';
import './styles.css';

let _self = null;
class SiteFourPoolOne extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            typeValue:'',
            keysData:[
                {
                    'Region':{label:'Region', type:'RenderSelect', necessary:true, tip:'Select region where you want to deploy.', active:true, items:[]},
                    'poolName':{label:'Pool Name', type:'RenderInput', necessary:true, tip:'Name of the cloudlet pool.', active:true, items:[]},
                    'selectCloudlet':{label:'Into the pool', type:'RenderDualListBox', necessary:false, tip:'select a cloudlet', active:true},
                    'invisibleField':{label:'Invisible', type:'InvisibleField', necessary:false, tip:'invisible field', active:true}
                },
                {

                }
            ],
            fakeData:[
                {
                    'Region':'',
                    'poolName':'',
                    'selectCloudlet':'',
                    'invisibleField':''
                }
            ],
            keysDataLink:[
                {
                    'CloudletPool':{label:'Cloudlet Pool', type:'RenderDropDown', necessary:true, tip:'Name of the cloudlet pool.', active:true, items:[]},
                    'LinktoOrganization':{label:'Into the pool', type:'RenderDualListBox', necessary:true, tip:'select a cloudlet', active:true},
                    'LinkDiagram':{label:'Linked Status', type:'RenderLinkedDiagram', necessary:false, tip:'linked the cloudlet pool with the organization', active:true},
                },
                {

                }
            ],
            fakeDataLink:[
                {
                    'CloudletPool':'',
                    'LinktoOrganization':'',
                    'LinkDiagram':''
                }
            ],
            devData: []
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
        if(this.props.toggleSubmit) {
            this.props.dispatch(stopSubmit('orgaStepOne',{}))
        }
        
        this.setState({devData:{data:this.state.fakeData, keys:this.state.keysData}})
    }


    render (){
        const { handleSubmit, reset, org, type } = this.props;
        return (
            <Fragment>
                <Grid>
                    <Grid.Column width={11}>
                        <div><SiteFourCreatePoolForm data={this.state.devData}/></div>
                    </Grid.Column>
                    <Grid.Column width={5}>
                    </Grid.Column>
                </Grid>

            </Fragment>
        )

    }
};


export default SiteFourPoolOne;
