import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import './PageMonitoring.css'
import PageMonitoringForOperator from "./oper/PageOperMonitoring";
import {Grid} from "semantic-ui-react";
import PageMonitoringForDeveloper from "./dev/PageDevMonitoring";
import PageMonitoringForAdmin from "./admin/PageAdminMonitoring";
import {hot} from "react-hot-loader/root";
import {Card} from "@material-ui/core";


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
}

type State = {
    date: string,
}


export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageMonitoringMain extends Component<Props, State> {
        state = {
            date: '',
        };

        constructor(props) {
            super(props);
        }


        //todo@ sdlfksdlkflsdkflksdf
        //todo@ sdlfksdlkflsdkflksdf
        //todo@ sdlfksdlkflsdkflksdf
        //todo@ sdlfksdlkflsdkflksdf

        componentWillMount(): void {
            let store = JSON.parse(localStorage.PROJECT_INIT);
            let token = store ? store.userToken : 'null';
            console.log('token===>', token);
            let userRole = localStorage.getItem('selectRole')
            console.log('userRole====>', userRole);

            this.setState({
                userRole: userRole,
            })
        }


        renderMainPage() {
            if (this.state.userRole.includes('Admin')) {
                return (
                    <PageMonitoringForAdmin/>
                )
            } else if (this.state.userRole.includes('Operator')) {
                return (
                    <PageMonitoringForOperator/>
                )
            } else {//Developer***
                return (
                    <PageMonitoringForDeveloper/>
                )
            }
        }

        render() {
            return (
                <Card style={{ width: '100%', height: '100%', backgroundColor: '#292c33', padding: 10, color: 'white' }}>
                    {this.renderMainPage()}
                </Card>

            );
        }

    }
))));


