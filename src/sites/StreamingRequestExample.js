import * as React from 'react';
import {CircularProgress} from "@material-ui/core";
import ndjsonStream from "can-ndjson-stream";
import FlexBox from "flexbox-react";

type Props = {
    history: any,
};
type State = {
    loading: boolean,
    results: any,
};

export class StreamingRequestExample extends React.Component<Props, State> {
    state = {
        loading: false,
        results: [],
    }

    async componentDidMount(): void {
        this.requestShowAppInst();
    }

    async requestShowAppInst() {
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
        });
    }


    render() {
        return (
            <div>

                {this.state.loading && <FlexBox style={{justifyContent: 'center'}}>
                    <CircularProgress color={'red'} style={{color: 'red'}}/>
                </FlexBox>}
                Streaming Request Example ...

                {this.state.results.map((item, index) => {
                    return (
                        <FlexBox style={{marginRight: 23}} key={index}
                                 style={{alignItems: 'center', justifyContent: 'flex-start'}}>
                            <FlexBox style={{fontSize: 20, color: 'white', justifyContent: 'center'}}>
                                {item.key.cluster_inst_key.developer}
                            </FlexBox>
                            <FlexBox style={{width: 50}}/>
                            <FlexBox style={{fontSize: 20, color: 'white', justifyContent: 'center'}}>
                                {item.flavor.name}
                            </FlexBox>
                            <FlexBox style={{width: 50}}/>
                            <FlexBox style={{fontSize: 20, color: 'white', justifyContent: 'center'}}>
                                {item.key.cluster_inst_key.cloudlet_key.operator_key.name}
                            </FlexBox>
                        </FlexBox>
                    )
                })}
            </div>
        );
    };
};


/*
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
                return;
            }
            console.log("streaming data====>", result.value.data);
            reader.read().then(read);

        });
    });
}*/
