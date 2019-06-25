import React, { Fragment } from "react";

import {Button, Form, Table, List, Grid, Card, Header, Divider, Tab, Item, Popup, Icon, Input} from "semantic-ui-react";

import { Field, reduxForm, initialize, reset, change } from "redux-form";
import MaterialIcon from "material-icons-react";
import * as services from '../services/service_compute_service';
import './styles.css';

const validate = values => {
    const errors = {}
    if (!values.username) {
        errors.username = 'Required'
    } else if (values.username.length > 15) {
        errors.username = 'Must be 15 characters or less'
    }
    if (!values.email) {
        errors.email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    if (!values.age) {
        errors.age = 'Required'
    } else if (isNaN(Number(values.age))) {
        errors.age = 'Must be a number'
    } else if (Number(values.age) < 18) {
        errors.age = 'Sorry, you must be at least 18 years old'
    }
    return errors
}

const makeOption =(options)=> (
    options.map((value) =>(
        {key:value, text:value, value:value}
    ))
)

const makeOptionNumber =(options)=> (
    options.map((value,i) =>(
        {key:i, text:value, value:i}
    ))
)

const renderCheckbox = field => (
    <Form.Checkbox toggle
        style={{height:'33px', paddingTop:'8px'}}
        checked={!!field.input.value}
        name={field.input.name}
        label={field.label}
        onChange={(e, { checked }) => field.input.onChange(checked)}
    />
);

const renderRadio = field => (
    <Form.Radio
        style={{height: '38px', paddingTop: '10px'}}
        checked={field.input.value === field.radioValue}
        label={field.label}
        name={field.input.name}
        onChange={(e, { checked }) => field.input.onChange(field.radioValue)}
    />
);

const renderSelect = field => (
    <Form.Select
        label={field.label}
        name={field.input.name}
        onChange={(e, { value }) => field.input.onChange(value)}
        options={makeOption(field.options)}
        placeholder={field.placeholder}
        value={field.input.value}
    />
);

const renderSelectNumber = field => (
    <Form.Select
        label={field.label}
        name={field.input.name}
        onChange={(e, { value }) => field.input.onChange(value)}
        options={makeOptionNumber(field.options)}
        placeholder={field.placeholder}
        value={field.input.value}
    />
);

const renderTextArea = field => (
    <Form.TextArea
        {...field.input}
        label={field.label}
        // placeholder={field.placeholder}
    />
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
    <Form.Input
        {...field.input}
        type={field.type}
        label={field.label}
        // placeholder={field.placeholder}
    />
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

const makeCardContent = (item, i, type) => (
    <Grid.Row>
        <Card>
            <Card.Content>
                <Card.Header>{item['header']}</Card.Header>
                <Card.Meta>{type}</Card.Meta>
                <Card.Description>

                </Card.Description>
            </Card.Content>
        </Card>
    </Grid.Row>
)
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
        console.log('data,,,', data)
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
            services.getMCService('showOrg',{token:store.userToken}, this.receiveResult)
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("SiteFourCreateFormDefault --> ",nextProps)
        if(nextProps.data && nextProps.data.data.length){
            let keys = Object.keys(nextProps.data.data[0])
            this.setState({data:nextProps.data.data[0], regKeys:keys, fieldKeys:nextProps.data.keys, pId:nextProps.pId})
            if(!this.state.dataInit){
                this.handleInitialize(nextProps.data.data[0]);
                this.setState({dataInit:true})
            }
        }
        
        
    }

    getLabel (key, pId) {
        // console.log('key - ', key, 'pid -', pId, 'value-', this.state.fieldKeys[pId])
        return (this.state.fieldKeys && this.state.fieldKeys[pId][key]) ? this.state.fieldKeys[pId][key]['label'] : null
    }
    getNecessary (key, pId) {
        return (this.state.fieldKeys && this.state.fieldKeys[pId][key]) ? this.state.fieldKeys[pId][key]['necessary'] ? ' *':'' : null
    }

    getHelpPopup =(value)=> (
        <Popup
            trigger={<Icon name='question circle outline' size='large' style={{lineHeight:'38px'}} />}
            content={value}
            style={style}
            inverted
        />
    )
    onHandleSubmit=(a,b)=> {
        this.props.handleSubmit();
        setTimeout(() => {
            this.props.dispatch(initialize('createAppFormDefault', {
                submitSucceeded: false
            }))
            //this.props.dispatch(reset('createAppFormDefault'))
        },100);
    }
    onFormState=(a,b)=> {
        alert('onForm state',a,b)

    }
    onHandleChange(key,value,c){
        console.log("key@@@@@@",key,value,c)
        if(key === 'Region'){
            this.props.onChangeState(key)
        } else if(key === 'OrganizationName') {
            this.props.onChangeState(key)
        } else if(key === 'DeploymentType') {
            if(value == 'Docker') {
                this.setState({ipAccessValue:['IpAccessDedicated']})
                this.setState({deployTypeDocker:true})
            } else if(value == 'Kubernetes') {
                this.setState({ipAccessValue:['IpAccessDedicated','IpAccessShared']})
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
        console.log("receive == ", result)
        result.map((item,i) => {
            arr.push(item.Organization);
        })
        this.setState({orgArr:arr});
    }

    cancelClick = (e) => {
        e.preventDefault();
        this.props.gotoUrl()
    }
    
    render (){
        const { handleSubmit, reset, dimmer, selected, open, close, option, value, change, org, type, pId, getUserRole } = this.props;
        const { data, regKeys, fieldKeys } = this.state;
        console.log("data@fo@@",data, regKeys, fieldKeys)
        let cType = (type)?type.substring(0,1).toUpperCase() + type.substring(1):'';
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
                                                <Grid.Row columns={3} key={i}>

                                                    <Grid.Column width={4} className='detail_item'>
                                                        <div>{this.getLabel(key, pId)}{this.getNecessary(key, pId)}</div>
                                                    </Grid.Column>
                                                    <Grid.Column width={11}>
                                                        {

                                                            (fieldKeys[pId][key]['type'] === 'RenderTextArea') ?
                                                            <Field
                                                                component={renderTextArea}
                                                                placeholder={data[key]}
                                                                value={data[key] || ''}
                                                                name={key}
                                                                onChange={()=>console.log('onChange text..')}/>
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderSelect') ?
                                                            <Field
                                                                component={renderSelect}
                                                                placeholder={'Select '+fieldKeys[pId][key]['label'] }
                                                                value={data[key]}
                                                                options={(fieldKeys[pId][key]['label'] !== 'Ip Access') ? fieldKeys[pId][key]['items'] : this.state.ipAccessValue}
                                                                name={key}
                                                                onChange={(e)=>this.onHandleChange(key,e,data[key])}/>
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderCheckbox') ?
                                                            <Field
                                                                component={renderCheckbox}
                                                                value={data[key]}
                                                                name={key}
                                                                />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderInputNum') ?
                                                            <Field
                                                                component={renderInputNum}
                                                                value={data[key]}
                                                                name={key}
                                                            />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderInputDisabled') ?
                                                                (getUserRole == 'AdminManager' && fieldKeys[pId][key]['label'] === 'Organization Name') ?
                                                                    <Field
                                                                        component={renderSelect}
                                                                        placeholder={'Select Organization Name'}
                                                                        options={this.state.orgArr}
                                                                        name={key}
                                                                        onChange={()=>console.log('onChange text..')}/>
                                                                :
                                                                    <Field
                                                                        disabled
                                                                        component={renderInputDisabled}
                                                                        type="input"
                                                                        name={key}
                                                                        value={data[key]}
                                                                        />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'CustomPorts') ?
                                                            <Grid>
                                                                {
                                                                    this.state.portArray.map((item,i) => (

                                                                        <Grid.Row key={i} columns={3} style={{paddingBottom:'0px'}}>
                                                                            <Grid.Column width={10}>
                                                                                <Field
                                                                                    component={renderInput}
                                                                                    type="input"
                                                                                    name={key+'_'+i}
                                                                                    //value={data[key]}
                                                                                    />
                                                                            </Grid.Column>
                                                                            <Grid.Column width={5}>
                                                                                <Field
                                                                                    component={renderSelect}
                                                                                    placeholder={'Select port'}
                                                                                    //value={data[key]}
                                                                                    options={fieldKeys[pId][key]['items']}
                                                                                    name={key+'select_'+i}
                                                                                    onChange={()=>console.log('onChange text..')}
                                                                                    />
                                                                            </Grid.Column>
                                                                            <Grid.Column width={1}>
                                                                                {/*<Button onClick={this.RemovePorts} sttle={{width:'100%'}}>Delete</Button>*/}
                                                                                <div className='removePorts' onClick={this.RemovePorts}><i className="material-icons">clear</i></div>
                                                                            </Grid.Column>
                                                                        </Grid.Row>
                                                                    ))
                                                                }
                                                                <Grid.Row>
                                                                    <Grid.Column>
                                                                        <Button positive onClick={this.AddPorts}>Add Port Mapping</Button>
                                                                        {/*<div className="addPortMapping" onClick={this.AddPorts}>+ Add Port Mapping</div>*/}
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
                                                                />
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
                                    primary
                                    positive
                                    icon='checkmark'
                                    labelPosition='right'
                                    content="Save"
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
