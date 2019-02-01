import React, {Component} from 'react';
import axios from 'axios';
import { Grid, Button, Container, Input, Label } from 'semantic-ui-react';
import React3DGlobe from '../libs/react3dglobe';
import { getMockData } from "../libs/react3dglobe/mockData";

import { connect } from 'react-redux';
import * as actions from '../actions';

import SiteOne from './siteOne';

const pointMarkers = getMockData(0x97bcd8, 'point');

class EntranceGlobe extends Component {

    constructor() {
        super();

        this.state = {
            data: null,
            intro:true,
            clickedMarker: null,
            hoveredMarker: null,
            mouseEvent: null,
            loginState:'out'
        };
    }

    componentDidMount() {
        axios.get('../data/sampleData.json')
            .then(response => this.setState({data: response.data}))
        let clickedMarker = {
            "lat": 39.483,
            "long": -0.367,
            "city": "Valencia",
            "id": "HkYDMRP1ysfN",
            "color": 9204427,
            "type": "point",
            "value": 94,
            "size": 10
        };
        let mouseEvent;
        let self = this;
        setTimeout(()=>self.setState({clickedMarker}), 2000)
    }

    //go to NEXT
    goToNext(site) {
        //브라우져 입력창에 주소 기록
        let mainPath = site;
        let subPath = 'pg=0';
        this.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        this.props.history.location.search = subPath;
        this.props.handleChangeSite({mainPath:mainPath, subPath: subPath})

    }
    handleMarkerMouseover = (mouseEvent, hoveredMarker) => {
        this.setState({hoveredMarker, mouseEvent});
    };

    handleMarkerMouseout = mouseEvent => {
        this.setState({hoveredMarker: null, mouseEvent});
    };

    handleMarkerClick = (mouseEvent, clickedMarker) => {
        alert('mouse click == '+clickedMarker)
        this.setState({clickedMarker, mouseEvent});
    };

    handleClickLogin() {
        this.setState({loginState:'in'})
    }
    render() {
        const {clickedMarker, hoveredMarker, mouseEvent} = this.state;
        return (

            // add data to "data" attribute, and render <Gio> tag

                (this.state.intro)?
                    <div style={{width:'100%', height:'100%', overflow:'hidden'}}>
                        <React3DGlobe
                            markers={pointMarkers}
                            onMarkerMouseover={this.handleMarkerMouseover}
                            onMarkerMouseout={this.handleMarkerMouseout}
                            onMarkerClick={this.handleMarkerClick}
                        />
                        {(this.state.loginState === 'out')?
                            <div className='intro_login'>
                                <Grid>
                                    <Grid.Row>
                                        <span className='title'>User Login</span>
                                    </Grid.Row>
                                    <Grid.Row columns={2}>
                                        <Grid.Column>
                                            <Input placeholder='ID' width></Input>
                                        </Grid.Column>
                                        <Grid.Column >
                                            <Input  placeholder='Password' type='password'></Input>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Button onClick={() => this.handleClickLogin()}>Log In</Button>
                                    </Grid.Row>
                                </Grid>
                            </div>
                            :
                            (this.state.loginState === 'in')?
                            <div className='intro_link'>
                                <Button onClick={() => this.goToNext('/site2')}>MobiledgeX Monitoring</Button>
                                <Button onClick={() => this.goToNext('/site4')}>MobiledgeX Compute</Button>
                            </div>
                            :
                            <Label>Incorrect password or confirmation code entered. Please try again.</Label>

                        }

                    </div>
                    :
                    <div style={{width:'100%', height:'100%'}}>
                        <SiteOne />
                    </div>



        )
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleChangeTab: (data) => { dispatch(actions.changeTab(data))}
    };
};

export default connect(null, mapDispatchProps)(EntranceGlobe);
