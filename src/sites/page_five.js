import React from 'react/lib/React';
import { Grid, Header, Segment, Dimmer, Loader } from 'semantic-ui-react';
import { ScaleLoader } from 'react-spinners';
import TableStatusA from '../components/tableStatusA';
import HighCharts from '../charts/highChart';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
//service
import * as service from '../services/service_compute_inflxdb';
import FormatBLStatus from '../services/formatter/formatBLStatus';

const Container = (props) => (
    <div className="pageFiveGrid">
        <Header attached='headerTitle top'>카드관리현황</Header>
        <Grid attached padded='vertically'>
            <Grid.Row columns={2}>
                <Grid.Column width={8}>
                        <TableStatusA title='BL현황' data={(props.dataBLStatus) ? props.dataBLStatus:null}/>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Grid.Row stretched>
                        <TableStatusA title='감면현황' data={(props.dataReduct) ? props.dataReduct:null}/>
                    </Grid.Row>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        <div className="chartCon">
            <Header size='huge' attached='top' className={'chartContainerHeader cellasHeaderDark'} style={{color:'#fff', backgroundColor:'#0061B6'}}>
                교통카드별 B/L 현황
            </Header>

            <Segment attached className="chartContainer">
                <HighCharts chart={'column'} data={(props.dataCardBLState) ? props.dataCardBLState:null}/>
            </Segment>
        </div>
    </div>
)

class PageFive extends React.Component  {
    constructor(props){
        super(props)
        this.state = {
            receivedData:null,
            url:'',
            loading: true,
            dataBLStatus:null,
            dataReduct:null,
            dataCardBLState:null,
            activeDimmer: true
        }
        this.loopControl = null;
    }
    receiveData(result) {
        //this.props.handleInjectData(result);
        this.setState({data:result, activeDimmer:false})

    }
    receiveDataReduct(result) {
        //this.props.handleInjectData(result);
        this.setState({dataReduct:result, activeDimmer:false})

    }
    receivedataCardBLState(result) {
        //this.props.handleInjectData(result);
        this.setState({dataCardBLState:result, activeDimmer:false,
            dataBLStatus:FormatBLStatus([ result.value.serise[1].data[result.value.serise[1].data.length-1], result.value.serise[1].data[result.value.serise[1].data.length-2]])
        })

    }
    /*********************
    * Call Data from Server as REST
    **********************/
    requestCall() {
        console.log('did mount page five -------')

        //감면현황
        service.getCardReductionStatInfos('cardReductionStatInfos',0, this.receiveDataReduct.bind(this), 60*60*6); //6시간
        //교통카드별 B/L 현황
        service.getCardBLStatInfoList('cardBLStatInfoList',0, this.receivedataCardBLState.bind(this), 60*60*6); //6시간
    }
    componentDidMount() {
        //if(this.props && this.props.data) this.props.data = {};
        console.log('did mount pageOne...')
        let self = this;
        this.loopControl = setInterval(() => {
            self.requestCall();
        }, 60*60*6*1000)

        self.requestCall();


    }
    componentWillUnmount() {
        clearInterval(this.loopControl)
    }
    render() {
        const { tabIdx} = this.props;
        return (
            (tabIdx.tab == 3) ?
                <Container ref={ref => this.container = ref} dataBLStatus={this.state.dataBLStatus} dataReduct={this.state.dataReduct} dataCardBLState={this.state.dataCardBLState} activeDimmer={this.state.activeDimmer}></Container>
                :
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column>
                            <ScaleLoader
                                color={'#123abc'}
                                loading={this.state.loading}
                                />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

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

export default connect(mapStateToProps, mapDispatchProps)(PageFive);
