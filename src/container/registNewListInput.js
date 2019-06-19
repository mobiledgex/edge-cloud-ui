import React, { Fragment } from "react";
import {Button, Form, Item, Message, Divider, Modal, List, Grid, Card, Dropdown, Input, TextArea} from "semantic-ui-react";
import { Field, reduxForm, initialize } from "redux-form";

import MaterialIcon from "../sites/siteFour_page_createOrga";
import './styles.css';
import '../css/index.css';

const validate = values => {
    console.log("validation@@",values)
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

const renderSelect = field => (
    <Form.Select
        name={field.input.name}
        onChange={(e, { value }) => field.input.onChange(value)}
        //onChange={field.input.onChange(field.value)}
        options={field.options}
        placeholder={field.placeholder}
        value={field.value}
        fluid
    />
);

const renderInputNum = field => (
    <Form.Field
        {...field.input}
        type={field.type}
    >
        <label>{field.label}</label>
        {(field.unit)?
        <Input fluid
               type="number"
               label={{ basic: true, content: field.unit}}
               labelPosition='right'></Input>
        :
        <Input fluid type="number"></Input>}
    </Form.Field>
);

const renderInput = ({ input, placeholder, type, meta: { touched, error, warning } }) => (
    <div>
         <Form.Input
            {...input}
            type={type}
            placeholder={placeholder}
            fluid
        />
        {touched && ((error && <span className="text-danger">{error}</span>) || (warning && <span>{warning}</span>))}
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

    handleInitialize(initData) {


        this.props.initialize(initData);
    }

    componentDidMount() {
        //this.handleInitialize(this.props.data);
    }

    componentWillReceiveProps(nextProps) {
        console.log("regsit new input Props",nextProps)

    }

    render() {
        const {handleSubmit, data, dimmer, selected, regKeys, open, close, option, value, change} = this.props;


        return (
            <Fragment>
                <Form onSubmit={handleSubmit} className={"fieldForm"}>
                    <Form.Group>
                        <Modal style={{width:800}} open={open} onClose={close}>
                            <Modal.Header>Settings</Modal.Header>
                            <Modal.Content>
                                <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                                    <Grid divided style={{width:800}}>
                                    {
                                        (data.length > 0)?
                                        regKeys.map((key, i)=>(
                                            <Grid.Row key={i} columns={2}>
                                                <Grid.Column width={5} className='detail_item'>
                                                    <div>{(key === 'FlavorName')?'Flavor Name':(key == 'RAM')?'RAM Size':(key == 'vCPUs')?'Number of vCPUs':(key == 'Disk')?'Disk Space':key}</div>
                                                </Grid.Column>
                                                <Grid.Column width={11}>
                                                {
                                                    (key === 'MasterFlavor')?
                                                    <Field component={renderSelect} placeholder='Select MasterFlavor' name='MasterFlavor' options={option[0]} value={value[0]} />
                                                    : (key === 'NodeFlavor')?
                                                    <Field component={renderSelect} placeholder='Select NodeFlavor' name='NodeFlavor' options={option[0]} value={value[0]} />
                                                    : (key === 'Region')?
                                                    <Field component={renderSelect} placeholder='Select Region' name='Region' options={this.state.regionStatic} />
                                                    : (key === 'RAM')?
                                                    <Field component={renderInputNum} name='RAM' unit="MB" options={this.state.regionStatic} />
                                                    : (key === 'vCPUs')?
                                                    <Field component={renderInputNum} name='vCPUs' options={this.state.regionStatic} />
                                                    : (key === 'Disk' )?
                                                    <Field component={renderInputNum} name='Disk'  unit="GB" options={this.state.regionStatic} />
                                                    :
                                                    <Field component={renderInput} type="input" name={key} placeholder={(dimmer === 'blurring')? '' : selected[key] } />
                                                }
                                                </Grid.Column>
                                                <Divider vertical></Divider>
                                            </Grid.Row>
                                        ))
                                        :''
                                    }
                                    </Grid>
                                </div>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={close}>
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
