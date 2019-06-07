import React from 'react';
import {Button, Divider, Modal, Grid, Input, TextArea, Dropdown, Image} from "semantic-ui-react";


let _self = null;
export default class PopUserViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            open:false,
            dimmer:'',
            cloudletResult:null,
            propsData:[]
        }
        _self = this;
    }

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('regist new item -- ', nextProps)
        if(nextProps.open) {
            this.setState({open:nextProps.open, dimmer:nextProps.dimmer, propsData:nextProps.data});   
        }

    }

    // ))

    setCloudletList = (operNm) => {
        let cl = [];
        _self.state.cloudletResult[operNm].map((oper, i) => {
            if(i === 0) _self.setState({dropdownValueThree: oper.CloudletName})
            cl.push({ key: i, value: oper.CloudletName, text: oper.CloudletName })
        })

        _self.setState({devOptionsThree: cl})
    }



    close() {
        this.setState({ open: false })
        this.props.close()
    }


    render() {

        return (
            <Modal size={'tiny'} open={this.state.open} dimmer={false}>
                <Modal.Header>User</Modal.Header>
                <Modal.Content  image scrolling>
                    <Grid>
                        <Grid.Row >
                            <Grid.Column>
                                <Image src='/assets/matthew.png' size="small" centered bordered/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row >
                            <Grid.Column>
                                <div style={{fontSize:'28px',borderBottom:'1px solid rgba(255,255,255,0.3)', padding:'10px 0'}}>{this.state.propsData.Username}</div>
                            </Grid.Column>
                        </Grid.Row>
                        {
                            Object.keys(this.state.propsData).map((key, i)=> (
                                (key !== 'Edit' && key !== 'Username')?
                                    <Grid.Row columns={2}>
                                        <Grid.Column width={5} className='detail_item'>
                                            <div>{key}</div>
                                        </Grid.Column>
                                        <Grid.Column width={11}>
                                            <div style={{wordWrap: 'break-word'}}>{(typeof this.state.propsData[key] === 'object')? JSON.stringify(this.state.propsData[key]):String(this.state.propsData[key])}</div>
                                        </Grid.Column>
                                        <Divider vertical></Divider>
                                    </Grid.Row>
                                :null
                            ))
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


