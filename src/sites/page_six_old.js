import React from 'react/lib/React';
import { Grid, Image, Header, Segment, Table, Rating, Tab, Transition, View } from 'semantic-ui-react';
import TableStatusB from '../components/tableStatusB';
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
*/
const Container = (props) => (
    <div className="pageSixGrid">
        <Header attached='headerTitle top'>기상정보</Header>
            <Grid attached padded='vertically' style={{paddingLeft:14, paddingRight:14}}>

                <Grid.Row columns={3} style={{backgroundColor:'#023f7e'}}>
                    <Grid.Column>
                            <TableStatusB title={(props.data) ? props.data[0].title:'Bridge Name'} data={(props.data) ? props.data[0]:null}/>
                    </Grid.Column>
                    <Grid.Column className='weatherInfo'>
                        <Grid.Row stretched>
                            <TableStatusB title={(props.data) ? props.data[1].title:'Bridge Name'} data={(props.data) ? props.data[1]:null}/>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column>
                        <TableStatusB title={(props.data) ? props.data[2].title:'Bridge Name'} data={(props.data) ? props.data[2]:null}/>
                    </Grid.Column>
                </Grid.Row>


                <Grid.Row columns={3} style={{backgroundColor:'#023f7e'}}>
                    <Grid.Column>
                        <Grid.Row stretched>
                            <TableStatusB title={(props.data) ? props.data[3].title:'Bridge Name'} data={(props.data) ? props.data[3]:null}/>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column className='weatherInfo'>
                        <Grid.Row stretched>
                            <TableStatusB title={(props.data) ? props.data[4].title:'Bridge Name'} data={(props.data) ? props.data[4]:null}/>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column>
                    <Grid.Row stretched>
                        <TableStatusB title={(props.data) ? props.data[5].title:'Bridge Name'} data={(props.data) ? props.data[5]:null}/>
                    </Grid.Row>
                    </Grid.Column>
                </Grid.Row>



                <Grid.Row columns={3} style={{backgroundColor:'#023f7e'}}>
                    <Grid.Column>
                        <Grid.Row stretched>
                            <TableStatusB title={(props.data) ? props.data[6].title:'Bridge Name'} data={(props.data) ? props.data[6]:null}/>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column className='weatherInfo'>
                        <TableStatusB title={(props.data) ? props.data[7].title:'Bridge Name'} data={(props.data) ? props.data[7]:null}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Grid.Row stretched>
                            <TableStatusB title={(props.data) ? props.data[8].title:'Bridge Name'} data={(props.data) ? props.data[8]:null}/>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

    </div>

)
class PageSix extends React.Component  {
    constructor(props){
        super(props)
        this.state = {
            receivedData:null,
            url:'',
            data:null
        }
    }
    receiveData(result) {
        console.log('receive data ----- '+JSON.stringify(result));
        //this.props.handleInjectData(result);
        this.setState({data:result})
    }
    /*********************
    * Call Data from Server as REST
    **********************/
    componentDidMount() {
        console.log('did mount page five -------')
        service.getBridgeWeatherInfos('bridgeWeatherInfos','0', this.receiveData.bind(this), 60);
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
