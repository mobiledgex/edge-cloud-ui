import * as React from 'react';
import {CircularProgress} from "@material-ui/core";
import ndjsonStream from "can-ndjson-stream";

type Props = {};
type State = {};

export class StreamingRequestExample extends React.Component<Props, State> {
    state = {
        loading: false,
    }

    async componentDidMount(): void {
        this.fetchShowAppInst0002();
    }

    /* async fetchShowAppInst() {

         this.setState({
             loading: true,
         })
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
             return ndjsonStream(response.body); //ndjsonStream parses the response.body

         }).then((streamData) => {
             const reader = streamData.getReader();
             let read;
             reader.read().then(read = (result) => {
                 if (result.done) {
                     this.setState({
                         loading: false,
                     })
                     alert('Streaming complete.')
                     return;
                 }
                 console.log("streaming data====>", result.value.data);
                 reader.read().then(read);

             });
         });
     }*/


    async fetchShowAppInst0002() {

        this.setState({
            loading: true,
        })
        fetch('/api/v1/auth/ctrl/CreateClusterInst', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY4MDk5MzIsImlhdCI6MTU3NjcyMzUzMiwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.JPKz83yI45GdSIacNanYyX_7zmmE7HvaQvISTLVpWr-IofHwGY8tTQGChyizMpaMcOtKWg2J989p16Rm_2Mr1w",
            },


            body: JSON.stringify({
                    "region": "US",
                    "clusterinst": {
                        "key": {
                            "cluster_key": {
                                "name": "bictestCloudlet1206-01"
                            },
                            "cloudlet_key": {
                                "operator_key": {
                                    "name": "MEX"
                                },
                                "name": [
                                    "jlm-dind"
                                ]
                            },
                            "developer": "MobiledgeX"
                        },
                        "deployment": "docker",
                        "flavor": {
                            "name": "m4.xlarge"
                        },
                        "ip_access": 1,
                        "num_masters": 0,
                        "num_nodes": 0
                    }
                }
            )
        }).then((response) => {
            return ndjsonStream(response.body); //ndjsonStream parses the response.body

        }).then((streamData) => {
            const reader = streamData.getReader();
            let read;
            reader.read().then(read = (result) => {
                if (result.done) {
                    this.setState({
                        loading: false,
                    })
                    alert('Streaming complete.')
                    return;
                }
                console.log("streaming data====>", result.value.data);
                reader.read().then(read);

            });
        });
    }

    render() {
        return (
            <div>

                {this.state.loading && <CircularProgress/>}
                Streaming Request Example ...
            </div>
        );
    };
};
