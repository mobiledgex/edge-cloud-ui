import React, { Fragment } from "react";

import {Button, Form, Table, List, Grid, Card, Header, Divider, Tab, Item, Popup, Icon, Input, Dropdown} from "semantic-ui-react";

import { Field, reduxForm, initialize, reset, stopSubmit } from "redux-form";
import MaterialIcon from "material-icons-react";
import * as services from '../services/service_compute_service';
import './styles.css';

const makeOption =(options)=> (
    options.map((value) =>(
        {key:value, text:value, value:value}
    ))
)

const renderCheckbox = field => (
    <Form.Checkbox toggle
        style={{height:'33px', paddingTop:'8px'}}
        checked={!!field.input.value}
        name={field.input.name}
        label={field.label}
        onChange={(e, { checked }) => field.input.onChange(checked)}
        disabled = {field.disabled}
    />
);

const renderSelect = ({ input, label, options, placeholder, error, disabled }) => (
    <div>
        <Form.Select
            label={label}
            name={input.name}
            onChange={(e, { value }) => input.onChange(value)}
            options={makeOption(options)}
            placeholder={placeholder}
            value={input.value}
            disabled = {disabled}
        />
        {error && <span className="text-danger">{error}</span>}
    </div>
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
            disabled = {field.disabled}
        />
        {field.error && <span className="text-danger">{field.error}</span>}
    </div>
);

const renderInput = ({ input, placeholder, label, type, error }) => (
    <div>
        <Form.Input
            {...input}
            type={type}
            label={label}
            placeholder={placeholder}
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

const style = {
    borderRadius: 0,
    opacity: 0.7,
    padding:'2em'
}

class SiteFourCreateFormAppInstDefault extends React.Component {
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
            ClusterDisable:false
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
        console.log("SiteFourCreateFormAppInstDefault --> ",nextProps)
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
    onHandleSubmit() {
        this.props.handleSubmit();
        // setTimeout(() => {
        //     this.props.dispatch(initialize('createAppFormDefault', {
        //         submitSucceeded: false
        //     }))
        // },100);
        //setTimeout(() => this.props.dispatch(reset('createAppFormDefault')),1000);
    }

    handleRegionChange = (e) => {
        this.props.getOptionData(e)
        //this.props.dispatch(reset('createAppFormDefault'));
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
        console.log("eeeesse@@",this.props)
        e.preventDefault();
        this.props.gotoUrl()
    }

    onHandleToggleChange = (e) => {
        this.setState({ClusterDisable:e})
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
                    <Form onSubmit={() => this.onHandleSubmit()} className={"fieldForm"} >
                        <Form.Group widths="equal" style={{flexDirection:'column', marginLeft:10, marginRight:10, alignContent:'space-around'}}>
                            <Grid columns={2}>
                                {
                                    (regKeys && regKeys.length > 0) ?
                                        regKeys.map((key, i) => (

                                            (this.getLabel(key, pId))?
                                                (!this.props.autoClusterDisable || (key !== 'AutoClusterInst' && key !== 'ClusterInst'))?
                                                <Grid.Row columns={3} key={i}>

                                                    <Grid.Column width={4} className='detail_item'>
                                                        <div>{this.getLabel(key, pId)}{this.getNecessary(key, pId)}</div>
                                                    </Grid.Column>
                                                    <Grid.Column width={11}>
                                                        {
                                                            (fieldKeys[pId][key]['type'] === 'RenderSelect') ?
                                                            <Field
                                                                component={renderSelect}
                                                                placeholder={'Select '+fieldKeys[pId][key]['label']}
                                                                value={data[key]}
                                                                options={fieldKeys[pId][key]['items']}
                                                                name={key}
                                                                onChange={()=>console.log('onChange text..')}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
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
                                                            (fieldKeys[pId][key]['type'] === 'RenderCheckbox') ?
                                                            <Field
                                                                component={renderCheckbox}
                                                                value={data[key]}
                                                                name={key}
                                                                onChange={(e)=>this.onHandleToggleChange(e)}
                                                                disabled={this.props.autoClusterDisable}
                                                                />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderInputDisabled') ?
                                                                (getUserRole == 'AdminManager') ?
                                                                    <Field
                                                                        component={renderSelect}
                                                                        placeholder={'Select Organization Name'}
                                                                        options={fieldKeys[pId][key]['items']}
                                                                        name={key}
                                                                        onChange={()=>console.log('onChange text..')}
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
                                                            (fieldKeys[pId][key]['type'] === 'RenderClusterDisabled') ?
                                                                (!this.state.ClusterDisable) ?
                                                                    <Field
                                                                        component={renderDropDown}
                                                                        placeholder={'Select '+fieldKeys[pId][key]['label']}
                                                                        value={data[key]}
                                                                        options={fieldKeys[pId][key]['items']}
                                                                        name={key}
                                                                        onChange={()=>console.log('onChange text..')}
                                                                        error={(this.props.validError.indexOf(key) !== -1)?'Required':''}
                                                                        disabled={this.props.autoClusterDisable}
                                                                        />
                                                                :
                                                                    <Field
                                                                        disabled
                                                                        component={renderInputDisabled}
                                                                        type="input"
                                                                        name={key}
                                                                        placeholder={'autocluster'}
                                                                        />
                                                            :
                                                            <Field
                                                                component={renderInput}
                                                                type="input"
                                                                name={key}
                                                                value={data[key]}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                        }
                                                    </Grid.Column>
                                                    <Grid.Column width={1}>
                                                    {(fieldKeys[pId][key] && fieldKeys[pId][key]['tip']) ? this.getHelpPopup(fieldKeys[pId][key]['tip']):null}

                                                    </Grid.Column>
                                                </Grid.Row>
                                                :null
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
})(SiteFourCreateFormAppInstDefault);
