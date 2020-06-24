import React from 'react';
import {Button, Divider, Modal, Grid} from "semantic-ui-react";
import {FORMAT_FULL_DATE_TIME, time} from '../utils/date_util'

let _self = null;
export default class PopProfileViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            open:false,
            listOfDetail:null
        }
        _self = this;
    }

    componentDidMount() {

    }
    makeUTC = (date) => {
        return time(FORMAT_FULL_DATE_TIME, date)
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.open) {
            this.setState({open:nextProps.open});
            let regKeys = [];
            let component = null;
            if(nextProps.data){
                regKeys = Object.keys(nextProps.data)
                component = regKeys.map((key, i)=>(
                    <Grid.Row columns={2} key={i}>
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
                        <Grid.Column width={11} style={{display:'flex', flexDirection:'row', alignContent:'center', justifyContent:'flex-start'}}>
                            <div style={{wordWrap: 'break-word', marginRight:20}}>
                                {(typeof nextProps.data[key] === 'object')? JSON.stringify(nextProps.data[key])
                                :(key === 'EmailVerified' && JSON.stringify(nextProps.data[key]) === 'true')?'Yes'
                                :(key === 'Locked' && JSON.stringify(nextProps.data[key]) === 'false')?'No'
                                :(key === 'CreatedAt' && nextProps.data[key]) ? this.makeUTC(nextProps.data[key])
                                :(key === 'UpdatedAt' && nextProps.data[key]) ? this.makeUTC(nextProps.data[key])
                                :String(nextProps.data[key])}
                            </div>
                        </Grid.Column>
                        <Divider vertical></Divider>
                    </Grid.Row>
                ))
            }
            this.setState({listOfDetail:component})
        }

    }


    close(mode) {
        this.setState({ open: false })
        this.props.close && this.props.close(mode)
    }


    render() {
        return (
            <Modal size={'small'} open={this.state.open}>
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


