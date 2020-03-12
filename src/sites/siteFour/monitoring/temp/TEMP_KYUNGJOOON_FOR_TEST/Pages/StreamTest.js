import * as React from 'react';
import {CircularProgress} from "@material-ui/core";

import fetchStream from 'fetch-readablestream';

type Props = {};
type State = {};
export default class StreamTest extends React.Component<Props, State> {
    state = {
        loading: false,
    }

    async componentDidMount(): void {
        this.fetchShowAppInst();
    }

    readAllChunks(readableStream) {
        const reader = readableStream.getReader();
        const chunks = [];

        function pump() {
            return reader.read().then(({value, done}) => {
                if (done) {
                    this.setState({
                        loading: false,
                    })
                    return chunks;
                }
                chunks.push(value);
                return pump();
            });
        }

        return pump();
    }


    async fetchShowAppInst() {
        this.setState({
            loading: true,
        })

        fetchStream('/api/v1/auth/ctrl/ShowAppInstClient',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODQwNTg5NjYsImlhdCI6MTU4Mzk3MjU2NiwidXNlcm5hbWUiOiJreXVuZ2pvb25nbzMiLCJlbWFpbCI6ImlhbWplc3NpY2E3Nzc3N0BnbWFpbC5jb20iLCJraWQiOjJ9.e3fY3ARAU0TyVUekNEyP_sYNPH-6AkvtW64rpjMgXEOhDt0BVs2m7HRgqUlov8EPeM1B5767PoUhm_TC0WLsXQ",
                },
                body: JSON.stringify({
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
                })
            }
        ).then(response => this.readAllChunks(response.body)).then(chunks => console.dir(chunks))

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
