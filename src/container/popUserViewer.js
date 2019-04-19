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
            listOfDetail:null,
            userImage:null,
            userName:null
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
            let image = null;
            let name = null;
            console.log(nextProps.data)
            if(nextProps.data){
                image = (
                    <Grid.Row >
                        <Grid.Column>
                            <Image src='/assets/matthew.png' size="medium" centered bordered/>
                        </Grid.Column>
                    </Grid.Row>
                )
                name = (
                    <Grid.Row >
                        <Grid.Column>
                            <div style={{fontSize:'28px',borderBottom:'1px solid rgba(255,255,255,0.3)', padding:'10px 0'}}>{nextProps.data.UserName}</div>
                        </Grid.Column>
                    </Grid.Row>
                )
                regKeys = Object.keys(nextProps.data)
                component = regKeys.map((key, i)=>(
                    (key !== 'Edit' && key !== 'UserName')?
                    <Grid.Row columns={2}>
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
            this.setState({listOfDetail:component, userImage:image, userName:name})
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
            <Modal size={'tiny'} open={this.state.open} dimmer={false}>
                <Modal.Header>User</Modal.Header>
                <Modal.Content>
                    <Grid>
                        {this.state.userImage}
                        {this.state.userName}
                        {this.state.listOfDetail}
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


