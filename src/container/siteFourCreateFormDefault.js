import React, { Fragment } from "react";

import {Button, Form, Table, List, Grid, Card, Header, Divider, Tab, Item, Popup, Icon, Input, Dropdown} from "semantic-ui-react";

import { Field, reduxForm, initialize, reset, change, stopSubmit } from "redux-form";
import MaterialIcon from "material-icons-react";
import * as services from '../services/service_compute_service';
import './styles.css';


const makeOption =(options)=> (
    options.map((value) =>(
        {key:value, text:value, value:value}
    ))
)

const renderSelect = field => (
    <div>
        <Form.Select
            label={field.label}
            name={field.input.name}
            onChange={(e, { value }) => field.input.onChange(value)}
            options={makeOption(field.options)}
            placeholder={field.placeholder}
            value={field.input.value}
        />
        {field.error && <span className="text-danger">{field.error}</span>}
    </div>
);

const renderInputNum = field => (
    <Form.Field
        {...field.input}
        type={field.type}
        // placeholder={field.placeholder}
    >
        <label>{field.label}</label>
        <Input type="number" onChange={(e)=>{if(e.target.value == 0 || e.target.value < 0) e.target.value = null}}></Input>
    </Form.Field>
);
const renderInput = field => (
    <div>
        <Form.Input
            {...field.input}
            type={field.type}
            label={field.label}
            // placeholder={field.placeholder}
        />
        {field.error && <span className="text-danger">{field.error}</span>}
    </div>
);
const renderInputCluster = field => (
    <div>
        <Form.Input
            {...field.input}
            type={field.type}
            label={field.label}
            placeholder={'Please use numbers and English letters only'}
            onChange={(e, { value }) => {
                const reg = /^[0-9a-zA-Z][-0-9a-zA-Z.]*$/;
                if(reg.test(value) || value == ''){
                    field.input.onChange(value)
                }
            }}
        />
        {field.error && <span className="text-danger">{field.error}</span>}
    </div>
);
const renderInputDisabled = field => (
    <Form.Input
        {...field.input}
        type={field.type}
        label={field.label}
        placeholder={field.placeholder}
        disabled
    />
);
const renderDropDown = field => (
    <div>
        <Form.Dropdown
            placeholder={field.placeholder}
            fluid
            multiple
            selection
            options={makeOption(field.options)}
            onChange={(e, { value }) => field.input.onChange(value)}
        />
        {field.error && <span className="text-danger">{field.error}</span>}
    </div>
);
const renderLocationInput = ({ input, placeholder, change, type, error, initialValue }) => (
    <div>
        <Form.Field
            {...input}
            type={type}
        >
            <Input fluid type="number"
                   onChange={change}
                   value={initialValue}
                   ></Input>
        </Form.Field>
        {error && <span className="text-danger">{error}</span>}
    </div>

);

const style = {
    borderRadius: 0,
    opacity: 0.7,
    padding:'2em'
}

