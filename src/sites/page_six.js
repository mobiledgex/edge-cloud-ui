import React from 'react/lib/React';
import { Grid, Image, Header, Segment, Table, Rating, Tab, Transition, View } from 'semantic-ui-react';
import TableStatusC from '../components/tableStatusC';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
//service
import * as service from '../services/service_weather';

/*
<Grid.Row>
    {
        (props.data) ? props.data.map((data, i) => (
            <Grid.Column mobile={16} tablet={8} computer={5}>
                <TableStatusC title={props.data[i]['title']} data={(props.data) ? props.data[0]:null}/>
            </Grid.Column>
        )) : null
    }
</Grid.Row>
*/
/*
신도시IC교    : JAWI00100000
영종대교      : JAWI00200000
귤현3교       : JAWI00300000
방화대교      : JAWI00400000
[송도]STA 7+0 : 0002WIS00S
[공항]STA 10+6: 0003WIS00A
*/
const Container = (props) => (
    <div className="pageSixGrid">
        <Header attached='headerTitle top'>기상정보</Header>
            <Grid attached padded='vertically' style={{paddingLeft:14, paddingRight:14}}>

                <Grid.Row style={{backgroundColor:'#023f7e'}}>
                    <Grid.Column>
                            <TableStatusC  data={(props.data) ? props.data:null}/>
                    </Grid.Column>

                </Grid.Row>
            </Grid>

    </div>

)
let self = null;
class PageSix extends React.Component  {
    constructor(props){
        super(props)
        this.state = {
            receivedData:null,
            url:'',
            data:null
        }
        self = this;
        this.loopControl = null;
    }
    receiveData(result) {
        console.log('receive data ----- '+JSON.stringify(result));
        //this.props.handleInjectData(result);
        this.setState({data:result})
    }
    /*********************
    * Call Data from Server as REST
    **********************/
    requestCall() {
        console.log('did mount page five -------')
        service.getBridgeWeatherInfos('bridgeWeatherInfos','0', self.receiveData.bind(self), 60);
    }
    componentDidMount() {
        //if(this.props && this.props.data) this.props.data = {};
        console.log('did mount pageOne...')
        let self = this;
        this.loopControl = setInterval(() => {
            self.requestCall();
        }, 60*1000)

        self.requestCall();


    }
    componentWillUnmount() {
        clearInterval(this.loopControl)
    }
    render() {
        const { tabIdx} = this.props;
        return (
            (tabIdx.tab == 4) ? <Container ref={ref => this.container = ref} data={this.state.data}></Container> : null
        );
    }
};
const mapStateToProps = (state, ownProps) => {
    return {
        data: state.receiveDataReduce.data,
        tabIdx: state.tabChanger
    };
};

const mapDispatchProps = (dispatch) => {
    return {
        handleInjectData: (data) => { dispatch(actions.injectData(data))}
    };
};

export default connect(mapStateToProps, mapDispatchProps)(PageSix);
