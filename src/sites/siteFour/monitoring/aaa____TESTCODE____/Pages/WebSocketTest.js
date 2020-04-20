import * as React from 'react';
import {CircularProgress} from "@material-ui/core";
import FlexBox from "flexbox-react";
import uuid from "uuid";
import {showToast3} from "../../PageMonitoringCommonService";
import {SemanticToastContainer} from "react-semantic-toasts";

type Props = {
    history: any,
};
type State = {
    loading: boolean,
    results: any,
};

let sockets = [];

export default class WebSocketTest extends React.Component<Props, State> {
    state = {
        loading: false,
        results: [],
    }

    //wss://console-stage.mobiledgex.net:443/ws/api/v1/auth/ctrl/ShowAppInstClient

    async componentDidMount(): void {
        this.requestShowAppInstClient_WEBSOCKET();
    }

    async requestShowAppInstClient_WEBSOCKET() {
        //const ws = new WebSocket(`${url}/ws${EP.getPath(request)}`)

        const webSocket = new WebSocket('wss://console-stage.mobiledgex.net:443/ws/api/v1/auth/ctrl/ShowAppInstClient')

        webSocket.onopen = () => {

            showToast3('opened!!!!')
            console.log(' webSocket.onopen')

            console.log("lskflksdflkklsd====");
            console.log("lskflksdflkklsd====>", 'sdlkflsdkflkdsf');

            sockets.push({uuid: uuid.v1(), socket: webSocket, isClosed: false});
            webSocket.send(`{"token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODQwNTg5NjYsImlhdCI6MTU4Mzk3MjU2NiwidXNlcm5hbWUiOiJreXVuZ2pvb25nbzMiLCJlbWFpbCI6ImlhbWplc3NpY2E3Nzc3N0BnbWFpbC5jb20iLCJraWQiOjJ9.e3fY3ARAU0TyVUekNEyP_sYNPH-6AkvtW64rpjMgXEOhDt0BVs2m7HRgqUlov8EPeM1B5767PoUhm_TC0WLsXQ"}`);
            webSocket.send(JSON.stringify({
                "appinstclientkey": {
                    "key": {
                        "app_key": {
                            "developer_key": {
                                "name": "MobiledgeX"
                            },
                            "name": "MobiledgeX SDK Demo",
                            "version": "2.0"
                        },
                        "cluster_inst_key": {
                            "cloudlet_key": {
                                "name": "hamburg-stage",
                                "operator_key": {
                                    "name": "TDG"
                                }
                            },
                            "cluster_key": {
                                "name": "autoclustermobiledgexsdkdemo"
                            },
                            "developer": "MobiledgeX"
                        }
                    }
                },
                "region": "EU"
            }));
        }


        webSocket.onmessage = event => {
            let data = JSON.parse(event.data);
            console.log("onmessage===>", data.data);
            console.log("onmessage===>", data.data.location);

        }

        webSocket.onerror = (event) =>{
            alert(event.toString())
        }


    }


    render() {
        return (
            <div>

                {this.state.loading && <FlexBox style={{justifyContent: 'center'}}>
                    <CircularProgress color={'red'} style={{color: 'red'}}/>
                </FlexBox>}
                <SemanticToastContainer className={'warning'} position={"top-left"}/>
                Streaming Request Example ...

                {/* {this.state.results.map((item, index) => {
                    return (
                        <FlexBox style={{marginRight: 23}} key={index}
                                 style={{alignItems: 'center', justifyContent: 'flex-start'}}>
                            <FlexBox style={{fontSize: 20, color: 'white', justifyContent: 'center'}}>
                                {item}
                            </FlexBox>
                        </FlexBox>
                    )
                })}*/}
            </div>
        );
    };
};


/*

axios({
    method: 'POST',
    url: '/api/v1/auth/ctrl/ShowAppInst',
    data: JSON.stringify({
        "region": 'US',
    }),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY4MDk5MzIsImlhdCI6MTU3NjcyMzUzMiwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.JPKz83yI45GdSIacNanYyX_7zmmE7HvaQvISTLVpWr-IofHwGY8tTQGChyizMpaMcOtKWg2J989p16Rm_2Mr1w",
    },
}).then(response => {

    console.log('sdlkfsldkflksdflksdlfk===>', response);
    //return ndjsonStream(response); //ndjsonStream parses the response.body
}).then((streamData) => {
    const reader = streamData.getReader();
    let read;
    let _results = [];
    reader.read().then(read = (result) => {
        //todo:스트림이 완료 된 경우...
        if (result.done) {

            setTimeout(() => {
                this.setState({
                    loading: false,
                    results: _results,
                })
            }, 250)
            return;
        }

        console.log("streaming data====>", result.value.data);
        let streamedDataOne = result.value.data;
        _results.push(streamedDataOne)
        //todo:다음 Stream 데이터를 읽어온다..
        reader.read().then(read);
    });
});*/
