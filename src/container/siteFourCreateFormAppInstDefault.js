import React, { Fragment } from "react";

import {Button, Form, Table, List, Grid, Card, Header, Divider, Tab, Item, Popup, Icon, Input, Dropdown} from "semantic-ui-react";

import { Field, reduxForm, initialize, reset, stopSubmit, change } from "redux-form";
import MaterialIcon from "material-icons-react";
import * as serviceMC from '../services/serviceMC';
import './styles.css';

const makeOption =(options)=> {

    let newOptions = options.sort(

        function(a, b) {
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
            return 0;
        }
    );

    return (

        newOptions.map((value) => (
            {key: value, text: value, value: value}
        ))

    )

};

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
            {...field.input}
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

const renderInput = ({ input, placeholder, label, type, error, disabled }) => (
    <div>
        <Form.Input
            {...input}
            type={type}
            label={label}
            placeholder={placeholder}
            disabled = {disabled}
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
            ClusterDisable:false,
            title:'Settings',
            editToggle:false,
            editDsb:false
        };

    }

    // data.map((dt) => {
    handleInitialize(data) {
        const initData = [];
        if(data.Cloudlet) data.Cloudlet = [data.Cloudlet];
        if(data.OrganizationName) data.DeveloperName = data.OrganizationName;
        if(data.ClusterInst) data.ClusterInst = [data.ClusterInst];
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
            serviceMC.sendRequest({token:store.userToken, method:serviceMC.SHOW_ORG}, this.receiveResult)
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

        if(nextProps.data.editMode && nextProps.data.editData && !this.state.editToggle){
            this.setState({editToggle:true, editDsb:true});
            this.handleInitialize(nextProps.data.editData,nextProps.data.editMode);
        }
        
        if(nextProps.data.editMode) this.setState({title:'Update Settings'})
        
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
        this.props.onSubmit();
    }

    handleRegionChange = (e) => {
        this.props.getOptionData(e)
    }


    receiveResult = (mcRequest) => {
        let result = mcRequest.data;
        let arr = [];
        result.map((item,i) => {
            arr.push(item.Organization);
        })
        this.setState({orgArr:arr});
    }

    cancelClick = (e) => {
        e.preventDefault();
        this.props.gotoUrl()
    }

    onHandleToggleChange = (e) => {
        this.setState({ClusterDisable:e})
    }

    onHandleChange = (key) => {
        if(key === 'Region'){
            // this.props.dispatch(change('createAppFormDefault', 'Cloudlet', null));
            // this.props.dispatch(change('createAppFormDefault', 'ClusterInst', null));
            this.handleInitialize(this.props.data.data[0]);
        }
        
    }
    
    render (){
        const { handleSubmit, reset, dimmer, selected, open, close, option, value, change, org, type, pId, getUserRole } = this.props;
        const { data, regKeys, fieldKeys, title } = this.state;
        let cType = (type)?type.substring(0,1).toUpperCase() + type.substring(1):'';
        return (

            <Item className='content create-org' style={{margin:'0 auto', maxWidth:1200}}>
                <Header style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>{title}</Header>
                <Fragment >
                    <Form onSubmit={() => this.onHandleSubmit()} className={"fieldForm"} >
                        <Form.Group widths="equal" style={{flexDirection:'column', marginLeft:10, marginRight:10, alignContent:'space-around'}}>
                            <Grid columns={2}>
                                {
                                    (regKeys && regKeys.length > 0) ?
                                        regKeys.map((key, i) => (

                                            (this.getLabel(key, pId))?
                                                (!this.props.autoClusterDisable || (key !== 'AutoClusterInst' && key !== 'ClusterInst'))?
                                                <Grid.Row columns={3} key={i} className={'createAppInst'+i}>

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
                                                                onChange={()=>this.onHandleChange(key)}
                                                                disabled={(fieldKeys[pId][key]['label'] == 'Region' && fieldKeys[pId][key]['disable'] == false)?true:false}
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
                                                                disabled={(fieldKeys[pId][key]['disable'] == false)?true:false}
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
                                    className='createAppInst8'
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
    // validate
    // enableReinitialize: true
})(SiteFourCreateFormAppInstDefault);
