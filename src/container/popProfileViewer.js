import React from 'react';
import {Button, Divider, Modal, Grid} from "semantic-ui-react";


let _self = null;
export default class PopProfileViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            open:false,
            dimmer:'',
            listOfDetail:null
        }
        _self = this;
    }

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('regist new item -- ', nextProps)
        if(nextProps.open) {
            this.setState({open:nextProps.open, dimmer:nextProps.dimmer});
            let regKeys = [];
            let component = null;
            if(nextProps.data){
                regKeys = Object.keys(nextProps.data)
                component = regKeys.map((key, i)=>(
                    <Grid.Row columns={2} key={i}>
                        <Grid.Column width={5} className='detail_item'>
                            <div>{key}</div>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <div style={{wordWrap: 'break-word'}}>{(typeof nextProps.data[key] === 'object')? JSON.stringify(nextProps.data[key]):String(nextProps.data[key])}</div>
                        </Grid.Column>
                        <Divider vertical></Divider>
                    </Grid.Row>
                ))
            }
            this.setState({listOfDetail:component})
        }

    }


    close() {
        this.setState({ open: false })
    }


    render() {

        return (
            <Modal size={'small'} open={this.state.open} dimmer={false}>
                <Modal.Header>Profile</Modal.Header>
                <Modal.Content>
                    <Grid divided>
                        {
                            this.state.listOfDetail
                        }

                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.close()}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}


