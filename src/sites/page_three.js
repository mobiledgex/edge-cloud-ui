import React from 'react';
import { Grid } from 'semantic-ui-react';

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
//service
import * as service from '../services/service_traffics';
import * as serviceTraffic from '../services/service_hipass';

const Containers = (props) => (
    <Grid padded className='pageThreeGrid' >
        <Grid.Row width={3} stretched className="trafficVolume" style={{backgroundColor:'red'}}>
            <div>Header</div>
        </Grid.Row>

        <Grid.Row width={13} stretched className="trafficVolume">
            <Grid.Column stretched width={3}  style={{backgroundColor:'green'}}>
                <div>left</div>
            </Grid.Column>
            <Grid.Column width={13} style={{backgroundColor:'blue'}}>
                <div>Right</div>
            </Grid.Column>
        </Grid.Row>
    </Grid>
)
let self = null;
class PageThree extends React.Component  {
    constructor(props){
        super(props)
        self = this;
        this.state = {
            receivedData:null,
            url:'',
            officeData:null,
            collectData:null,
            inoutData:null,
            dataTraffic:[{value:null}]
        }
        this.loopControl = null;
    }
    receiveData(traffic, result) {
        console.log('receive data ----- '+JSON.stringify(result));
        //self.props.handleInjectData(result);
        if(traffic === 'office'){
            self.setState({officeData:result});
        } else if(traffic === 'collect') {
            self.setState({collectData:result});
        } else if(traffic === 'inout') {
            self.setState({inoutData:result});
        }

    }
    receiveDataInout(traffic, result) {
        self.setState({inoutData:result});
    }
    receiveTrafficData(result) {
        console.log('receive traffic data ----- '+JSON.stringify(result));
        //this.props.handleInjectData(result);
        this.setState({dataTraffic:result})
    }
    /*********************
    * Call Data from Server as REST
    **********************/
    requestCall() {

        //영업소별 교통량
        service.getOfficeTrafficInfos('officeTrafficInfos',0, self.receiveData.bind(self, 'office'), 60);
        //징수수단별
        service.getOfficeTrafficInfos('collectWayTrafficInfos',0, self.receiveData.bind(self, 'collect'), 60);
        //진출/입로 교통량
        service.getInoutWayTrafficInfos('inoutWayTrafficInfos',0, self.receiveDataInout.bind(self, 'inout'), 60);
        //시간대별 교통량
        serviceTraffic.getTrafficData('trafficStatus',0, self.receiveTrafficData.bind(self), 60);

    }
    componentDidMount() {
        //if(this.props && this.props.data) this.props.data = {};
        console.log('did mount pageOne...')
        let self = this;
        this.loopControl = setInterval(() => {
            //self.requestCall();
        }, 60*1000)

        //self.requestCall();


    }
    componentWillUnmount() {
        clearInterval(this.loopControl)
    }
    render() {

        return (

            <Containers ref={ref => this.container = ref} />

        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        tabIdx: state.tabChanger
    };
};

const mapDispatchProps = (dispatch) => {
    return {
        handleInjectData: (data) => { dispatch(actions.injectData(data))}
    };
};

export default connect(mapStateToProps, mapDispatchProps)(PageThree);
