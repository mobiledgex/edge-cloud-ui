import React from 'react';
//import 'semantic-ui-css/semantic.min.css'
import '../css/introjs.css';
import '../css/introjs-dark.css';
import '../css/index.css';
import ndjsonStream from "can-ndjson-stream";

export const requestShowAppInst = async () => {
    let streamData = await fetch('/api/v1/auth/ctrl/ShowAppInst', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY4MDk5MzIsImlhdCI6MTU3NjcyMzUzMiwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.JPKz83yI45GdSIacNanYyX_7zmmE7HvaQvISTLVpWr-IofHwGY8tTQGChyizMpaMcOtKWg2J989p16Rm_2Mr1w",
        },
        body: JSON.stringify({
            "region": 'US',
        })
    }).then((response) => ndjsonStream(response.body)).then((streamData) => {
        return streamData
    });
    const reader = streamData.getReader();
    let read;
    let _results = [];
    reader.read().then(read = (result) => {
        //todo:스트림이 완료 된 경우...
        if (result.done) {

            return _results;
            return ;
        }
        console.log("streaming data====>", result.value.data);
        let streamedDataOne = result.value.data;
        _results.push(streamedDataOne)
        //todo:다음 Stream 데이터를 읽어온다..
        reader.read().then(read);
    });

}



