import React, { Fragment } from "react";
import {
    Button,
    Form,
    Item,
    Message,
    Divider,
    Modal,
    List,
    Grid,
    Card,
    Dropdown,
    Input,
    TextArea,
    Popup, Icon
} from "semantic-ui-react";
import { Field, reduxForm, initialize, reset } from "redux-form";

import MaterialIcon from "../sites/siteFour_page_createOrga";
import './styles.css';
import '../css/index.css';

const validate = values => {
    const errors = {}
    if (!values.FlavorName) {
        errors.FlavorName = 'Required'
    }
    if (!values.RAM) {
        errors.RAM = 'Required'
    } 
    if (!values.vCPUs) {
        errors.vCPUs = 'Required'
    } 
    if (!values.Disk) {
        errors.Disk = 'Required'
    } 
    return errors
}

const renderSelect = ({ input, options, placeholder, value, type, error }) => (
    <div>
        <Form.Select
            name={input.name}
            onChange={(e, { value }) => input.onChange(value)}
            //onChange={field.input.onChange(field.value)}
            options={options}
            placeholder={placeholder}
            value={value}
            fluid
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

const renderInput = ({ input, placeholder, type, error }) => (
    <div>
         <Form.Input
            {...input}
            type={type}
            placeholder={placeholder}
            fluid
        />
        {error && <span className="text-danger">{error}</span>}
    </div>
   
);

const renderTextArea = field => (
    <Form>
        <TextArea
            rows={3}
            {...field.input}
            label={field.label}
            placeholder={field.placeholder} />
    </Form>
);

const maxlength = (e) => {
    if(e.target.value > 99999){
        e.target.value = e.target.value.slice(0, 5);
    } else if(e.target.value <= 0){
        e.target.value = ''
    }
}


class registNewListInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            typeValue:'',
            regionStatic:[
                {key: 1, value: "US", text: "US"},
                {key: 2, value: "EU", text: "EU"}
            ]
        };

    }

    handleInitialize() {
        const initData = {
            "FlavorName": ""
        };
        this.props.initialize(initData);
    }

    componentDidMount() {
        this.handleInitialize();
    }

    componentWillReceiveProps(nextProps) {

    }

    getHelpPopup =(key)=> (
        <Popup
            trigger={<Icon name='question circle outline' size='large' style={{lineHeight:'unset', margin:'10px 0'}}/>}
            content=
                {(key=='FlavorName')? 'Name of the flavor'
                    :(key=='RAM')? 'RAM in megabytes'
                        :(key=='vCPUs')? 'Number of virtual CPUs'
                            :(key=='Disk')? 'Amount of disk space in gigabytes'
                                : key
                }
            // content={this.state.tip}
            // style={style}
            inverted
        />
    )

    handleClose = () => {
        this.props.close()
        this.props.dispatch(reset('registNewListInput'));
    }


    render() {
        const {handleSubmit, data, dimmer, selected, regKeys, open, close, option, value, change} = this.props;


        return (
            <Fragment>
                <Form onSubmit={handleSubmit} className={"fieldForm"}>
                    <Form.Group>
                        <Modal style={{width:800}} open={open} onClose={this.handleClose}>
                            <Modal.Header>Settings</Modal.Header>
                            <Modal.Content>
                                <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                                    <Grid divided style={{width:800}}>
                                    {
                                        (data.length > 0 && regKeys)?
                                        regKeys.map((key, i)=>(
                                            <Grid.Row key={i} columns={3}>
                                                <Grid.Column width={5} className='detail_item'>
                                                    <div>{(key == 'Region')?'Region *':(key === 'FlavorName')?'Flavor Name *':(key == 'RAM')?'RAM Size *':(key == 'vCPUs')?'Number of vCPUs *':(key == 'Disk')?'Disk Space *':key}</div>
                                                </Grid.Column>
                                                <Grid.Column width={10}>
                                                {
                                                    (key === 'MasterFlavor')?
                                                    <Field component={renderSelect} placeholder='Select MasterFlavor' name='MasterFlavor' options={option[0]} value={value[0]} />
                                                    : (key === 'NodeFlavor')?
                                                    <Field component={renderSelect} placeholder='Select NodeFlavor' name='NodeFlavor' options={option[0]} value={value[0]} />
                                                    : (key === 'Region')?
                                                    <Field component={renderSelect} placeholder='Select Region' name='Region' options={this.state.regionStatic} error={(this.props.validError.indexOf(key) !== -1)?'Required':''} />
                                                    : (key === 'RAM')?
                                                    <Field component={renderInputNum} name='RAM' unit="MB" options={this.state.regionStatic} error={(this.props.validError.indexOf(key) !== -1)?'Required':''} />
                                                    : (key === 'vCPUs')?
                                                    <Field component={renderInputNum} name='vCPUs' options={this.state.regionStatic} error={(this.props.validError.indexOf(key) !== -1)?'Required':''} />
                                                    : (key === 'Disk' )?
                                                    <Field component={renderInputNum} name='Disk'  unit="GB" options={this.state.regionStatic} error={(this.props.validError.indexOf(key) !== -1)?'Required':''} />
                                                    :
                                                    <Field component={renderInput} type="input" name={key} placeholder={(dimmer === 'blurring')? '' : selected[key] } error={(this.props.validError.indexOf(key) !== -1)?'Required':''} />
                                                }
                                                </Grid.Column>
                                                <Grid.Column width={1}>
                                                    {this.getHelpPopup(key)}
                                                </Grid.Column>
                                                <Divider vertical></Divider>
                                            </Grid.Row>
                                        ))
                                        :null
                                    }
                                    </Grid>
                                </div>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={this.handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    positive
                                    icon='checkmark'
                                    labelPosition='right'
                                    content="Save"
                                    type="submit"
                                />
                            </Modal.Actions>
                        </Modal>
                    </Form.Group>
                </Form>
            </Fragment>
        );
    }
};

export default reduxForm({
    form: "registNewListInput",
    validate
})(registNewListInput);
