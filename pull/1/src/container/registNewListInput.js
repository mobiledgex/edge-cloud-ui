import React, { Fragment } from "react";
import {Button, Form, Item, Message, Divider, Modal, List, Grid, Card, Dropdown, Input, TextArea} from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import MaterialIcon from "../sites/siteFour_page_createOrga";
import './styles.css';
import '../css/index.css';

const renderSelect = field => (
    <Form.Select
        name={field.input.name}
        //onChange={(e, { field }) => field.input.onChange(field.value)}
        //onChange={field.input.onChange(field.value)}
        options={field.options}
        placeholder={field.placeholder}
        value={field.value}
        fluid
    />
);

const renderInput = field => (
    <div>
         <Form.Input
            {...field.input}
            type={field.type}
            placeholder={field.placeholder}
            fluid
        />
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

const registNewListInput = (props) => {
    const { handleSubmit, data, dimmer, selected, regKeys,open, close, option, value, change } = props;

    
    return (
        <Fragment>
            <Form onSubmit={handleSubmit} className={"fieldForm"}>
                <Form.Group>
                    <Modal size={"small"} open={open} onClose={close}>
                        <Modal.Header>Settings</Modal.Header>
                        <Modal.Content>
                            <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                                <Grid divided style={{width:800}}>
                                {
                                    (data.length > 0)?
                                    regKeys.map((key, i)=>(
                                        <Grid.Row columns={2}>
                                            <Grid.Column width={5} className='detail_item'>
                                                <div>{key}</div>
                                            </Grid.Column>
                                            <Grid.Column width={11}>
                                            {
                                                (key === 'Operator')?
                                                <Field component={renderSelect} placeholder='Select Operator' name='Operator' options={option[0]} value={value[0]} onChange={change[0]}/>
                                                : (key === 'DeveloperName1')?
                                                <Field component={renderSelect} placeholder='Select Developer' name='Developer' options={option[1]} value={value[1]} onChange={change[1]}/>
                                                : (key === 'CloudletName')?
                                                <Field component={renderSelect} placeholder='Select Cloudlet' name='Cloudlet' options={option[2]} value={value[2]} onChange={change[2]}/>
                                                : (key === 'AppNameSelect')?
                                                <Field component={renderSelect} placeholder='Select AppName' name='AppName' options={option[3]} value={value[3]} onChange={change[3]}/>
                                                : (key === 'Version')?
                                                <Field component={renderSelect} placeholder='Select Version' name='Version' options={option[4]} value={value[4]} onChange={change[4]}/>
                                                : (key === 'ClusterInst')?
                                                <Field component={renderSelect} placeholder='Select ClusterInst' name='ClusterInst' options={option[5]} value={value[5]} onChange={change[5]}/>
                                                : (key === 'Type')?
                                                <Field component={renderSelect} placeholder='Select Type' name='Type' options={option[6]} value={value[6]} onChange={change[6]}/>
                                                : (key === 'Role')?
                                                <Field component={renderSelect} placeholder='Select Role' name='Role' options={option[7]} value={value[7]} onChange={change[7]}/>
                                                : (key === 'DeploymentMF')?
                                                <Field component={renderTextArea} placeholder={data[0][key]} value={data[0][key]} name='DeploymentMF' options={option[8]} value={value[8]} onChange={change[8]}/>
                                                :
                                                <Field component={renderInput} type="input" name={key} placeholder={(dimmer === 'blurring')? data[0][key] : (selected[key])?selected[key]:data[0][key] } />
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
                                positive
                                icon='checkmark'
                                labelPosition='right'
                                content="Save"
                                //type="submit"
                                onClick={handleSubmit}
                            />
                        </Modal.Actions>
                    </Modal>
                </Form.Group>
            </Form>
        </Fragment>
        
            
    );
};

export default reduxForm({
    form: "registNewListInput"
})(registNewListInput);
