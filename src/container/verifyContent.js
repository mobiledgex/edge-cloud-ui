import React, { Component } from 'react';

//ajax test

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
//service
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
        console.log('verify content props.. ', this.props)
        let strArr = this.props.params.subPath.split('=')
        let token = strArr[1];
        //verify user email as user token
        this.requestVerify(token);


    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('verify content props.. ', nextProps)
    }

    goToNext(site) {
        //브라우져 입력창에 주소 기록
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
        let result = mcRequest.response;
        console.log('receive result...', result.data)
        if(result.data.error) {
            Alert.error(result.data.error, {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });

            setTimeout(() => _self.goToNext('/site1'),3000)

        } else {
            Alert.success(result.data.message, {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });

            setTimeout(() => _self.goToNext('/site1'),3000)
        }


    }
    requestVerify(token) {
        serviceMC.sendRequest({ token: token, method: serviceMC.getEP().VERIFY_EMAIL, data: { service: 'verifyemail' } }, this.receiveData, this)
    }


    /* http://docs.nativebase.io/docs/examples/ReduxFormExample.html */
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

// const mapStateToProps = (state, ownProps) => {
//     return {
//         data: state.receiveDataReduce.data,
//         tabIdx: state.tabChanger
//     };
// };
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.setUser(data)) },
        handleChangeTab: (data) => { dispatch(actions.changeTab(data)) }
    };
};

export default connect(null, mapDispatchProps)(VerifyContent);
