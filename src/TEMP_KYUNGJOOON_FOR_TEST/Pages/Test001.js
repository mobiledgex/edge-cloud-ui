import * as React from 'react';
import Axios from 'axios-observable';
import {CircularProgress} from "@material-ui/core";
import ndjsonStream from "can-ndjson-stream";

type Props = {};
type State = {
    loading: boolean,
    results: any,
};

export class Test001 extends React.Component<Props, State> {

    state = {
        loading: false,
        results: [],
    }

    async componentDidMount(): void {
        this.getStream();
    }


    async requestStreamEndPoint() {
        this.setState({
            loading: true,

        })
        //http --stream --timeout 100000 --auth-type=jwt --auth=$SUPERPASS POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/ctrl/CreateClusterInst <<< '{"region":"US","clusterinst":{"key":{"cluster_key":{"name":"dockertest20190802-9"},"cloudlet_key":{"operator_key":{"name":"TDG"},"name":"mexplat-stage-bonn-cloudlet"},"developer":"MobiledgeX"},"deployment":"docker","flavor":{"name":"c1.small"},"ip_access":1,"num_masters":0,"num_nodes":0}}'


        fetch('http://35.221.245.158:8080/TickTock?time=5', {
            method: 'get',
        }).then((response) => {
            return ndjsonStream(response.body); //ndjsonStream parses the response.body

        }).then((streamData) => {
            const reader = streamData.getReader();
            let read;

            let index = 0;
            reader.read().then(read = (result) => {
                if (result.done) {
                    this.setState({
                        loading: false,
                    })
                    return;
                }
                console.log(`data___${index}====>`, result.value);
                reader.read().then(read);
                index++;

            });
        });
    }


    async getStream() {

        await this.setState({
            loading: true,
        })

        let url = 'http://35.221.245.158:8080/TickTock?time=5';


        this.setState({
            loading: true,
        })
        fetch(url, {
            method: 'GET',
           /* headers: {
                'Content-Type': 'application/json',
                //'Authorization': "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY4MDk5MzIsImlhdCI6MTU3NjcyMzUzMiwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.JPKz83yI45GdSIacNanYyX_7zmmE7HvaQvISTLVpWr-IofHwGY8tTQGChyizMpaMcOtKWg2J989p16Rm_2Mr1w",
            },*/
           /* body: JSON.stringify({
                "region": 'US',
            })*/
        }).then((response) => {
            return ndjsonStream(response.body); //ndjsonStream parses the response.body

        }).then((streamData) => {
            const reader = streamData.getReader();
            let read;

            let index = 0;
            reader.read().then(read = (result) => {
                if (result.done) {
                    this.setState({
                        loading: false,
                    })
                    return;
                }
                console.log(`data___${index}====>`, result.value.data);
                reader.read().then(read);
                index++;

            });
        });


    }

    /*requesetExample000001() {
        fetch('/api/v1/auth/ctrl/ShowAppInst', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY4MDk5MzIsImlhdCI6MTU3NjcyMzUzMiwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.JPKz83yI45GdSIacNanYyX_7zmmE7HvaQvISTLVpWr-IofHwGY8tTQGChyizMpaMcOtKWg2J989p16Rm_2Mr1w",
            },
            body: JSON.stringify({
                "region": 'US',
            })
        }).then((response) => {
            console.log('response====>', response);
            return response;
        }).then((data) => {
            console.log('data====>' + JSON.stringify(data));
        });
    }*/

    render() {
        return (
            <div>

                {this.state.loading && <CircularProgress/>}
                {this.state.results.map(item => {
                    return (
                        <div>
                            {item.uri}
                        </div>
                    )
                })}
            </div>
        );
    };
};
