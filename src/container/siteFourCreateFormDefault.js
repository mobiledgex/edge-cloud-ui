import React, { Fragment } from "react";

import {Button, Form, Table, List, Grid, Card, Header, Divider, Tab, Item, Popup, Icon} from "semantic-ui-react";

import { Field, reduxForm, initialize, reset } from "redux-form";
import MaterialIcon from "material-icons-react";
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

const renderCheckbox = field => (
    <Form.Checkbox
        checked={!!field.input.value}
        name={field.input.name}
        label={field.label}
        onChange={(e, { checked }) => field.input.onChange(checked)}
    />
);

const renderRadio = field => (
    <Form.Radio
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

const renderTextArea = field => (
    <Form.TextArea
        {...field.input}
        label={field.label}
        placeholder={field.placeholder}
    />
);
const renderInput = field => (
    <Form.Input
        {...field.input}
        type={field.type}
        label={field.label}
        placeholder={field.placeholder}
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
            dataInit:false
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
        console.log('key - ', key, 'pid -', pId, 'value-', this.state.fieldKeys[pId])
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
    onHandleSubmit(a,b) {
        console.log('a, b', a, b)
        this.props.handleSubmit();
        setTimeout(() => this.props.dispatch(reset('createAppFormDefault')),1000);
    }

    
    render (){
        const { handleSubmit, reset, dimmer, selected, open, close, option, value, change, org, type, pId } = this.props;
        const { data, regKeys, fieldKeys } = this.state;
        let cType = (type)?type.substring(0,1).toUpperCase() + type.substring(1):'';
        return (

            <Item className='content create-org' style={{margin:'0 auto', maxWidth:1200}}>
                <Header style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>App Settings</Header>
                <Fragment >
                    <Form onSubmit={(a,b) => this.onHandleSubmit(a,b)} className={"fieldForm"} >
                        <Form.Group widths="equal" style={{flexDirection:'column', marginLeft:10, marginRight:10, alignContent:'space-around'}}>
                            <Grid columns={2}>
                                {
                                    (regKeys && regKeys.length) ?
                                        regKeys.map((key, i) => (

                                            (this.getLabel(key, pId))?
                                            <Grid.Row columns={3}>

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
                                                            placeholder={data[key]}
                                                            value={data[key]}
                                                            options={fieldKeys[pId][key]['items']}
                                                            name={key}
                                                            onChange={()=>console.log('onChange text..')}/>
                                                        :
                                                        (fieldKeys[pId][key]['type'] === 'RenderCheckbox') ?
                                                        <Field
                                                            component={renderCheckbox}
                                                            value={data[key]}
                                                            name={key}
                                                            />
                                                        :
                                                        <Field
                                                            component={renderInput}
                                                            type="input"
                                                            name={key}
                                                            value={data[key]}
                                                            placeholder={(dimmer === 'blurring') ? data[key] : data[key]}/>
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
