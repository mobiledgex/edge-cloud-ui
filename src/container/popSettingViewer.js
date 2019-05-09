import React, {Fragment} from 'react';
import {Button, Divider, Modal, Grid, Form, TextArea} from "semantic-ui-react";
import {Field, reduxForm, initialize, change, reset} from "redux-form";


const renderInput = field => (
    <div>
        <Form.Input
            {...field.input}
            type={field.type}
            placeholder={field.placeholder}
            disabled={field.disabled}
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


let _self = null;
class PopSettingViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            open:false,
            dimmer:'',
            listOfDetail:null,
            regKeys:[]
        }
        _self = this;
    }


    handleInitialize() {

        const initData = {
            "userURL": "https://mc.mobiledgex.net:9900",
        };

        this.props.initialize(initData);
    }
    onHandleSubmit = (a,b,c) => {
        alert(a,b,c)
        console.log('+++++++++on handle submit popSettingViewer+++++', a,b,c)
        _self.props.handleSubmit();
        setTimeout(() => {
            _self.props.dispatch(reset('registUserSetting'));
            _self.props.dispatch(initialize('registUserSetting', {
                submitSucceeded: false,
            }))
        },1000);

    }

    componentDidMount() {
        this.handleInitialize();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('regist new item -- ', nextProps)
        if(nextProps.open) {
            this.setState({open:nextProps.open, dimmer:nextProps.dimmer});
            if(nextProps.data){
                this.setState({regKeys:Object.keys(nextProps.data)})
            }
        }

    }


    close() {

        this.setState({ open: false })
        this.props.close(false)

    }

    makeForm = (regKeys) => (

        regKeys.map((key, i)=>(
            <Grid.Row columns={2}>
                <Grid.Column width={5} className='detail_item'>
                    <div>{key}</div>
                </Grid.Column>
                <Grid.Column width={11}>

                        <Field
                            component={renderInput}
                            type="input"
                            name="userURL"
                            value={"https://mc.mobiledgex.net:9900"}
                        />

                </Grid.Column>
                <Divider vertical></Divider>
            </Grid.Row>
        ))
    )


    render() {
        const { handleSubmit, dimmer } = this.props;
        return (
            <Fragment>
            <Form onSubmit={_self.onHandleSubmit} className={"fieldForm"}>
                <Form.Group>
                    <Modal size={'small'} open={this.state.open} dimmer={false}>
                        <Modal.Header>Settings</Modal.Header>
                        <Modal.Content>
                            <Grid divided>

                                {
                                    this.makeForm(this.state.regKeys)
                                }

                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>

                                <Button onClick={() => this.close()}>
                                    Cancel
                                </Button>
                                <Button
                                    primary
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
        )
    }
}


export default reduxForm({
    form: "registUserSetting",
    enableReinitialize: true
})(PopSettingViewer);

