import * as React from 'react';
import ndjsonStream from 'can-ndjson-stream';
import axios from "axios";
import qs from "qs";
import FormatComputeInst from "../services/formatter/formatComputeInstance";
import FormatComputeOper from "../services/formatter/formatComputeOperator";
import FormatComputeDev from "../services/formatter/formatComputeDeveloper";
import FormatComputeCloudlet from "../services/formatter/formatComputeCloudlet";
import FormatComputeApp from "../services/formatter/formatComputeApp";

type Props = {};
type State = {};

export class Test001 extends React.Component<Props, State> {

    async componentDidMount(): void {


        this.getStream();
    }

    async getStream() {

        /* fetch("https://mc-dev.mobiledgex.net:9900/api/v1/auth/ctrl/ShowAppInst",{
             method: 'post',
             body: {
                 "region": 'US',
             },
             headers: {
                 'Authorization': "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY4MDk5MzIsImlhdCI6MTU3NjcyMzUzMiwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.JPKz83yI45GdSIacNanYyX_7zmmE7HvaQvISTLVpWr-IofHwGY8tTQGChyizMpaMcOtKWg2J989p16Rm_2Mr1w",
             }
         }).then((response) => {
             return ndjsonStream(response.body); //ndjsonStream parses the response.body
         }).then((exampleStream) => {
             const reader = exampleStream.getReader();
             let read;
             reader.read().then(read = (result) => {
                 if (result.done) {
                     return;
                 }

                 console.log("slkflsdkfklsd===>",result.value);
                 reader.read().then(read);

             });
         });*/

     /*   fetch('https://jsonplaceholder.typicode.com/todos/1').then(response => response.json()).then(json => {

            console.log('asldfklskdflkslfkslkdfldskf====>', json)
        })
*//*
        fetch('/api/v1/auth/ctrl/ShowAppInst', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY4MDk5MzIsImlhdCI6MTU3NjcyMzUzMiwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.JPKz83yI45GdSIacNanYyX_7zmmE7HvaQvISTLVpWr-IofHwGY8tTQGChyizMpaMcOtKWg2J989p16Rm_2Mr1w",
            },
            body: {
                "region": 'US',
            },
            //body: JSON.stringify(opts)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log('error====>' + data);
        });
*/

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
            console.log('response====>' ,response);
            return response;
        }).then((data) => {
            console.log('data====>' + JSON.stringify(data));
        });





    }

    render() {
        return (
            <div>

                asdlfksadlfkslakdfl
            </div>
        );
    };
};
