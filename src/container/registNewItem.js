import React from 'react';
import {Button, Divider, Modal, Grid, Input, TextArea} from "semantic-ui-react";

let _self = null;
export default class RegistNewItem extends React.Component {
    constructor() {
        super();
        this.state = {
            dummyData:[],
            selected:{},
            open:false,
            dimmer:'',
        }
        _self = this;
    }
    close = () => {
        this.setState({ open: false })
        this.props.close()
    }
    onClickInput(a, b) {
        // setTimeout(()=>{
        //     console.log('ddd=', _self['input_'+b])
        //     if(_self['input_'+b]) _self['input_'+b].focus();
        // }, 2000)
    }
    InputExampleFluid = (value, i) => <Input ref={ref => this['input_'+i] = ref} onClick={(a)=>this.onClickInput(a,i)} fluid placeholder={(this.state.dimmer === 'blurring')? '' : value} />

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('regist new item -- ', nextProps)
        if(nextProps.open) {
            this.setState({open:nextProps.open, dimmer:nextProps.dimmer});
        }

        let self = this;
        setTimeout(()=>{
            console.log('ddd=', self['input_0'])
            if(self['input_0']) self['input_0'].focus();
        }, 2000)
    }

    componentDidMount() {

    }



    render() {
        let {data, dimmer, selected} = this.props;
        return (
            <Modal size={'small'} open={this.state.open} onClose={this.close}>
                <Modal.Header>Settings</Modal.Header>
                <Modal.Content>
                    <Grid divided>
                        {
                            (data.length > 0)?
                                Object.keys(data[0]).map((key, i)=>(
                                    <Grid.Row columns={2}>
                                        <Grid.Column width={5} className='detail_item'>
                                            <div>{key}</div>
                                        </Grid.Column>
                                        <Grid.Column width={11}>
                                            {this.InputExampleFluid(selected[key], i)}
                                        </Grid.Column>
                                        <Divider vertical></Divider>
                                    </Grid.Row>
                                ))
                                :''
                        }

                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.close}>
                        Cancel
                    </Button>
                    <Button
                        positive
                        icon='checkmark'
                        labelPosition='right'
                        content="Save"
                        onClick={this.close}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}
