import * as React from 'react';

import {w3cwebsocket as W3CWebSocket} from "websocket";

const wsClient = new W3CWebSocket('ws://mc-stage.mobiledgex.net:9900/ws/api/v1/auth/ctrl/ShowClusterInst');


export default class Test003 extends React.Component {

    componentWillMount() {
        wsClient.onopen = function () {
            // Web Socket is connected, send data using send()
            wsClient.send('{"token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Nzc2Mzg3MzcsImlhdCI6MTU3NzU1MjMzNywidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.cWVT4OWK_eEg2gU17KhS5U3s84zu3CpFkHcY0VOcxZutHIfAl65dQI0Zd-A3Yzb00SANfUGTVh-y3w9vTznyXg"}');
            alert("Token sent");
            wsClient.send('{"region":"US"}');
            alert("Data sent");
        };
        wsClient.onmessage = function (evt) {
            let received_msg = evt.data;
            alert(received_msg);
        };
        wsClient.onclose = function () {
            // websocket is closed.
            alert("Connection is closed...");
            wsClient.close()
        };

        wsClient.onerror = err => {
            alert('Connection Error');
            console.log('err===>', err)
            wsClient.close();
        };
    }

    componentDidMount(): void {

    }

    render() {

        return (
            <div style={{width: 350}}>
                <div>
                    W3CWebSocket Test
                </div>
            </div>
        );
    }
}

