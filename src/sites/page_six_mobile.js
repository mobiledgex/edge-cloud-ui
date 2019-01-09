import React from 'react/lib/React';
import { Grid} from 'semantic-ui-react';
import TableStatusBMobile from '../components/tableStatusBMobile';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
//service
import * as service from '../services/service_weather_mobile';

/*
<Grid.Row>
    {
        (props.data) ? props.data.map((data, i) => (
            <Grid.Column mobile={16} tablet={8} computer={5}>
                <TableStatusB title={props.data[i]['title']} data={(props.data) ? props.data[0]:null}/>
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

<TableStatusB title={(props.data) ? props.data[i].title:'Bridge Name'} data={(props.data) ? props.data[i]:null}/>
*/
const Container = (props) => (
    <div style={{backgroundColor:'#023f7e', paddingTop:0, flex:1}}>

        <Grid attached className='weatherContainer'>
            {
                (props.data) ? props.data.map((data, i) => (
                    <Grid.Row>
                        <Grid.Column>
                            <TableStatusBMobile title={(props.data) ? props.data[i].title:'Bridge Name'} data={(props.data) ? props.data[i]:null}/>
                        </Grid.Column>
                    </Grid.Row>
                )) : null
            }
        </Grid>
    </div>

)
class PageSixMobile extends React.Component  {
    constructor(props){
        super(props)
        this.state = {
            receivedData:null,
            url:'',
            data:null
        }
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
        service.getBridgeWeatherInfos('bridgeWeatherInfos','0', this.receiveData.bind(this), 60);
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
            <Container ref={ref => this.container = ref} data={this.state.data}></Container>
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

export default connect(mapStateToProps, mapDispatchProps)(PageSixMobile);
