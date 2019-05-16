import React from 'react';
import {Button, Divider, Modal, Grid, Input, TextArea, Dropdown} from "semantic-ui-react";


let _self = null;
export default class PopDetailViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            dummyData:[],
            selected:{},
            open:false,
            dimmer:'',
            devOptionsOne:[],
            devOptionsTwo:[],
            devOptionsThree:[],
            devOptionsFour:[],
            devOptionsFive:[],
            dropdownValueOne:'',
            dropdownValueTwo:'',
            dropdownValueThree:'',
            dropdownValueFour:'',
            dropdownValueFive:'',
            cloudletResult:null,
            appResult:null,
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
                    (key !== 'Edit')?
                    <Grid.Row columns={2} key={i}>
                        <Grid.Column width={5} className='detail_item'>
                            <div>{key}</div>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <div style={{wordWrap: 'break-word'}}>{(typeof nextProps.data[key] === 'object')? JSON.stringify(nextProps.data[key]):String(nextProps.data[key])}</div>
                        </Grid.Column>
                        <Divider vertical></Divider>
                    </Grid.Row>
                        :null

                ))
            }
            this.setState({listOfDetail:component})
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



    close() {
        this.setState({ open: false })
        this.props.close()
    }


    render() {

        return (
            <Modal size={'small'} open={this.state.open} dimmer={false}>
                <Modal.Header>View Detail</Modal.Header>
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


