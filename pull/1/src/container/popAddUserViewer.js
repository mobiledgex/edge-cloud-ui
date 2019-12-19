import React from 'react';
import {Button, Divider, Modal, Grid, Input, TextArea, Dropdown, Image} from "semantic-ui-react";
import SiteFourOrgaTwo from "./siteFourOrgaStepTwo";


let _self = null;
export default class PopAddUserViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            open:false,
            dimmer:'',
            cloudletResult:null,
            listOfDetail:null,
            userImage:null,
            userName:null,
            typeOperator:'',
            organization:''
        }
        _self = this;
    }

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('regist new item -- ', nextProps)
        if(nextProps.open) {
            this.setState({open:nextProps.open, dimmer:nextProps.dimmer, typeOperator:nextProps.data['Type'], organization:nextProps.data['Organization']});
        }

    }

    setCloudletList = (operNm) => {
        let cl = [];
        _self.state.cloudletResult[operNm].map((oper, i) => {
            if(i === 0) _self.setState({dropdownValueThree: oper.CloudletName})
            cl.push({ key: i, value: oper.CloudletName, text: oper.CloudletName })
        })

        _self.setState({devOptionsThree: cl})
    }

    setForms = () => (
        <SiteFourOrgaTwo onSubmit={() => console.log('Form was submitted')} org={this.state.organization} type={this.state.typeOperator}></SiteFourOrgaTwo>
    )


    close() {
        this.setState({ open: false })
        this.props.close()
    }


    render() {

        return (
            <Modal open={this.state.open} dimmer={false}>
                <Modal.Header>Add User</Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row >
                            <Grid.Column>
                                <Image src='/assets/matthew.png' size="tiny" centered bordered/>
                            </Grid.Column>
                        </Grid.Row>
                        {this.setForms()}
                    </Grid>
                    <Button onClick={() => this.close()} style={{position:'absolute', top:'13px', right:'13px'}}>
                        Close
                    </Button>
                </Modal.Content>
            </Modal>
        )
    }
}