class SiteFourCreateFormDefault extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typeValue:'',
            data:null,
            regKey:null,
            fieldKeys:null,
            dataInit:false,
            portArray:['item'],
            orgArr:[],
            ipAccessValue:[],
            deployTypeDocker:false
        };

    }

    // data.map((dt) => {
    handleInitialize(data) {
        const initData = [];
        if(data.length){

        } else {
            this.props.initialize(data);

        }

    }


    componentDidMount() {
        if(this.props.data && this.props.data.data.length){
            let keys = Object.keys(this.props.data.data[0])
            this.setState({data:this.props.data.data[0], regKeys:keys, fieldKeys:this.props.data.keys, pId:this.props.pId})
            if(!this.state.dataInit){
                this.handleInitialize(this.props.data.data[0]);
                this.setState({dataInit:true})
            }
        }
        if(this.props.getUserRole == 'AdminManager') {
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            services.getMCService('showOrg',{token:store ? store.userToken : 'null'}, this.receiveResult)
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data && nextProps.data.data.length){
            let keys = Object.keys(nextProps.data.data[0])
            this.setState({data:nextProps.data.data[0], regKeys:keys, fieldKeys:nextProps.data.keys, pId:nextProps.pId})
            // submitSucceeded 초기화
            if(this.props.toggleSubmit) {
                this.props.dispatch(stopSubmit('createAppFormDefault',{}))
            }
            if(!this.state.dataInit){
                this.handleInitialize(nextProps.data.data[0]);
                this.setState({dataInit:true})
            }
        }
        
        
    }

    getLabel (key, pId) {
        return (this.state.fieldKeys && this.state.fieldKeys[pId][key]) ? this.state.fieldKeys[pId][key]['label'] : null
    }
    getNecessary (key, pId) {
        return (this.state.fieldKeys && this.state.fieldKeys[pId][key]) ? this.state.fieldKeys[pId][key]['necessary'] ? ' *':'' : null
    }

    getHelpPopup =(value)=> (
        <Popup
            trigger={<Icon name='question circle outline' size='large' style={{lineHeight:'unset', margin:'10px 0'}} />}
            content={value}
            style={style}
            inverted
        />
    )
    onHandleSubmit=(a,b)=> {
        this.props.handleSubmit();
    }
    onFormState=(a,b)=> {
        alert('onForm state',a,b)
    }
    onHandleChange(key,value,c){
        if(key === 'Region'){
            this.props.onChangeState(key)
        } else if(key === 'OrganizationName') {
            this.props.onChangeState(key)
        } else if(key === 'DeploymentType') {
            if(value == 'Docker') {
                this.setState({ipAccessValue:['Dedicated']})
                this.setState({deployTypeDocker:true})
            } else if(value == 'Kubernetes') {
                this.setState({ipAccessValue:['Dedicated','Shared']})
                this.setState({deployTypeDocker:false})
            }
            this.props.clusterHide(value);
            this.props.onChangeState(key)
        } else {
            this.props.onChangeState(key)
        }
    }

    handleRegionChange = (e) => {
        alert(e)
        this.props.getOptionData(e)
        //this.props.dispatch(reset('createAppFormDefault'));
    }

    AddPorts = (e) => {
        e.preventDefault();
        this.setState({portArray:this.state.portArray.concat('item')})
    }
    RemovePorts = (e) => {
        let arr = this.state.portArray;
        if(arr.length > 1) {
            arr.pop()
        }
        this.setState({portArray:arr}); 
    }
    receiveResult = (result) => {
        let arr = [];
        result.map((item,i) => {
            if(item.Type === 'developer'){
                arr.push(item.Organization);
            }
        })
        this.setState({orgArr:arr});
    }

    cancelClick = (e) => {
        e.preventDefault();
        let siteNum = 0;
        console.log("cancelClickddd",e,":::",this.props)
        if(localStorage.selectMenu == 'Cloudlets') siteNum = 2
        else if(localStorage.selectMenu == 'Cluster Instances') siteNum = 4
        this.props.gotoUrl(siteNum)
    }
    
    render (){
        const {  dimmer, selected, longLoc, latLoc, type, pId, getUserRole, handleChangeLong, handleChangeLat } = this.props;
        const { data, regKeys, fieldKeys } = this.state;
        let cType = (type)?type.substring(0,1).toUpperCase() + type.substring(1):'';
        console.log('20190902 this.props.regionInfo ===>>>', this.props.regionInfo, 'dimmer=', dimmer)
        console.log('20190902 longLoc ===>>>', longLoc, 'latLoc=', latLoc)
        return (

            <Item className='content create-org' style={{margin:'0 auto', maxWidth:1200}}>
                <Header style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>Settings</Header>
                <Fragment >
                    <Form onSubmit={this.onHandleSubmit} getFormState={this.onFormState} className={"fieldForm"} >
                        <Form.Group widths="equal" style={{flexDirection:'column', marginLeft:10, marginRight:10, alignContent:'space-around'}}>
                            <Grid columns={2}>
                                {
                                    (regKeys && regKeys.length > 0) ?
                                        regKeys.map((key, i) => (

                                            (this.getLabel(key, pId))?
                                                (!this.state.deployTypeDocker || (key !== 'NumberOfMaster' && key !== 'NumberOfNode')) ?
                                                <Grid.Row columns={3} key={i} className={'cloudletReg'+i}>

                                                    <Grid.Column width={4} className='detail_item'>
                                                        <div>{this.getLabel(key, pId)}{this.getNecessary(key, pId)}</div>
                                                    </Grid.Column>
                                                    <Grid.Column width={11}>
                                                        {
                                                            (fieldKeys[pId][key]['type'] === 'RenderSelect') ?
                                                            <Field
                                                                component={renderSelect}
                                                                placeholder={'Select '+fieldKeys[pId][key]['label'] }
                                                                value={data[key]}
                                                                options={(fieldKeys[pId][key]['label'] !== 'IP Access') ? fieldKeys[pId][key]['items'] : this.state.ipAccessValue}
                                                                name={key}
                                                                onChange={(e)=>this.onHandleChange(key,e,data[key])}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderInputNum') ?
                                                            <Field
                                                                component={renderInputNum}
                                                                value={data[key]}
                                                                name={key}
                                                            />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderDropDown') ?
                                                            <Field
                                                                placeholder={'Select '+fieldKeys[pId][key]['label'] }
                                                                component={renderDropDown}
                                                                options={fieldKeys[pId][key]['items']}
                                                                name={key}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}
                                                            />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderInputDisabled') ?
                                                                (getUserRole == 'AdminManager' && fieldKeys[pId][key]['label'] === 'Organization Name') ?
                                                                    <Field
                                                                        component={renderSelect}
                                                                        placeholder={'Select Organization Name'}
                                                                        options={this.state.orgArr}
                                                                        name={key}
                                                                        error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                                :
                                                                    <Field
                                                                        disabled
                                                                        component={renderInputDisabled}
                                                                        type="input"
                                                                        name={key}
                                                                        value={data[key]}
                                                                        />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderInputCluster') ?
                                                            <Field
                                                                component={renderInputCluster}
                                                                type="input"
                                                                name={key}
                                                                value={data[key]}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'CloudletLocation') ?
                                                            <Grid>
                                                                <Grid.Row columns={2}>
                                                                    <Grid.Column><span>Latitude</span>
                                                                        <Field ref={latLoc} name='Latitude' component={renderLocationInput}
                                                                                                            change={handleChangeLat} error={(this.props.validError.indexOf('Latitude') !== -1)?'Required':''}
                                                                                                            initialValue={Number(this.props.regionInfo.lat)}
                                                                        />
                                                                        </Grid.Column>
                                                                    <Grid.Column><span>Longitude</span>
                                                                        <Field ref={longLoc} name='Longitude' component={renderLocationInput}
                                                                                                            change={handleChangeLong} error={(this.props.validError.indexOf('Longitude') !== -1)?'Required':''}
                                                                                                            initialValue={Number(this.props.regionInfo.long)}
                                                                        />
                                                                        </Grid.Column>
                                                                </Grid.Row>
                                                            </Grid>
                                                            :
                                                            <Field
                                                                component={renderInput}
                                                                type="input"
                                                                name={key}
                                                                value={data[key]}
                                                                onChange={(e)=>this.onHandleChange(key,e.target.value)}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                        }
                                                    </Grid.Column>
                                                    <Grid.Column width={1}>
                                                    {(fieldKeys[pId][key] && fieldKeys[pId][key]['tip']) ? this.getHelpPopup(fieldKeys[pId][key]['tip']):null}

                                                    </Grid.Column>
                                                </Grid.Row>
                                                :
                                                null
                                            : null
                                        ))
                                        : ''
                                }
                            </Grid>
                        </Form.Group>
                        <Form.Group className={"submitButtonGroup orgButton"} id={"submitButtonGroup"} inline style={{flexDirection:'row', marginLeft:10, marginRight:10}}>
                            <Form.Group inline>
                                {/*<Button onClick={()=>this.onHandleReset()}>Reset</Button>*/}
                                <span style={{marginRight:'1em'}}>
                                    <Button onClick={this.cancelClick}>
                                        Cancel
                                    </Button>
                                </span>
                                <Button
                                    className='cloudletReg7'
                                    primary
                                    positive
                                    icon='checkmark'
                                    labelPosition='right'
                                    content="Create"
                                />
                            </Form.Group>

                        </Form.Group>
                    </Form>
                </Fragment>
            </Item>
        )
        
    }
};

export default reduxForm({
    form: "createAppFormDefault",
    enableReinitialize: true,
})(SiteFourCreateFormDefault);
