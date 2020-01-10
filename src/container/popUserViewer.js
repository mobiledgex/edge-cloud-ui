import React from 'react';
import {Button, Divider, Modal, Grid, Input, TextArea, Dropdown, Image} from "semantic-ui-react";
import * as moment from 'moment';

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
    makeUTC = (time) => {
        return moment(time).utc().format("YYYY-MM-DD HH:mm:ss") + ' UTC'
    }

    render() {

        return (
            <Modal size={'tiny'} open={this.state.open}>
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
                                            <div>
                                                {(key == 'EmailVerified')?'Email Verified'
                                                :(key == 'FamilyName')?'Family Name'
                                                :(key == 'Given Name')?'Given Name'
                                                :(key == 'CreatedAt')?'Created At'
                                                :(key == 'UpdatedAt')?'Updated At'
                                                :key}
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={11}>
                                            <div style={{wordWrap: 'break-word'}}>
                                                {
                                                    (typeof this.state.propsData[key] === 'object')? JSON.stringify(this.state.propsData[key])
                                                    : (key === 'EmailVerified' && JSON.stringify(this.state.propsData[key]) === 'true')? 'Yes'
                                                    : (key === 'Locked' && JSON.stringify(this.state.propsData[key]) === 'true')? 'Yes'
                                                    : (key === 'CreatedAt') ? String(this.makeUTC(this.state.propsData[key]))
                                                    : (key === 'UpdatedAt') ? String(this.makeUTC(this.state.propsData[key]))
                                                    : String(this.state.propsData[key])



                                                }
                                            </div>

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


/*
function example(…) {
    return condition1 ? value1
         : condition2 ? value2
         : condition3 ? value3
         : value4;
}

// Equivalent to:

function example(…) {
    if (condition1) { return value1; }
    else if (condition2) { return value2; }
    else if (condition3) { return value3; }
    else { return value4; }
}
 */
