import React, { Fragment } from "react";

import {Button, Form, Table, List, Grid, Card, Header, Divider, Tab, Item, Popup, Icon, Input} from "semantic-ui-react";

import { Field, reduxForm, initialize, reset, stopSubmit, change } from "redux-form";
import MaterialIcon from "material-icons-react";
import * as services from '../services/service_compute_service';
import './styles.css';

let portNum = 0;

const makeOption =(options)=> (
    options.map((value) =>(
        {key:value, text:(value == 'tcp' || value == 'udp')? value.toUpperCase() : value, value:value}
    ))
)

const makeOptionNumber =(options)=> (
    options.map((value,i) =>(
        {key:i, text:value, value:i}
    ))
)

const renderSelect = ({ input, label, options, placeholder, error}) => (
    <div>
        <Form.Select
            label={label}
            name={input.name}
            onChange={(e, { value }) => input.onChange(value)}
            options={makeOption(options)}
            placeholder={placeholder}
            value={input.value}
        />
        {error && <span className="text-danger">{error}</span>}
    </div>
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

const renderInput = ({ input, placeholder, label, type, error}) => (
    <div>
        <Form.Input
            {...input}
            type={type}
            label={label}
            // placeholder={placeholder}
        />
        {error && <span className="text-danger">{error}</span>}
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

const renderInputDpType = field => (
    <Form.Input
        {...field.input}
        type={field.type}
        label={field.label}
        value={field.placeholder}
        disabled
    />
);

const renderInputPathType = field => (
    <Form.Input
        {...field.input}
        type={field.type}
        label={field.label}
        value={field.placeholder}
    />
);

const renderInputApp = field => (
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

const renderCheckbox = field => (
    <Form.Checkbox toggle
        style={{height:'33px', paddingTop:'8px'}}
        checked={!!field.input.value}
        name={field.input.name}
        label={field.label}
        onChange={(e, { checked }) => field.input.onChange(checked)}
    />
);

const style = {
    borderRadius: 0,
    opacity: 0.7,
    padding:'2em'
}

class SiteFourCreateFormAppDefault extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typeValue:'',
            data:null,
            regKey:null,
            fieldKeys:null,
            dataInit:false,
            portArray:[],
            orgArr:[],
            deployAPK:false
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

    componentWillUnmount() {
        portNum = 0;
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
    onHandleSubmit() {
        this.props.handleSubmit();
    }

    handleRegionChange = (e) => {
        this.props.getOptionData(e)
        //this.props.dispatch(reset('createAppFormDefault'));
    }

    AddPorts = (e) => {
        e.preventDefault();
        this.setState({portArray:this.state.portArray.concat(portNum)})
        portNum++;
    }
    RemovePorts = (num) => {
        let arr = this.state.portArray;
        
        this.props.dispatch(change('createAppFormDefault', 'Ports_'+num, null));
        this.props.dispatch(change('createAppFormDefault', 'Portsselect_'+num, null));

        if(arr.length > 0) {
            const idx = arr.indexOf(num)
            if (idx > -1) arr.splice(idx, 1)
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
        this.props.gotoUrl()
    }

    onHandleChange(key,value){
        if(key === 'DeploymentType') {
            if(value == 'VM') {
                this.setState({deployAPK:true})
            } else {
                this.setState({deployAPK:false})
            }
        } 
    }
    
    render (){
        const { handleSubmit, reset, dimmer, selected, open, close, option, value, change, org, type, pId, getUserRole } = this.props;
        const { data, regKeys, fieldKeys } = this.state;
        let cType = (type)?type.substring(0,1).toUpperCase() + type.substring(1):'';
        return (

            <Item className='content create-org' style={{margin:'0 auto', maxWidth:1200}}>
                <Header style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>Settings</Header>
                <Fragment >
                    <Form onSubmit={() => this.onHandleSubmit()} className={"fieldForm"} >
                        <Form.Group widths="equal" style={{flexDirection:'column', marginLeft:10, marginRight:10, alignContent:'space-around'}}>
                            <Grid columns={2}>
                                {
                                    (regKeys && regKeys.length > 0) ?
                                        regKeys.map((key, i) => (

                                            (this.getLabel(key, pId))?
                                                
                                                <Grid.Row columns={3} key={i} className={'createApp'+i}>

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
                                                                />

                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderSelect') ?
                                                            <Field
                                                                component={renderSelect}
                                                                placeholder={'Select '+fieldKeys[pId][key]['label']}
                                                                value={data[key]}
                                                                options={fieldKeys[pId][key]['items']}
                                                                name={key}
                                                                onChange={(e)=>this.onHandleChange(key,e)}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'IpSelect') ?
                                                            <Field
                                                                component={renderSelectNumber}
                                                                placeholder={'Select IpAccess'}
                                                                value={data[key]}
                                                                options={fieldKeys[pId][key]['items']}
                                                                name={key}
                                                                />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'FlavorSelect') ?
                                                            <Field
                                                                component={renderSelect}
                                                                placeholder={'Select Flavor'}
                                                                value={data[key]}
                                                                options={this.props.flavorData}
                                                                name={key}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RegionSelect') ?
                                                            <Field
                                                                component={renderSelect}
                                                                placeholder={'Select Region'}
                                                                value={data[key]}
                                                                options={fieldKeys[pId][key]['items']}
                                                                name={key}

                                                                onChange={this.handleRegionChange}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderDT') ?
                                                            <Field
                                                                    component={renderInputDpType}
                                                                    placeholder={fieldKeys[pId][key].items}
                                                                    type="input"
                                                                    name={key}
                                                                    value={fieldKeys[pId][key].items}
                                                                    error={(this.props.validError.indexOf(key) !== -1)?'Required':''}
                                                                    />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderPath') ?
                                                            <Field
                                                                    component={renderInputPathType}
                                                                    placeholder={fieldKeys[pId][key].items}
                                                                    type="input"
                                                                    name={key}
                                                                    value={(fieldKeys[pId][key].items)?fieldKeys[pId][key].items:data[key]}
                                                                    error={(this.props.validError.indexOf(key) !== -1)?'Required':''}
                                                                    />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderCheckbox') ?
                                                            <Field
                                                                component={renderCheckbox}
                                                                name={key}
                                                                />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderInputDisabled') ?
                                                                (getUserRole == 'AdminManager') ?
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
                                                                        //placeholder={data[key]}
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
                                                                                    name={key+'_'+item}
                                                                                    //value={data[key]}
                                                                                    error={(this.props.validError.indexOf(key+'_'+i) !== -1)?'Required':''}
                                                                                    />
                                                                            </Grid.Column>
                                                                            <Grid.Column width={5}>
                                                                                <Field
                                                                                    component={renderSelect}
                                                                                    placeholder={'Select port'}
                                                                                    //value={data[key]}
                                                                                    options={fieldKeys[pId][key]['items']}
                                                                                    name={key+'select_'+item}
                                                                                    error={(this.props.validError.indexOf(key+'select_'+i) !== -1)?'Required':''}
                                                                                    />
                                                                            </Grid.Column>
                                                                            <Grid.Column width={1}>
                                                                                {/*<Button onClick={this.RemovePorts} sttle={{width:'100%'}}>Delete</Button>*/}
                                                                                <div className='removePorts' onClick={() => this.RemovePorts(item)}><i className="material-icons">clear</i></div>
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
                                                            (fieldKeys[pId][key]['type'] === 'RenderInputApp') ?
                                                            <Field
                                                                component={renderInputApp}
                                                                type="input"
                                                                name={key}
                                                                value={data[key]}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                            :
                                                            <Field
                                                                component={renderInput}
                                                                type="input"
                                                                name={key}
                                                                value={data[key]}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}
                                                                />
                                                        }
                                                    </Grid.Column>
                                                    <Grid.Column width={1}>
                                                        {(fieldKeys[pId][key] && fieldKeys[pId][key]['tip']) ? this.getHelpPopup(fieldKeys[pId][key]['tip']):null}
                                                    </Grid.Column>
                                                </Grid.Row>
                                                
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
    // validate
    // enableReinitialize: true
})(SiteFourCreateFormAppDefault);
