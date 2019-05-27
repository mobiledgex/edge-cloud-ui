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
const hostname = window.location.hostname;
class PopSettingViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            open:false,
            opened:false,
            dimmer:'',
            listOfDetail:null,
            regKeys:[],
            defaultUrl:this.getDomain()
        }
        _self = this;
    }
    getDomain() {
        if (hostname.indexOf('stage') > 0) {
            return 'https://mc-stage.mobiledgex.com:9900'
        } else if (hostname.indexOf('dev') > 0) {
            return 'https://mc-dev.mobiledgex.com:9900'
        } else if (hostname === 'localhost' ){
            return 'https://mc-stage.mobiledgex.com:9900'
            }
        else {
            return 'https://mc.mobiledgex.com:9900'
        }

    }


    handleInitialize() {

        const initData = {
            "userURL": this.state.defaultUrl,
        };

        this.props.initialize(initData);
    }
    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }
    onHandleSubmit =(a,b)=> {

        console.log('+++++++++on handle submit popSettingViewer+++++', _self.props.userURL, a, b)
        localStorage.setItem('domainData', JSON.stringify({"mcDomain":_self.props.userURL}));
        _self.props.handleSubmit();
        setTimeout(() => {
            _self.props.dispatch(initialize('registUserSetting', {
                submitSucceeded: false
            }))
            //_self.handleInitialize();
        },1000);

    }
    close() {
        this.setState({open:false})
    }

    componentDidMount() {
        //this.handleInitialize();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('regist new item -- ', nextProps)
        // if(nextProps.open) {
        //     this.setState({open:nextProps.open, dimmer:nextProps.dimmer});
        //     if(nextProps.data){
        //         this.setState({regKeys:Object.keys(nextProps.data)})
        //     }
        //     this.forceUpdate()
        // }

        if(nextProps.data){
            this.setState({regKeys:Object.keys(nextProps.data), open:nextProps.open})
        }

    }


    makeForm = (regKeys) => (
            <Form.Group  style={{margin:0, width: '100%'}}>
                <Grid style={{width:'100%', margin:'-1rem 0 -1rem 0'}}>
                {
                    regKeys.map((key, i) => (
                        <Grid.Row columns={2} key={i}>
                            <Grid.Column width={5} className='detail_item'>
                                <div>{key}</div>
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <Field
                                    component={renderInput}
                                    type="input"
                                    name="userURL"
                                    value={_self.getDomain()}
                                    onChange={this.handleChange}
                                />
                            </Grid.Column>
                            <Divider vertical></Divider>
                        </Grid.Row>
                    ))
                }
                </Grid>
            </Form.Group>
    )

    makebutton = (regKeys) => (
            <Form.Group>
                <Button onClick={() => this.close()}>
                    Cancel
                </Button>
                <Button
                    primary
                    positive
                    icon='checkmark'
                    labelPosition='right'
                    content="Save"
                    type="submit"
                />
            </Form.Group>
    )


    render() {
        const { handleSubmit, reset, dimmer } = this.props;
        return (

            <Modal size={'small'} open={this.state.open} dimmer={false}>
                <Modal.Header>Settings</Modal.Header>
                <Modal.Content style={{padding:'1.5rem 0.5rem 1.5rem 0.5rem'}}>
                    <Form onSubmit={this.onHandleSubmit} className={"fieldForm"}>
                    {
                        this.makeForm(this.state.regKeys)
                    }
                    {
                        this.makebutton(this.state.regKeys)
                    }
                    </Form>
                </Modal.Content>
            </Modal>

        )
    }
}


export default reduxForm({
    form: "registUserSetting",
    enableReinitialize: false
})(PopSettingViewer);

