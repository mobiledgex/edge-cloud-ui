import 'react-hot-loader'
import React from 'react';
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {hot} from "react-hot-loader/root";
import {Grid, Tab,} from "semantic-ui-react";
import type {TypeAppInstance} from "../shared/Types";
import {CircularProgress} from "@material-ui/core";
//import './PageMonitoring.css';
const FA = require('react-fontawesome')
const {Column, Row} = Grid;
const {Pane} = Tab

const mapStateToProps = (state) => {
    return {
        isLoading: state.LoadingReducer.isLoading,
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        toggleLoading: (data) => {
            dispatch(actions.toggleLoading(data))
        }
    };
};

type Props = {
    handleLoadingSpinner: Function,
    toggleLoading: Function,
    history: any,
    onSubmit: any,
    sendingContent: any,
    loading: boolean,
    isLoading: boolean,
    toggleLoading: Function,
}

type State = {
    date: string,
    time: string,
    dateTime: string,
    datesRange: string,
    appInstanceListGroupByCloudlet: any,
    loading: boolean,
}


export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageMonitoringDetail extends React.Component<Props, State> {
        state = {
            date: '',
            time: '',
            dateTime: '',
            datesRange: '',
            appInstanceListGroupByCloudlet: [],
            loading: false,
        };

        intervalHandle = null;

        constructor(props) {
            super(props);

        }

        renderHeader = () => {
            return (
                <Grid.Row className='content_title'
                          style={{width: 'fit-content', display: 'inline-block'}}>
                    <Grid.Column className='title_align'
                                 style={{lineHeight: '36px'}}>Monitoring</Grid.Column>
                    <div style={{marginLeft: '10px'}}>
                        <button className="ui circular icon button"><i aria-hidden="true"
                                                                       className="info icon"></i></button>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: "center",
                        alignSelf: "center",
                        width: 200,
                        marginLeft: 15,
                        marginBottom: 0
                    }}>
                        {!this.state.isReady &&
                        <CircularProgress style={{color: '#77BD25', fontSize: 15, marginBottom: 5, marginLeft: -50,}} size={35}/>
                        }

                    </div>
                </Grid.Row>
            )
        }

        /*sadlkflsadkflksadf
        sdflkasdlfklsakdflksadlkf
        sadlfksladkflsakdflkasdlfkasldkf*/


        render() {

            return (

                <Grid.Row className='view_contents'>
                    <Grid.Column className='contents_body'>
                        {/*todo:####################*/}
                        {/*todo:Content Header part      */}
                        {/*todo:####################*/}
                        {this.renderHeader()}

                        <Grid.Row className='site_content_body'>
                           <div>
                               sldkflksdlfksd
                           </div>
                            <div>
                                sldkflksdlfksd
                            </div>
                            <div>
                                sldkflksdlfksd
                            </div>
                        </Grid.Row>
                    </Grid.Column>

                </Grid.Row>


            );
        }

    }
))));
