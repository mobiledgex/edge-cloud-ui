import React, { Component } from 'react';
import { Grid, Header, Segment, Table, Icon, Card } from 'semantic-ui-react';

import Iframe from 'react-iframe';
import * as service from "../services/service_equipStatus";


const EquipStatus = (props) => (
    <Iframe url={props.url}
            width="100%"
            height="100%"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative"
            allowFullScreen/>
)

let self = null;
class PageEight extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            dataMapUrl:null,
        }
        self = this;
    }
    receiveData(result) {
        console.log('receive data dataMapUrl ----- '+JSON.stringify(result));
        //this.props.handleInjectData(result);
        self.setState({dataMapUrl:result})
    }
    componentDidMount() {
        //if(this.props && this.props.data) this.props.data = {};
        service.getMapURL('mapURL',1, self.receiveData);

    }

    render() {

        return (

            <Grid attached className='pageEightGrid'>
                <Grid.Row stretched className="containerWapper">
                    <Grid.Column className='fmsLeftPan'>
                        <Segment className='nblue'>
                            <EquipStatus url={this.state.dataMapUrl}/>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        )
    }

};
export default PageEight;
