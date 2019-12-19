import * as React from 'react';
import ndjsonStream from 'can-ndjson-stream';
import axios from "axios";
import qs from "qs";
import FormatComputeInst from "../services/formatter/formatComputeInstance";

type Props = {};
type State = {};

export class Test001 extends React.Component<Props, State> {

    async componentDidMount(): void {


        this.getStream();
    }

    async getStream() {
        let serviceBody = {
            "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY3OTA4MTgsImlhdCI6MTU3NjcwNDQxOCwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.4a2fmGx-NWBDmyJuRN6Rasbay0An5rZflMmuTuVnlIvNn285cGOtJ4KNaLPx5YyxymV1IgOVDujjOJFwA0okfA",
            "params": {
                "region": 'US',
                "appinst": {
                    "key": {
                        "app_key": {
                            "developer_key": {"name": localStorage.selectOrg},
                        }
                    }
                }
            }
        }
        fetch("https://mc-stage.mobiledgex.net:9900/api/v1/auth/ctrl/ShowAppInst",{
            method: 'post',
            body: {
                re
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

                console.log(result.value);
                reader.read().then(read);

            });
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
