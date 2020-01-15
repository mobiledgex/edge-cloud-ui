import React, { Component } from 'react';
import * as Service from '../../services/service_login_api';
class LoginJWT extends Component {
    receiveResult(result, target) {
        if(result.token) {
            console.log('get token for result is == ', result.token)

        } else {
            console.log(result.message)
        }
    }
    componentDidMount() {
        Service.getMethodCall('masterControl',{username:'mexadmin', password:''}, this.receiveResult, this)
    }

    render() {
        return (
            <div>good</div>
        )
    }
}

export default LoginJWT;

