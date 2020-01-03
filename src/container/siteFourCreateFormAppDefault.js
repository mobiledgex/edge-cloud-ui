import React, { Fragment } from "react";

import {Button, Form, Grid, Header, Item, Popup, Icon} from "semantic-ui-react";

import { Field, reduxForm, stopSubmit, change } from "redux-form";
import * as serviceMC from '../services/serviceMC';
import './styles.css';

let portNum = 0;

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
            {key:value, text:(value === 'tcp' || value === 'udp')? value.toUpperCase() : value, value:value}
        ))

    )

};

const makeOptionNumber =(options)=> (
    options.map((value,i) =>(
        {key:i, text:value, value:i}
    ))
)

const renderSelect = ({ input, label, options, placeholder, error, disabled}) => (
    <div>
        <Form.Select
            label={label}
            name={input.name}
            onChange={(e, { value }) => input.onChange(value)}
            options={makeOption(options)}
            placeholder={placeholder}
            value={input.value}
            disabled={disabled}
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
        rows={field.row}
        // placeholder={field.placeholder}
    />
);

const renderInput = ({ input, placeholder, label, type, error, disabled}) => (
    <div>
        <Form.Input
            {...input}
            type={type}
            label={label}
            // placeholder={placeholder}
            disabled={disabled}
        />
        {error && <span className="text-danger">{error}</span>}
    </div>

);
const renderInputNum = ({ input, placeholder, label, type, error, disabled}) => (
    <div>
        <Form.Input
            {...input}
            type={type}
            label={label}
            disabled={disabled}
            onChange={(e, { value }) => {
                let regexp = /[^0-9]/g
                if(!regexp.test(value)){
                    input.onChange(value)
                }

            }}
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
                const reg = /^[0-9a-zA-Z_][-0-9a-zA-Z_]*/;
                if(reg.test(value) || value === ''){
                    field.input.onChange(value)
                }
            }}
            disabled={field.disabled}
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
            deployAPK:false,
            deploymentType:false,
            title:'Settings',
            editToggle:false,
            editDsb:false,
            tah:4,
            submitButton:'Create'
        };

    }

    // data.map((dt) => {
    handleInitialize(data,edit) {
        let _data = data;
        let _portArr = [];
        let _statePort = [];
        if(edit && _data){
            (_data.DeploymentType === 'docker')?_data.DeploymentType = 'Docker':
                (_data.DeploymentType === 'kubernetes')?_data.DeploymentType = 'Kubernetes':
                    _data.DeploymentType = 'VM'
            this.onHandleChange('DeploymentType',_data.DeploymentType);
            if(_data.Ports && _data.Ports != '-'){
                _portArr = _data.Ports.split(',')
                _portArr.map((item,i) => {
                    _data['Ports_'+i] = item.split(':')[1];
                    _data['Portsselect_'+i] = (item.split(':')[0].toLowerCase() ==='tcp')?'TCP':'UDP';
                    _statePort.push({
                        num:i,
                        name:'single'
                    });
                    portNum++;
                })
                this.setState({portArray:_statePort});
            }
            Object.keys(_data).map((item) => {
                if(_data[item] === '-'){
                    _data[item] = '';
                }
            })
        }
        if(_data.length){

        } else {
            this.props.initialize(_data);
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
        if(this.props.getUserRole === 'AdminManager') {
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            serviceMC.sendRequest({token:store ? store.userToken : 'null', method:serviceMC.getEP().SHOW_ORG}, this.receiveResult)
        }
    }

    componentWillUnmount() {
        portNum = 0;
    }

    componentWillReceiveProps(nextProps) {
        console.log("editmode333",nextProps.data)
        if(nextProps.data.editMode && nextProps.data.editData && !this.state.editToggle){
            console.log("nextPropsnextPropsds",nextProps.data.editData)
            this.setState({editToggle:true, editDsb:true});
            this.handleInitialize(nextProps.data.editData,nextProps.data.editMode);
        }
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
        if(nextProps.data.editMode) this.setState({title:'Update Settings',submitButton:'Update'})

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
        let pn = {
            num:portNum,
            name:'single'
        }
        this.setState({portArray:this.state.portArray.concat(pn)})
        portNum++;
    }
    AddMultiPorts = (e) => {
        e.preventDefault();
        let pn = {
            num:portNum,
            name:'multi'
        }
        this.setState({portArray:this.state.portArray.concat(pn)})
        portNum++;
    }
    RemovePorts = (num,cnum) => {
        let arr = this.state.portArray;
        this.props.dispatch(change('createAppFormDefault', 'Ports_'+cnum, null));
        this.props.dispatch(change('createAppFormDefault', 'Portsselect_'+cnum, null));
        if(arr.length > 0) {
            arr.splice(num, 1)
        }
        this.setState({portArray:arr});
    }
    receiveResult = (mcRequest) => {
        let result = mcRequest.response;
        let arr = [];
        result.data.map((item,i) => {
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
            if(value === 'VM') {
                this.setState({deployAPK:true})
            } else {
                this.setState({deployAPK:false})
            }

            if(value === 'Kubernetes') {
                this.setState({deploymentType:false})
            } else {
                this.setState({deploymentType:true})
            }
        }
    }

    textUpload = (e) => {
        e.preventDefault();
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "*";
        input.onchange = (event) => {
            this.processFile(event.target.files[0]);
        };
        input.click();
    }

    processFile = (file) => {
        let reader = new FileReader();
        this.setState({tah:10});
        reader.onload = () => {
            this.props.dispatch(change('createAppFormDefault', 'DeploymentMF', reader.result));
        };

        reader.readAsText(file, /* optional */ "euc-kr");
    }

    textRemove = (e) => {
        e.preventDefault();
        this.props.dispatch(change('createAppFormDefault', 'DeploymentMF', ''));
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
                                                (!this.state.deploymentType || key !== 'ScaleWithCluster')?
                                                    <Grid.Row columns={3} key={i} className={'createApp'+i}>

                                                        <Grid.Column width={4} className='detail_item'>
                                                            <div>{this.getLabel(key, pId)}{this.getNecessary(key, pId)}</div>
                                                        </Grid.Column>
                                                        <Grid.Column width={11}>
                                                            {

                                                                (fieldKeys[pId][key]['type'] === 'RenderTextArea') ?
                                                                    <div>
                                                                        <Field
                                                                            component={renderTextArea}
                                                                            placeholder={data[key]}
                                                                            value={data[key]}
                                                                            name={key}
                                                                            row={(fieldKeys[pId][key]['label'] === 'Deployment Manifest') ?this.state.tah:4}
                                                                        />
                                                                        {
                                                                            (fieldKeys[pId][key]['label'] === 'Deployment Manifest') ?
                                                                                <div style={{marginTop:'1em'}}>
                                                                        <span style={{marginRight:'1em'}}>
                                                                            <Button positive onClick={this.textUpload}>Select Manifest</Button>
                                                                        </span>
                                                                                    <Button onClick={this.textRemove}>Clear Manifest</Button>
                                                                                </div>
                                                                                :null
                                                                        }
                                                                    </div>
                                                                    :
                                                                    (fieldKeys[pId][key]['type'] === 'RenderSelect') ?
                                                                        <Field
                                                                            component={renderSelect}
                                                                            placeholder={'Select '+fieldKeys[pId][key]['label']}
                                                                            value={data[key]}
                                                                            options={fieldKeys[pId][key]['items']}
                                                                            name={key}
                                                                            onChange={(e)=>this.onHandleChange(key,e)}
                                                                            disabled={(this.state.editDsb)?fieldKeys[pId][key].editDisabled:false}
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
                                                                                        disabled={(this.state.editDsb)?fieldKeys[pId][key].editDisabled:false}
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
                                                                                                            disabled={(this.state.editDsb)?fieldKeys[pId][key].editDisabled:false}
                                                                                                            error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                                                                        :
                                                                                                        <Field
                                                                                                            disabled={(this.state.editDsb)?fieldKeys[pId][key].editDisabled:false}
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
                                                                                                                    (item.name == 'multi')?
                                                                                                                        <Grid.Row key={i} columns={3} style={{paddingBottom:'0px'}}>
                                                                                                                            <Grid.Column width={5}>
                                                                                                                                <Field
                                                                                                                                    component={renderInputNum}
                                                                                                                                    type="input"
                                                                                                                                    name={'multiF_'+item.num}
                                                                                                                                    value={data[key]}
                                                                                                                                    error={(this.props.validError.indexOf(key+'_'+i) !== -1)?'Required':''}
                                                                                                                                />
                                                                                                                            </Grid.Column>
                                                                                                                            <Grid.Column width={1}>
                                                                                                                                <center style={{lineHeight:'35px',fontSize:'18px'}}>~</center>
                                                                                                                            </Grid.Column>
                                                                                                                            <Grid.Column width={5}>
                                                                                                                                <Field
                                                                                                                                    component={renderInputNum}
                                                                                                                                    type="input"
                                                                                                                                    name={'multiS_'+item.num}
                                                                                                                                    value={data[key]}
                                                                                                                                    error={(this.props.validError.indexOf(key+'_'+i) !== -1)?'Required':''}
                                                                                                                                />
                                                                                                                            </Grid.Column>
                                                                                                                            <Grid.Column width={4} style={{padding:0}}>
                                                                                                                                <Field
                                                                                                                                    component={renderSelect}
                                                                                                                                    placeholder={'Select port'}
                                                                                                                                    value={data[key]}
                                                                                                                                    options={['TCP','UDP']}
                                                                                                                                    name={key+'select_'+item.num}
                                                                                                                                    error={(this.props.validError.indexOf(key+'select_'+i) !== -1)?'Required':''}
                                                                                                                                />
                                                                                                                            </Grid.Column>
                                                                                                                            <Grid.Column width={1}>
                                                                                                                                <div className='removePorts' onClick={() => this.RemovePorts(i,item.num)}><i className="material-icons">clear</i></div>
                                                                                                                            </Grid.Column>
                                                                                                                        </Grid.Row>
                                                                                                                        :
                                                                                                                        <Grid.Row key={i} columns={3} style={{paddingBottom:'0px'}}>
                                                                                                                            <Grid.Column width={11}>
                                                                                                                                <Field
                                                                                                                                    component={renderInputNum}
                                                                                                                                    type="input"
                                                                                                                                    name={key+'_'+item.num}
                                                                                                                                    value={data[key]}
                                                                                                                                    error={(this.props.validError.indexOf(key+'_'+i) !== -1)?'Required':''}
                                                                                                                                />
                                                                                                                            </Grid.Column>
                                                                                                                            <Grid.Column width={4} style={{padding:0}}>
                                                                                                                                <Field
                                                                                                                                    component={renderSelect}
                                                                                                                                    placeholder={'Select port'}
                                                                                                                                    value={data[key]}
                                                                                                                                    options={['TCP','UDP']}
                                                                                                                                    name={key+'select_'+item.num}
                                                                                                                                    error={(this.props.validError.indexOf(key+'select_'+i) !== -1)?'Required':''}
                                                                                                                                />
                                                                                                                            </Grid.Column>
                                                                                                                            <Grid.Column width={1}>
                                                                                                                                <div className='removePorts' onClick={() => this.RemovePorts(i,item.num)}><i className="material-icons">clear</i></div>
                                                                                                                            </Grid.Column>
                                                                                                                        </Grid.Row>
                                                                                                                ))
                                                                                                            }
                                                                                                            <Grid.Row>
                                                                                                                <Grid.Column>
                                                                        <span style={{marginRight:'1em'}}>
                                                                            <Button positive onClick={this.AddPorts}>Add Port Mapping</Button>
                                                                        </span>
                                                                                                                    <Button positive onClick={this.AddMultiPorts}>Add MultiPort Mapping</Button>
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
                                                                                                                disabled={(this.state.editDsb)?fieldKeys[pId][key].editDisabled:false}
                                                                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                                                                            :
                                                                                                            <Field
                                                                                                                component={renderInput}
                                                                                                                type="input"
                                                                                                                name={key}
                                                                                                                value={data[key]}
                                                                                                                disabled={(this.state.editDsb)?fieldKeys[pId][key].editDisabled:false}
                                                                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}
                                                                                                            />
                                                            }
                                                        </Grid.Column>
                                                        <Grid.Column width={1}>
                                                            {(fieldKeys[pId][key] && fieldKeys[pId][key]['tip']) ? this.getHelpPopup(fieldKeys[pId][key]['tip']):null}
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    : null
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
                                    content={this.state.submitButton}
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
})(SiteFourCreateFormAppDefault);
