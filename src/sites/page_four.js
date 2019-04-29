import React from 'react/lib/React';
import { Grid, Image, Header, Segment, Table, Rating, Tab, Transition } from 'semantic-ui-react';
import TableAttached from '../components/tableAttachTypeA';
import CardVideo from '../components/cardVideo';
import TableExampleStructured from '../components/tableStructured';
import TableSimpleA from '../components/tableSimpleA';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
//service
import * as service from '../services';

const Containers = (props) => (
    <Grid padded relaxed>
        <Grid.Row>
            <Grid.Column width={12}>
                <TableExampleStructured data={(props.data) ? props.data[0]:null} title={'근무자정보'}/>
            </Grid.Column>
            <Grid.Column width={4}>
                <Grid.Row>
                    <TableSimpleA data={(props.data) ? props.data[1]:null} title='수납사원'/>
                    <TableSimpleA data={(props.data) ? props.data[2]:null} title='일근주임'/>
                    <TableSimpleA data={(props.data) ? props.data[3]:null} title='금일휴무자'/>
                </Grid.Row>
            </Grid.Column>
        </Grid.Row>
    </Grid>
)
class PageFour extends React.Component  {
    constructor(props){
        super(props)
        this.state = {
            receivedData:null,
            url:''
        }
    }
    receiveData(result) {
        console.log('receive data ----- '+JSON.stringify(result));
        this.props.handleInjectData(result);

    }
    /*********************
    * Call Data from Server as REST
    **********************/
    componentDidMount() {
        console.log('did mount page three -------')
        service.getHipassMonitor('workerInformation','0', this.receiveData.bind(this), 60);
    }
    componentWillUnmount () {
        console.log('will unmount page three -------')

    }
    render() {
        const {data, tabIdx} = this.props;
        return (
            (tabIdx.tab == 3) ? <Containers ref={ref => this.container = ref} data={data}></Containers> : null
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

export default connect(mapStateToProps, mapDispatchProps)(PageFour);
