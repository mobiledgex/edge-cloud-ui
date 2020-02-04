import React, { Fragment } from "react";
import {Button, Form, Grid, Header, Item, Popup, Icon, Input, Checkbox} from "semantic-ui-react";
import { Field, reduxForm, stopSubmit } from "redux-form";
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

const renderInputNum = ({ input, unit, label, placeholder, type, error }) => (
    <div>
        <Form.Field
            {...input}
            type={type}
        >
            <label>{label}</label>
            {(unit)?
            <Input fluid
                   type="number"
                   onChange={(e) => maxlength(e)}
                   label={{ basic: true, content: unit}}
                   labelPosition='right'></Input>
            :
            <Input fluid type="number" onChange={(e) => maxlength(e)}></Input>}
        </Form.Field>
        {error && <span className="text-danger">{error}</span>}
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

const maxlength = (e) => {
    if(e.target.value > 99999){
        e.target.value = e.target.value.slice(0, 5);
    } else if(e.target.value <= 0){
        e.target.value = ''
    }
}

const style = {
    borderRadius: 0,
    opacity: 0.7,
    padding:'2em'
}

class SiteFourCreateFormFlavorDefault extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data:null,
            regKey:null,
            fieldKeys:null,
            dataInit:false,
            gpu:false
        };
    }

    handleInitialize(data) {
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
        
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data && nextProps.data.data.length){
            let keys = Object.keys(nextProps.data.data[0])
            this.setState({data:nextProps.data.data[0], regKeys:keys, fieldKeys:nextProps.data.keys, pId:nextProps.pId})
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
        this.props.onSubmit();
    }

    cancelClick = (e) => {
        e.preventDefault();
        this.props.gotoUrl()
    }

    onHandleToggleChange = (e)=>{

    }

    onHandleChange = (key) => {
        if(key === 'Region'){
            this.handleInitialize(this.props.data.data[0]);
        } 
    }
    
    render (){
        const {type, pId} = this.props;
        const { data, regKeys, fieldKeys } = this.state;
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
                                                <Grid.Row columns={3} key={i} className={'createFlavorForm'+i}>

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
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                            :

                                                            (fieldKeys[pId][key]['type'] === 'renderInputNum') ?
                                                            <Field
                                                                component={renderInputNum}
                                                                value={data[key]}
                                                                name={key}
                                                                unit={fieldKeys[pId][key]['unit']}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                            :

                                                            (fieldKeys[pId][key]['type'] === 'renderCheckbox') ?
                                                            <Field
                                                                component={renderCheckbox}
                                                                value={data[key]}
                                                                name={key}
                                                                onChange={(e)=>this.onHandleToggleChange(e)}
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
                                                </Grid.Row>
                                            : null
                                        ))
                                        : ''
                                }
                            </Grid>
                        </Form.Group>
                        <Form.Group className={"submitButtonGroup orgButton"} id={"submitButtonGroup"} inline style={{flexDirection:'row', marginLeft:10, marginRight:10}}>
                            <Form.Group inline>
                                <span style={{marginRight:'1em'}}>
                                    <Button onClick={this.cancelClick}>
                                        Cancel
                                    </Button>
                                </span>
                                <Button
                                    className='saveButton'
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
    form: "createAppFormDefault"
})(SiteFourCreateFormFlavorDefault);
