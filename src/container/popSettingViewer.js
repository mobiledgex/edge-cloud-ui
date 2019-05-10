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
            opened:false,
            dimmer:'',
            listOfDetail:null,
            regKeys:[],
            defaultUrl:'https://mc.mobiledgex.net:9900'
        }
        _self = this;
    }


    handleInitialize() {

        const initData = {
            "userURL": this.state.defaultUrl,
        };

        this.props.initialize(initData);
    }
    onHandleSubmit =(a,b)=> {
        console.log('+++++++++on handle submit popSettingViewer+++++', _self.props.userURL, a, b)
        _self.props.handleSubmit();
        setTimeout(() => {
            _self.props.dispatch(initialize('registUserSetting', {
                submitSucceeded: false
            }))
            _self.handleInitialize();
        },1000);

    }
    close() {
        this.setState({open:false})
    }

    componentDidMount() {
        this.handleInitialize();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('regist new item -- ', nextProps, nextProps.usrUrl)
        // if(nextProps.open) {
        //     this.setState({open:nextProps.open, dimmer:nextProps.dimmer});
        //     if(nextProps.data){
        //         this.setState({regKeys:Object.keys(nextProps.data)})
        //     }
        //     this.forceUpdate()
        // }

        if(nextProps.data){
            this.setState({regKeys:Object.keys(nextProps.data), defaultUrl:nextProps.usrUrl})
        }

    }


    makeForm = (regKeys) => (
        <Form onSubmit={this.onHandleSubmit} className={"fieldForm"}>
            <Form.Group>
                <Grid style={{width:'100%'}}>
                {
                    regKeys.map((key, i) => (
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
                }
                </Grid>
            </Form.Group>
            <Form.Group>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Button onClick={() => this.close()}>
                                Cancel
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button
                                primary
                                positive
                                icon='checkmark'
                                labelPosition='right'
                                content="Save"
                                type="submit"
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form.Group>
        </Form>
    )


    render() {
        const { handleSubmit, reset, dimmer } = this.props;
        return (

            <Modal size={'small'} open={this.props.open} dimmer={false}>
                <Modal.Header>Settings</Modal.Header>
                <Modal.Content>

                        {
                            this.makeForm(this.state.regKeys)
                        }

                </Modal.Content>
            </Modal>

        )
    }
}


export default reduxForm({
    form: "registUserSetting",
    enableReinitialize: false
})(PopSettingViewer);

