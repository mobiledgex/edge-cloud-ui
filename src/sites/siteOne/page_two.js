import React from 'react';
import { Grid } from 'semantic-ui-react';
import * as actions from "../../actions";
import {connect} from "react-redux";


const Containers = () => (
    <Grid padded className='pageTwoGrid'>
        <Grid.Row className="containerWapper">
            <Grid.Column className="cardWrapper">
                <div>site2</div>
            </Grid.Column>
        </Grid.Row>
    </Grid>
)
let self = null;
class PageTwo extends React.Component  {
    constructor(props){
        super(props)
        self = this;
        this.state = {

        }
    }
    componentWillReceiveProps(nextProps) {

    }
    render() {
        const { tabIdx} = this.props;
        return (
            <Containers ref={ref => this.container = ref} tab={tabIdx}></Containers>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        data: state.receiveDataReduce.data,
        tabIdx: state.tabChanger,
        status: state.videoControl.status
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleInjectData: (data) => { dispatch(actions.injectData(data)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(PageTwo);
