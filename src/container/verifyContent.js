import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as serviceMC from "../services/serviceMC";
import {GridLoader} from "react-spinners";
import Alert from 'react-s-alert';

let _self = null;
class VerifyContent extends Component {
    constructor(props){
        super(props);
        this.state={
            isReady : false,
            isError: false,
            focused : false,
            loginState: false,
            uid:null,
            publicKey:null,
            exponent:null,
            loading: true
        };
        _self = this;

    }
    componentDidMount() {
        let strArr = this.props.params.subPath.split('=')
        let token = strArr[1];
        this.requestVerify(token);
    }
   

    goToNext(site) {
        let mainPath = site;
        let subPath = 'pg=0';
        _self.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})

    }
    receiveData(mcRequest) {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                Alert.success(response.data.message, {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 5000
                });
                setTimeout(() => _self.goToNext('/site1'), 3000)
            }
        }
    }
    requestVerify(token) {
        serviceMC.sendRequest(_self, {method: serviceMC.getEP().VERIFY_EMAIL, data: {token: token} }, this.receiveData)
    }


    render() {
        return (


            <div className="loadingBox">
                <GridLoader
                    sizeUnit={"px"}
                    size={20}
                    color={'#70b2bc'}
                    loading={this.state.loading}
                />
                <div>Verifying...</div>
            </div>



        );
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.setUser(data)) },
        handleChangeTab: (data) => { dispatch(actions.changeTab(data)) }
    };
};

export default connect(null, mapDispatchProps)(VerifyContent);
