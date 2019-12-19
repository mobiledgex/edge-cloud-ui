import * as React from 'react';
import Axios from 'axios-observable';
import {CircularProgress} from "@material-ui/core";
import ndjsonStream from "can-ndjson-stream";

type Props = {};
type State = {};

export class Test001 extends React.Component<Props, State> {

    state = {
        loading: false,
    }

    async componentDidMount(): void {

        //this.getStream();

        this.requestStreamEndPoint();
    }


    async requestStreamEndPoint() {

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

                    return;
                }
                console.log("datasdflskdfskdf====>", result.value.data);
                reader.read().then(read);

            });
        });
    }


    async getStream() {

        await this.setState({
            loading: true,
        })
        Axios.request({
            method: 'post',
            url: '/api/v1/auth/ctrl/ShowAppInst',
            responseType: 'stream',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY4MDk5MzIsImlhdCI6MTU3NjcyMzUzMiwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.JPKz83yI45GdSIacNanYyX_7zmmE7HvaQvISTLVpWr-IofHwGY8tTQGChyizMpaMcOtKWg2J989p16Rm_2Mr1w",
            },
            data: {
                "region": 'US',
            }
        }).subscribe(
            response => console.log(response),
            error => console.log(error),
            async () => {
                this.setState({
                    loading: false,
                })
            }
        );
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
                asdlfksadlfkslakdfl
            </div>
        );
    };
};
