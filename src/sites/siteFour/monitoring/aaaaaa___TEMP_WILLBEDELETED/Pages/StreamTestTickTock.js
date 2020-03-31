import * as React from 'react';
import {CircularProgress} from "@material-ui/core";
import FlexBox from "flexbox-react";

type Props = {
    history: any,
};
type State = {
    loading: boolean,
    results: any,
};

export default class StreamTestTickTock extends React.Component<Props, State> {
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
        fetch('http://kyungjoon77.ipdisk.co.kr:8080/tickTock/index', {}).then((response) => {
            const reader = response.body.getReader();
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
                    return false;
                }

                var resultString = String.fromCharCode.apply(null, result.value);
                console.log("streaming data====>", result);
                console.log("streaming data====>", resultString);
                let streamedDataOne = resultString;
                _results.push(streamedDataOne)
                this.setState({
                    results: _results,
                })
                //todo:다음 Stream 데이터를 읽어온다..
                reader.read().then(read);


            });
        })
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
                                {item}
                            </FlexBox>
                        </FlexBox>
                    )
                })}
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
